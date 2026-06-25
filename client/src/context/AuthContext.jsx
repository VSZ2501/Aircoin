/**
 * Emplacement : client/src/context/AuthContext.jsx
 *
 * Contexte global d'authentification.
 * Stocke le token JWT dans localStorage (clé "aircoin_token") et
 * garde l'utilisateur courant en mémoire pour toute l'application.
 *
 * Usage :
 *   const { user, isAuthenticated, login, register, logout } = useAuth()
 */

import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/auth.service'

const TOKEN_KEY = 'aircoin_token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Au montage : si un token existe déjà, on récupère le profil
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    authService.getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  async function login(loginValue, motDePasse) {
    const { token, user: newUser } = await authService.login(loginValue, motDePasse)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(newUser)
    return newUser
  }

  async function register(payload) {
    const { token, user: newUser } = await authService.register(payload)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(newUser)
    return newUser
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  /**
   * Transforme le compte courant (client) en hébergeur.
   * Met à jour `user` immédiatement, sans recharger la page.
   */
  async function upgradeToHebergeur() {
    const updatedUser = await authService.devenirHebergeur()
    setUser(updatedUser)
    return updatedUser
  }

  /**
   * Ajoute ou retire un logement des favoris (toggle), avec mise à
   * jour optimiste de l'UI (le cœur change d'état immédiatement,
   * sans attendre la réponse serveur — annulé en cas d'erreur).
   */
  async function toggleFavori(logementId) {
    if (!user) return

    const wasAlreadyFavori = user.favoris?.includes(logementId)
    const nextFavoris = wasAlreadyFavori
      ? user.favoris.filter((id) => id !== logementId)
      : [...(user.favoris || []), logementId]

    // Mise à jour optimiste
    setUser((prev) => ({ ...prev, favoris: nextFavoris }))

    try {
      await authService.toggleFavori(logementId)
    } catch (err) {
      // Rollback si l'appel échoue
      setUser((prev) => ({ ...prev, favoris: user.favoris || [] }))
      throw err
    }
  }

  function isFavori(logementId) {
    return user?.favoris?.includes(logementId) || false
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    upgradeToHebergeur,
    toggleFavori,
    isFavori,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de <AuthProvider>')
  }
  return ctx
}