/**
 * Emplacement : client/src/components/detail/RatingBar.jsx
 *
 * Barre de progression pour une catégorie de notation
 * (Propreté, Communication, Emplacement...) vue dans le bloc
 * "avis" de la fiche détail.
 *
 * Usage :
 *   <RatingBar label="Propreté" note={4.9} />
 *   <RatingBar label="Emplacement" note={4.6} max={5} />
 */

export default function RatingBar({ label, note, max = 5 }) {
  const percent = Math.min(100, (note / max) * 100)

  return (
    <div className="flex items-center gap-4">
      <span className="w-40 text-sm text-charbon shrink-0">{label}</span>

      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-terrecuite rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      <span className="w-8 text-sm font-bold text-minuit text-right">
        {note.toFixed(1)}
      </span>
    </div>
  )
}