// ─── CONTROLLER Logement ──────────────────────────────────────────────────────
// Toutes les réponses passent par formatListing() qui traduit les noms de champs
// FR (BDD) → EN (front React) pour coller à ce qu'attendent les composants.

const Logement    = require('../models/logement.model');
const AvisLogement = require('../models/avisLogement.model');

// ══ Mappers ════════════════════════════════════════════════════════════════════

/**
 * Formate un document Utilisateur (hôte) pour le front.
 * Correspond à l'objet HOST utilisé dans HostCard / DetailPage.
 */
function formatHost(u, listingsCount = 0) {
  if (!u || typeof u !== 'object') return u;  // non peuplé → on renvoie l'ObjectId brut
  return {
    id:           u._id,
    name:        `${u.prenom} ${u.nom}`,
    since:        u.date_inscription
                    ? new Date(u.date_inscription).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                    : '',
    listingsCount,
    note:         u.avis,
    responseRate: u.taux_reponse,
    bio:          u.bio,
    isSuperhost:  u.superhost,
    avatar:       u.photo_de_profil,
  };
}

/**
 * Formate un document Logement pour le front.
 * Correspond aux objets LISTINGS utilisés dans ListingGrid / DetailPage / BookingCard.
 */
function formatListing(doc, listingsCount = 0) {
  const l = doc.toObject ? doc.toObject() : doc;

  // Construit la chaîne "location" affichée sous le titre dans les cards :
  // ex. "Paris 10e · 68 m²"  ou  "Paris · 68 m²"  ou  "Paris"
  const locationParts = [];
  if (l.quartier) locationParts.push(l.quartier);
  else if (l.ville) locationParts.push(l.ville);
  if (l.surface) locationParts.push(`${l.surface} m²`);
  const location = locationParts.join(' · ');

  return {
    id:          l._id,
    title:       l.nom_logement,
    type:        l.type_de_logement,
    location,                              // "Paris 10e · 68 m²"
    city:        l.ville,
    district:    l.quartier,
    address:     l.adresse,
    surface:     l.surface,
    price:       l.prix,
    maxGuests:   l.capacite,
    rooms:       l.chambres,
    bathrooms:   l.salles_de_bain,
    floor:       l.etage,
    description: l.description,
    badge:       l.badge || null,
    amenities:   l.equipement,
    furnished:   l.meuble,
    petsAllowed: l.animaux,
    photos:      (l.photos || []).map(p => p.piece_jointe),
    note:        l.avgNote,
    reviewCount: l.reviewCount,
    host:        l.hebergeur_id && typeof l.hebergeur_id === 'object'
                   ? formatHost(l.hebergeur_id, listingsCount)
                   : l.hebergeur_id,
  };
}

// ══ Controllers ════════════════════════════════════════════════════════════════

/**
 * GET /api/logements
 * Filtres : ville, type, prixMin, prixMax, meuble, animaux, chambres
 * Pagination : page (défaut 1), limit (défaut 12)
 * Tri : sort = prix_asc | prix_desc | note | recent
 */
const getLogements = async (req, res, next) => {
  try {
    const {
      ville, type, prixMin, prixMax,
      meuble, animaux, chambres,
      page  = 1,
      limit = 12,
      sort  = 'prix_asc',
    } = req.query;

    // ── Construction du filtre ─────────────────────────────────────────────────
    const filtre = {};
    if (ville)    filtre.ville             = { $regex: ville, $options: 'i' };
    if (type)     filtre.type_de_logement  = type;
    if (meuble  === 'true') filtre.meuble  = true;
    if (animaux === 'true') filtre.animaux = true;
    if (chambres) filtre.chambres          = { $gte: Number(chambres) };
    if (prixMin || prixMax) {
      filtre.prix = {};
      if (prixMin) filtre.prix.$gte = Number(prixMin);
      if (prixMax) filtre.prix.$lte = Number(prixMax);
    }

    // ── Tri ───────────────────────────────────────────────────────────────────
    const triMap = {
      prix_asc:  { prix: 1 },
      prix_desc: { prix: -1 },
      note:      { avgNote: -1 },
      recent:    { _id: -1 },
    };
    const triOption = triMap[sort] || { prix: 1 };

    // ── Pagination ────────────────────────────────────────────────────────────
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Logement.countDocuments(filtre);

    const logements = await Logement.find(filtre)
      .populate('hebergeur_id', 'nom prenom photo_de_profil avis superhost taux_reponse bio date_inscription')
      .sort(triOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      succes: true,
      count:  total,
      page:   Number(page),
      pages:  Math.ceil(total / Number(limit)),
      data:   logements.map(l => formatListing(l)),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/logements/featured
 * 4 logements avec badge, triés par note — utilisés dans la HomePage.
 */
const getLogementsALaUne = async (req, res, next) => {
  try {
    const logements = await Logement.find({ badge: { $exists: true, $ne: '' } })
      .populate('hebergeur_id', 'nom prenom photo_de_profil avis superhost')
      .sort({ avgNote: -1 })
      .limit(4);

    res.json({ succes: true, data: logements.map(l => formatListing(l)) });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/logements/villes
 * Agrégation → { name, count } pour les cartes "Destinations populaires" de la HomePage.
 */
const getVilles = async (req, res, next) => {
  try {
    const villes = await Logement.aggregate([
      { $group: { _id: '$ville', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, name: '$_id', count: 1 } },
    ]);

    res.json({ succes: true, data: villes });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/logements/:id
 * Détail complet avec hôte peuplé + nb de logements de cet hôte.
 */
const getLogementById = async (req, res, next) => {
  try {
    const logement = await Logement.findById(req.params.id)
      .populate('hebergeur_id', 'nom prenom photo_de_profil avis superhost taux_reponse bio date_inscription');

    if (!logement) {
      return res.status(404).json({ succes: false, message: 'Logement introuvable' });
    }

    // Nombre de logements de cet hôte (affiché dans HostCard → listingsCount)
    const listingsCount = await Logement.countDocuments({
      hebergeur_id: logement.hebergeur_id?._id ?? logement.hebergeur_id,
    });

    res.json({ succes: true, data: formatListing(logement, listingsCount) });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/logements
 * Création — réservé aux hébergeurs connectés.
 */
const creerLogement = async (req, res, next) => {
  try {
    const logement = await Logement.create({
      ...req.body,
      hebergeur_id: req.utilisateur._id,
    });

    res.status(201).json({ succes: true, data: formatListing(logement) });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/logements/:id
 * Modification — réservé au propriétaire du logement.
 */
const modifierLogement = async (req, res, next) => {
  try {
    const logement = await Logement.findById(req.params.id);

    if (!logement) {
      return res.status(404).json({ succes: false, message: 'Logement introuvable' });
    }
    if (logement.hebergeur_id.toString() !== req.utilisateur._id.toString()) {
      return res.status(403).json({ succes: false, message: 'Non autorisé' });
    }

    const updated = await Logement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('hebergeur_id', 'nom prenom photo_de_profil avis superhost');

    res.json({ succes: true, data: formatListing(updated) });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/logements/:id
 * Suppression — réservé au propriétaire du logement.
 */
const supprimerLogement = async (req, res, next) => {
  try {
    const logement = await Logement.findById(req.params.id);

    if (!logement) {
      return res.status(404).json({ succes: false, message: 'Logement introuvable' });
    }
    if (logement.hebergeur_id.toString() !== req.utilisateur._id.toString()) {
      return res.status(403).json({ succes: false, message: 'Non autorisé' });
    }

    await logement.deleteOne();

    // Nettoyage des avis associés
    await AvisLogement.deleteMany({ logement_id: req.params.id });

    res.json({ succes: true, message: 'Logement supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLogements,
  getLogementsALaUne,
  getVilles,
  getLogementById,
  creerLogement,
  modifierLogement,
  supprimerLogement,
};