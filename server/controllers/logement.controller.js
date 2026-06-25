// ─── CONTROLLER Logement ──────────────────────────────────────────────────────
// Toutes les réponses passent par formatListing() qui traduit les noms de champs
// FR (BDD) → EN (front React) pour coller à ce qu'attendent les composants.

const Logement     = require('../models/logement.model');
const AvisLogement = require('../models/avisLogement.model');
const { geocoderAdresse } = require('../utils/geocode');

// ══ Mappers ════════════════════════════════════════════════════════════════════

function formatHost(u, listingsCount = 0) {
  if (!u || typeof u !== 'object') return u;
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
 * Exportée (voir module.exports en bas) car réutilisée par
 * utilisateur.controller.js -> getFavoris(), pour que les logements
 * favoris soient renvoyés dans le même format que partout ailleurs.
 */
function formatListing(doc, listingsCount = 0) {
  const l = doc.toObject ? doc.toObject() : doc;

  const locationParts = [];
  if (l.quartier) locationParts.push(l.quartier);
  else if (l.ville) locationParts.push(l.ville);
  if (l.surface) locationParts.push(`${l.surface} m²`);
  const location = locationParts.join(' · ');

  return {
    id:          l._id,
    title:       l.nom_logement,
    type:        l.type_de_logement,
    location,
    city:        l.ville,
    district:    l.quartier,
    address:     l.adresse,
    postalCode:  l.code_postal,
    latitude:    l.latitude,
    longitude:   l.longitude,
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
 * Filtres : ville, type, prixMin, prixMax, meuble, animaux, chambres, hebergeurId
 * Pagination : page (défaut 1), limit (défaut 12)
 * Tri : sort = prix_asc | prix_desc | note | recent
 */
const getLogements = async (req, res, next) => {
  try {
    const {
      ville, type, prixMin, prixMax,
      meuble, animaux, chambres,
      hebergeurId,
      page  = 1,
      limit = 12,
      sort  = 'prix_asc',
    } = req.query;

    const filtre = {};
    if (ville)       filtre.ville             = { $regex: ville, $options: 'i' };
    if (type)         filtre.type_de_logement  = type;
    if (meuble  === 'true') filtre.meuble      = true;
    if (animaux === 'true') filtre.animaux     = true;
    if (chambres)     filtre.chambres          = { $gte: Number(chambres) };
    if (hebergeurId)  filtre.hebergeur_id       = hebergeurId;
    if (prixMin || prixMax) {
      filtre.prix = {};
      if (prixMin) filtre.prix.$gte = Number(prixMin);
      if (prixMax) filtre.prix.$lte = Number(prixMax);
    }

    const triMap = {
      prix_asc:  { prix: 1 },
      prix_desc: { prix: -1 },
      note:      { avgNote: -1 },
      recent:    { _id: -1 },
    };
    const triOption = triMap[sort] || { prix: 1 };

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
 */
const getLogementById = async (req, res, next) => {
  try {
    const logement = await Logement.findById(req.params.id)
      .populate('hebergeur_id', 'nom prenom photo_de_profil avis superhost taux_reponse bio date_inscription');

    if (!logement) {
      return res.status(404).json({ succes: false, message: 'Logement introuvable' });
    }

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
 * Géocode automatiquement l'adresse en coordonnées GPS (latitude/longitude)
 * avant la sauvegarde — l'hôte n'a jamais à les saisir manuellement.
 */
const creerLogement = async (req, res, next) => {
  try {
    const { latitude, longitude } = await geocoderAdresse(
      req.body.adresse,
      req.body.code_postal,
      req.body.ville
    );

    const logement = await Logement.create({
      ...req.body,
      latitude,
      longitude,
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
 * Re-géocode uniquement si l'adresse, le code postal ou la ville
 * changent (sinon les coordonnées existantes restent valides).
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

    const adresseAChange =
      (req.body.adresse     && req.body.adresse     !== logement.adresse) ||
      (req.body.code_postal && req.body.code_postal !== logement.code_postal) ||
      (req.body.ville       && req.body.ville       !== logement.ville);

    let coords = {};
    if (adresseAChange) {
      coords = await geocoderAdresse(
        req.body.adresse     || logement.adresse,
        req.body.code_postal || logement.code_postal,
        req.body.ville       || logement.ville
      );
    }

    const updated = await Logement.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...coords },
      { new: true, runValidators: true }
    ).populate('hebergeur_id', 'nom prenom photo_de_profil avis superhost');

    res.json({ succes: true, data: formatListing(updated) });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/logements/:id
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
  formatListing,
};