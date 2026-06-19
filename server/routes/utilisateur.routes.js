// ─── ROUTES Utilisateur ───────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();

const { inscrire, connecter, moi } = require('../controllers/utilisateur.controller');
const { proteger }                  = require('../middlewares/authMiddleware');

router.post('/register', inscrire);          // POST /api/utilisateurs/register
router.post('/login',    connecter);         // POST /api/utilisateurs/login
router.get('/moi',       proteger, moi);     // GET  /api/utilisateurs/moi

module.exports = router;