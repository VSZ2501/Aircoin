// client/src/services/bookings.service.js
// Fonctions d'appel API pour les réservations.
// Même convention que listings.service.js : chaque fonction retourne
// directement r.data (donc { succes, data } ou { succes, count, data }).

import api from './api';

/**
 * Toutes les réservations de l'utilisateur connecté (token requis).
 */
export const getMesReservations = () =>
  api.get('/reservations/mes-reservations').then(r => r.data);

/**
 * Créer une réservation (token requis, rôle client).
 * @param {Object} body - { logement_id, date_arrivee, date_depart, nb_voyageurs }
 */
export const creerReservation = (body) =>
  api.post('/reservations', body).then(r => r.data);

/**
 * Annuler une réservation (token requis, doit appartenir au client).
 * @param {string} id
 */
export const annulerReservation = (id) =>
  api.put(`/reservations/${id}/annuler`).then(r => r.data);

/**
 * Toutes les réservations reçues sur les logements de l'hôte connecté
 * (token requis, rôle hébergeur).
 */
export const getReservationsRecues = () =>
  api.get('/reservations/recues').then(r => r.data);

/**
 * Accepte une réservation reçue (token requis, doit être le
 * propriétaire du logement concerné).
 * @param {string} id
 */
export const accepterReservation = (id) =>
  api.put(`/reservations/${id}/accepter`).then(r => r.data);

/**
 * Refuse une réservation reçue (token requis, doit être le
 * propriétaire du logement concerné).
 * @param {string} id
 */
export const refuserReservation = (id) =>
  api.put(`/reservations/${id}/refuser`).then(r => r.data);