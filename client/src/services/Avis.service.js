// client/src/services/avis.service.js
// Avis sur les UTILISATEURS (hôte ↔ client), réciproques après un séjour
// terminé. Distinct des avis sur les LOGEMENTS, gérés dans
// listings.service.js (getAvisLogement / creerAvis, déjà existants).
//
// Routes serveur (avis.routes.js, même fichier que les avis logement,
// préfixe /utilisateur pour les distinguer) :
//   POST /api/avis/utilisateur/:reservationId   { cible_id, note, commentaire }
//   GET  /api/avis/utilisateur/:userId
//   GET  /api/reservations/:reservationId/peut-noter

import api from './api';

/**
 * Crée un avis réciproque après un séjour terminé.
 * @param {string} reservationId
 * @param {Object} body - { cible_id, note, commentaire }
 *   cible_id : l'ID de la personne notée (l'hôte si on est le client
 *   connecté, ou le client si on est l'hôte connecté).
 */
export const creerAvisUtilisateur = (reservationId, body) =>
  api.post(`/avis/utilisateur/${reservationId}`, body).then(r => r.data);

/**
 * Tous les avis reçus par un utilisateur (affichés sur HostCard,
 * profil public, etc.).
 * @param {string} userId
 */
export const getAvisUtilisateur = (userId) =>
  api.get(`/avis/utilisateur/${userId}`).then(r => r.data);

/**
 * Vérifie si l'utilisateur connecté peut laisser un avis pour une
 * réservation donnée (séjour terminé + pas déjà noté).
 * @param {string} reservationId
 * @returns {Promise<{ peutNoter: boolean, dejaNote: boolean }>}
 */
export const peutNoterReservation = (reservationId) =>
  api.get(`/reservations/${reservationId}/peut-noter`).then(r => r.data);