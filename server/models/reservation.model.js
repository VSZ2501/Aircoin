// ─── MODÈLE Reservation ───────────────────────────────────────────────────────
// Collection : "reservations"
// Correspond à la BookingCard du front (checkIn, checkOut, guests, priceRows, total).

const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    logement_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Logement',    required: true, index: true },
    client_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true, index: true },

    // ── Séjour ───────────────────────────────────────────────────────────────────
    date_arrivee: { type: Date, required: [true, "La date d'arrivée est requise"] },
    date_depart:  { type: Date, required: [true, 'La date de départ est requise'] },
    nb_voyageurs: { type: Number, required: true, min: 1 },

    // ── Tarification (correspond aux priceRows du front) ─────────────────────────
    prix_par_nuit:  { type: Number, required: true },   // snapshot du prix au moment de la résa
    nb_nuits:       { type: Number, required: true },
    frais_service:  { type: Number, default: 0 },
    taxe_sejour:    { type: Number, default: 0 },
    montant_total:  { type: Number, required: true },   // total final affiché

    // ── Statut ───────────────────────────────────────────────────────────────────
    statut: {
      type: String,
      enum: ['en_attente', 'confirmee', 'refusee', 'annulee'],
      default: 'en_attente',
    },

    date_limite_annulation: { type: Date },   // "Annulation gratuite avant le 8 juin"
    date_creation:          { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    collection: 'reservations',
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);