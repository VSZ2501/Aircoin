/**
 * Emplacement : client/src/components/detail/HostCard.jsx
 *
 * Carte de présentation de l'hôte sur la fiche logement.
 * Lié au MLD : entité Utilisateur + Hebergeur (certification, langue).
 *
 * Usage :
 *   <HostCard host={{
 *     name: 'Marianne Lefebvre',
 *     since: 'juillet 2019',
 *     listingsCount: 186,
 *     note: 4.98,
 *     responseRate: 99,
 *     bio: 'Passionnée d\'architecture...',
 *     isSuperhost: true,
 *   }} />
 */

import Button from '../ui/Button'

export default function HostCard({ host }) {
  const {
    name,
    since,
    listingsCount,
    note,
    responseRate,
    bio,
    isSuperhost,
    avatarColor = '#D47A5B',
  } = host

  return (
    <div className="bg-brume rounded-xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-6">

        {/* Avatar + badge */}
        <div className="shrink-0">
          <div
            className="w-20 h-20 rounded-full"
            style={{ backgroundColor: avatarColor }}
          />
          {isSuperhost && (
            <span className="block mt-3 text-xs font-semibold text-terrecuite bg-white rounded-full px-3 py-1 text-center w-fit">
              Superhost ✓
            </span>
          )}
        </div>

        {/* Infos */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-minuit">{name}</h3>
          <p className="text-sm text-gris mt-1">
            Membre depuis {since} · {listingsCount} logements loués
          </p>
          <p className="text-sm font-semibold text-star mt-2">
            ★ {note.toFixed(2)} · {responseRate} % de réponses
          </p>
          <p className="text-sm text-charbon leading-relaxed mt-3 max-w-lg">
            {bio}
          </p>

          <Button variant="secondary" size="sm" className="mt-5">
            Contacter {name.split(' ')[0]}
          </Button>
        </div>
      </div>
    </div>
  )
}