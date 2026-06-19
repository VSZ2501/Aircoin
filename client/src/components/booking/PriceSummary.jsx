/**
 * Emplacement : client/src/components/booking/PriceSummary.jsx
 *
 * Détail du prix dans la booking card : lignes de calcul + total.
 * Lié au MLD : champ "prix" de l'entité Logement.
 *
 * Usage :
 *   <PriceSummary
 *     rows={[
 *       { label: '89 € × 5 nuits', value: '445 €' },
 *       { label: 'Frais de service', value: '40 €' },
 *       { label: 'Taxe de séjour', value: '12 €' },
 *     ]}
 *     total="497 €"
 *   />
 */

export default function PriceSummary({ rows = [], total }) {
  return (
    <div className="border-t border-border pt-4">
      <div className="flex flex-col gap-2.5 mb-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm text-charbon">
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 flex items-center justify-between">
        <span className="text-base font-bold text-minuit">Total (taxes incluses)</span>
        <span className="text-lg font-bold text-terrecuite">{total}</span>
      </div>
    </div>
  )
}