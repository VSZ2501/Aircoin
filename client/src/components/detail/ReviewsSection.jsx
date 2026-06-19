/**
 * Emplacement : client/src/components/detail/ReviewsSection.jsx
 *
 * Section complète des avis sur la fiche logement :
 * note globale + barres par catégorie + grille d'avis individuels.
 *
 * Lié au MLD : entité Avis_logement (note, Date_avis, Commentaire).
 *
 * Usage :
 *   <ReviewsSection
 *     overallNote={4.9}
 *     reviewCount={214}
 *     categories={[{ label: 'Propreté', note: 4.9 }, ...]}
 *     reviews={[{ id, name, date, note, text, avatarColor }, ...]}
 *   />
 */

import RatingBar from './RatingBar'
import StarRating from '../ui/StarRating'
import Button from '../ui/Button'

export default function ReviewsSection({
  overallNote,
  reviewCount,
  categories = [],
  reviews = [],
}) {
  return (
    <section className="border-t border-border pt-8">

      {/* Note globale */}
      <div className="mb-8">
        <p className="text-4xl font-bold text-minuit">★ {overallNote.toFixed(1)}</p>
        <p className="text-sm text-gris mt-1">sur {reviewCount} avis vérifiés</p>
      </div>

      {/* Barres par catégorie */}
      <div className="flex flex-col gap-3 mb-12 max-w-xl">
        {categories.map((cat) => (
          <RatingBar key={cat.label} label={cat.label} note={cat.note} />
        ))}
      </div>

      {/* Avis individuels */}
      <h3 className="text-xl font-bold text-minuit mb-6">Derniers commentaires</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        {reviews.map((review) => (
          <article key={review.id} className="flex gap-3">
            <div
              className="w-10 h-10 rounded-full shrink-0"
              style={{ backgroundColor: review.avatarColor ?? '#1A2B4C' }}
            />
            <div>
              <p className="text-base font-bold text-minuit">{review.name}</p>
              <p className="text-sm text-gris mb-2">{review.date}</p>
              <StarRating note={review.note} display="stars" size="sm" className="mb-2" />
              <p className="text-sm text-charbon leading-relaxed">{review.text}</p>
            </div>
          </article>
        ))}
      </div>

      <Button variant="outline">
        Voir {reviewCount} avis →
      </Button>
    </section>
  )
}