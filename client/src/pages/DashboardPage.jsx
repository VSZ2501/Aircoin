/**
 * Emplacement : client/src/pages/DashboardPage.jsx
 *
 * Tableau de bord — passe par PageWrapper (nav + footer présents).
 *
 * Logique des rôles :
 *   - 'client'    → ses réservations + bouton "Devenir hôte"
 *   - 'hebergeur' → ses annonces ET ses réservations (un hôte peut
 *                   aussi avoir réservé des séjours par ailleurs)
 *
 * "Devenir hôte" nécessite PUT /api/utilisateurs/moi côté serveur
 * (voir auth.service.js → devenirHebergeur, à faire ajouter par le
 * collègue en charge du serveur si pas encore fait).
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getMesReservations,
  annulerReservation,
  getReservationsRecues,
  accepterReservation,
  refuserReservation,
} from '../services/bookings.service'
import { getMesLogements } from '../services/listings.service'
import { getFavoris } from '../services/auth.service'
import { creerAvisUtilisateur, peutNoterReservation } from '../services/avis.service'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import PriceTag from '../components/ui/PriceTag'
import ListingGrid from '../components/listing/ListingGrid'
import LeaveReviewModal from '../components/listing/LeaveReviewModal'

const STATUS_LABELS = {
  en_attente: { label: 'En attente', variant: 'minuit' },
  confirmee:  { label: 'Confirmée',   variant: 'success' },
  refusee:    { label: 'Refusée',     variant: 'error' },
  annulee:    { label: 'Annulée',     variant: 'error' },
}

// ── Section : réservations reçues (visible seulement pour les hébergeurs) ──
function ReservationsRecuesSection() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionId, setActionId] = useState(null) // id en cours de traitement

  useEffect(() => {
    getReservationsRecues()
      .then((result) => setReservations(result.data))
      .catch(() => setError('Impossible de charger les réservations reçues.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleAccepter(id) {
    setActionId(id)
    try {
      await accepterReservation(id)
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'confirmee' } : r))
      )
    } catch {
      alert("Erreur lors de l'acceptation.")
    } finally {
      setActionId(null)
    }
  }

  async function handleRefuser(id) {
    if (!window.confirm('Refuser cette réservation ?')) return
    setActionId(id)
    try {
      await refuserReservation(id)
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'refusee' } : r))
      )
    } catch {
      alert('Erreur lors du refus.')
    } finally {
      setActionId(null)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-40 rounded-xl bg-[#E8EDF2] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) return <p className="text-error text-sm">{error}</p>

  if (reservations.length === 0) {
    return (
      <div className="text-center py-16 bg-brume dark:bg-[#16233D] rounded-xl">
        <p className="text-2xl mb-4">📬</p>
        <p className="text-minuit dark:text-white font-bold mb-2">Aucune réservation reçue</p>
        <p className="text-gris dark:text-[#8AADC5] text-sm">Les demandes de réservation sur vos annonces apparaîtront ici.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {reservations.map((r) => {
        const status = STATUS_LABELS[r.status] || STATUS_LABELS.en_attente
        const isPending = actionId === r.id
        return (
          <div key={r.id} className="bg-white dark:bg-minuit dark:border dark:border-white/10 rounded-xl shadow-card p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-minuit dark:text-white">{r.checkIn} → {r.checkOut}</p>
                <p className="text-xs text-gris dark:text-[#8AADC5] mt-1">{r.guests} voyageur{r.guests > 1 ? 's' : ''} · {r.nbNuits} nuit{r.nbNuits > 1 ? 's' : ''}</p>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between gap-3">
              <PriceTag amount={Number(r.total.replace(/[^\d]/g, ''))} suffix="total" />
              {r.status === 'en_attente' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleRefuser(r.id)} disabled={isPending}>
                    Refuser
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleAccepter(r.id)} disabled={isPending}>
                    {isPending ? '…' : 'Accepter'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Bouton "Laisser un avis" — vérifie côté serveur si le séjour est
// terminé et si un avis n'a pas déjà été laissé, avant d'afficher
// quoi que ce soit (évite les faux avis sur séjour non terminé). ──
function ReviewButton({ reservation }) {
  const [statut, setStatut] = useState(null) // null = en chargement
  const [showModal, setShowModal] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    peutNoterReservation(reservation.id)
      .then((result) => setStatut(result.data))
      .catch(() => setStatut({ peutNoter: false, dejaNote: false }))
  }, [reservation.id])

  async function handleSubmitAvis({ note, commentaire }) {
    await creerAvisUtilisateur(reservation.id, {
      cible_id: reservation.hostId,
      note,
      commentaire,
    })
    setDone(true)
  }

  if (statut === null) return null // pas encore chargé, n'affiche rien
  if (done || statut.dejaNote) {
    return <span className="text-xs text-success font-semibold">✓ Avis envoyé</span>
  }
  if (!statut.peutNoter) return null // séjour pas encore terminé

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
        Laisser un avis
      </Button>
      {showModal && (
        <LeaveReviewModal
          title="Noter votre hôte"
          onSubmit={handleSubmitAvis}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

// ── Section : mes réservations (visible pour tout le monde) ─────────────────
function ReservationsSection() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  useEffect(() => {
    getMesReservations()
      .then((result) => setReservations(result.data))
      .catch(() => setError('Impossible de charger vos réservations.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleCancel(id) {
    if (!window.confirm('Annuler cette réservation ?')) return
    try {
      await annulerReservation(id)
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'annulee' } : r))
      )
    } catch {
      alert("Erreur lors de l'annulation.")
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-40 rounded-xl bg-[#E8EDF2] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) return <p className="text-error text-sm">{error}</p>

  if (reservations.length === 0) {
    return (
      <div className="text-center py-16 bg-brume rounded-xl">
        <p className="text-2xl mb-4">🧳</p>
        <p className="text-minuit font-bold mb-2">Aucune réservation pour le moment</p>
        <p className="text-gris text-sm mb-8">Trouvez votre prochain séjour parmi nos logements.</p>
        <Link to="/logements">
          <Button variant="primary">Explorer les logements</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {reservations.map((r) => {
        const status = STATUS_LABELS[r.status] || STATUS_LABELS.en_attente
        const sejourTermine = r.checkOutISO && new Date(r.checkOutISO) < new Date()
        const peutAnnuler = r.status !== 'annulee' && !sejourTermine

        return (
          <div key={r.id} className="bg-white dark:bg-minuit dark:border dark:border-white/10 rounded-xl shadow-card p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-minuit dark:text-white">{r.checkIn} → {r.checkOut}</p>
                <p className="text-xs text-gris dark:text-[#8AADC5] mt-1">{r.guests} voyageur{r.guests > 1 ? 's' : ''} · {r.nbNuits} nuit{r.nbNuits > 1 ? 's' : ''}</p>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between gap-3">
              <PriceTag amount={Number(r.total.replace(/[^\d]/g, ''))} suffix="total" />
              <div className="flex items-center gap-2">
                {r.status !== 'annulee' && <ReviewButton reservation={r} />}
                {peutAnnuler && (
                  <Button variant="outline" size="sm" onClick={() => handleCancel(r.id)}>
                    Annuler
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Section : mes favoris (visible pour tout le monde) ──────────────────────
function FavorisSection() {
  const { user } = useAuth()
  const [favoris, setFavoris] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  // Se recharge chaque fois que la liste d'IDs favoris change
  // (ex: un cœur cliqué/retiré depuis une ListingCard ailleurs sur le site).
  useEffect(() => {
    getFavoris()
      .then(setFavoris)
      .catch(() => setError('Impossible de charger vos favoris.'))
      .finally(() => setLoading(false))
  }, [user?.favoris])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-72 rounded-xl bg-[#E8EDF2] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) return <p className="text-error text-sm">{error}</p>

  if (favoris.length === 0) {
    return (
      <div className="text-center py-16 bg-brume rounded-xl">
        <p className="text-2xl mb-4">♡</p>
        <p className="text-minuit font-bold mb-2">Aucun favori pour le moment</p>
        <p className="text-gris text-sm mb-8">Cliquez sur le cœur d'une annonce pour la retrouver ici.</p>
        <Link to="/logements">
          <Button variant="primary">Explorer les logements</Button>
        </Link>
      </div>
    )
  }

  return <ListingGrid listings={favoris} columns={3} />
}

// ── Section : mes annonces (visible seulement pour les hébergeurs) ──────────
function AnnoncesSection({ userId }) {
  const [logements, setLogements] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    getMesLogements(userId)
      .then((result) => setLogements(result.data))
      .catch(() => setError('Impossible de charger vos annonces.'))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-[#E8EDF2] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) return <p className="text-error text-sm">{error}</p>

  if (logements.length === 0) {
    return (
      <div className="text-center py-16 bg-brume rounded-xl">
        <p className="text-2xl mb-4">🏠</p>
        <p className="text-minuit font-bold mb-2">Aucune annonce publiée</p>
        <p className="text-gris text-sm mb-8">Publiez votre premier logement pour commencer à recevoir des réservations.</p>
        <Link to="/publier">
          <Button variant="primary">Publier une annonce →</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {logements.map((l) => (
        <Link
          key={l.id}
          to={`/logements/${l.id}`}
          className="relative bg-white dark:bg-minuit dark:border dark:border-white/10 rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-250"
        >
          <div
            className="h-40 bg-[#4A6080]"
            style={l.photos?.[0] ? { backgroundImage: `url(${l.photos[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          />

          {/* Bouton Modifier — empêche la navigation du Link parent */}
          <Link
            to={`/logements/${l.id}/modifier`}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 bg-white/95 dark:bg-minuit/95 text-xs font-semibold text-minuit dark:text-white px-3 py-1.5 rounded-full hover:bg-white dark:hover:bg-minuit transition-colors duration-150"
          >
            Modifier
          </Link>

          <div className="p-5">
            <h3 className="text-sm font-bold text-minuit dark:text-white mb-1 line-clamp-1">{l.title}</h3>
            <p className="text-xs text-gris dark:text-[#8AADC5] mb-3">{l.location}</p>
            <div className="flex items-center justify-between">
              <PriceTag amount={l.price} size="sm" />
              <span className="text-xs text-gris dark:text-[#8AADC5]">★ {l.note?.toFixed(1) ?? '—'} ({l.reviewCount ?? 0})</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

// ── Bandeau : devenir hôte (visible seulement pour les clients) ─────────────
function DevenirHoteBanner() {
  const { upgradeToHebergeur } = useAuth()
  const [loading, setLoading]  = useState(false)
  const [error, setError]      = useState('')

  async function handleClick() {
    const confirme = window.confirm(
      'Voulez-vous vraiment devenir hôte ? Vous pourrez publier des annonces tout en gardant vos réservations existantes.'
    )
    if (!confirme) return

    setError('')
    setLoading(true)
    try {
      await upgradeToHebergeur()
      // user.role est maintenant 'hebergeur' → la page se réaffiche
      // automatiquement avec les deux sections.
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue, veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-minuit rounded-2xl p-8 mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div>
        <p className="text-xs font-bold text-terrecuite uppercase tracking-wide mb-2">
          Vous avez un logement à louer ?
        </p>
        <h2 className="text-white text-xl font-bold mb-1">
          Devenez hôte sur Air'Coin
        </h2>
        <p className="text-[#8AADC5] text-sm">
          Publiez votre annonce et commencez à générer des revenus.
        </p>
        {error && <p className="text-error text-sm mt-3">{error}</p>}
      </div>
      <Button variant="primary" onClick={handleClick} disabled={loading} className="shrink-0">
        {loading ? 'Conversion en cours…' : 'Devenir hôte'}
      </Button>
    </div>
  )
}

// ── Page principale ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()

  if (authLoading) return null

  if (!user) {
    return (
      <div className="container py-24 text-center">
        <p className="text-minuit font-bold mb-3">Connexion requise</p>
        <p className="text-gris text-sm mb-8">Connectez-vous pour accéder à votre tableau de bord.</p>
        <Link to="/connexion">
          <Button variant="primary">Se connecter</Button>
        </Link>
      </div>
    )
  }

  const isHebergeur = user.role === 'hebergeur'

  return (
    <div className="container pt-10 pb-24">
      <p className="text-sm text-gris mb-2">Bonjour {user.prenom},</p>
      <h1 className="text-3xl mb-10">Mon tableau de bord</h1>

      {/* Bandeau "Devenir hôte" — uniquement pour les comptes client */}
      {!isHebergeur && <DevenirHoteBanner />}

      {/* Un hébergeur voit ses annonces, les réservations reçues
          dessus, ET ses propres réservations de voyage.
          Un client voit uniquement ses réservations. */}
      {isHebergeur && (
        <>
          <section className="mb-14">
            <h2 className="text-xl font-bold text-minuit dark:text-white mb-6">Mes annonces</h2>
            <AnnoncesSection userId={user.id} />
          </section>

          <section className="mb-14">
            <h2 className="text-xl font-bold text-minuit dark:text-white mb-6">Réservations reçues</h2>
            <ReservationsRecuesSection />
          </section>
        </>
      )}

      <section className="mb-14">
        <h2 className="text-xl font-bold text-minuit mb-6">Mes favoris</h2>
        <FavorisSection />
      </section>

      <section>
        <h2 className="text-xl font-bold text-minuit mb-6">Mes réservations</h2>
        <ReservationsSection />
      </section>
    </div>
  )
}