// ─── MODÈLE Utilisateur ───────────────────────────────────────────────────────
// Collection : "utilisateurs"
// Champs ajoutés pour coller au front : bio, superhost, taux_reponse, date_inscription, favoris

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const utilisateurSchema = new mongoose.Schema(
  {
    // ── Identité ────────────────────────────────────────────────────────────────
    nom:               { type: String, required: [true, 'Le nom est requis'],    trim: true },
    prenom:            { type: String, required: [true, 'Le prénom est requis'], trim: true },
    date_de_naissance: { type: Date },
    login:             { type: String, required: [true, 'Le login est requis'],
                         unique: true, lowercase: true, trim: true },
    mot_de_passe:      { type: String, required: [true, 'Le mot de passe est requis'],
                         minlength: 6, select: false },
    photo_de_profil:   { type: String, default: '' },

    // ── Rôle ────────────────────────────────────────────────────────────────────
    role: { type: String, enum: ['client', 'hebergeur'], required: true },

    // ── Favoris (logements likés par l'utilisateur) ──────────────────────────────
    favoris: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Logement', default: [] }],

    // ── Profil hôte (affiché sur DetailPage → HostCard) ─────────────────────────
    bio:             { type: String, default: '', trim: true },
    superhost:       { type: Boolean, default: false },       // isSuperhost
    taux_reponse:    { type: Number,  default: 0, min: 0, max: 100 }, // responseRate (%)
    avis:            { type: Number,  default: 0, min: 0, max: 5 },   // note globale
    date_inscription:{ type: Date,    default: Date.now },    // memberSince

    // ── Champs spécifiques CLIENT ────────────────────────────────────────────────
    preference:   { type: String, default: '' },
    verification: { type: Boolean, default: false },

    // ── Champs spécifiques HÉBERGEUR ─────────────────────────────────────────────
    certification:      { type: String, default: '' },
    langue:             { type: String, default: '' },
    date_certification: { type: Date },
  },
  {
    timestamps:  false,
    versionKey:  false,
    collection:  'utilisateurs',
  }
);

// ── Hash du mot de passe avant sauvegarde ─────────────────────────────────────
utilisateurSchema.pre('save', async function (next) {
  if (!this.isModified('mot_de_passe')) return next();
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, 12);
  next();
});

// ── Comparaison pour la connexion ─────────────────────────────────────────────
utilisateurSchema.methods.verifierMotDePasse = async function (motDePasseSaisi) {
  return bcrypt.compare(motDePasseSaisi, this.mot_de_passe);
};

module.exports = mongoose.model('Utilisateur', utilisateurSchema);