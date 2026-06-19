/**
 * Emplacement : client/src/components/layout/Navbar.jsx
 *
 * Barre de navigation fixe en haut de page.
 * Desktop (≥768px) : logo + liens + CTA "Se connecter".
 * Mobile (<768px)  : logo + hamburger → menu déroulant.
 *
 * Fix : utilisation de classes Tailwind natives standards
 * (hidden / md:flex / md:hidden) sans aucune classe arbitraire
 * mélangée, pour garantir une génération fiable en Tailwind v4.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const NAV_LINKS = [
  { label: 'Explorer', to: '/logements' },
  { label: 'Comment ça marche', to: '/comment-ca-marche' },
  { label: 'Publier', to: '/publier' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-nav">
      <div className="container h-[72px] flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="text-xl font-bold text-minuit shrink-0">
          aircoin<span className="text-terrecuite">.</span>
        </Link>

        {/* Liens — visibles seulement à partir de 768px (md) */}
        <nav className="hidden md:flex md:items-center md:gap-10 md:flex-1 md:justify-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-charbon hover:text-terrecuite transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA — visible seulement à partir de 768px (md) */}
        <Link to="/connexion" className="hidden md:block shrink-0">
          <Button variant="secondary" size="sm">
            Se connecter
          </Button>
        </Link>

        {/* Hamburger — visible seulement EN DESSOUS de 768px */}
        <button
          type="button"
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="md:hidden shrink-0 w-9 h-9 flex flex-col items-center justify-center gap-1.5"
        >
          <span className={`block h-0.5 w-6 bg-minuit rounded-full transition-transform duration-200 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-minuit rounded-full transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`block h-0.5 w-6 bg-minuit rounded-full transition-transform duration-200 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-white">
          <div className="container flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="text-base text-charbon py-3 border-b border-border last:border-b-0"
              >
                {link.label}
              </Link>
            ))}

            <Link to="/connexion" onClick={closeMenu} className="mt-4">
              <Button variant="secondary" fullWidth>
                Se connecter
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}