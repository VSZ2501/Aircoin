/**
 * Emplacement : client/src/components/booking/DatePicker.jsx
 *
 * Affichage des dates d'arrivée / départ dans la booking card.
 * Purement visuel pour l'instant (inputs texte) — sera branché
 * sur une vraie librairie de calendrier plus tard si besoin.
 *
 * Lié au MLD : entité Reserver (date_debut, date_fin).
 *
 * Usage :
 *   <DatePicker checkIn="14 juin 2025" checkOut="19 juin 2025" />
 */

export default function DatePicker({ checkIn, checkOut, onChange }) {
  return (
    <div className="grid grid-cols-2 bg-brume rounded-md overflow-hidden">
      <div className="px-5 py-4 border-r border-border min-w-0">
        <label className="block text-[9px] font-bold uppercase tracking-wide text-charbon mb-1.5">
          Arrivée
        </label>
        <input
          type="text"
          defaultValue={checkIn}
          onChange={(e) => onChange?.('checkIn', e.target.value)}
          className="w-full text-sm font-semibold text-minuit"
        />
      </div>

      <div className="px-5 py-4 min-w-0">
        <label className="block text-[9px] font-bold uppercase tracking-wide text-charbon mb-1.5">
          Départ
        </label>
        <input
          type="text"
          defaultValue={checkOut}
          onChange={(e) => onChange?.('checkOut', e.target.value)}
          className="w-full text-sm font-semibold text-minuit"
        />
      </div>
    </div>
  )
}