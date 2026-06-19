/**
 * Emplacement : client/src/pages/ListingPage.jsx
 *
 * Page résultats de recherche — assemble SearchBar (compact),
 * FilterChips, SearchResults, ListingGrid (horizontal) + carte placeholder.
 *
 * Données factices en attendant le branchement de services/listings.service.js
 */

import { useState } from 'react'
import SearchBar from '../components/search/SearchBar'
import FilterChips from '../components/search/FilterChips'
import SearchResults from '../components/search/SearchResults'
import ListingGrid from '../components/listing/ListingGrid'

const FILTERS = ['Type de bien', 'Prix', 'Chambres', 'Équipements', 'Meublé', 'Animaux OK', '+ Filtres']

const LISTINGS = [
  { id: '1', title: 'Appartement haussmannien lumineux', location: 'Paris 10e · 68 m²', price: 89, note: 4.9, reviewCount: 214, badge: 'Coup de cœur' },
  { id: '2', title: 'Studio moderne Bastille', location: 'Paris 11e · 32 m²', price: 74, note: 4.7, reviewCount: 87 },
  { id: '3', title: '2P avec balcon Montmartre', location: 'Paris 18e · 55 m²', price: 105, note: 4.8, reviewCount: 162, badge: 'Populaire' },
  { id: '4', title: 'Loft design République', location: 'Paris 3e · 80 m²', price: 138, note: 4.9, reviewCount: 301, badge: 'Design' },
  { id: '5', title: 'Cosy studio Nation', location: 'Paris 12e · 28 m²', price: 68, note: 4.5, reviewCount: 53 },
  { id: '6', title: 'Appartement familial Marais', location: 'Paris 4e · 90 m²', price: 155, note: 4.9, reviewCount: 188, badge: 'Famille' },
]

export default function ListingPage() {
  const [activeFilters, setActiveFilters] = useState(['Meublé'])

  function toggleFilter(filter) {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    )
  }

  return (
    <>
      {/* Barre de recherche compacte */}
      <div className="bg-white border-b border-border">
        <div className="container py-5">
          <SearchBar
            variant="compact"
            defaultValues={{ where: 'Paris', checkin: '14 juin', checkout: '19 juin', guests: '2 adultes' }}
          />
        </div>
      </div>

      {/* En-tête résultats */}
      <div className="bg-brume">
        <div className="container py-7">
          <SearchResults count={328} location="Paris" subtitle="14 – 19 juin · 2 voyageurs" />
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white border-b border-border">
        <div className="container py-4 flex items-center justify-between gap-4">
          <FilterChips filters={FILTERS} activeFilters={activeFilters} onToggle={toggleFilter} />
          <span className="text-sm text-gris whitespace-nowrap hidden lg:block">
            Trier par : <strong className="text-minuit">Prix croissant ▾</strong>
          </span>
        </div>
      </div>

      {/* Contenu : cartes + carte (map)
          La grille de cards définit la hauteur naturelle de la rangée ;
          la carte (map) suit cette hauteur via self-stretch + sticky,
          sans jamais dicter elle-même la hauteur totale de la page. */}
      <div className="container py-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-start">

        <ListingGrid listings={LISTINGS} columns={2} />

        <div className="hidden lg:block lg:sticky lg:top-24">
          <div className="bg-[#C8D8E8] rounded-xl aspect-[4/5] flex items-center justify-center">
            <p className="text-[#3A5878] text-sm">🗺 Carte interactive</p>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="container pb-20 flex items-center gap-2">
        {['←', '1', '2', '3', '...', '18', '→'].map((p) => (
          <button
            key={p}
            type="button"
            className={`w-10 h-10 rounded-md text-sm transition-colors duration-150 ${
              p === '2'
                ? 'bg-terrecuite text-white font-bold'
                : 'bg-white border border-border text-charbon hover:border-minuit'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </>
  )
}