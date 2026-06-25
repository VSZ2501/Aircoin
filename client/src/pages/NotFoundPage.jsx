/**
 * Emplacement : client/src/pages/NotFoundPage.jsx
 *
 * Page 404 — affichée pour toute route non définie dans AppRouter.jsx
 * (route catch-all "*"). Pas de Navbar/Footer, page autonome.
 */

import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brume px-6">
      <div className="text-center max-w-md">

        {/* Logo */}
        <Link to="/" className="inline-block text-xl font-bold text-minuit mb-10">
          aircoin<span className="text-terrecuite">.</span>
        </Link>

        {/* Illustration simple : numéro 404 stylisé */}
        <p className="text-[120px] font-bold text-minuit leading-none mb-2">
          4<span className="text-terrecuite">0</span>4
        </p>

        <h1 className="text-2xl mb-3">Page introuvable</h1>
        <p className="text-base text-charbon leading-relaxed mb-10">
          Le logement ou la page que vous cherchez n'existe pas, ou a été déplacé.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary">
              Retour à l'accueil
            </Button>
          </Link>
          <Link to="/logements">
            <Button variant="outline">
              Explorer les logements
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}