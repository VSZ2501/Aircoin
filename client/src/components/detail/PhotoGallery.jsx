/**
 * Emplacement : client/src/components/detail/PhotoGallery.jsx
 *
 * Galerie photo de la fiche logement — 1 grande photo + 4 vignettes,
 * avec overlay "Voir tout" sur la dernière. Reprend la maquette détail.
 *
 * Lié au MLD : entité Photo (id_photo, piece_jointe) via relation Decrir.
 *
 * Usage :
 *   <PhotoGallery photos={['/img/1.jpg', '/img/2.jpg', ...]} totalCount={24} />
 */

export default function PhotoGallery({ photos = [], totalCount }) {
  const [main, ...rest] = photos
  const thumbnails = rest.slice(0, 4)
  const remaining = totalCount ?? photos.length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 rounded-lg overflow-hidden">

      {/* Photo principale */}
      <div
        className="bg-[#3D5C7A] aspect-[16/10] lg:aspect-auto lg:h-[480px] rounded-lg lg:rounded-l-lg lg:rounded-r-none"
        style={main ? { backgroundImage: `url(${main})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      />

      {/* Grille de 4 vignettes */}
      <div className="grid grid-cols-2 gap-3 lg:h-[480px]">
        {Array.from({ length: 4 }).map((_, i) => {
          const isLast = i === 3
          const photo = thumbnails[i]

          return (
            <div
              key={i}
              className="relative bg-[#384858] aspect-square lg:aspect-auto lg:h-full rounded-md overflow-hidden"
              style={photo ? { backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              {isLast && (
                <button
                  type="button"
                  className="absolute inset-0 bg-black/45 hover:bg-black/55 transition-colors duration-150 flex items-center justify-center text-white text-sm font-semibold"
                >
                  Voir tout · {remaining} photos
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}