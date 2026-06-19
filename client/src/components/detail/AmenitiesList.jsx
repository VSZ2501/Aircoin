/**
 * Emplacement : client/src/components/detail/AmenitiesList.jsx
 *
 * Liste des équipements / services du logement, en grille 3 colonnes.
 * Lié au MLD : champ "equipement" de l'entité Logement.
 *
 * Usage :
 *   <AmenitiesList amenities={[
 *     { icon: '📡', label: 'WiFi haut débit' },
 *     { icon: '🔥', label: 'Chauffage central' },
 *   ]} />
 */

export default function AmenitiesList({ amenities = [], title = 'Équipements & services' }) {
  return (
    <section>
      <h3 className="text-xl font-bold text-minuit mb-6">{title}</h3>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
        {amenities.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-sm text-charbon">
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}