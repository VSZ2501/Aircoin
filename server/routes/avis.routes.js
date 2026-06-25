// ─── ROUTES Avis ──────────────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();

const {
  getAvisLogement,
  creerAvis,
  peutNoterLogement,
  creerAvisUtilisateur,
  getAvisUtilisateur,
} = require('../controllers/avis.controller');

const { proteger } = require('../middlewares/authMiddleware');

// ── Avis sur les LOGEMENTS ──────────────────────────────────────────────────
router.get('/logement/:id', getAvisLogement);                  // public
router.post('/logement/:id', proteger, creerAvis);              // connecté (tout rôle)
router.get('/logement/:id/peut-noter', proteger, peutNoterLogement);


// ── Avis sur les UTILISATEURS (hôte ↔ client, réciproque) ───────────────────
router.post('/utilisateur/:reservationId', proteger, creerAvisUtilisateur);
router.get('/utilisateur/:userId', getAvisUtilisateur);         // public

module.exports = router;