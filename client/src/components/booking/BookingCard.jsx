/**
 * Emplacement : client/src/components/booking/BookingCard.jsx
 *
 * Carte de réservation — désormais entièrement fonctionnelle :
 *  - dates contrôlées (DatePicker)
 *  - nombre de voyageurs contrôlé
 *  - calcul du prix en direct (nuits × prix + frais + taxe)
 *  - appel réel à POST /api/reservations au clic sur "Réserver"
 *  - gestion des états : non connecté / chargement / erreur / succès
 *
 * Le calcul de prix ici est indicatif (même logique que côté serveur :
 * frais de service 9 %, taxe de séjour 1 €/pers/nuit) — le serveur
 * reste la source de vérité finale, voir reservation.controller.js.
 *
 * Usage :
 *   <BookingCard
 *     logementId={listing.id}
 *     price={listing.price}
 *     note={listing.note}
 *     reviewCount={listing.reviewCount}
 *     maxGuests={listing.maxGuests}
 *   />
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { creerReservation } from '../../services/bookings.service'
import Button from '../ui/Button'
import PriceTag from '../ui/PriceTag'
import DatePicker from './DatePicker'
import PriceSummary from './PriceSummary'

function nbNuitsEntre(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const diff = new Date(checkOut) - new Date(checkIn)
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
}

export default function BookingCard({
  logementId,
  price,
  note,
  reviewCount,
  maxGuests,
}) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [checkIn, setCheckIn]   = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests]     = useState(1)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  const nbNuits = useMemo(() => nbNuitsEntre(checkIn, checkOut), [checkIn, checkOut])

  // Calcul indicatif — identique à la logique serveur (cf. reservation.controller.js)
  const fraisService = nbNuits > 0 ? Math.round(price * nbNuits * 0.09) : 0
  const taxeSejour    = nbNuits > 0 ? guests * nbNuits : 0
  const total          = nbNuits > 0 ? price * nbNuits + fraisService + taxeSejour : 0

  const priceRows = nbNuits > 0
    ? [
        { label: `${price} € × ${nbNuits} nuit${nbNuits > 1 ? 's' : ''}`, value: `${price * nbNuits} €` },
        { label: 'Frais de service', value: `${fraisService} €` },
        { label: 'Taxe de séjour',   value: `${taxeSejour} €` },
      ]
    : []

  function handleDateChange(field, value) {
    setError('')
    if (field === 'checkIn') setCheckIn(value)
    if (field === 'checkOut') setCheckOut(value)
  }

  async function handleReserve() {
    setError('')

    if (!isAuthenticated) {
      navigate('/connexion')
      return
    }
    if (!checkIn || !checkOut) {
      setError('Sélectionnez vos dates de séjour.')
      return
    }
    if (nbNuits <= 0) {
      setError('La date de départ doit être après la date d\'arrivée.')
      return
    }
    if (maxGuests && guests > maxGuests) {
      setError(`Ce logement accueille ${maxGuests} personne${maxGuests > 1 ? 's' : ''} maximum.`)
      return
    }

    setLoading(true)
    try {
      await creerReservation({
        logement_id: logementId,
        date_arrivee: checkIn,
        date_depart: checkOut,
        nb_voyageurs: guests,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue, veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  // ── État succès ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="bg-white border border-border rounded-2xl shadow-booking p-8 text-center">
        <p className="text-3xl mb-4">🎉</p>
        <p className="text-lg font-bold text-minuit mb-2">Réservation confirmée</p>
        <p className="text-sm text-gris mb-6">
          Retrouvez les détails dans votre tableau de bord.
        </p>
        <Button variant="primary" fullWidth onClick={() => navigate('/dashboard')}>
          Voir mes réservations
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-border rounded-2xl shadow-booking p-7 sm:p-8">

      {/* Prix + note */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
        <PriceTag amount={price} size="lg" />
        {note > 0 && (
          <span className="text-sm text-charbon whitespace-nowrap">
            ★ {note.toFixed(1)} · {reviewCount} avis
          </span>
        )}
      </div>

      {/* Dates */}
      <DatePicker checkIn={checkIn} checkOut={checkOut} onChange={handleDateChange} />

      {/* Voyageurs */}
      <div className="bg-brume rounded-md px-5 py-4 mt-4 mb-6">
        <label htmlFor="guests" className="block text-[9px] font-bold uppercase tracking-wide text-charbon mb-1.5">
          Voyageurs
        </label>
        <input
          id="guests"
          type="number"
          min={1}
          max={maxGuests || undefined}
          value={guests}
          onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
          className="w-full text-sm text-minuit bg-transparent"
        />
      </div>

      {error && (
        <p className="text-sm text-error bg-error/10 rounded-md px-4 py-3 mb-5">
          {error}
        </p>
      )}

      {/* CTA principal */}
      <Button variant="primary" fullWidth size="md" onClick={handleReserve} disabled={loading}>
        {loading ? 'Réservation en cours…' : isAuthenticated ? 'Réserver maintenant' : 'Se connecter pour réserver'}
      </Button>

      {/* Détail prix — affiché seulement si des dates valides sont choisies */}
      {nbNuits > 0 && (
        <div className="mt-7">
          <PriceSummary rows={priceRows} total={`${total} €`} />
        </div>
      )}

      {/* Confiance */}
      <p className="text-sm text-gris text-center mt-6">
        🔒 Paiement 100 % sécurisé
      </p>
    </div>
  )
}