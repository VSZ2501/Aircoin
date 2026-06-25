/**
 * Emplacement : client/src/pages/PublishPage.jsx
 *
 * Page "Publier une annonce" — réservée aux comptes hébergeur.
 * Utilise le formulaire partagé ListingForm (voir
 * components/listing/ListingForm.jsx), réutilisé aussi par
 * EditListingPage pour la modification.
 */

import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { creerLogement } from '../services/listings.service'
import ListingForm, { EMPTY_LISTING_FORM } from '../components/listing/ListingForm'
import Button from '../components/ui/Button'

export default function PublishPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return (
      <div className="container py-24 text-center">
        <p className="text-minuit dark:text-white font-bold mb-3">Connexion requise</p>
        <p className="text-gris dark:text-[#8AADC5] text-sm mb-8">Connectez-vous pour publier une annonce.</p>
        <Link to="/connexion">
          <Button variant="primary">Se connecter</Button>
        </Link>
      </div>
    )
  }

  if (user.role !== 'hebergeur') {
    return (
      <div className="container py-24 text-center max-w-lg mx-auto">
        <p className="text-2xl mb-4">🏠</p>
        <p className="text-minuit dark:text-white font-bold mb-3">Devenez hôte pour publier</p>
        <p className="text-gris dark:text-[#8AADC5] text-sm mb-8">
          Votre compte est actuellement un compte voyageur. Passez en mode hôte
          depuis votre tableau de bord pour publier votre premier logement.
        </p>
        <Link to="/dashboard">
          <Button variant="primary">Aller à mon tableau de bord</Button>
        </Link>
      </div>
    )
  }

  async function handleSubmit(formData) {
    const result = await creerLogement(formData)
    navigate(`/logements/${result.data.id}`)
  }

  return (
    <div className="container pt-10 pb-24 max-w-3xl">
      <p className="text-sm text-gris dark:text-[#8AADC5] mb-2">Hôte · {user.prenom}</p>
      <h1 className="text-3xl mb-10">Publier une annonce</h1>

      <ListingForm
        initialValues={EMPTY_LISTING_FORM}
        submitLabel="Publier mon annonce"
        onSubmit={handleSubmit}
      />
    </div>
  )
}