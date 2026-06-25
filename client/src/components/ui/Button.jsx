/**
 * Emplacement : client/src/components/ui/Button.jsx
 *
 * Bouton réutilisable Air'Coin.
 *
 * ── Fix important ────────────────────────────────────────────
 * Version précédente : les classes étaient injectées via
 * ${VARIANTS[variant]} dans un template string. Bien que les
 * classes existent en entier dans le fichier, ce pattern s'est
 * révélé peu fiable avec Tailwind v4 + @tailwindcss/vite.
 *
 * Cette version n'utilise plus AUCUNE composition dynamique de
 * classes. Chaque variante a son propre rendu JSX avec une classe
 * statique complète, garantissant une détection à 100% par le
 * scanner Tailwind (qui lit le fichier comme du texte brut).
 *
 * Usage :
 *   <Button variant="primary">Réserver maintenant</Button>
 *   <Button variant="secondary" size="sm">Voir l'offre</Button>
 *   <Button variant="outline" fullWidth>Voir 214 avis</Button>
 */

const BASE_CLASSES = 'font-semibold whitespace-nowrap transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'

function getSizeClasses(size) {
  if (size === 'sm') return 'text-sm px-4 py-2 rounded-md'
  if (size === 'lg') return 'text-lg px-8 py-4 rounded-lg'
  return 'text-base px-6 py-3 rounded-lg' // md (défaut)
}

function getVariantClasses(variant) {
  if (variant === 'secondary') return 'bg-minuit text-white hover:bg-minuit/90'
  if (variant === 'outline')   return 'bg-white text-minuit border border-minuit hover:bg-brume'
  if (variant === 'ghost')     return 'bg-transparent text-terrecuite hover:text-terrecuite-hover px-0'
  return 'bg-terrecuite text-white shadow-cta hover:bg-terrecuite-hover' // primary (défaut)
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
  const sizeClasses = getSizeClasses(size)
  const variantClasses = getVariantClasses(variant)
  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${BASE_CLASSES} ${variantClasses} ${sizeClasses} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}