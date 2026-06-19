/**
 * Emplacement : client/src/pages/HomePage.jsx
 *
 * Page d'accueil — assemble Hero + SearchBar + ListingGrid + sections
 * statiques (destinations, comment ça marche, témoignages, CTA).
 *
 * Données factices en attendant le branchement de services/listings.service.js
 *
 * ── Note technique sur l'empilement (z-index) ──────────────────
 * Règle simple appliquée partout dans ce fichier : AUCUNE section
 * n'a de z-index custom. Chaque <section> est un bloc indépendant,
 * empilé dans l'ordre naturel du document (pas de overlap entre
 * sections). Le SEUL chevauchement volontaire est la search bar
 * qui remonte sur le hero via un margin-top négatif — et rien
 * d'autre ne porte de z-index, donc aucun conflit possible.
 */

import { Link } from 'react-router-dom'
import SearchBar from '../components/search/SearchBar'
import ListingGrid from '../components/listing/ListingGrid'
import Button from '../components/ui/Button'

// ── Données factices (à remplacer par un appel API plus tard) ──
const FEATURED_LISTINGS = [
  { id: '1', title: 'Appartement lumineux et chaleureux', location: 'Paris 11e', price: 89, note: 4.9, reviewCount: 128, badge: 'Coup de cœur' },
  { id: '2', title: 'Maison avec jardin privatif', location: 'Lyon, Croix-Rousse', price: 120, note: 4.8, reviewCount: 96, badge: 'Famille' },
  { id: '3', title: 'Studio vue mer', location: 'Marseille, 7e', price: 74, note: 4.7, reviewCount: 64, badge: 'Vue mer' },
  { id: '4', title: 'Loft industriel design', location: 'Bordeaux Centre', price: 105, note: 4.9, reviewCount: 152, badge: 'Design' },
]

const CITIES = [
  { name: 'Paris', count: '2 847 annonces', color: '#2A4060' },
  { name: 'Lyon', count: '1 203 annonces', color: '#3A5040' },
  { name: 'Bordeaux', count: '986 annonces', color: '#5A3828' },
  { name: 'Marseille', count: '1 540 annonces', color: '#2A4858' },
  { name: 'Nantes', count: '734 annonces', color: '#304858' },
]

const STEPS = [
  { num: '01', icon: '🔍', title: 'Recherchez', desc: 'Filtrez par ville, budget, équipements. Trouvez l\'annonce parfaite.' },
  { num: '02', icon: '📅', title: 'Réservez', desc: 'Contactez le propriétaire ou réservez instantanément en ligne.' },
  { num: '03', icon: '🏠', title: 'Emménagez', desc: 'Arrivez les clés en main. Notre équipe vous accompagne à chaque étape.' },
]

const TESTIMONIALS = [
  { name: 'Sophie M.', city: 'Paris', note: '5.0', text: 'Interface claire, logement conforme aux photos. Je recommande à 100 % !', color: '#D47A5B' },
  { name: 'Karim B.', city: 'Lyon', note: '4.9', text: 'Réservation en 3 minutes chrono. Le propriétaire était très accueillant.', color: '#2D3142' },
  { name: 'Léa T.', city: 'Nantes', note: '5.0', text: 'Excellent rapport qualité-prix. Le site donne vraiment confiance.', color: '#1A2B4C' },
]

export default function HomePage() {
  return (
    <>
      {/* ════════════════════ HERO ════════════════════
          padding-bottom volontairement grand (pb-40) pour laisser
          la place à la search bar qui va remonter par-dessus. */}
      <section className="bg-minuit overflow-hidden">
        <div className="container relative pt-20 pb-40 lg:pt-28 lg:pb-44">

          {/* Décor silhouette : un <span> simple, premier enfant du
              container, donc rendu en premier puis recouvert par le
              texte qui suit dans le DOM. Pas de z-index nécessaire. */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-0 right-0 bottom-0 w-1/2 bg-[#3A5878]/30"
          />

          <p className="relative text-xs font-semibold text-terrecuite uppercase tracking-wider mb-4">
            Location · Particuliers & professionnels
          </p>
          <h1 className="relative text-white max-w-xl mb-6">
            Trouvez le logement qui vous ressemble.
          </h1>
          <p className="relative text-[#93AECA] text-lg max-w-md mb-10 leading-relaxed">
            Appartements, maisons, studios — partout en France.
          </p>

          <div className="relative flex flex-wrap gap-8 text-sm text-[#8AADC5]">
            <span>🏠 +48 000 annonces</span>
            <span>⭐ Note 4.8/5</span>
            <span>🔒 Sécurisé</span>
          </div>
        </div>
      </section>

      {/* ════════════════════ SEARCH BAR ════════════════════
          Remonte sur le hero grâce au margin négatif. Pas de
          z-index : comme elle vient APRÈS le hero dans le DOM,
          elle s'affiche naturellement au-dessus. */}
      <div className="container -mt-20 mb-16">
        <SearchBar variant="hero" />
      </div>

      {/* ════════════════════ DESTINATIONS ════════════════════ */}
      <section className="section pt-0">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Destinations populaires</h2>
            <p className="section__subtitle">Les villes où nos logements font le plein de voyageurs.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CITIES.map((city) => (
              <Link
                key={city.name}
                to={`/logements?ville=${city.name}`}
                className="relative aspect-[4/5] rounded-lg overflow-hidden block"
                style={{ backgroundColor: city.color }}
              >
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold leading-tight">{city.name}</p>
                  <p className="text-[#D0D8E0] text-xs mt-0.5">{city.count}</p>
                </div>
              </Link>
            ))}
          </div>
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

          <ListingGrid listings={FEATURED_LISTINGS} columns={4} />
        </div>
      </section>

      {/* ════════════════════ COMMENT ÇA MARCHE ════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Comment ça marche ?</h2>
            <p className="section__subtitle">Simple, rapide, sécurisé — en trois étapes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {STEPS.map((step) => (
              <div key={step.num}>
                <div className="w-14 h-14 rounded-full bg-terrecuite/10 flex items-center justify-center text-2xl mb-4">
                  {step.icon}
                </div>
                <p className="text-xs font-bold text-terrecuite mb-1">{step.num}</p>
                <h3 className="text-lg font-bold text-minuit mb-2">{step.title}</h3>
                <p className="text-sm text-charbon leading-relaxed">{step.desc}</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-lg shadow-card p-6">
                <p className="text-terrecuite text-2xl mb-3 leading-none">❝</p>
                <p className="text-sm text-charbon leading-relaxed mb-5">{t.text}</p>
                <p className="text-star text-sm mb-5">
                  ★★★★★ <span className="text-gris ml-1">{t.note}</span>
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                  <div>
                    <p className="text-sm font-bold text-minuit leading-tight">{t.name}</p>
                    <p className="text-xs text-gris mt-0.5">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA PROPRIÉTAIRE ════════════════════
          Section totalement indépendante, AUCUN absolute/z-index
          qui pourrait l'envoyer derrière le Footer qui suit. */}
      <section className="bg-minuit">
        <div className="container py-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 border-l-4 border-terrecuite pl-8">
          <div className="max-w-lg">
            <p className="text-xs font-bold text-terrecuite uppercase tracking-wide mb-3">
              Vous êtes propriétaire ?
            </p>
            <h2 className="text-white text-3xl leading-tight mb-4">
              Mettez votre logement en location et générez des revenus complémentaires.
            </h2>
            <p className="text-[#8AADC5]">
              Publication gratuite, accompagnement personnalisé, paiements sécurisés.
            </p>
          </div>

          <div className="flex flex-col gap-8 shrink-0">
            <Button variant="primary" size="lg">
              Publier une annonce →
            </Button>
            <div className="flex gap-8">
              {[['12 h', 'Délai de publication'], ['0 %', 'Commission à la mise en ligne'], ['98 %', 'Propriétaires satisfaits']].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-white text-2xl font-bold">{val}</p>
                  <p className="text-[#6A8BAA] text-xs max-w-[110px] mt-1 leading-snug">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}