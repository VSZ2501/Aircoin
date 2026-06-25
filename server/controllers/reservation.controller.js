// ─── CONTROLLER Reservation ───────────────────────────────────────────────────
// Gère la création, la liste et l'annulation des réservations.
// Les priceRows renvoyés correspondent exactement à ce qu'affiche BookingCard.

const Reservation = require('../models/reservation.model');
const Logement    = require('../models/logement.model');

// ── Formatter ─────────────────────────────────────────────────────────────────
function formatReservation(r) {
  const doc = r.toObject ? r.toObject() : r;

  // Construit les priceRows (cf. BookingCard → PRICE_ROWS)
  const nbNuits    = doc.nb_nuits;
  const priceRows  = [
    { label: `${doc.prix_par_nuit} € × ${nbNuits} nuit${nbNuits > 1 ? 's' : ''}`, value: `${doc.prix_par_nuit * nbNuits} €` },
    { label: 'Frais de service',  value: `${doc.frais_service} €` },
    { label: 'Taxe de séjour',    value: `${doc.taxe_sejour} €` },
  ];

  return {
    id:          doc._id,
    logement:    doc.logement_id,
    hostId:      doc.logement_id?.hebergeur_id?.toString
                   ? doc.logement_id.hebergeur_id.toString()
                   : doc.logement_id?.hebergeur_id,
    checkIn:     doc.date_arrivee
                   ? new Date(doc.date_arrivee).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                   : '',
    checkOut:    doc.date_depart
                   ? new Date(doc.date_depart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                   : '',
    checkOutISO: doc.date_depart || null,   // <- AJOUT — format brut exploitable côté front
    guests:      doc.nb_voyageurs,
    nbNuits,
    priceRows,
    total:       `${doc.montant_total} €`,
    status:      doc.statut,
    freeCancellation: doc.date_limite_annulation
                   ? `Annulation gratuite avant le ${new Date(doc.date_limite_annulation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                   : null,
    createdAt:   doc.date_creation,
  };
}

// ── Utilitaire : vérifie chevauchement de dates ────────────────────────────────
async function verifierDisponibilite(logementId, dateArrivee, dateDepart, exclureId = null) {
  const filtre = {
    logement_id:  logementId,
    statut:       { $ne: 'annulee' },
    date_arrivee: { $lt: dateDepart },
    date_depart:  { $gt: dateArrivee },
  };
  if (exclureId) filtre._id = { $ne: exclureId };

  const conflit = await Reservation.findOne(filtre);
  return !conflit; // true = disponible
}

// ══ Controllers ════════════════════════════════════════════════════════════════

/**
 * POST /api/reservations
 * Body : { logement_id, date_arrivee, date_depart, nb_voyageurs }
 */
const creerReservation = async (req, res, next) => {
  try {
    const { logement_id, date_arrivee, date_depart, nb_voyageurs } = req.body;

    if (!logement_id || !date_arrivee || !date_depart || !nb_voyageurs) {
      return res.status(400).json({ succes: false, message: 'Tous les champs sont requis' });
    }

    const arrivee = new Date(date_arrivee);
    const depart  = new Date(date_depart);

    if (arrivee >= depart) {
      return res.status(400).json({ succes: false, message: "La date d'arrivée doit être avant le départ" });
    }

    // Récupère le logement pour le prix
    const logement = await Logement.findById(logement_id);
    if (!logement) {
      return res.status(404).json({ succes: false, message: 'Logement introuvable' });
    }
    if (nb_voyageurs > (logement.capacite || Infinity)) {
      return res.status(400).json({ succes: false, message: `Capacité max : ${logement.capacite} voyageurs` });
    }

    // Vérifie la disponibilité
    const dispo = await verifierDisponibilite(logement_id, arrivee, depart);
    if (!dispo) {
      return res.status(409).json({ succes: false, message: 'Logement non disponible pour ces dates' });
    }

    // Calcul du prix
    const nbNuits       = Math.ceil((depart - arrivee) / (1000 * 60 * 60 * 24));
    const fraisService  = Math.round(logement.prix * nbNuits * 0.09); // 9 %
    const taxeSejour    = nb_voyageurs * nbNuits;                      // 1 €/pers/nuit (simplifié)
    const montantTotal  = logement.prix * nbNuits + fraisService + taxeSejour;

    // Annulation gratuite 6 jours avant l'arrivée
    const dateLimiteAnnulation = new Date(arrivee);
    dateLimiteAnnulation.setDate(dateLimiteAnnulation.getDate() - 6);

    const reservation = await Reservation.create({
      logement_id,
      client_id:              req.utilisateur._id,
      date_arrivee:           arrivee,
      date_depart:            depart,
      nb_voyageurs,
      prix_par_nuit:          logement.prix,
      nb_nuits:               nbNuits,
      frais_service:          fraisService,
      taxe_sejour:            taxeSejour,
      montant_total:          montantTotal,
      statut:                 'en_attente',
      date_limite_annulation: dateLimiteAnnulation,
    });

    const populated = await Reservation.findById(reservation._id).populate('logement_id', 'nom_logement adresse ville prix photos');

    res.status(201).json({ succes: true, data: formatReservation(populated) });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reservations/mes-reservations
 * Toutes les réservations du client connecté.
 */
const getMesReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ client_id: req.utilisateur._id })
      .populate('logement_id', 'nom_logement adresse ville prix photos badge hebergeur_id')
      .sort({ date_creation: -1 });

    res.json({ succes: true, count: reservations.length, data: reservations.map(formatReservation) });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/reservations/:id/annuler
 * Annule une réservation si elle appartient au client connecté.
 */
const annulerReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ succes: false, message: 'Réservation introuvable' });
    }
    if (reservation.client_id.toString() !== req.utilisateur._id.toString()) {
      return res.status(403).json({ succes: false, message: 'Non autorisé' });
    }
    if (reservation.statut === 'annulee') {
      return res.status(400).json({ succes: false, message: 'Réservation déjà annulée' });
    }
    if (reservation.date_depart < new Date()) {
      return res.status(400).json({ succes: false, message: 'Impossible d\'annuler un séjour déjà terminé' });
    }

    reservation.statut = 'annulee';
    await reservation.save();

    res.json({ succes: true, data: formatReservation(reservation) });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/reservations/:id/accepter
 * L'hôte (propriétaire du logement) accepte la réservation.
 */
const accepterReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('logement_id', 'hebergeur_id');

    if (!reservation) {
      return res.status(404).json({ succes: false, message: 'Réservation introuvable' });
    }
    if (reservation.logement_id.hebergeur_id.toString() !== req.utilisateur._id.toString()) {
      return res.status(403).json({ succes: false, message: 'Non autorisé' });
    }
    if (reservation.statut !== 'en_attente') {
      return res.status(400).json({ succes: false, message: 'Cette réservation a déjà été traitée' });
    }

    reservation.statut = 'confirmee';
    await reservation.save();

    res.json({ succes: true, data: formatReservation(reservation) });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/reservations/:id/refuser
 * L'hôte (propriétaire du logement) refuse la réservation.
 */
const refuserReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('logement_id', 'hebergeur_id');

    if (!reservation) {
      return res.status(404).json({ succes: false, message: 'Réservation introuvable' });
    }
    if (reservation.logement_id.hebergeur_id.toString() !== req.utilisateur._id.toString()) {
      return res.status(403).json({ succes: false, message: 'Non autorisé' });
    }
    if (reservation.statut !== 'en_attente') {
      return res.status(400).json({ succes: false, message: 'Cette réservation a déjà été traitée' });
    }

    reservation.statut = 'refusee';
    await reservation.save();

    res.json({ succes: true, data: formatReservation(reservation) });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reservations/recues
 * Toutes les réservations reçues sur les logements de l'hôte connecté
 * (pour afficher la liste à accepter/refuser sur son Dashboard).
 */
const getReservationsRecues = async (req, res, next) => {
  try {
    const Logement = require('../models/logement.model');
    const mesLogements = await Logement.find({ hebergeur_id: req.utilisateur._id }).select('_id');
    const logementIds = mesLogements.map(l => l._id);

    const reservations = await Reservation.find({ logement_id: { $in: logementIds } })
      .populate('logement_id', 'nom_logement adresse ville prix photos')
      .sort({ date_creation: -1 });

    res.json({ succes: true, count: reservations.length, data: reservations.map(formatReservation) });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reservations/:id/peut-noter
 * Vérifie si l'utilisateur connecté peut laisser un avis pour cette
 * réservation : statut confirmée + date de départ déjà passée +
 * pas déjà noté.
 */
const peutNoterReservation = async (req, res, next) => {
  try {
    const AvisUtilisateur = require('../models/avisUtilisateur.model');
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ succes: false, message: 'Réservation introuvable' });
    }

    const sejourTermine = reservation.statut === 'confirmee' && reservation.date_depart < new Date();

    const dejaNote = await AvisUtilisateur.findOne({
      reservation_id: req.params.id,
      auteur_id: req.utilisateur._id,
    });

    res.json({
      succes: true,
      data: { peutNoter: sejourTermine && !dejaNote, dejaNote: !!dejaNote },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  creerReservation,
  getMesReservations,
  annulerReservation,
  accepterReservation,
  refuserReservation,
  getReservationsRecues,
  peutNoterReservation,
};