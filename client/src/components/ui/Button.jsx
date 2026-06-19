/**
 * Emplacement : client/src/components/ui/Button.jsx
 *
 * Bouton réutilisable Air'Coin.
 * Reprend les styles vus dans les maquettes :
 *  - primary   : Terre Cuite (CTA principal — "Réserver", "Rechercher")
 *  - secondary : Bleu Minuit (CTA secondaire — "Voir l'offre", "Se connecter")
 *  - outline   : Bordure Bleu Minuit, fond transparent ("Voir tous les avis")
 *  - ghost     : Texte seul, sans fond (liens type "Lire la suite →")
 *
 * Usage :
 *   <Button variant="primary">Réserver maintenant</Button>
 *   <Button variant="secondary" size="sm">Voir l'offre</Button>
 *   <Button variant="outline" fullWidth>Voir 214 avis</Button>
 */

const VARIANTS = {
  primary:
    'bg-terrecuite text-white shadow-cta hover:bg-terrecuite-hover',
  secondary:
    'bg-minuit text-white hover:bg-minuit/90',
  outline:
    'bg-white text-minuit border border-minuit hover:bg-brume',
  ghost:
    'bg-transparent text-terrecuite hover:text-terrecuite-hover px-0',
}

const SIZES = {
  sm: 'text-sm px-4 py-2 rounded-md',
  md: 'text-base px-6 py-3 rounded-lg',
  lg: 'text-lg px-8 py-4 rounded-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        font-semibold whitespace-nowrap
        transition-all duration-250
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}