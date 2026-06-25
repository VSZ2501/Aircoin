/**
 * Emplacement : client/src/components/booking/DatePicker.jsx
 *
 * Sélecteur de dates d'arrivée / départ, désormais fonctionnel
 * (type="date" natif, contrôlé). Remonte ses valeurs via onChange
 * au format ISO (YYYY-MM-DD), directement utilisable par l'API
 * (POST /api/reservations attend date_arrivee / date_depart).
 *
 * Usage :
 *   <DatePicker
 *     checkIn={checkIn}
 *     checkOut={checkOut}
 *     onChange={(field, value) => ...}
 *   />
 */

export default function DatePicker({ checkIn, checkOut, onChange }) {
  // Empêche de choisir une date de départ avant ou égale à l'arrivée
  const minCheckOut = checkIn || undefined
  // Empêche de choisir une date d'arrivée dans le passé
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="grid grid-cols-2 bg-brume rounded-md overflow-hidden">
      <div className="px-5 py-4 border-r border-border min-w-0">
        <label htmlFor="checkin" className="block text-[9px] font-bold uppercase tracking-wide text-charbon mb-1.5">
          Arrivée
        </label>
        <input
          id="checkin"
          type="date"
          min={today}
          value={checkIn || ''}
          onChange={(e) => onChange?.('checkIn', e.target.value)}
          className="w-full text-sm font-semibold text-minuit bg-transparent"
        />
      </div>

      <div className="px-5 py-4 min-w-0">
        <label htmlFor="checkout" className="block text-[9px] font-bold uppercase tracking-wide text-charbon mb-1.5">
          Départ
        </label>
        <input
          id="checkout"
          type="date"
          min={minCheckOut}
          value={checkOut || ''}
          onChange={(e) => onChange?.('checkOut', e.target.value)}
          className="w-full text-sm font-semibold text-minuit bg-transparent"
        />
      </div>
    </div>
  )
}