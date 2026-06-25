// ─── CONTROLLER Utilisateur ───────────────────────────────────────────────────
// Gère l'authentification JWT, le profil utilisateur et les favoris.

const jwt          = require('jsonwebtoken');
const Utilisateur  = require('../models/utilisateur.model');

// formatListing est réutilisé pour que getFavoris() renvoie les logements
// dans le même format que partout ailleurs sur le front (title, price,
// location...), au lieu des champs bruts en français de la base.
const { formatListing } = require('./logement.controller');

// ── Helpers ────────────────────────────────────────────────────────────────────

const genererToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

/** Formate un doc Utilisateur pour la réponse API (jamais de mot_de_passe). */
function formatUser(u) {
  return {
    id:           u._id,
    name:        `${u.prenom} ${u.nom}`,
    prenom:       u.prenom,
    nom:          u.nom,
    login:        u.login,
    role:         u.role,
    avatar:       u.photo_de_profil,
    note:         u.avis,
    isSuperhost:  u.superhost,
    bio:          u.bio,
    responseRate: u.taux_reponse,
    since:        u.date_inscription
                    ? new Date(u.date_inscription).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                    : '',
    favoris:      (u.favoris || []).map(id => id.toString ? id.toString() : id),
  };
}

// ══ Controllers ════════════════════════════════════════════════════════════════

/**
 * POST /api/utilisateurs/register
 * Body : { nom, prenom, login, mot_de_passe, role }
 */
const inscrire = async (req, res, next) => {
  try {
    const { nom, prenom, login, mot_de_passe, role = 'client' } = req.body;

    if (!nom || !prenom || !login || !mot_de_passe) {
      return res.status(400).json({ succes: false, message: 'Tous les champs sont requis' });
    }

    const existe = await Utilisateur.findOne({ login });
    if (existe) {
      return res.status(400).json({ succes: false, message: 'Ce login est déjà utilisé' });
    }

    const utilisateur = await Utilisateur.create({ nom, prenom, login, mot_de_passe, role });

    res.status(201).json({
      succes: true,
      token:  genererToken(utilisateur._id),
      data:   formatUser(utilisateur),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/utilisateurs/login
 * Body : { login, mot_de_passe }
 */
const connecter = async (req, res, next) => {
  try {
    const { login, mot_de_passe } = req.body;

    if (!login || !mot_de_passe) {
      return res.status(400).json({ succes: false, message: 'Login et mot de passe requis' });
    }

    const utilisateur = await Utilisateur.findOne({ login }).select('+mot_de_passe');

    if (!utilisateur || !(await utilisateur.verifierMotDePasse(mot_de_passe))) {
      return res.status(401).json({ succes: false, message: 'Login ou mot de passe incorrect' });
    }

    res.json({
      succes: true,
      token:  genererToken(utilisateur._id),
      data:   formatUser(utilisateur),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/utilisateurs/moi
 * Renvoie le profil de l'utilisateur connecté (token requis).
 */
const moi = async (req, res) => {
  res.json({ succes: true, data: formatUser(req.utilisateur) });
};

/**
 * PUT /api/utilisateurs/moi
 * Permet à un client connecté de devenir hébergeur.
 * Body : { role: 'hebergeur' }
 */
const devenirHebergeur = async (req, res, next) => {
  try {
    if (req.body.role !== 'hebergeur') {
      return res.status(400).json({ succes: false, message: 'Rôle invalide' });
    }
    if (req.utilisateur.role === 'hebergeur') {
      return res.status(400).json({ succes: false, message: 'Vous êtes déjà hébergeur' });
    }

    req.utilisateur.role = 'hebergeur';
    await req.utilisateur.save();

    res.json({ succes: true, data: formatUser(req.utilisateur) });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/utilisateurs/favoris/:logementId
 * Ajoute ou retire un logement des favoris de l'utilisateur connecté (toggle).
 */
const toggleFavori = async (req, res, next) => {
  try {
    const { logementId } = req.params;
    const index = req.utilisateur.favoris.findIndex(
      (id) => id.toString() === logementId
    );

    if (index === -1) {
      req.utilisateur.favoris.push(logementId);
    } else {
      req.utilisateur.favoris.splice(index, 1);
    }
    await req.utilisateur.save();

    res.json({
      succes: true,
      data: req.utilisateur.favoris.map((id) => id.toString()),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/utilisateurs/favoris
 * Liste des logements favoris de l'utilisateur connecté, formatés
 * exactement comme les logements partout ailleurs sur le front
 * (title, price, location...) via formatListing().
 */
const getFavoris = async (req, res, next) => {
  try {
    const utilisateur = await req.utilisateur.populate('favoris');

    res.json({
      succes: true,
      count: utilisateur.favoris.length,
      data: utilisateur.favoris.map((logement) => formatListing(logement)),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  inscrire,
  connecter,
  moi,
  devenirHebergeur,
  toggleFavori,
  getFavoris,
};