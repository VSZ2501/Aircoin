/**
 * Emplacement : client/src/pages/RegisterPage.jsx
 *
 * Page d'inscription — pas de Navbar/Footer (déclarée hors PageWrapper
 * dans AppRouter.jsx), centrée, charte Air'Coin.
 *
 * Route réelle utilisée (server/routes/utilisateur.routes.js) :
 *   POST /api/utilisateurs/register
 *   body : { nom, prenom, login, mot_de_passe, role }
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    login: '',
    motDePasse: '',
    confirmMotDePasse: '',
    role: 'client',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.motDePasse !== form.confirmMotDePasse) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (form.motDePasse.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)
    try {
      await register({
        nom: form.nom,
        prenom: form.prenom,
        login: form.login,
        motDePasse: form.motDePasse,
        role: form.role,
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue, veuillez réessayer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brume px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-10">

        {/* Logo */}
        <Link to="/" className="block text-center text-xl font-bold text-minuit mb-8">
          aircoin<span className="text-terrecuite">.</span>
        </Link>

        <h1 className="text-2xl text-center mb-2">Créer un compte</h1>
        <p className="text-sm text-gris text-center mb-8">
          Rejoignez Air'Coin en quelques secondes.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Nom / Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prenom" className="block text-sm font-semibold text-minuit mb-2">
                Prénom
              </label>
              <input
                id="prenom"
                type="text"
                required
                value={form.prenom}
                onChange={(e) => updateField('prenom', e.target.value)}
                placeholder="Jean"
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
              />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-semibold text-minuit mb-2">
                Nom
              </label>
              <input
                id="nom"
                type="text"
                required
                value={form.nom}
                onChange={(e) => updateField('nom', e.target.value)}
                placeholder="Dupont"
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
              />
            </div>
          </div>

          {/* Login */}
          <div>
            <label htmlFor="login" className="block text-sm font-semibold text-minuit mb-2">
              Identifiant
            </label>
            <input
              id="login"
              type="text"
              required
              value={form.login}
              onChange={(e) => updateField('login', e.target.value)}
              placeholder="jean.dupont"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-minuit mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={form.motDePasse}
              onChange={(e) => updateField('motDePasse', e.target.value)}
              placeholder="6 caractères minimum"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
            />
          </div>

          {/* Confirmation */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-minuit mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={form.confirmMotDePasse}
              onChange={(e) => updateField('confirmMotDePasse', e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
            />
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-semibold text-minuit mb-2">
              Vous êtes
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField('role', 'client')}
                className={
                  form.role === 'client'
                    ? 'px-4 py-3 rounded-lg border-2 border-terrecuite bg-terrecuite/10 text-sm font-semibold text-minuit'
                    : 'px-4 py-3 rounded-lg border border-border text-sm text-charbon'
                }
              >
                Voyageur
              </button>
              <button
                type="button"
                onClick={() => updateField('role', 'hebergeur')}
                className={
                  form.role === 'hebergeur'
                    ? 'px-4 py-3 rounded-lg border-2 border-terrecuite bg-terrecuite/10 text-sm font-semibold text-minuit'
                    : 'px-4 py-3 rounded-lg border border-border text-sm text-charbon'
                }
              >
                Hôte
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-error bg-error/10 rounded-md px-4 py-3">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={loading} className="mt-2">
            {loading ? 'Création du compte…' : 'Créer mon compte'}
          </Button>
        </form>

        <p className="text-sm text-gris text-center mt-8">
          Déjà un compte ?{' '}
          <Link to="/connexion" className="text-terrecuite font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}