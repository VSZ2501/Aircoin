// Script à exécuter une seule fois manuellement :
//   node scripts/recalculerToutesLesNotes.js
// Recalcule la note moyenne de TOUS les utilisateurs ayant déjà
// reçu au moins un avis, pour rattraper les avis créés avant
// l'ajout du recalcul automatique dans creerAvisUtilisateur.

require('dotenv').config();
const mongoose = require('mongoose');
const AvisUtilisateur = require('../models/avisUtilisateur.model');
const Utilisateur = require('../models/utilisateur.model');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connecté à MongoDB');

  // Tous les IDs distincts d'utilisateurs ayant reçu un avis
  const cibles = await AvisUtilisateur.distinct('cible_id');
  console.log(`${cibles.length} utilisateur(s) à recalculer`);

  for (const cibleId of cibles) {
    const stats = await AvisUtilisateur.aggregate([
      { $match: { cible_id: cibleId } },
      { $group: { _id: null, avgNote: { $avg: '$note' } } },
    ]);

    const avgNote = stats.length ? Math.round(stats[0].avgNote * 10) / 10 : 0;
    await Utilisateur.findByIdAndUpdate(cibleId, { avis: avgNote });
    console.log(`  → ${cibleId} : ${avgNote} ★`);
  }

  console.log('✅ Terminé');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('❌ Erreur :', err);
  process.exit(1);
});