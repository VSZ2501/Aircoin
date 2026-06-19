// ─── MIDDLEWARE errorHandler ───────────────────────────────────────────────────
// Doit être le DERNIER middleware enregistré dans server.js.
// Intercepte toutes les erreurs passées via next(err).

const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ❌ ${err.message}`);

  // Mongoose : document introuvable (mauvais ObjectId)
  if (err.name === 'CastError') {
    return res.status(404).json({ succes: false, message: 'Ressource introuvable' });
  }

  // Mongoose : validation échouée
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ succes: false, message: messages.join(', ') });
  }

  // MongoDB : clé dupliquée (unique: true)
  if (err.code === 11000) {
    const champ = Object.keys(err.keyValue)[0];
    return res.status(400).json({ succes: false, message: `Ce ${champ} est déjà utilisé` });
  }

  // JWT invalide
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ succes: false, message: 'Token invalide' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ succes: false, message: 'Token expiré, veuillez vous reconnecter' });
  }

  // Erreur générique
  const status = err.statusCode || 500;
  res.status(status).json({
    succes:  false,
    message: err.message || 'Erreur serveur interne',
  });
};

module.exports = errorHandler;