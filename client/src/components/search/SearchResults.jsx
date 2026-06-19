/**
 * Emplacement : client/src/components/search/SearchResults.jsx
 *
 * Bandeau d'en-tête des résultats sur ListingPage :
 * "328 logements trouvés à Paris" + sous-ligne dates/voyageurs.
 *
 * Usage :
 *   <SearchResults count={328} location="Paris" subtitle="14 – 19 juin · 2 voyageurs" />
 */

export default function SearchResults({ count, location, subtitle }) {
  return (
    <div>
      <h1 className="text-lg font-bold text-minuit">
        {count} logements trouvés{location ? ` à ${location}` : ''}
      </h1>
      {subtitle && (
        <p className="text-sm text-gris mt-1">{subtitle}</p>
      )}
    </div>
  )
}