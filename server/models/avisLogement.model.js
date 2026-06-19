// ─── MODÈLE AvisLogement ──────────────────────────────────────────────────────
// Collection : "avis_logements"
// Après chaque création/suppression, avgNote et reviewCount du Logement
// sont recalculés (voir avis.controller.js → recalculerNotes).

const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema(
  {
    proprete:            { type: Number, min: 1, max: 5, default: 5 },
    communication:       { type: Number, min: 1, max: 5, default: 5 },
    emplacement:         { type: Number, min: 1, max: 5, default: 5 },
    rapport_qualite_prix:{ type: Number, min: 1, max: 5, default: 5 },
  },
  { _id: false }
);

const avisSchema = new mongoose.Schema(
  {
    logement_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Logement',    required: true, index: true },
    auteur_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    note:            { type: Number, required: true, min: 1, max: 5 },
    commentaire:     { type: String, required: [true, 'Le commentaire est requis'], trim: true },
    date_publication:{ type: Date, default: Date.now },
    categories:      { type: categoriesSchema, default: () => ({}) },
  },
  {
    versionKey: false,
    collection: 'avis_logements',
  }
);

// Un utilisateur ne peut laisser qu'un avis par logement
avisSchema.index({ logement_id: 1, auteur_id: 1 }, { unique: true });

module.exports = mongoose.model('AvisLogement', avisSchema);