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

// ── Hébergeur (Dashboard) ───────────────────────────────────────────────────

/**
 * Logements d'un hébergeur précis — utilisé par DashboardPage (vue hôte).
 * ⚠️ Nécessite un filtre hebergeurId côté serveur dans logement.controller.js
 * (getLogements) : if (hebergeurId) filtre.hebergeur_id = hebergeurId;
 * @param {string} hebergeurId
 */
export const getMesLogements = (hebergeurId) =>
  api.get('/logements', { params: { hebergeurId, limit: 100 } }).then(r => r.data);

/**
 * Crée un nouveau logement (hébergeur connecté requis).
 * Body attendu (champs du modèle Logement, en français) :
 *   nom_logement, type_de_logement, description, adresse, ville,
 *   code_postal, quartier, surface, capacite, chambres,
 *   salles_de_bain, etage, prix, equipement[], regle, meuble, animaux
 */
export const creerLogement = (body) =>
  api.post('/logements', body).then(r => r.data);

/**
 * Modifie un logement existant (propriétaire hébergeur uniquement).
 * @param {string} id
 * @param {Object} body - mêmes champs que creerLogement, partiels acceptés
 */
export const modifierLogement = (id, body) =>
  api.put(`/logements/${id}`, body).then(r => r.data);
 
/**
 * Supprime un logement (propriétaire hébergeur uniquement).
 * @param {string} id
 */
export const supprimerLogement = (id) =>
  api.delete(`/logements/${id}`).then(r => r.data);

export const peutNoterLogement = (logementId) =>
  api.get(`/avis/logement/${logementId}/peut-noter`).then(r => r.data);