/**
 * Emplacement : client/src/components/booking/BookingCard.jsx
 *
 * Carte de réservation "sticky" de la fiche logement — assemble
 * PriceTag, DatePicker, PriceSummary et le CTA principal.
 *
 * Lié au MLD : entité Reserver (date_debut, date_fin) + Logement (prix).
 *
 * Usage :
 *   <BookingCard
 *     price={89}
 *     note={4.9}
 *     reviewCount={214}
 *     checkIn="14 juin 2025"
 *     checkOut="19 juin 2025"
 *     guests="2 adultes, 1 enfant"
 *     freeCancellation="Annulation gratuite avant le 8 juin"
 *     priceRows={[...]}
 *     total="497 €"
 *   />
 */

import Button from '../ui/Button'
import PriceTag from '../ui/PriceTag'
import DatePicker from './DatePicker'
import PriceSummary from './PriceSummary'

export default function BookingCard({
  price,
  note,
  reviewCount,
  checkIn,
  checkOut,
  guests,
  freeCancellation,
  priceRows = [],
  total,
}) {
  return (
    <div className="bg-white border border-border rounded-2xl shadow-booking p-7 sm:p-8">

      {/* Prix + note */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
        <PriceTag amount={price} size="lg" />
        <span className="text-sm text-charbon whitespace-nowrap">
          ★ {note?.toFixed(1)} · {reviewCount} avis
        </span>
      </div>

      {/* Dates */}
      <DatePicker checkIn={checkIn} checkOut={checkOut} />

      {/* Voyageurs */}
      <div className="bg-brume rounded-md px-5 py-4 mt-4 mb-6">
        <label className="block text-[9px] font-bold uppercase tracking-wide text-charbon mb-1.5">
          Voyageurs
        </label>
        <input
          type="text"
          defaultValue={guests}
          className="w-full text-sm text-minuit"
        />
      </div>

      {/* CTA principal */}
      <Button variant="primary" fullWidth size="md">
        Réserver maintenant
      </Button>

      {freeCancellation && (
        <p className="text-sm font-semibold text-success text-center mt-5">
          ✓ {freeCancellation}
        </p>
      )}

      {/* Détail prix */}
      <div className="mt-7">
        <PriceSummary rows={priceRows} total={total} />
      </div>

      {/* Confiance */}
      <p className="text-sm text-gris text-center mt-6">
        🔒 Paiement 100 % sécurisé
      </p>
    </div>
  )
}