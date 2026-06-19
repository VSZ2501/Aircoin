// ─── CONTROLLER AvisLogement ──────────────────────────────────────────────────
// Après chaque création/suppression, recalcule avgNote et reviewCount sur Logement.

const AvisLogement = require('../models/avisLogement.model');
const Logement     = require('../models/logement.model');

// ── Helper : recalcule les stats de notes sur le logement ─────────────────────
async function recalculerNotes(logementId) {
  const stats = await AvisLogement.aggregate([
    { $match: { logement_id: logementId } },
    { $group: { _id: null, avgNote: { $avg: '$note' }, count: { $sum: 1 } } },
  ]);

  const avgNote    = stats.length ? Math.round(stats[0].avgNote * 10) / 10 : 0;
  const reviewCount = stats.length ? stats[0].count : 0;

  await Logement.findByIdAndUpdate(logementId, { avgNote, reviewCount });
}

// ── Formatter ─────────────────────────────────────────────────────────────────
function formatAvis(a) {
  const doc = a.toObject ? a.toObject() : a;
  const auteur = doc.auteur_id;

  return {
    id:   doc._id,
    name: auteur && typeof auteur === 'object'
            ? `${auteur.prenom} ${auteur.nom}`
            : 'Utilisateur',
    date: doc.date_publication
            ? new Date(doc.date_publication).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
            : '',
    note:         doc.note,
    text:         doc.commentaire,
    avatarColor:  auteur?.photo_de_profil || null,
    categories: {
      label:  'Propreté',        note: doc.categories?.proprete             ?? 5,
      label2: 'Communication',   note2: doc.categories?.communication       ?? 5,
      label3: 'Emplacement',     note3: doc.categories?.emplacement         ?? 5,
      label4: 'Rapport qualité/prix', note4: doc.categories?.rapport_qualite_prix ?? 5,
    },
    // Format attendu par ReviewsSection → categories array
    categoriesArray: [
      { label: 'Propreté',             note: doc.categories?.proprete              ?? 5 },
      { label: 'Communication',        note: doc.categories?.communication         ?? 5 },
      { label: 'Emplacement',          note: doc.categories?.emplacement           ?? 5 },
      { label: 'Rapport qualité/prix', note: doc.categories?.rapport_qualite_prix  ?? 5 },
    ],
  };
}

// ══ Controllers ════════════════════════════════════════════════════════════════

/**
 * GET /api/avis/logement/:id
 * Tous les avis d'un logement, triés du plus récent.
 */
const getAvisLogement = async (req, res, next) => {
  try {
    const avis = await AvisLogement.find({ logement_id: req.params.id })
      .populate('auteur_id', 'nom prenom photo_de_profil')
      .sort({ date_publication: -1 });

    res.json({ succes: true, count: avis.length, data: avis.map(formatAvis) });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/avis/logement/:id
 * Créer un avis (client connecté, un seul par logement).
 * Body : { note, commentaire, categories? }
 */
const creerAvis = async (req, res, next) => {
  try {
    const { note, commentaire, categories } = req.body;

    if (!note || !commentaire) {
      return res.status(400).json({ succes: false, message: 'Note et commentaire requis' });
    }

    const avis = await AvisLogement.create({
      logement_id:      req.params.id,
      auteur_id:        req.utilisateur._id,
      note,
      commentaire,
      categories:       categories ?? {},
      date_publication: new Date(),
    });

    // Recalcul immédiat des stats du logement
    await recalculerNotes(avis.logement_id);

    const avisPopule = await AvisLogement.findById(avis._id)
      .populate('auteur_id', 'nom prenom photo_de_profil');

    res.status(201).json({ succes: true, data: formatAvis(avisPopule) });
  } catch (err) {
    // Duplicate key = déjà un avis pour ce logement
    if (err.code === 11000) {
      return res.status(400).json({ succes: false, message: 'Vous avez déjà laissé un avis pour ce logement' });
    }
    next(err);
  }
};

module.exports = { getAvisLogement, creerAvis };