/**
 * Emplacement : client/src/pages/HowItWorksPage.jsx
 *
 * Page de contenu statique présentant le fonctionnement du site,
 * en deux parcours distincts : voyageur et hôte (cohérent avec le
 * système de rôles client/hebergeur).
 *
 * Passe par PageWrapper (nav + footer présents).
 */

import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const TRAVELER_STEPS = [
  { num: '01', icon: '🔍', title: 'Recherchez', desc: 'Filtrez par ville, dates, budget et équipements pour trouver le logement qui vous correspond.' },
  { num: '02', icon: '📅', title: 'Réservez', desc: 'Choisissez vos dates, indiquez le nombre de voyageurs et confirmez votre réservation en quelques clics.' },
  { num: '03', icon: '💳', title: 'Payez en sécurité', desc: 'Votre paiement est protégé jusqu\'à votre arrivée. Annulation gratuite selon les conditions de l\'annonce.' },
  { num: '04', icon: '🏠', title: 'Profitez de votre séjour', desc: 'Récupérez les clés et installez-vous. Votre hôte reste disponible pendant tout votre séjour.' },
]

const HOST_STEPS = [
  { num: '01', icon: '📝', title: 'Créez votre compte hôte', desc: 'Depuis votre tableau de bord, passez en un clic de voyageur à hôte — sans rien perdre de votre historique.' },
  { num: '02', icon: '📸', title: 'Publiez votre annonce', desc: 'Décrivez votre logement, ajoutez des photos, fixez votre prix et vos règles. Publication gratuite.' },
  { num: '03', icon: '📬', title: 'Recevez des demandes', desc: 'Les voyageurs réservent directement ou vous contactent. Vous gardez le contrôle sur vos disponibilités.' },
  { num: '04', icon: '💰', title: 'Encaissez vos revenus', desc: 'Le paiement est versé automatiquement après l\'arrivée du voyageur, en toute sécurité.' },
]

const FAQS = [
  { q: 'Air\'Coin prend-il une commission ?', a: 'La publication d\'une annonce est gratuite. Une commission modérée est appliquée uniquement sur les réservations confirmées.' },
  { q: 'Puis-je annuler une réservation ?', a: 'Oui, chaque annonce précise ses conditions d\'annulation. La plupart proposent une annulation gratuite sous 48h.' },
  { q: 'Comment devenir hôte si j\'ai déjà un compte voyageur ?', a: 'Rendez-vous sur votre tableau de bord et cliquez sur "Devenir hôte". Votre historique de réservations est conservé.' },
  { q: 'Mes paiements sont-ils sécurisés ?', a: 'Oui, tous les paiements sont chiffrés et protégés. Les fonds ne sont versés à l\'hôte qu\'après l\'arrivée du voyageur.' },
]

function StepCard({ step }) {
  return (
    <div>
      <div className="w-14 h-14 rounded-full bg-terrecuite/10 flex items-center justify-center text-2xl mb-5">
        {step.icon}
      </div>
      <p className="text-xs font-bold text-terrecuite mb-2">{step.num}</p>
      <h3 className="text-lg font-bold text-minuit mb-3">{step.title}</h3>
      <p className="text-sm text-charbon leading-relaxed">{step.desc}</p>
    </div>
  )
}

export default function HowItWorksPage() {
  return (
    <>
      {/* ════════════════════ HERO ════════════════════ */}
      <section className="bg-minuit">
        <div className="container py-20 text-center">
          <p className="text-xs font-semibold text-terrecuite uppercase tracking-wider mb-4">
            Air'Coin, simplement
          </p>
          <h1 className="text-white max-w-2xl mx-auto mb-5">
            Comment ça marche ?
          </h1>
          <p className="text-[#93AECA] text-lg max-w-xl mx-auto leading-relaxed">
            Que vous cherchiez un logement ou que vous souhaitiez louer le vôtre,
            Air'Coin rend chaque étape simple et sécurisée.
          </p>
        </div>
      </section>

      {/* ════════════════════ PARCOURS VOYAGEUR ════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <p className="text-xs font-bold text-terrecuite uppercase tracking-wide mb-2">
              Pour les voyageurs
            </p>
            <h2 className="section__title">Trouver et réserver un logement</h2>
            <p className="section__subtitle">Quatre étapes pour partir l'esprit tranquille.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {TRAVELER_STEPS.map((step) => (
              <StepCard key={step.num} step={step} />
            ))}
          </div>

          <div className="text-center mt-14">
            <Link to="/logements">
              <Button variant="primary" size="lg">
                Explorer les logements →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════ PARCOURS HÔTE ════════════════════ */}
      <section className="section section--brume">
        <div className="container">
          <div className="section__header">
            <p className="text-xs font-bold text-terrecuite uppercase tracking-wide mb-2">
              Pour les hôtes
            </p>
            <h2 className="section__title">Publier et louer votre logement</h2>
            <p className="section__subtitle">Quatre étapes pour générer des revenus complémentaires.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {HOST_STEPS.map((step) => (
              <StepCard key={step.num} step={step} />
            ))}
          </div>

          <div className="text-center mt-14">
            <Link to="/dashboard">
              <Button variant="primary" size="lg">
                Devenir hôte →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════ FAQ ════════════════════ */}
      <section className="section">
        <div className="container max-w-3xl">
          <div className="section__header text-center">
            <h2 className="section__title">Questions fréquentes</h2>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group bg-white border border-border rounded-xl p-6">
                <summary className="flex items-center justify-between cursor-pointer text-base font-semibold text-minuit list-none">
                  {faq.q}
                  <span className="text-terrecuite text-xl shrink-0 ml-4 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="text-sm text-charbon leading-relaxed mt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}