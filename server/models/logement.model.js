// ─── MODÈLE Logement ──────────────────────────────────────────────────────────
// Collection : "logements"
// Champs ajoutés pour coller au front : ville, quartier, description, badge,
// chambres, salles_de_bain, etage, meuble, animaux, avgNote, reviewCount,
// code_postal, latitude, longitude

const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  { piece_jointe: { type: String, required: true } },
  { _id: false, versionKey: false }
);

const pieceSchema = new mongoose.Schema(
  { type_de_piece: { type: String, required: true } },
  { _id: false, versionKey: false }
);

const logementSchema = new mongoose.Schema(
  {
    // ── Identification ──────────────────────────────────────────────────────────
    nom_logement:     { type: String, required: [true, 'Le nom est requis'],   trim: true },
    type_de_logement: { type: String, required: [true, 'Le type est requis'],
                        enum: ['Appartement', 'Maison', 'Villa', 'Studio', 'Chalet', 'Loft', 'Autre'] },
    badge:            { type: String, default: '' },          // "Coup de cœur", "Populaire"…
    description:      { type: String, default: '', trim: true },

    // ── Localisation ────────────────────────────────────────────────────────────
    adresse:     { type: String, required: [true, "L'adresse est requise"], trim: true },
    ville:       { type: String, required: [true, 'La ville est requise'],  trim: true, index: true },
    code_postal: { type: String, required: true, trim: true },
    quartier:    { type: String, default: '', trim: true },      // "Paris 10e", "Croix-Rousse"

    // Coordonnées GPS — calculées automatiquement par géocodage de
    // l'adresse côté serveur (voir utils/geocode.js + logement.controller.js
    // → creerLogement/modifierLogement). L'hôte n'a jamais à les saisir.
    latitude:  { type: Number },
    longitude: { type: Number },

    // ── Caractéristiques ────────────────────────────────────────────────────────
    surface:        { type: Number, min: 1 },
    capacite:       { type: Number, min: 1 },                 // maxGuests
    chambres:       { type: Number, min: 0, default: 1 },
    salles_de_bain: { type: Number, min: 0, default: 1 },
    etage:          { type: Number, default: 0 },

    // ── Options ─────────────────────────────────────────────────────────────────
    prix:       { type: Number, required: [true, 'Le prix est requis'], min: 0 },
    equipement: { type: [String], default: [] },              // amenities
    regle:      { type: String, default: '' },
    meuble:     { type: Boolean, default: false },            // furnished
    animaux:    { type: Boolean, default: false },            // petsAllowed

    // ── Évaluation (recalculé à chaque avis) ────────────────────────────────────
    avgNote:     { type: Number, default: 0,  min: 0, max: 5 },
    reviewCount: { type: Number, default: 0,  min: 0 },

    // ── Relations ───────────────────────────────────────────────────────────────
    hebergeur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    pieces:       { type: [pieceSchema],  default: [] },
    photos:       { type: [photoSchema],  default: [] },
  },
  {
    versionKey: false,
    collection: 'logements',
  }
);

// ── Index ─────────────────────────────────────────────────────────────────────
logementSchema.index({ hebergeur_id: 1 });
logementSchema.index({ prix: 1 });
logementSchema.index({ type_de_logement: 1 });
logementSchema.index({ ville: 1, prix: 1 });
logementSchema.index({ avgNote: -1 });

module.exports = mongoose.model('Logement', logementSchema);