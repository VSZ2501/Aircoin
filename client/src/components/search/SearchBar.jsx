/**
 * Emplacement : client/src/components/search/SearchBar.jsx
 *
 * Barre de recherche multi-champs, désormais fonctionnelle.
 *
 * Deux variantes :
 *  - "hero"    : Homepage. Au clic sur "Rechercher", navigue vers
 *                /logements?ville=X (la recherche réelle se fait
 *                sur ListingPage via useListings).
 *  - "compact" : ListingPage. Appelle onSearch(values) fourni par
 *                le parent, qui met à jour les filtres en cours
 *                sans recharger la page.
 *
 * Usage :
 *   <SearchBar variant="hero" />
 *   <SearchBar variant="compact" defaultValues={{ where: 'Paris' }} onSearch={(vals) => ...} />
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

const FIELDS = [
  { name: 'where',   label: 'Où ?',       placeholder: 'Paris, Lyon, Bordeaux…' },
  { name: 'checkin', label: 'Arrivée',    placeholder: 'jj / mm / aaaa' },
  { name: 'checkout',label: 'Départ',     placeholder: 'jj / mm / aaaa' },
  { name: 'guests',  label: 'Voyageurs',  placeholder: '2 adultes' },
]

export default function SearchBar({ variant = 'hero', defaultValues = {}, onSearch }) {
  const isCompact = variant === 'compact'
  const navigate = useNavigate()

  const [values, setValues] = useState({
    where: defaultValues.where || '',
    checkin: defaultValues.checkin || '',
    checkout: defaultValues.checkout || '',
    guests: defaultValues.guests || '',
  })

  function updateField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSearch() {
    if (isCompact) {
      onSearch?.(values)
    } else {
      const params = new URLSearchParams()
      if (values.where) params.set('ville', values.where)
      navigate(`/logements${params.toString() ? `?${params}` : ''}`)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div
      className={`
        bg-white rounded-xl flex flex-col sm:flex-row items-stretch
        ${isCompact ? 'shadow-none border border-border' : 'shadow-search'}
      `}
    >
      {FIELDS.map((field, i) => (
        <div
          key={field.name}
          className={`
            flex-1 px-6 py-3.5 min-w-0
            ${i > 0 ? 'sm:border-l border-border' : ''}
          `}
        >
          <label
            htmlFor={field.name}
            className="block text-[10px] font-bold uppercase tracking-wide text-charbon mb-1.5"
          >
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type="text"
            value={values[field.name]}
            onChange={(e) => updateField(field.name, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={field.placeholder}
            className="w-full text-sm text-minuit font-medium placeholder:text-gris placeholder:font-normal"
          />
        </div>
      ))}

      <div className="p-2.5 flex items-center justify-center sm:justify-start">
        <Button
          variant="primary"
          size={isCompact ? 'sm' : 'md'}
          fullWidth
          className="sm:w-auto"
          onClick={handleSearch}
        >
          {isCompact ? 'Modifier' : 'Rechercher'}
        </Button>
      </div>
    </div>
  )
}