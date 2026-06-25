// ─── ROUTES Reservation ───────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();

const {
  creerReservation,
  getMesReservations,
  annulerReservation,
  accepterReservation,
  refuserReservation,
  getReservationsRecues,
  peutNoterReservation,
} = require('../controllers/reservation.controller');

const { proteger } = require('../middlewares/authMiddleware');

router.use(proteger);

router.post('/',                  creerReservation);
router.get('/mes-reservations',   getMesReservations);
router.get('/recues',             getReservationsRecues);
router.put('/:id/annuler',        annulerReservation);
router.put('/:id/accepter',       accepterReservation);
router.put('/:id/refuser',        refuserReservation);
router.get('/:id/peut-noter', peutNoterReservation);


module.exports = router;