// ─── ROUTES Logement ──────────────────────────────────────────────────────────
// IMPORTANT : les routes statiques (featured, villes) DOIVENT être déclarées
// AVANT /:id, sinon Express les interpréterait comme un paramètre.

const express = require('express');
const router  = express.Router();

const {
  getLogements,
  getLogementsALaUne,
  getVilles,
  getLogementById,
  creerLogement,
  modifierLogement,
  supprimerLogement,
} = require('../controllers/logement.controller');

const { proteger, roleRequis } = require('../middlewares/authMiddleware');

// ── Publiques ─────────────────────────────────────────────────────────────────
router.get('/featured',  getLogementsALaUne);   // HomePage → "Logements à la une"
router.get('/villes',    getVilles);            // HomePage → "Destinations populaires"
router.get('/',          getLogements);         // ListingPage → liste + filtres
router.get('/:id',       getLogementById);      // DetailPage → fiche complète

// ── Protégées (hébergeur connecté) ────────────────────────────────────────────
router.post('/',    proteger, roleRequis('hebergeur'), creerLogement);
router.put('/:id',  proteger, roleRequis('hebergeur'), modifierLogement);
router.delete('/:id', proteger, roleRequis('hebergeur'), supprimerLogement);

module.exports = router;