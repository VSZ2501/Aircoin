/**
 * Emplacement : client/src/services/auth.service.js
 *
 * Appels API d'authentification.
 * Routes réelles (server/routes/utilisateur.routes.js) :
 *   POST /api/utilisateurs/login    { login, mot_de_passe }
 *   POST /api/utilisateurs/register { nom, prenom, login, mot_de_passe, role }
 *   GET  /api/utilisateurs/moi      (Authorization: Bearer <token>)
 *
 * Toutes les réponses ont la forme { succes, token?, data?, message? }.
 */

import api from './api'

/**
 * Connexion. Retourne { token, user } en cas de succès.
 */
export async function login(loginValue, motDePasse) {
  const res = await api.post('/utilisateurs/login', {
    login: loginValue,
    mot_de_passe: motDePasse,
  })
  return { token: res.data.token, user: res.data.data }
}

/**
 * Inscription. role = 'client' | 'hebergeur'
 */
export async function register({ nom, prenom, login: loginValue, motDePasse, role = 'client' }) {
  const res = await api.post('/utilisateurs/register', {
    nom,
    prenom,
    login: loginValue,
    mot_de_passe: motDePasse,
    role,
  })
  return { token: res.data.token, user: res.data.data }
}

/**
 * Récupère le profil de l'utilisateur connecté à partir du token stocké.
 */
export async function getMe() {
  const res = await api.get('/utilisateurs/moi')
  return res.data.data
}

/**
 * Transforme un compte client en compte hébergeur.
 * ⚠️ Nécessite que le serveur expose PUT /api/utilisateurs/moi
 * (voir utilisateur.routes.js + utilisateur.controller.js → devenirHebergeur).
 */
export async function devenirHebergeur() {
  const res = await api.put('/utilisateurs/moi', { role: 'hebergeur' })
  return res.data.data
}

/**
 * Ajoute ou retire un logement des favoris (toggle).
 * Retourne la nouvelle liste d'IDs favoris.
 */
export async function toggleFavori(logementId) {
  const res = await api.put(`/utilisateurs/favoris/${logementId}`)
  return res.data.data
}

/**
 * Liste complète des logements favoris (peuplés) de l'utilisateur connecté.
 */
export async function getFavoris() {
  const res = await api.get('/utilisateurs/favoris')
  return res.data.data
}