// ─── ROUTES Avis ──────────────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();

const { getAvisLogement, creerAvis } = require('../controllers/avis.controller');
const { proteger, roleRequis }       = require('../middlewares/authMiddleware');

// GET  /api/avis/logement/:id  → liste des avis (public)
router.get('/logement/:id', getAvisLogement);

// POST /api/avis/logement/:id  → créer un avis (client connecté)
router.post('/logement/:id', proteger, roleRequis('client'), creerAvis);

module.exports = router;