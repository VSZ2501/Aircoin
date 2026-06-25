/**
 * Emplacement : client/src/pages/DetailPage.jsx
 * Données chargées depuis l'API via useListing(id).
 * id récupéré via useParams().
 */

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useListing } from '../hooks/useListing'
import { creerAvis, peutNoterLogement } from '../services/listings.service'
import StarRating from '../components/ui/StarRating'
import PhotoGallery from '../components/detail/PhotoGallery'
import AmenitiesList from '../components/detail/AmenitiesList'
import ReviewsSection from '../components/detail/ReviewsSection'
import HostCard from '../components/detail/HostCard'
import BookingCard from '../components/booking/BookingCard'
import LeaveReviewModal from '../components/listing/LeaveReviewModal'
import Button from '../components/ui/Button'

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

/**
 * Reconstitue l'adresse complète affichable à partir des champs
 * désormais séparés côté API : address (rue), postalCode, city.
 * Ex: "12 rue de Rivoli, 75001 Paris"
 */
function adresseComplete(listing) {
  const parts = [listing.address]
  const villeAvecCp = [listing.postalCode, listing.city].filter(Boolean).join(' ')
  if (villeAvecCp) parts.push(villeAvecCp)
  return parts.filter(Boolean).join(', ')
}

/**
 * Bouton "Laisser un avis" pour un logement — vérifie côté serveur
 * que l'utilisateur a bien séjourné dans ce logement (réservation
 * confirmée + terminée) avant d'afficher quoi que ce soit.
 */
function ReviewListingButton({ logementId, onSubmitted }) {
  const [statut, setStatut] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    peutNoterLogement(logementId)
      .then((result) => setStatut(result.data))
      .catch(() => setStatut({ peutNoter: false, dejaNote: false }))
  }, [logementId])

  async function handleSubmitAvis({ note, commentaire }) {
    await creerAvis(logementId, { note, commentaire })
    onSubmitted?.()
  }

  if (statut === null) return null
  if (statut.dejaNote) {
    return <p className="text-sm text-success font-semibold">✓ Vous avez déjà laissé un avis sur ce logement</p>
  }
  if (!statut.peutNoter) return null

  return (
    <>
      <Button variant="outline" onClick={() => setShowModal(true)}>
        Laisser un avis sur ce logement
      </Button>
      {showModal && (
        <LeaveReviewModal
          title="Noter ce logement"
          onSubmit={handleSubmitAvis}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

export default function DetailPage() {
  const { id } = useParams()
  const { listing, reviews, loading, error } = useListing(id)

  // ── États de chargement ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container pt-10 pb-24">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-[#E8EDF2] rounded w-1/3" />
          <div className="aspect-[16/7] bg-[#E8EDF2] rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-16">
            <div className="space-y-5">
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
      <div className="container pt-24 pb-24 text-center">
        <p className="text-2xl mb-5">😕</p>
        <p className="text-minuit font-bold mb-3">Logement introuvable</p>
        <p className="text-gris text-sm mb-8">{error || 'Ce logement n\'existe pas ou a été supprimé.'}</p>
        <Link to="/logements" className="text-sm font-semibold text-terrecuite">
          ← Retour aux résultats
        </Link>
      </div>
    )
  }

  // ── Calcul des données dérivées ─────────────────────────────────────────────
  const amenities = (listing.amenities || []).map(amenityWithIcon)

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

  // Note : priceRows et total sont désormais calculés directement
  // dans BookingCard, en fonction des vraies dates choisies par
  // l'utilisateur — plus besoin de les pré-calculer ici.

  return (
    <div className="container pt-10 pb-24">

      {/* Fil d'ariane */}
      <p className="text-sm text-gris mb-6">
        <Link to="/logements" className="hover:text-minuit transition-colors">← Retour aux résultats</Link>
        {listing.city && <> · {listing.city}</>}
        {listing.type && <> · {listing.type}s</>}
      </p>

      {/* Galerie */}
      <PhotoGallery photos={listing.photos} totalCount={listing.photos?.length || 0} />

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-16 mt-12">

        {/* ── Colonne contenu ── */}
        <div className="flex flex-col gap-14">

          {/* En-tête */}
          <div>
            <p className="text-sm text-gris mb-3">
              {listing.type} entier · {listing.district || listing.city}
            </p>
            <h1 className="text-3xl mb-4">{listing.title}</h1>
            {listing.note > 0 && (
              <StarRating note={listing.note} reviewCount={listing.reviewCount} />
            )}
            {listing.address && (
              <p className="text-sm text-gris mt-3">📍 {adresseComplete(listing)}</p>
            )}

            {/* Hôte mini pill */}
            {listing.host && (
              <div className="inline-flex items-center gap-3 bg-brume rounded-full pr-6 py-2.5 pl-2.5 mt-5">
                <div
                  className="w-9 h-9 rounded-full bg-terrecuite overflow-hidden"
                  style={listing.host.avatar ? { backgroundImage: `url(${listing.host.avatar})`, backgroundSize: 'cover' } : {}}
                />
                <div>
                  <p className="text-sm font-bold text-minuit leading-tight">
                    {listing.host.name}{listing.host.isSuperhost ? ' · Superhost' : ''}
                  </p>
                  <p className="text-xs text-gris mt-0.5">Membre depuis {listing.host.since}</p>
                </div>
              </div>
            )}
          </div>

          {/* Caractéristiques clés */}
          <div className="border-t border-border pt-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {listing.rooms      && <div><p className="text-2xl mb-2">🛏</p><p className="text-sm font-bold text-minuit">{listing.rooms} chambre{listing.rooms > 1 ? 's' : ''}</p><p className="text-xs text-gris mt-1">{listing.maxGuests} personnes max</p></div>}
            {listing.bathrooms  && <div><p className="text-2xl mb-2">🛁</p><p className="text-sm font-bold text-minuit">{listing.bathrooms} salle{listing.bathrooms > 1 ? 's' : ''} de bain</p></div>}
            {listing.surface    && <div><p className="text-2xl mb-2">📐</p><p className="text-sm font-bold text-minuit">{listing.surface} m²</p><p className="text-xs text-gris mt-1">Superficie habitable</p></div>}
            {listing.floor > 0  && <div><p className="text-2xl mb-2">🏢</p><p className="text-sm font-bold text-minuit">{listing.floor}e étage</p></div>}
          </div>

          {/* Description */}
          {listing.description && (
            <div className="border-t border-border pt-10">
              <h2 className="text-xl font-bold text-minuit mb-5">À propos de ce logement</h2>
              <p className="text-base text-charbon leading-loose">{listing.description}</p>
            </div>
          )}

          {/* Équipements */}
          {amenities.length > 0 && (
            <div className="border-t border-border pt-10">
              <AmenitiesList amenities={amenities} />
            </div>
          )}

          {/* Avis */}
          <div className="border-t border-border pt-10">
            {listing.reviewCount > 0 ? (
              <ReviewsSection
                overallNote={listing.note}
                reviewCount={listing.reviewCount}
                categories={computeCategories()}
                reviews={reviews}
              />
            ) : (
              <h2 className="text-xl font-bold text-minuit mb-5">Avis</h2>
            )}

            <div className="mt-6">
              <ReviewListingButton
                logementId={listing.id}
                onSubmitted={() => window.location.reload()}
              />
            </div>
          </div>

          {/* Localisation */}
          <div className="border-t border-border pt-10">
            <h2 className="text-xl font-bold text-minuit mb-5">Localisation</h2>
            <div className="bg-[#C4D4E0] rounded-lg h-80 flex flex-col items-center justify-center">
              <p className="text-2xl mb-3">📍</p>
              <p className="text-sm font-semibold text-minuit">{adresseComplete(listing)}</p>
            </div>
          </div>

          {/* Hôte */}
          {listing.host && (
            <div className="border-t border-border pt-10">
              <h2 className="text-xl font-bold text-minuit mb-5">Votre hôte</h2>
              <HostCard host={listing.host} />
            </div>
          )}
        </div>

        {/* ── Colonne booking (sticky) ── */}
        <div className="lg:sticky lg:top-24 self-start">
          <BookingCard
            logementId={listing.id}
            price={listing.price}
            note={listing.note}
            reviewCount={listing.reviewCount}
            maxGuests={listing.maxGuests}
          />
        </div>
      </div>
    </div>
  )
}