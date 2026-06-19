const jwt          = require('jsonwebtoken');
const Utilisateur  = require('../models/utilisateur.model');

// Vérifie que la requête contient un JWT valide
const proteger = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ succes: false, message: 'Non autorisé — token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.utilisateur = await Utilisateur.findById(decoded.id).select('-mot_de_passe');

    if (!req.utilisateur) {
      return res.status(401).json({ succes: false, message: 'Utilisateur introuvable' });
    }
    next();
  } catch {
    res.status(401).json({ succes: false, message: 'Token invalide ou expiré' });
  }
};

// Vérifie que l'utilisateur connecté a le rôle requis
const roleRequis = (...roles) => (req, res, next) => {
  if (!roles.includes(req.utilisateur.role)) {
    return res.status(403).json({
      succes: false,
      message: `Accès réservé aux ${roles.join(' / ')}`,
    });
  }
  next();
};

module.exports = { proteger, roleRequis };
