/**
 * Emplacement : client/src/pages/DetailPage.jsx
 * Données chargées depuis l'API via useListing(id).
 * id récupéré via useParams().
 */

import { useParams, Link } from 'react-router-dom'
import { useListing } from '../hooks/useListing'
import StarRating from '../components/ui/StarRating'
import PhotoGallery from '../components/detail/PhotoGallery'
import AmenitiesList from '../components/detail/AmenitiesList'
import ReviewsSection from '../components/detail/ReviewsSection'
import HostCard from '../components/detail/HostCard'
import BookingCard from '../components/booking/BookingCard'

// Mapping équipement string → icône emoji
const AMENITY_ICONS = {
  'WiFi': '📡', 'wifi': '📡', 'WiFi haut débit': '📡',
  'Chauffage': '🔥', 'Climatisation': '❄️',
  'Cuisine': '🍳', 'Cuisine équipée': '🍳',
  'Lave-linge': '🧺', 'Machine à laver': '🧺',
  'TV': '📺', 'TV connectée': '📺',
  'Parking': '🅿️', 'Parking privé': '🅿️',
  'Ascenseur': '🛗',
  'Animaux': '🐾', 'Animaux acceptés': '🐾',
  'Vélo': '🚲', 'Local à vélos': '🚲',
  'Self check-in': '🔑',
  'Espace de travail': '💼',
}

function amenityWithIcon(label) {
  const icon = AMENITY_ICONS[label] || '✔️'
  return { icon, label }
}

export default function DetailPage() {
  const { id }                          = useParams()
  const { listing, reviews, loading, error } = useListing(id)

  // ── États de chargement ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container pt-10 pb-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#E8EDF2] rounded w-1/3" />
          <div className="aspect-[16/7] bg-[#E8EDF2] rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12">
            <div className="space-y-4">
              <div className="h-6 bg-[#E8EDF2] rounded w-2/3" />
              <div className="h-4 bg-[#E8EDF2] rounded w-1/2" />
              <div className="h-32 bg-[#E8EDF2] rounded" />
            </div>
            <div className="h-80 bg-[#E8EDF2] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="container pt-20 pb-16 text-center">
        <p className="text-2xl mb-4">😕</p>
        <p className="text-minuit font-bold mb-2">Logement introuvable</p>
        <p className="text-gris text-sm mb-6">{error || 'Ce logement n\'existe pas ou a été supprimé.'}</p>
        <Link to="/logements" className="text-sm font-semibold text-terrecuite">
          ← Retour aux résultats
        </Link>
      </div>
    )
  }

  // ── Calcul des données dérivées ─────────────────────────────────────────────
  const amenities = (listing.amenities || []).map(amenityWithIcon)

  // Calcule la note moyenne par catégorie depuis les avis réels
  const computeCategories = () => {
    if (!reviews.length) return []
    const keys = ['proprete', 'communication', 'emplacement', 'rapport_qualite_prix']
    const labels = { proprete: 'Propreté', communication: 'Communication', emplacement: 'Emplacement', rapport_qualite_prix: 'Rapport qualité/prix' }
    return keys.map(key => ({
      label: labels[key],
      note: Math.round(
        reviews.reduce((sum, r) => sum + (r.categoriesArray?.find(c => c.label === labels[key])?.note ?? r.note), 0)
        / reviews.length * 10
      ) / 10,
    }))
  }

  // priceRows pour BookingCard (example sur 1 nuit si pas de réservation)
  const priceRows = [
    { label: `${listing.price} € × 1 nuit`, value: `${listing.price} €` },
    { label: 'Frais de service',             value: `${Math.round(listing.price * 0.09)} €` },
    { label: 'Taxe de séjour',               value: '2 €' },
  ]
  const total = listing.price + Math.round(listing.price * 0.09) + 2

  return (
    <div className="container pt-6 pb-16">

      {/* Fil d'ariane */}
      <p className="text-sm text-gris mb-4">
        <Link to="/logements" className="hover:text-minuit transition-colors">← Retour aux résultats</Link>
        {listing.city && <> · {listing.city}</>}
        {listing.type && <> · {listing.type}s</>}
      </p>

      {/* Galerie */}
      <PhotoGallery photos={listing.photos} totalCount={listing.photos?.length || 0} />

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 mt-8">

        {/* ── Colonne contenu ── */}
        <div className="flex flex-col gap-10">

          {/* En-tête */}
          <div>
            <p className="text-sm text-gris mb-2">
              {listing.type} entier · {listing.district || listing.city}
            </p>
            <h1 className="text-3xl mb-3">{listing.title}</h1>
            {listing.note > 0 && (
              <StarRating note={listing.note} reviewCount={listing.reviewCount} />
            )}
            {listing.address && (
              <p className="text-sm text-gris mt-2">📍 {listing.address}</p>
            )}

            {/* Hôte mini pill */}
            {listing.host && (
              <div className="inline-flex items-center gap-3 bg-brume rounded-full pr-5 py-2 pl-2 mt-4">
                <div
                  className="w-8 h-8 rounded-full bg-terrecuite overflow-hidden"
                  style={listing.host.avatar ? { backgroundImage: `url(${listing.host.avatar})`, backgroundSize: 'cover' } : {}}
                />
                <div>
                  <p className="text-sm font-bold text-minuit leading-tight">
                    {listing.host.name}{listing.host.isSuperhost ? ' · Superhost' : ''}
                  </p>
                  <p className="text-xs text-gris">Membre depuis {listing.host.since}</p>
                </div>
              </div>
            )}
          </div>

          {/* Caractéristiques clés */}
          <div className="border-t border-border pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {listing.rooms      && <div><p className="text-2xl mb-1">🛏</p><p className="text-sm font-bold text-minuit">{listing.rooms} chambre{listing.rooms > 1 ? 's' : ''}</p><p className="text-xs text-gris">{listing.maxGuests} personnes max</p></div>}
            {listing.bathrooms  && <div><p className="text-2xl mb-1">🛁</p><p className="text-sm font-bold text-minuit">{listing.bathrooms} salle{listing.bathrooms > 1 ? 's' : ''} de bain</p></div>}
            {listing.surface    && <div><p className="text-2xl mb-1">📐</p><p className="text-sm font-bold text-minuit">{listing.surface} m²</p><p className="text-xs text-gris">Superficie habitable</p></div>}
            {listing.floor > 0  && <div><p className="text-2xl mb-1">🏢</p><p className="text-sm font-bold text-minuit">{listing.floor}e étage</p></div>}
          </div>

          {/* Description */}
          {listing.description && (
            <div className="border-t border-border pt-6">
              <h2 className="text-xl font-bold text-minuit mb-4">À propos de ce logement</h2>
              <p className="text-base text-charbon leading-loose">{listing.description}</p>
            </div>
          )}

          {/* Équipements */}
          {amenities.length > 0 && (
            <div className="border-t border-border pt-6">
              <AmenitiesList amenities={amenities} />
            </div>
          )}

          {/* Avis */}
          {listing.reviewCount > 0 && (
            <ReviewsSection
              overallNote={listing.note}
              reviewCount={listing.reviewCount}
              categories={computeCategories()}
              reviews={reviews}
            />
          )}

          {/* Localisation */}
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-bold text-minuit mb-4">Localisation</h2>
            <div className="bg-[#C4D4E0] rounded-lg h-80 flex flex-col items-center justify-center">
              <p className="text-2xl mb-2">📍</p>
              <p className="text-sm font-semibold text-minuit">{listing.address}</p>
            </div>
          </div>

          {/* Hôte */}
          {listing.host && (
            <div className="border-t border-border pt-6">
              <h2 className="text-xl font-bold text-minuit mb-4">Votre hôte</h2>
              <HostCard host={listing.host} />
            </div>
          )}
        </div>

        {/* ── Colonne booking (sticky) ── */}
        <div className="lg:sticky lg:top-24 self-start">
          <BookingCard
            price={listing.price}
            note={listing.note}
            reviewCount={listing.reviewCount}
            freeCancellation="Annulation gratuite sous 48h"
            priceRows={priceRows}
            total={`${total} €`}
          />
        </div>
      </div>
    </div>
  )
}