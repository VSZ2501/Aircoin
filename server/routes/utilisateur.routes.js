// ─── ROUTES Utilisateur ───────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();

const {
  inscrire,
  connecter,
  moi,
  devenirHebergeur,
  toggleFavori,
  getFavoris,
} = require('../controllers/utilisateur.controller');

const { proteger } = require('../middlewares/authMiddleware');

router.post('/register', inscrire);                  // POST /api/utilisateurs/register
router.post('/login',    connecter);                 // POST /api/utilisateurs/login
router.get('/moi',       proteger, moi);              // GET  /api/utilisateurs/moi
router.put('/moi',       proteger, devenirHebergeur); // PUT  /api/utilisateurs/moi (devenir hôte)

router.put('/favoris/:logementId', proteger, toggleFavori); // PUT /api/utilisateurs/favoris/:logementId
router.get('/favoris',             proteger, getFavoris);   // GET /api/utilisateurs/favoris

module.exports = router;