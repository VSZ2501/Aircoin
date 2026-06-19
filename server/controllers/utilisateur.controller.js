// ─── CONTROLLER Utilisateur ───────────────────────────────────────────────────
// Gère l'authentification JWT et le profil utilisateur.

const jwt          = require('jsonwebtoken');
const Utilisateur  = require('../models/utilisateur.model');

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

    // select('+mot_de_passe') car le champ est select:false dans le schéma
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

module.exports = { inscrire, connecter, moi };