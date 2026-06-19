/**
 * Emplacement : client/src/components/search/FilterChips.jsx
 *
 * Rangée de filtres rapides ("chips") vue sur ListingPage :
 * Type de bien, Prix, Chambres, Équipements, Meublé...
 *
 * Purement visuel — la sélection sera branchée plus tard
 * via un state contrôlé (useSearch / SearchContext).
 *
 * Usage :
 *   <FilterChips
 *     filters={['Type de bien', 'Prix', 'Chambres', 'Meublé']}
 *     activeFilters={['Meublé']}
 *     onToggle={(filter) => ...}
 *   />
 */

export default function FilterChips({
  filters = [],
  activeFilters = [],
  onToggle,
}) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto">
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter)

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onToggle?.(filter)}
            className={`
              px-4 py-2 rounded-full text-sm whitespace-nowrap
              transition-colors duration-150
              ${isActive
                ? 'bg-minuit text-white font-semibold'
                : 'bg-white text-charbon border border-border hover:border-minuit'}
            `}
          >
            {filter}
          </button>
        )
      })}
    </div>
  )
}