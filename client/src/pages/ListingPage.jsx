/**
 * Emplacement : client/src/pages/ListingPage.jsx
 * Données chargées depuis l'API via useListings.
 * Les filtres sont branchés sur les query params de l'URL.
 */

import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/search/SearchBar'
import FilterChips from '../components/search/FilterChips'
import SearchResults from '../components/search/SearchResults'
import ListingGrid from '../components/listing/ListingGrid'
import { useListings } from '../hooks/useListings'

const FILTERS = ['Type de bien', 'Prix', 'Chambres', 'Équipements', 'Meublé', 'Animaux OK', '+ Filtres']

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

  // Toggle pour les chips "Meublé" et "Animaux OK"
  function toggleFilter(filter) {
    if (filter === 'Meublé')     updateFilter('meuble',  !filters.meuble)
    if (filter === 'Animaux OK') updateFilter('animaux', !filters.animaux)
  }

  const activeFilters = [
    filters.meuble  && 'Meublé',
    filters.animaux && 'Animaux OK',
  ].filter(Boolean)

  // Pages à afficher dans la pagination
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
    if (p === '←' && page > 1)     setPage(page - 1)
    if (p === '→' && page < pages)  setPage(page + 1)
    const num = Number(p)
    if (!isNaN(num) && num !== page) setPage(num)
  }

  return (
    <>
      {/* Barre de recherche compacte */}
      <div className="bg-white border-b border-border">
        <div className="container py-5">
          <SearchBar
            variant="compact"
            defaultValues={{ where: filters.ville || '' }}
            onSearch={(vals) => updateFilter('ville', vals.where || '')}
          />
        </div>
      </div>

      {/* En-tête résultats */}
      <div className="bg-brume">
        <div className="container py-7">
          <SearchResults
            count={total}
            location={filters.ville || 'France'}
          />
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white border-b border-border">
        <div className="container py-4 flex items-center justify-between gap-4">
          <FilterChips filters={FILTERS} activeFilters={activeFilters} onToggle={toggleFilter} />
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="text-sm text-minuit border border-border rounded-md px-3 py-1.5 hidden lg:block"
          >
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
            <option value="note">Mieux notés</option>
            <option value="recent">Plus récents</option>
          </select>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container py-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-start">

        {/* Grille de listings */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl bg-[#E8EDF2] animate-pulse h-72" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : listings.length === 0 ? (
            <p className="text-gris text-sm text-center py-16">Aucun logement pour ces critères.</p>
          ) : (
            <ListingGrid listings={listings} columns={2} />
          )}
        </div>

        {/* Carte placeholder (sticky) */}
        <div className="hidden lg:block lg:sticky lg:top-24">
          <div className="bg-[#C8D8E8] rounded-xl aspect-[4/5] flex items-center justify-center">
            <p className="text-[#3A5878] text-sm">🗺 Carte interactive</p>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="container pb-20 flex items-center gap-2">
          {paginationItems().map((p, i) => (
            <button
              key={`${p}-${i}`}
              type="button"
              onClick={() => handlePageClick(p)}
              disabled={p === '...'}
              className={`w-10 h-10 rounded-md text-sm transition-colors duration-150 ${
                String(p) === String(page)
                  ? 'bg-terrecuite text-white font-bold'
                  : p === '...'
                  ? 'text-gris cursor-default'
                  : 'bg-white border border-border text-charbon hover:border-minuit'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </>
  )
}