/**
 * Emplacement : client/src/components/ui/PriceTag.jsx
 *
 * Affichage du prix — toujours en Terre Cuite selon la charte
 * (règle DA : "le prix est un accent, jamais une info neutre").
 *
 * Vu dans les maquettes :
 *  - Card logement  : "89 €" + "/ nuit" en petit, gris
 *  - Booking card    : prix total, plus grand
 *
 * Usage :
 *   <PriceTag amount={89} />
 *   <PriceTag amount={497} suffix="taxes incluses" size="lg" />
 */

const SIZES = {
  sm: { amount: 'text-lg',  suffix: 'text-xs'  },
  md: { amount: 'text-2xl', suffix: 'text-sm'  },
  lg: { amount: 'text-3xl', suffix: 'text-base' },
}

export default function PriceTag({
  amount,
  unit = '€',
  suffix = '/ nuit',
  size = 'md',
  className = '',
}) {
  const sizeClasses = SIZES[size]

  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className={`font-bold text-terrecuite ${sizeClasses.amount}`}>
        {amount} {unit}
      </span>
      {suffix && (
        <span className={`text-gris font-normal ${sizeClasses.suffix}`}>
          {suffix}
        </span>
      )}
    </span>
  )
}