/**
 * Emplacement : client/src/components/listing/LeaveReviewModal.jsx
 *
 * Modale simple pour laisser un avis (étoiles + commentaire),
 * réutilisable pour les avis logement ET les avis utilisateur.
 *
 * Usage :
 *   <LeaveReviewModal
 *     title="Noter ce logement"
 *     onSubmit={async ({ note, commentaire }) => { ... }}
 *     onClose={() => setOpen(false)}
 *   />
 */

import { useState } from 'react'
import Button from '../ui/Button'

export default function LeaveReviewModal({ title, onSubmit, onClose }) {
  const [note, setNote] = useState(5)
  const [commentaire, setCommentaire] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!commentaire.trim()) {
      setError('Merci de laisser un commentaire.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({ note, commentaire })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue, veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-6">
      <div className="bg-white dark:bg-minuit rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold text-minuit dark:text-white mb-6">{title}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label className="block text-sm font-semibold text-minuit dark:text-white mb-3">
              Votre note
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNote(n)}
                  aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                  className={n <= note ? 'text-3xl text-star transition-colors duration-150' : 'text-3xl text-border transition-colors duration-150'}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-minuit dark:text-white mb-2">
              Commentaire
            </label>
            <textarea
              rows={4}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Partagez votre expérience..."
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-error bg-error/10 rounded-md px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Envoi…' : "Publier l'avis"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}