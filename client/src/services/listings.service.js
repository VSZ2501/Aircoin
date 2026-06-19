// client/src/services/listings.service.js
// Fonctions d'appel API pour les logements et les avis.
// Utilisées par les hooks useListings et useListing.

import api from './api';

// ── Logements ─────────────────────────────────────────────────────────────────

/**
 * Liste des logements avec filtres et pagination.
 * @param {Object} params - ville, type, prixMin, prixMax, meuble, animaux, chambres, page, limit, sort
 */
export const getLogements = (params = {}) =>
  api.get('/logements', { params }).then(r => r.data);

/**
 * 4 logements "à la une" pour la HomePage.
 */
export const getLogementsFeatured = () =>
  api.get('/logements/featured').then(r => r.data);

/**
 * Villes avec nombre d'annonces — cartes "Destinations populaires".
 */
export const getVilles = () =>
  api.get('/logements/villes').then(r => r.data);

/**
 * Détail complet d'un logement (avec hôte peuplé).
 * @param {string} id
 */
export const getLogementById = (id) =>
  api.get(`/logements/${id}`).then(r => r.data);

// ── Avis ──────────────────────────────────────────────────────────────────────

/**
 * Tous les avis d'un logement.
 * @param {string} logementId
 */
export const getAvisLogement = (logementId) =>
  api.get(`/avis/logement/${logementId}`).then(r => r.data);

/**
 * Créer un avis (token requis).
 * @param {string} logementId
 * @param {Object} body - { note, commentaire, categories? }
 */
export const creerAvis = (logementId, body) =>
  api.post(`/avis/logement/${logementId}`, body).then(r => r.data);