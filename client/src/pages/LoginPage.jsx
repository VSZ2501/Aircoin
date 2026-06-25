/**
 * Emplacement : client/src/pages/LoginPage.jsx
 *
 * Page de connexion — pas de Navbar/Footer (déclarée hors PageWrapper
 * dans AppRouter.jsx), centrée, charte Air'Coin.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [loginValue, setLoginValue] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(loginValue, motDePasse)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brume px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-10">

        {/* Logo */}
        <Link to="/" className="block text-center text-xl font-bold text-minuit mb-8">
          aircoin<span className="text-terrecuite">.</span>
        </Link>

        <h1 className="text-2xl text-center mb-2">Connexion</h1>
        <p className="text-sm text-gris text-center mb-8">
          Heureux de vous revoir sur Air'Coin.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="login" className="block text-sm font-semibold text-minuit mb-2">
              Identifiant
            </label>
            <input
              id="login"
              type="text"
              required
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              placeholder="jean.dupont"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-minuit mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
            />
          </div>

          {error && (
            <p className="text-sm text-error bg-error/10 rounded-md px-4 py-3">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={loading} className="mt-2">
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>

        <p className="text-sm text-gris text-center mt-8">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-terrecuite font-semibold">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}