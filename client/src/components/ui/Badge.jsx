/**
 * Emplacement : client/src/components/ui/Badge.jsx
 *
 * Badge / étiquette réutilisable.
 * Vu dans les maquettes sur les cards logement :
 *  - "Coup de cœur", "Populaire", "Design", "Famille" → variant="accent"
 *  - "Superhost ✓" → variant="light"
 *  - Statuts de réservation (futur) → variant="success" / "error"
 *
 * Usage :
 *   <Badge>Coup de cœur</Badge>
 *   <Badge variant="light">Superhost ✓</Badge>
 *   <Badge variant="success">Confirmée</Badge>
 */

const VARIANTS = {
  accent:  'bg-terrecuite text-white',
  light:   'bg-white text-terrecuite',
  minuit:  'bg-minuit text-white',
  success: 'bg-success text-white',
  error:   'bg-error text-white',
}

export default function Badge({
  children,
  variant = 'accent',
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center leading-none
        px-3.5 py-2
        rounded-md
        text-xs font-semibold
        ${VARIANTS[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}