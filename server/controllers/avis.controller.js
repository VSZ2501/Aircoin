// ─── CONTROLLER AvisLogement ──────────────────────────────────────────────────
// Après chaque création/suppression, recalcule avgNote et reviewCount sur Logement.

const AvisLogement    = require('../models/avisLogement.model');
const Logement        = require('../models/logement.model');
const AvisUtilisateur = require('../models/avisUtilisateur.model');
const Reservation     = require('../models/reservation.model');
const Utilisateur = require('../models/utilisateur.model');


// ── Helper : recalcule les stats de notes sur le logement ─────────────────────
async function recalculerNotes(logementId) {
  const stats = await AvisLogement.aggregate([
    { $match: { logement_id: logementId } },
    { $group: { _id: null, avgNote: { $avg: '$note' }, count: { $sum: 1 } } },
  ]);

  const avgNote    = stats.length ? Math.round(stats[0].avgNote * 10) / 10 : 0;
  const reviewCount = stats.length ? stats[0].count : 0;

  await Logement.findByIdAndUpdate(logementId, { avgNote, reviewCount });
}

// ── Formatter avis logement ────────────────────────────────────────────────────
function formatAvis(a) {
  const doc = a.toObject ? a.toObject() : a;
  const auteur = doc.auteur_id;

  return {
    id:   doc._id,
    name: auteur && typeof auteur === 'object'
            ? `${auteur.prenom} ${auteur.nom}`
            : 'Utilisateur',
    date: doc.date_publication
            ? new Date(doc.date_publication).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
            : '',
    note:         doc.note,
    text:         doc.commentaire,
    avatarColor:  auteur?.photo_de_profil || null,
    categoriesArray: [
      { label: 'Propreté',             note: doc.categories?.proprete              ?? 5 },
      { label: 'Communication',        note: doc.categories?.communication         ?? 5 },
      { label: 'Emplacement',          note: doc.categories?.emplacement           ?? 5 },
      { label: 'Rapport qualité/prix', note: doc.categories?.rapport_qualite_prix  ?? 5 },
    ],
  };
}

// ── Formatter avis utilisateur ─────────────────────────────────────────────────
function formatAvisUtilisateur(a) {
  const doc = a.toObject ? a.toObject() : a;
  const auteur = doc.auteur_id;

  return {
    id: doc._id,
    name: auteur && typeof auteur === 'object' ? `${auteur.prenom} ${auteur.nom}` : 'Utilisateur',
    date: doc.date_publication
      ? new Date(doc.date_publication).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      : '',
    note: doc.note,
    text: doc.commentaire,
  };
}

// ══ Controllers — Avis Logement ═════════════════════════════════════════════

/**
 * GET /api/avis/logement/:id
 */
const getAvisLogement = async (req, res, next) => {
  try {
    const avis = await AvisLogement.find({ logement_id: req.params.id })
      .populate('auteur_id', 'nom prenom photo_de_profil')
      .sort({ date_publication: -1 });

    res.json({ succes: true, count: avis.length, data: avis.map(formatAvis) });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/avis/logement/:id
 * Créer un avis (client connecté, doit avoir séjourné dans le logement).
 */
const creerAvis = async (req, res, next) => {
  try {
    const { note, commentaire, categories } = req.body;

    if (!note || !commentaire) {
      return res.status(400).json({ succes: false, message: 'Note et commentaire requis' });
    }

    const reservation = await Reservation.findOne({
      logement_id: req.params.id,
      client_id: req.utilisateur._id,
      statut: 'confirmee',
      date_depart: { $lt: new Date() },
    });

    if (!reservation) {
      return res.status(403).json({
        succes: false,
        message: "Vous devez avoir séjourné dans ce logement pour pouvoir le noter",
      });
    }

    const avis = await AvisLogement.create({
      logement_id:      req.params.id,
      auteur_id:        req.utilisateur._id,
      note,
      commentaire,
      categories:       categories ?? {},
      date_publication: new Date(),
    });

    await recalculerNotes(avis.logement_id);

    const avisPopule = await AvisLogement.findById(avis._id)
      .populate('auteur_id', 'nom prenom photo_de_profil');

    res.status(201).json({ succes: true, data: formatAvis(avisPopule) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ succes: false, message: 'Vous avez déjà laissé un avis pour ce logement' });
    }
    next(err);
  }
};

/**
 * GET /api/avis/logement/:id/peut-noter
 */
const peutNoterLogement = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({
      logement_id: req.params.id,
      client_id: req.utilisateur._id,
      statut: 'confirmee',
      date_depart: { $lt: new Date() },
    });

    const dejaNote = await AvisLogement.findOne({
      logement_id: req.params.id,
      auteur_id: req.utilisateur._id,
    });

    res.json({
      succes: true,
      data: { peutNoter: !!reservation && !dejaNote, dejaNote: !!dejaNote },
    });
  } catch (err) {
    next(err);
  }
};

// ══ Controllers — Avis Utilisateur ══════════════════════════════════════════

/**
 * POST /api/avis/utilisateur/:reservationId
 */
const creerAvisUtilisateur = async (req, res, next) => {
  try {
    const { cible_id, note, commentaire } = req.body;
    const { reservationId } = req.params;

    if (!cible_id || !note || !commentaire) {
      return res.status(400).json({ succes: false, message: 'Tous les champs sont requis' });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ succes: false, message: 'Réservation introuvable' });
    }

    const sejourTermine = reservation.statut === 'confirmee' && reservation.date_depart < new Date();
    if (!sejourTermine) {
      return res.status(400).json({ succes: false, message: "Le séjour n'est pas encore terminé" });
    }

    const avis = await AvisUtilisateur.create({
      reservation_id: reservationId,
      auteur_id: req.utilisateur._id,
      cible_id,
      note,
      commentaire,
    });

    // Recalcul immédiat de la note moyenne de la personne notée
    await recalculerNoteUtilisateur(cible_id);

    res.status(201).json({ succes: true, data: formatAvisUtilisateur(avis) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ succes: false, message: 'Vous avez déjà laissé un avis pour cette réservation' });
    }
    next(err);
  }
};

// ── Helper : recalcule la note moyenne d'un utilisateur ───────────────────────
async function recalculerNoteUtilisateur(utilisateurId) {
  const stats = await AvisUtilisateur.aggregate([
    { $match: { cible_id: utilisateurId } },
    { $group: { _id: null, avgNote: { $avg: '$note' } } },
  ]);

  const avgNote = stats.length ? Math.round(stats[0].avgNote * 10) / 10 : 0;

  await Utilisateur.findByIdAndUpdate(utilisateurId, { avis: avgNote });
}

/**
 * GET /api/avis/utilisateur/:userId
 */
const getAvisUtilisateur = async (req, res, next) => {
  try {
    const avis = await AvisUtilisateur.find({ cible_id: req.params.userId })
      .populate('auteur_id', 'nom prenom photo_de_profil')
      .sort({ date_publication: -1 });

    res.json({ succes: true, count: avis.length, data: avis.map(formatAvisUtilisateur) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAvisLogement,
  creerAvis,
  peutNoterLogement,
  creerAvisUtilisateur,
  getAvisUtilisateur,
};