// ─── ROUTES Reservation ───────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();

const {
  creerReservation,
  getMesReservations,
  annulerReservation,
} = require('../controllers/reservation.controller');

const { proteger, roleRequis } = require('../middlewares/authMiddleware');

// Toutes les routes de réservation nécessitent d'être connecté
router.use(proteger);

router.post('/',                        roleRequis('client'), creerReservation);      // POST /api/reservations
router.get('/mes-reservations',         roleRequis('client'), getMesReservations);    // GET  /api/reservations/mes-reservations
router.put('/:id/annuler',              roleRequis('client'), annulerReservation);    // PUT  /api/reservations/:id/annuler

module.exports = router;