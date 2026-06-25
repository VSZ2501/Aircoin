/**
 * Emplacement : client/src/components/listing/ListingMap.jsx
 *
 * Carte interactive (Leaflet + OpenStreetMap) affichant un pin
 * de prix par logement, remplace le placeholder "🗺 Carte interactive"
 * de ListingPage.jsx.
 *
 * ⚠️ Nécessite que chaque logement ait latitude/longitude (à faire
 * ajouter côté serveur dans logement.model.js + logement.controller.js
 * si pas encore fait). Les logements sans coordonnées sont simplement
 * ignorés sur la carte (pas d'erreur, juste pas de pin).
 *
 * Installation requise (terminal, dossier client) :
 *   npm install leaflet react-leaflet
 *
 * Usage :
 *   <ListingMap listings={listings} />
 */

import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Coordonnées par défaut si aucun logement n'a de position (centre France)
const DEFAULT_CENTER = [46.6, 2.3]
const DEFAULT_ZOOM    = 5

/**
 * Icône de pin personnalisée affichant le prix, dans le style
 * Air'Coin (fond blanc, texte Bleu Minuit, bordure légère).
 * Construite en HTML/CSS brut car Leaflet ne supporte pas JSX
 * directement pour ses icônes.
 */
function createPriceIcon(price) {
  return L.divIcon({
    className: 'aircoin-price-pin',
    html: `<div style="
      background: #FFFFFF;
      color: #1A2B4C;
      font-family: Inter, sans-serif;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 9999px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.18);
      white-space: nowrap;
      border: 1px solid #D8E2EC;
    ">${price} €</div>`,
    iconSize: null,
    iconAnchor: [30, 15],
  })
}

/**
 * Recentre automatiquement la carte pour englober tous les pins
 * (sous-composant car useMap() ne peut être appelé que dans un
 * enfant de <MapContainer>).
 */
function FitBounds({ positions }) {
  const map = useMap()

  useMemo(() => {
    if (positions.length === 0) return
    if (positions.length === 1) {
      map.setView(positions[0], 13)
      return
    }
    map.fitBounds(positions, { padding: [40, 40] })
  }, [positions, map])

  return null
}

export default function ListingMap({ listings = [] }) {
  // Ne garde que les logements ayant des coordonnées valides
  const listingsWithCoords = listings.filter(
    (l) => typeof l.latitude === 'number' && typeof l.longitude === 'number'
  )

  const positions = listingsWithCoords.map((l) => [l.latitude, l.longitude])

  return (
    <div className="rounded-xl overflow-hidden h-full w-full">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {positions.length > 0 && <FitBounds positions={positions} />}

        {listingsWithCoords.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.latitude, listing.longitude]}
            icon={createPriceIcon(listing.price)}
          >
            <Popup>
              <Link to={`/logements/${listing.id}`} className="block">
                <p className="font-bold text-minuit text-sm mb-1">{listing.title}</p>
                <p className="text-xs text-gris mb-1">{listing.location}</p>
                <p className="text-terrecuite font-bold text-sm">{listing.price} € / nuit</p>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}