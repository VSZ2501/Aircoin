// client/src/services/api.js
// Instance axios partagée par tous les services.
// VITE_API_URL peut être défini dans client/.env pour la prod.

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Injecte le token JWT sur chaque requête si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aircoin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;