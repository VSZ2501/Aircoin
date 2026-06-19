/**
 * Emplacement : client/src/pages/DetailPage.jsx
 *
 * Fiche logement — assemble PhotoGallery, BookingCard, AmenitiesList,
 * ReviewsSection, HostCard.
 *
 * Données factices en attendant le branchement de services/listings.service.js
 * (récupération via useParams().id côté logique, non câblé ici).
 */

import StarRating from '../components/ui/StarRating'
import PhotoGallery from '../components/detail/PhotoGallery'
import AmenitiesList from '../components/detail/AmenitiesList'
import ReviewsSection from '../components/detail/ReviewsSection'
import HostCard from '../components/detail/HostCard'
import BookingCard from '../components/booking/BookingCard'

const AMENITIES = [
  { icon: '📡', label: 'WiFi haut débit' }, { icon: '🔥', label: 'Chauffage central' }, { icon: '❄️', label: 'Climatisation' },
  { icon: '🍳', label: 'Cuisine équipée' }, { icon: '🧺', label: 'Machine à laver' }, { icon: '📺', label: 'TV connectée' },
  { icon: '🅿️', label: 'Parking privé' }, { icon: '🛗', label: 'Ascenseur' }, { icon: '🐾', label: 'Animaux acceptés' },
  { icon: '🚲', label: 'Local à vélos' }, { icon: '🔑', label: 'Self check-in' }, { icon: '💼', label: 'Espace de travail' },
]

const REVIEW_CATEGORIES = [
  { label: 'Propreté', note: 4.9 },
  { label: 'Communication', note: 4.8 },
  { label: 'Emplacement', note: 4.6 },
  { label: 'Rapport qualité/prix', note: 4.5 },
]

const REVIEWS = [
  { id: 1, name: 'Sophie M.', date: 'Mai 2025', note: 5, text: 'Appartement sublime, exactement conforme aux photos. Marianne est une hôte formidable, toujours disponible.', avatarColor: '#1A2B4C' },
  { id: 2, name: 'Karim B.', date: 'Avril 2025', note: 5, text: 'Emplacement parfait pour visiter Paris à pied. Le logement est spacieux et très bien équipé. On reviendra !', avatarColor: '#D47A5B' },
  { id: 3, name: 'Emma & Paul', date: 'Mars 2025', note: 4, text: 'Très beau séjour en famille. Les enfants ont adoré le quartier. Un petit bémol sur le wifi un peu lent.', avatarColor: '#2D3142' },
  { id: 4, name: 'Lucas T.', date: 'Fév. 2025', note: 5, text: "Coup de cœur total ! La cour intérieure est magique. Appartement très propre et lumineux.", avatarColor: '#4A6080' },
]

const HOST = {
  name: 'Marianne Lefebvre',
  since: 'juillet 2019',
  listingsCount: 186,
  note: 4.98,
  responseRate: 99,
  bio: "Passionnée d'architecture et de voyages, j'aime accueillir des voyageurs du monde entier dans ce bel appartement parisien hérité de ma grand-mère.",
  isSuperhost: true,
}

const PRICE_ROWS = [
  { label: '89 € × 5 nuits', value: '445 €' },
  { label: 'Frais de service', value: '40 €' },
  { label: 'Taxe de séjour', value: '12 €' },
]

export default function DetailPage() {
  return (
    <div className="container pt-6 pb-16">

      {/* Fil d'ariane */}
      <p className="text-sm text-gris mb-4">
        ← Retour aux résultats · Paris · Appartements
      </p>

      {/* Galerie */}
      <PhotoGallery
        photos={[]}
        totalCount={24}
      />

      {/* Layout principal : contenu + booking card */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 mt-8">

        {/* ── Colonne contenu ── */}
        <div className="flex flex-col gap-10">

          {/* En-tête */}
          <div>
            <p className="text-sm text-gris mb-2">Appartement entier · Paris 10e</p>
            <h1 className="text-3xl mb-3">
              Appartement haussmannien lumineux — Cour intérieure
            </h1>
            <StarRating note={4.9} reviewCount={214} />
            <p className="text-sm text-gris mt-2">
              📍 42 rue du Faubourg Saint-Denis, Paris 10e
            </p>

            {/* Hôte (mini pill) */}
            <div className="inline-flex items-center gap-3 bg-brume rounded-full pr-5 py-2 pl-2 mt-4">
              <div className="w-8 h-8 rounded-full bg-terrecuite" />
              <div>
                <p className="text-sm font-bold text-minuit leading-tight">Marianne L. · Superhost</p>
                <p className="text-xs text-gris">Membre depuis 2019</p>
              </div>
            </div>
          </div>

          {/* Caractéristiques clés */}
          <div className="border-t border-border pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              ['🛏', '3 chambres', '6 personnes max'],
              ['🛁', '2 salles de bain', 'Baignoire & douche'],
              ['📐', '85 m²', 'Superficie habitable'],
              ['🏢', '4e étage', 'Avec ascenseur'],
            ].map(([icon, label, sub]) => (
              <div key={label}>
                <p className="text-2xl mb-1">{icon}</p>
                <p className="text-sm font-bold text-minuit">{label}</p>
                <p className="text-xs text-gris">{sub}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-bold text-minuit mb-4">À propos de ce logement</h2>
            <p className="text-base text-charbon leading-loose">
              Situé au cœur du 10e arrondissement de Paris, cet appartement haussmannien de 85 m²
              vous accueille avec élégance. Lumineux et spacieux, il dispose de hauts plafonds,
              parquet d'époque et vue sur une tranquille cour intérieure. Idéal pour les familles
              ou groupes d'amis souhaitant découvrir Paris dans un cadre authentique.
            </p>
            <button type="button" className="text-sm font-semibold text-terrecuite mt-3">
              Lire la suite →
            </button>
          </div>

          {/* Équipements */}
          <div className="border-t border-border pt-6">
            <AmenitiesList amenities={AMENITIES} />
          </div>

          {/* Avis */}
          <ReviewsSection
            overallNote={4.9}
            reviewCount={214}
            categories={REVIEW_CATEGORIES}
            reviews={REVIEWS}
          />

          {/* Localisation */}
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-bold text-minuit mb-4">Localisation</h2>
            <div className="bg-[#C4D4E0] rounded-lg h-80 flex flex-col items-center justify-center">
              <p className="text-2xl mb-2">📍</p>
              <p className="text-sm font-semibold text-minuit">
                42 rue du Faubourg Saint-Denis · 75010 Paris
              </p>
            </div>
          </div>

          {/* Hôte */}
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-bold text-minuit mb-4">Votre hôte</h2>
            <HostCard host={HOST} />
          </div>
        </div>

        {/* ── Colonne booking (sticky) ── */}
        <div className="lg:sticky lg:top-24 self-start">
          <BookingCard
            price={89}
            note={4.9}
            reviewCount={214}
            checkIn="14 juin 2025"
            checkOut="19 juin 2025"
            guests="2 adultes, 1 enfant"
            freeCancellation="Annulation gratuite avant le 8 juin"
            priceRows={PRICE_ROWS}
            total="497 €"
          />
        </div>
      </div>
    </div>
  )
}