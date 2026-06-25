// ─── UTILS Geocode ────────────────────────────────────────────────────────────
// Géocode une adresse en coordonnées GPS via Nominatim (OpenStreetMap),
// service gratuit et sans clé API. Utilisé par logement.controller.js
// pour positionner automatiquement chaque logement sur ListingMap.jsx
// côté front, sans jamais demander à l'hôte de connaître ses propres
// coordonnées GPS.
//
// Limite Nominatim : 1 requête/seconde max. Pas un problème pour des
// créations d'annonces ponctuelles ; à surveiller en cas d'import en masse.

/**
 * Convertit une adresse complète en { latitude, longitude }.
 * Ne lève jamais d'exception : en cas d'échec (adresse introuvable,
 * service indisponible, timeout...), retourne { latitude: null,
 * longitude: null } pour ne jamais bloquer la création/modification
 * d'un logement à cause d'un problème de géocodage.
 *
 * @param {string} adresse     - ex. "12 rue de Rivoli"
 * @param {string} codePostal  - ex. "75001"
 * @param {string} ville       - ex. "Paris"
 * @returns {Promise<{ latitude: number|null, longitude: number|null }>}
 */
async function geocoderAdresse(adresse, codePostal, ville) {
  try {
    const requete = `${adresse}, ${codePostal} ${ville}, France`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(requete)}&limit=1`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'AirCoin-App' }, // requis par les conditions d'usage de Nominatim
    });

    if (!res.ok) {
      console.warn(`⚠️ Géocodage : réponse Nominatim non OK (${res.status}) pour "${requete}"`);
      return { latitude: null, longitude: null };
    }

    const data = await res.json();

    if (!data.length) {
      console.warn(`⚠️ Géocodage : aucun résultat pour "${requete}"`);
      return { latitude: null, longitude: null };
    }

    return {
      latitude:  parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.warn(`⚠️ Géocodage : erreur — ${err.message}`);
    return { latitude: null, longitude: null };
  }
}

module.exports = { geocoderAdresse };