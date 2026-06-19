/**
 * Emplacement : client/src/components/layout/Footer.jsx
 *
 * Pied de page — reprend la structure de la maquette homepage :
 * logo + tagline, 3 colonnes de liens, ligne de copyright.
 */

import { Link } from 'react-router-dom'

const FOOTER_COLUMNS = [
  {
    title: 'Explorer',
    links: ['Paris', 'Lyon', 'Bordeaux', 'Marseille', 'Toutes les villes'],
  },
  {
    title: 'Propriétaires',
    links: ['Publier une annonce', 'Comment ça marche', 'Tarifs & commissions', 'Aide'],
  },
  {
    title: "Air'Coin",
    links: ['À propos', 'Blog', 'Presse', 'Recrutement', 'CGU · Confidentialité'],
  },
]

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

          {/* Colonnes de liens */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h6 className="text-sm font-bold text-white mb-4">{col.title}</h6>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-sm text-[#5A7A9A] hover:text-terrecuite transition-colors duration-150"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Ligne de copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 pt-8 border-t border-[#253548]">
          <p className="text-xs text-[#3A5878]">
            © {new Date().getFullYear()} Air'Coin SAS — Tous droits réservés
          </p>
          <p className="text-xs text-[#3A5878]">
            Instagram · Twitter · LinkedIn
          </p>
        </div>

      </div>
    </footer>
  )
}