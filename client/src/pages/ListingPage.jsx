/**
 * Emplacement : client/src/pages/ListingPage.jsx
 * Données chargées depuis l'API via useListings.
 * Les filtres sont branchés sur les query params de l'URL.
 *
 * Fix appliqué : la pagination utilisait un template string avec
 * interpolation conditionnelle pour composer les classes Tailwind
 * (`bg-terrecuite text-white...` vs `bg-white border...`). Même
 * bug que sur Button.jsx — désormais résolu via une fonction qui
 * retourne des classes complètes et statiques.
 */

import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/search/SearchBar'
import FilterChips from '../components/search/FilterChips'
import SearchResults from '../components/search/SearchResults'
import ListingGrid from '../components/listing/ListingGrid'
import ListingMap from '../components/listing/ListingMap'
import { useListings } from '../hooks/useListings'

const FILTERS = ['Type de bien', 'Prix', 'Chambres', 'Équipements', 'Meublé', 'Animaux OK', '+ Filtres']

// Classes complètes et statiques pour chaque état du bouton de
// pagination — jamais de classe construite par interpolation.
function getPaginationButtonClasses(state) {
  if (state === 'active') return 'w-11 h-11 rounded-md text-sm font-bold bg-terrecuite text-white transition-colors duration-150'
  if (state === 'dots')   return 'w-11 h-11 rounded-md text-sm text-gris cursor-default'
  return 'w-11 h-11 rounded-md text-sm bg-white border border-border text-charbon hover:border-minuit transition-colors duration-150'
}

export default function ListingPage() {
  const [searchParams] = useSearchParams()
  const initialVille   = searchParams.get('ville') || ''

  const {
    listings,
    loading,
    error,
    total,
    page,
    pages,
    filters,
    setPage,
    updateFilter,
  } = useListings(initialVille)

  /**
   * Fix : useListings(initialVille) ne lit la valeur de l'URL qu'au
   * tout premier montage du composant. Si on est déjà sur /logements
   * et qu'on navigue vers /logements?ville=Lyon (ex: depuis le Footer
   * ou la Homepage), React Router ne démonte/remonte pas la page —
   * le hook garde donc son ancien filtre. Ce useEffect synchronise
   * manuellement le filtre "ville" chaque fois que le paramètre
   * d'URL change après le montage initial.
   */
  useEffect(() => {
    const villeFromUrl = searchParams.get('ville') || ''
    if (villeFromUrl !== filters.ville) {
      updateFilter('ville', villeFromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  function toggleFilter(filter) {
    if (filter === 'Meublé')     updateFilter('meuble',  !filters.meuble)
    if (filter === 'Animaux OK') updateFilter('animaux', !filters.animaux)
  }

  const activeFilters = [
    filters.meuble  && 'Meublé',
    filters.animaux && 'Animaux OK',
  ].filter(Boolean)

  const paginationItems = () => {
    const items = []
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) items.push(String(i))
    } else {
      items.push('1')
      if (page > 3) items.push('...')
      for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
        items.push(String(i))
      }
      if (page < pages - 2) items.push('...')
      items.push(String(pages))
    }
    return ['←', ...items, '→']
  }

  function handlePageClick(p) {
    if (p === '←' && page > 1)      setPage(page - 1)
    if (p === '→' && page < pages)  setPage(page + 1)
    const num = Number(p)
    if (!isNaN(num) && num !== page) setPage(num)
  }

  function getButtonState(p) {
    if (p === '...') return 'dots'
    if (String(p) === String(page)) return 'active'
    return 'default'
  }

  return (
    <>
      {/* Barre de recherche compacte */}
      <div className="bg-white border-b border-border">
        <div className="container py-6">
          <SearchBar
            variant="compact"
            defaultValues={{ where: filters.ville || '' }}
            onSearch={(vals) => updateFilter('ville', vals.where || '')}
          />
        </div>
      </div>

      {/* En-tête résultats */}
      <div className="bg-brume">
        <div className="container py-9">
          <SearchResults
            count={total}
            location={filters.ville || 'France'}
          />
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white border-b border-border">
        <div className="container py-5 flex items-center justify-between gap-4">
          <FilterChips filters={FILTERS} activeFilters={activeFilters} onToggle={toggleFilter} />
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="text-sm text-minuit border border-border rounded-md px-4 py-2 hidden lg:block"
          >
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
            <option value="note">Mieux notés</option>
            <option value="recent">Plus récents</option>
          </select>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container py-12 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-start">

        {/* Grille de listings */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl bg-[#E8EDF2] animate-pulse h-72" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : listings.length === 0 ? (
            <p className="text-gris text-sm text-center py-20">Aucun logement pour ces critères.</p>
          ) : (
            <ListingGrid listings={listings} columns={2} />
          )}
        </div>

        {/* Carte interactive (sticky) */}
        <div className="hidden lg:block lg:sticky lg:top-24 h-[640px]">
          {!loading && <ListingMap listings={listings} />}
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="container pb-24 flex items-center gap-3">
          {paginationItems().map((p, i) => (
            <button
              key={`${p}-${i}`}
              type="button"
              onClick={() => handlePageClick(p)}
              disabled={p === '...'}
              className={getPaginationButtonClasses(getButtonState(p))}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </>
  )
}