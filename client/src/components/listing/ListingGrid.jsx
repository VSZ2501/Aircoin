/**
 * Emplacement : client/src/components/listing/ListingGrid.jsx
 *
 * Affiche une collection de ListingCard en grille responsive.
 * Utilisé sur Homepage ("Logements à la une") et ListingPage.
 *
 * Usage :
 *   <ListingGrid listings={listings} />
 *   <ListingGrid listings={listings} columns={2} variant="horizontal" />
 */

import ListingCard from './ListingCard'

const COLUMN_CLASSES = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export default function ListingGrid({
  listings = [],
  columns = 4,
  variant = 'vertical',
  emptyMessage = 'Aucun logement trouvé.',
}) {
  if (listings.length === 0) {
    return (
      <p className="text-center text-gris py-12">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className={`grid gap-6 ${COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[4]}`}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} variant={variant} />
      ))}
    </div>
  )
}