/**
 * Emplacement : client/src/components/layout/Navbar.jsx
 *
 * Barre de navigation fixe en haut de page.
 * Desktop (≥768px) : logo + liens + CTA "Se connecter" OU profil utilisateur.
 * Mobile (<768px)  : logo + hamburger → menu déroulant.
 *
 * Branché sur useAuth() : affiche dynamiquement soit le bouton
 * "Se connecter", soit l'avatar + nom (cliquable → /dashboard) +
 * bouton "Déconnexion".
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Button from '../ui/Button'

const NAV_LINKS = [
  { label: 'Explorer', to: '/logements' },
  { label: 'Comment ça marche', to: '/comment-ca-marche' },
  { label: 'Publier', to: '/publier' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  function closeMenu() {
    setIsMenuOpen(false)
  }

  function handleLogout() {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-minuit shadow-nav transition-colors duration-200">
      <div className="container h-[72px] flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="text-xl font-bold text-minuit dark:text-white shrink-0">
          aircoin<span className="text-terrecuite">.</span>
        </Link>

        {/* Liens — visibles seulement à partir de 768px (md) */}
        <nav className="hidden md:flex md:items-center md:gap-10 md:flex-1 md:justify-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-charbon dark:text-white hover:text-terrecuite transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Zone droite : mode nuit + connecté ou non (desktop) ──── */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Toggle mode nuit */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Passer en mode jour' : 'Passer en mode nuit'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg hover:bg-brume dark:hover:bg-white/10 transition-colors duration-150"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <>
              {/* Avatar + prénom → mène au tableau de bord */}
              <Link to="/dashboard" className="flex items-center gap-2.5 group">
                <div
                  className="w-8 h-8 rounded-full bg-terrecuite overflow-hidden shrink-0"
                  style={user?.avatar ? { backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover' } : {}}
                />
                <span className="text-sm font-semibold text-minuit dark:text-white group-hover:text-terrecuite transition-colors duration-150">
                  {user?.prenom}
                </span>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Link to="/connexion">
              <Button variant="secondary" size="sm">
                Se connecter
              </Button>
            </Link>
          )}
        </div>

        {/* Hamburger — visible seulement EN DESSOUS de 768px */}
        <button
          type="button"
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="md:hidden shrink-0 w-9 h-9 flex flex-col items-center justify-center gap-1.5"
        >
          <span className={`block h-0.5 w-6 bg-minuit dark:bg-white rounded-full transition-transform duration-200 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-minuit dark:bg-white rounded-full transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`block h-0.5 w-6 bg-minuit dark:bg-white rounded-full transition-transform duration-200 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-white dark:bg-minuit">
          <div className="container flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="text-base text-charbon dark:text-white py-3 border-b border-border last:border-b-0"
              >
                {link.label}
              </Link>
            ))}

            {/* Toggle mode nuit (mobile) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-3 py-4 border-b border-border text-base text-charbon dark:text-white"
            >
              <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
              {isDark ? 'Mode jour' : 'Mode nuit'}
            </button>

            {isAuthenticated ? (
              <>
                {/* Avatar + nom → mène au tableau de bord */}
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center gap-3 py-4 border-b border-border"
                >
                  <div
                    className="w-9 h-9 rounded-full bg-terrecuite overflow-hidden shrink-0"
                    style={user?.avatar ? { backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover' } : {}}
                  />
                  <div>
                    <p className="text-base font-semibold text-minuit dark:text-white leading-tight">
                      {user?.prenom} {user?.nom}
                    </p>
                    <p className="text-xs text-gris mt-0.5">Voir mon tableau de bord →</p>
                  </div>
                </Link>
                <Button variant="outline" fullWidth onClick={handleLogout} className="mt-4">
                  Déconnexion
                </Button>
              </>
            ) : (
              <Link to="/connexion" onClick={closeMenu} className="mt-4">
                <Button variant="secondary" fullWidth>
                  Se connecter
                </Button>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}