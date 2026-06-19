/**
 * Emplacement : client/src/components/listing/ListingCard.jsx
 *
 * Carte logement — le composant le plus réutilisé du site.
 * Présent sur : Homepage ("Logements à la une"), ListingPage (résultats).
 *
 * Proportions calées sur la maquette Penpot d'origine :
 * photo ~210px de haut (pas carrée), padding raisonnable,
 * card compacte mais avec de l'air entre les lignes.
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

import { Link } from 'react-router-dom'
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

  return (
    <Link
      to={`/logements/${id}`}
      className={`
        group flex bg-white rounded-xl overflow-hidden
        shadow-card hover:shadow-card-hover
        transition-all duration-250
        ${isHorizontal ? 'flex-row' : 'flex-col'}
      `}
    >
      {/* ── Photo ──────────────────────────────────────────── 
          h-52 (~210px) sur la version verticale, comme la maquette —
          pas un aspect-square qui rendait la card disproportionnée. */}
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
          aria-label="Ajouter aux favoris"
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-terrecuite hover:bg-white transition-colors duration-150"
        >
          ♡
        </button>
      </div>

      {/* ── Contenu ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col p-5 min-w-0">
        <h3 className="text-md font-bold text-minuit leading-snug line-clamp-2 mb-2">
          {title}
        </h3>

        <p className="text-sm text-gris mb-2">
          📍 {location}
        </p>

        <StarRating note={note} reviewCount={reviewCount} size="sm" />

        {/* Espace flexible : pousse le prix en bas, garde toutes
            les cards d'une rangée alignées même si le titre fait
            1 ou 2 lignes. */}
        <div className="flex-1 min-h-4" />

        <div className="pt-4 mt-2 border-t border-border flex items-center justify-between gap-3">
          <PriceTag amount={price} />
          <span className="text-sm font-semibold text-minuit group-hover:text-terrecuite transition-colors duration-150 whitespace-nowrap">
            Voir l'offre →
          </span>
        </div>
      </div>
    </Link>
  )
}