/**
 * Emplacement : client/src/pages/HomePage.jsx
 * Données chargées depuis l'API — plus de données factices.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../components/search/SearchBar'
import ListingGrid from '../components/listing/ListingGrid'
import Button from '../components/ui/Button'
import { getLogementsFeatured, getVilles } from '../services/listings.service'

const STEPS = [
  { num: '01', icon: '🔍', title: 'Recherchez', desc: "Filtrez par ville, budget, équipements. Trouvez l'annonce parfaite." },
  { num: '02', icon: '📅', title: 'Réservez',   desc: 'Contactez le propriétaire ou réservez instantanément en ligne.' },
  { num: '03', icon: '🏠', title: 'Emménagez',  desc: 'Arrivez les clés en main. Notre équipe vous accompagne à chaque étape.' },
]

const TESTIMONIALS = [
  { name: 'Sophie M.',  city: 'Paris',  note: '5.0', text: 'Interface claire, logement conforme aux photos. Je recommande à 100 % !', color: '#D47A5B' },
  { name: 'Karim B.',   city: 'Lyon',   note: '4.9', text: 'Réservation en 3 minutes chrono. Le propriétaire était très accueillant.', color: '#2D3142' },
  { name: 'Léa T.',     city: 'Nantes', note: '5.0', text: 'Excellent rapport qualité-prix. Le site donne vraiment confiance.',        color: '#1A2B4C' },
]

// Couleurs pour les cartes villes (rotation)
const CITY_COLORS = ['#2A4060', '#3A5040', '#5A3828', '#2A4858', '#304858', '#4A3060', '#3A4828']

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [villes,   setVilles]   = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([getLogementsFeatured(), getVilles()])
      .then(([featuredData, villesData]) => {
        setFeatured(featuredData.data)
        setVilles(villesData.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* ════════════════════ HERO ════════════════════ */}
      <section className="bg-minuit overflow-hidden">
        <div className="container relative pt-24 pb-44 lg:pt-32 lg:pb-52">

          {/* Décor silhouette : z-index négatif explicite pour ne
              jamais passer au-dessus de la search bar qui suit
              (bug corrigé : le décor recouvrait invisiblement les
              champs Arrivée, Départ et Voyageurs, les rendant
              cliquables en apparence mais inertes en réalité). */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-0 right-0 bottom-0 w-1/2 bg-[#3A5878]/30 -z-10"
          />

          <p className="relative text-xs font-semibold text-terrecuite uppercase tracking-wider mb-5">
            Location · Particuliers & professionnels
          </p>
          <h1 className="relative text-white max-w-xl mb-7">
            Trouvez le logement qui vous ressemble.
          </h1>
          <p className="relative text-[#93AECA] text-lg max-w-md mb-12 leading-relaxed">
            Appartements, maisons, studios — partout en France.
          </p>
          <div className="relative flex flex-wrap gap-10 text-sm text-[#8AADC5]">
            <span>🏠 +48 000 annonces</span>
            <span>⭐ Note 4.8/5</span>
            <span>🔒 Sécurisé</span>
          </div>
        </div>
      </section>

      {/* ════════════════════ SEARCH BAR ════════════════════
          z-index explicite (relative + z-10) pour garantir qu'elle
          reste toujours cliquable, peu importe l'empilement créé
          par le hero (overflow-hidden) juste au-dessus. */}
      <div className="container relative z-10 -mt-24 mb-24">
        <SearchBar variant="hero" />
      </div>

      {/* ════════════════════ DESTINATIONS ════════════════════ */}
      <section className="section pt-0">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Destinations populaires</h2>
            <p className="section__subtitle">Les villes où nos logements font le plein de voyageurs.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-lg bg-[#E8EDF2] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {villes.map((city, i) => (
                <Link
                  key={city.name}
                  to={`/logements?ville=${city.name}`}
                  className="relative aspect-[4/5] rounded-lg overflow-hidden block"
                  style={{ backgroundColor: CITY_COLORS[i % CITY_COLORS.length] }}
                >
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-white font-bold leading-tight">{city.name}</p>
                    <p className="text-[#D0D8E0] text-xs mt-1">{city.count} annonce{city.count > 1 ? 's' : ''}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════ LOGEMENTS À LA UNE ════════════════════ */}
      <section className="section section--brume">
        <div className="container">
          <div className="section__header flex items-end justify-between">
            <div>
              <h2 className="section__title">Logements à la une</h2>
              <p className="section__subtitle">Sélectionnés par notre équipe pour leur qualité et leurs hôtes.</p>
            </div>
            <Link to="/logements" className="text-sm font-semibold text-terrecuite hidden sm:block shrink-0 ml-6">
              Voir tout →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl bg-[#E8EDF2] animate-pulse h-72" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <ListingGrid listings={featured} columns={4} />
          ) : (
            <p className="text-gris text-sm text-center py-10">Aucun logement à la une pour le moment.</p>
          )}
        </div>
      </section>

      {/* ════════════════════ COMMENT ÇA MARCHE ════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Comment ça marche ?</h2>
            <p className="section__subtitle">Simple, rapide, sécurisé — en trois étapes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-14">
            {STEPS.map((step) => (
              <div key={step.num}>
                <div className="w-16 h-16 rounded-full bg-terrecuite/10 flex items-center justify-center text-2xl mb-6">
                  {step.icon}
                </div>
                <p className="text-xs font-bold text-terrecuite mb-2">{step.num}</p>
                <h3 className="text-lg font-bold text-minuit dark:text-white mb-3">{step.title}</h3>
                <p className="text-sm text-charbon dark:text-[#B8C5D6] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ TÉMOIGNAGES ════════════════════ */}
      <section className="section section--brume">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Ce que disent nos utilisateurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white dark:bg-minuit dark:border dark:border-white/10 rounded-lg shadow-card p-8">
                <p className="text-terrecuite text-2xl mb-4 leading-none">❝</p>
                <p className="text-sm text-charbon dark:text-[#B8C5D6] leading-relaxed mb-6">{t.text}</p>
                <p className="text-star text-sm mb-6">★★★★★ <span className="text-gris dark:text-[#8AADC5] ml-1">{t.note}</span></p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                  <div>
                    <p className="text-sm font-bold text-minuit dark:text-white leading-tight">{t.name}</p>
                    <p className="text-xs text-gris dark:text-[#8AADC5] mt-1">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA PROPRIÉTAIRE ════════════════════ */}
      <section className="bg-minuit">
        <div className="container py-24 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-14 border-l-4 border-terrecuite pl-10">
          <div className="max-w-lg">
            <p className="text-xs font-bold text-terrecuite uppercase tracking-wide mb-4">Vous êtes propriétaire ?</p>
            <h2 className="text-white text-3xl leading-tight mb-5">
              Mettez votre logement en location et générez des revenus complémentaires.
            </h2>
            <p className="text-[#8AADC5]">Publication gratuite, accompagnement personnalisé, paiements sécurisés.</p>
          </div>
          <div className="flex flex-col gap-10 shrink-0">
            <Link to="/publier">
              <Button variant="primary" size="lg">Publier une annonce →</Button>
            </Link>
            <div className="flex gap-10">
              {[['12 h', 'Délai de publication'], ['0 %', 'Commission à la mise en ligne'], ['98 %', 'Propriétaires satisfaits']].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-white text-2xl font-bold">{val}</p>
                  <p className="text-[#6A8BAA] text-xs max-w-[110px] mt-1.5 leading-snug">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}