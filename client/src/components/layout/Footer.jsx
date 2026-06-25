/**
 * Emplacement : client/src/components/layout/Footer.jsx
 *
 * Pied de page — reprend la structure de la maquette homepage.
 *
 * IMPORTANT : ne contient plus QUE des liens vers des pages qui
 * existent réellement. Les liens vers des pages non créées (Blog,
 * Presse, Recrutement, CGU, Tarifs, Aide, À propos...) ont été
 * retirés volontairement plutôt que de pointer vers "#" — à
 * rajouter dans ce fichier le jour où ces pages existeront.
 */

import { Link } from 'react-router-dom'

const CITIES = ['Paris', 'Lyon', 'Bordeaux', 'Marseille']

export default function Footer() {
  return (
    <footer className="bg-[#101C30] text-white">
      <div className="container py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Logo + tagline */}
          <div>
            <div className="text-xl font-bold mb-4">
              aircoin<span className="text-terrecuite">.</span>
            </div>
            <p className="text-sm text-[#6A8BAA] leading-relaxed max-w-[260px]">
              La plateforme de location qui met en relation propriétaires et locataires.
            </p>
          </div>

          {/* Colonne Explorer — villes liées à de vrais résultats filtrés */}
          <div>
            <h6 className="text-sm font-bold text-white mb-4">Explorer</h6>
            <ul className="flex flex-col gap-3">
              {CITIES.map((city) => (
                <li key={city}>
                  <Link
                    to={`/logements?ville=${city}`}
                    className="text-sm text-[#5A7A9A] hover:text-terrecuite transition-colors duration-150"
                  >
                    {city}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/logements"
                  className="text-sm text-[#5A7A9A] hover:text-terrecuite transition-colors duration-150"
                >
                  Toutes les villes
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne Propriétaires — uniquement les 2 pages existantes */}
          <div>
            <h6 className="text-sm font-bold text-white mb-4">Propriétaires</h6>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="/publier"
                  className="text-sm text-[#5A7A9A] hover:text-terrecuite transition-colors duration-150"
                >
                  Publier une annonce
                </Link>
              </li>
              <li>
                <Link
                  to="/comment-ca-marche"
                  className="text-sm text-[#5A7A9A] hover:text-terrecuite transition-colors duration-150"
                >
                  Comment ça marche
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne Air'Coin — pages institutionnelles, à compléter plus tard */}
          <div>
            <h6 className="text-sm font-bold text-white mb-4">Air'Coin</h6>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#5A7A9A] hover:text-terrecuite transition-colors duration-150"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-[#5A7A9A] hover:text-terrecuite transition-colors duration-150"
                >
                  Mon compte
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 pt-8 border-t border-[#253548]">
          <p className="text-xs text-[#3A5878]">
            © {new Date().getFullYear()} Air'Coin SAS — Tous droits réservés
          </p>
        </div>

      </div>
    </footer>
  )
}