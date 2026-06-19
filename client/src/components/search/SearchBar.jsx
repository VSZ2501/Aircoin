/**
 * Emplacement : client/src/components/search/SearchBar.jsx
 *
 * Barre de recherche multi-champs.
 * Deux variantes vues dans les maquettes :
 *  - "hero"     : flottante, grande, sur fond sombre (Homepage)
 *  - "compact"  : fine, intégrée à la nav (ListingPage)
 *
 * Purement visuel pour l'instant — la logique de recherche
 * sera branchée plus tard via useSearch().
 *
 * Usage :
 *   <SearchBar variant="hero" />
 *   <SearchBar variant="compact" defaultValues={{ where: 'Paris', ... }} />
 */

import Button from '../ui/Button'

export default function SearchBar({ variant = 'hero', defaultValues = {} }) {
  const isCompact = variant === 'compact'

  const fields = [
    { name: 'where',   label: 'Où ?',       placeholder: 'Paris, Lyon, Bordeaux…' },
    { name: 'checkin', label: 'Arrivée',    placeholder: 'jj / mm / aaaa' },
    { name: 'checkout',label: 'Départ',     placeholder: 'jj / mm / aaaa' },
    { name: 'guests',  label: 'Voyageurs',  placeholder: '2 adultes' },
  ]

  return (
    <div
      className={`
        bg-white rounded-xl flex flex-col sm:flex-row items-stretch
        ${isCompact ? 'shadow-none border border-border' : 'shadow-search'}
      `}
    >
      {fields.map((field, i) => (
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
            defaultValue={defaultValues[field.name]}
            placeholder={field.placeholder}
            className="w-full text-sm text-minuit font-medium placeholder:text-gris placeholder:font-normal"
          />
        </div>
      ))}

      <div className="p-2.5 flex items-center justify-center sm:justify-start">
        <Button variant="primary" size={isCompact ? 'sm' : 'md'} fullWidth className="sm:w-auto">
          {isCompact ? 'Modifier' : 'Rechercher'}
        </Button>
      </div>
    </div>
  )
}