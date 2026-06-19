/**
 * Emplacement : client/src/components/ui/StarRating.jsx
 *
 * Affichage de note — correspond au champ "note" du MLD
 * (entités Avis_logement / Avis_utilisateur).
 *
 * Vu dans les maquettes :
 *  - Card logement     : "★ 4.9" + "(214 avis)"
 *  - Fiche détail       : "★ 4.9" en grand, sans avis à côté
 *  - Bloc avis détaillé  : "★★★★★" (étoiles pleines, sans chiffre)
 *
 * Usage :
 *   <StarRating note={4.9} />
 *   <StarRating note={4.9} reviewCount={214} />
 *   <StarRating note={4} display="stars" />   → ★★★★☆
 */

export default function StarRating({
  note = 0,
  reviewCount,
  display = 'numeric',   // 'numeric' → "★ 4.9" | 'stars' → "★★★★☆"
  size = 'md',
  className = '',
}) {
  const sizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  }[size]

  if (display === 'stars') {
    const fullStars = Math.round(note)
    const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars)

    return (
      <span className={`text-star ${sizeClass} ${className}`}>
        {stars}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClass} ${className}`}>
      <span className="text-star font-bold">★ {note.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-gris font-normal">
          ({reviewCount} avis)
        </span>
      )}
    </span>
  )
}