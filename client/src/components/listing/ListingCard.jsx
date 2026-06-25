/**
 * Emplacement : client/src/components/listing/ListingCard.jsx
 *
 * Carte logement — le composant le plus réutilisé du site.
 * Présent sur : Homepage ("Logements à la une"), ListingPage (résultats).
 *
 * Le bouton favori (vide / plein) est désormais fonctionnel :
 *  - non connecté → clic redirige vers /connexion
 *  - connecté → toggle optimiste via useAuth().toggleFavori()
 *
 * Usage :
 *   <ListingCard listing={{
 *     id: '1',
 *     title: 'Appartement haussmannien lumineux',
 *     location: 'Paris 10e',
 *     price: 89,
 *     note: 4.9,
 *     reviewCount: 214,
 *     image: '/img/listing-1.jpg',
 *     badge: 'Coup de cœur',
 *   }} />
 *
 *   <ListingCard listing={...} variant="horizontal" />
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Badge from '../ui/Badge'
import PriceTag from '../ui/PriceTag'
import StarRating from '../ui/StarRating'

export default function ListingCard({ listing, variant = 'vertical' }) {
  const {
    id,
    title,
    location,
    price,
    note,
    reviewCount,
    image,
    badge,
  } = listing

  const isHorizontal = variant === 'horizontal'

  const navigate = useNavigate()
  const { isAuthenticated, isFavori, toggleFavori } = useAuth()
  const [pending, setPending] = useState(false)

  const favori = isFavori(id)

  async function handleFavoriClick(e) {
    e.preventDefault()

    if (!isAuthenticated) {
      navigate('/connexion')
      return
    }

    setPending(true)
    try {
      await toggleFavori(id)
    } catch {
      // erreur silencieuse, le rollback est déjà géré par AuthContext
    } finally {
      setPending(false)
    }
  }

  return (
    <Link
      to={`/logements/${id}`}
      className={`
        group flex bg-white dark:bg-minuit dark:border dark:border-white/10 rounded-xl overflow-hidden
        shadow-card hover:shadow-card-hover
        transition-all duration-250
        ${isHorizontal ? 'flex-row' : 'flex-col'}
      `}
    >
      <div
        className={`
          relative bg-[#4A6080] overflow-hidden shrink-0
          ${isHorizontal ? 'w-44' : 'w-full h-52'}
        `}
        style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {badge && (
          <div className="absolute top-3 left-3">
            <Badge variant="accent">{badge}</Badge>
          </div>
        )}

        <button
          type="button"
          aria-label={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          onClick={handleFavoriClick}
          disabled={pending}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-terrecuite hover:bg-white transition-colors duration-150"
        >
          {favori ? '♥' : '♡'}
        </button>
      </div>

      <div className="flex-1 flex flex-col p-5 min-w-0">
        <h3 className="text-md font-bold text-minuit dark:text-white leading-snug line-clamp-2 mb-2">
          {title}
        </h3>

        <p className="text-sm text-gris dark:text-[#8AADC5] mb-2">
          📍 {location}
        </p>

        <StarRating note={note} reviewCount={reviewCount} size="sm" />

        <div className="flex-1 min-h-4" />

        <div className="pt-4 mt-2 border-t border-border flex items-center justify-between gap-3">
          <PriceTag amount={price} />
          <span className="text-sm font-semibold text-minuit dark:text-white group-hover:text-terrecuite transition-colors duration-150 whitespace-nowrap">
            Voir l'offre →
          </span>
        </div>
      </div>
    </Link>
  )
}