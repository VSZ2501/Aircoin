/**
 * Emplacement : client/src/pages/EditListingPage.jsx
 *
 * Page de modification d'une annonce existante. Réutilise ListingForm
 * (le même formulaire que PublishPage), pré-rempli avec les données
 * actuelles du logement via useListing(id).
 *
 * Route à ajouter dans AppRouter.jsx : "/logements/:id/modifier"
 */

import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useListing } from '../hooks/useListing'
import { modifierLogement, supprimerLogement } from '../services/listings.service'
import ListingForm from '../components/listing/ListingForm'
import Button from '../components/ui/Button'

function listingToFormValues(listing) {
  return {
    nom_logement: listing.title || '',
    type_de_logement: listing.type || 'Appartement',
    description: listing.description || '',
    adresse: listing.address || '',
    ville: listing.city || '',
    code_postal: listing.postalCode || '',
    quartier: listing.district || '',
    surface: listing.surface || '',
    capacite: listing.maxGuests || '',
    chambres: listing.rooms || '',
    salles_de_bain: listing.bathrooms || '',
    etage: listing.floor || '',
    prix: listing.price || '',
    equipement: listing.amenities || [],
    regle: listing.regle || '',
    meuble: !!listing.furnished,
    animaux: !!listing.petsAllowed,
  }
}

export default function EditListingPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { listing, loading } = useListing(id)
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  if (loading) {
    return (
      <div className="container pt-10 pb-24 max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E8EDF2] rounded w-1/3" />
          <div className="h-64 bg-[#E8EDF2] rounded-xl" />
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="container py-24 text-center">
        <p className="text-minuit dark:text-white font-bold mb-3">Logement introuvable</p>
        <Link to="/dashboard">
          <Button variant="primary">Retour au tableau de bord</Button>
        </Link>
      </div>
    )
  }

  const estProprietaire = listing.host?.id === user?.id

  if (!estProprietaire) {
    return (
      <div className="container py-24 text-center">
        <p className="text-minuit dark:text-white font-bold mb-3">Non autorisé</p>
        <p className="text-gris dark:text-[#8AADC5] text-sm mb-8">
          Vous ne pouvez modifier que vos propres annonces.
        </p>
        <Link to="/dashboard">
          <Button variant="primary">Retour au tableau de bord</Button>
        </Link>
      </div>
    )
  }

  async function handleSubmit(formData) {
    await modifierLogement(id, formData)
    navigate(`/logements/${id}`)
  }

  async function handleDelete() {
    const confirme = window.confirm(
      'Voulez-vous vraiment supprimer cette annonce ? Cette action est irréversible.'
    )
    if (!confirme) return

    setDeleteError('')
    setDeleting(true)
    try {
      await supprimerLogement(id)
      navigate('/dashboard')
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Impossible de supprimer cette annonce.')
      setDeleting(false)
    }
  }

  return (
    <div className="container pt-10 pb-24 max-w-3xl">
      <p className="text-sm text-gris dark:text-[#8AADC5] mb-2">Hôte · {user.prenom}</p>
      <h1 className="text-3xl mb-10">Modifier l'annonce</h1>

      <ListingForm
        initialValues={listingToFormValues(listing)}
        submitLabel="Enregistrer les modifications"
        onSubmit={handleSubmit}
        extraActions={
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleDelete}
            disabled={deleting}
            className="border-error text-error hover:bg-error/10"
          >
            {deleting ? 'Suppression…' : "Supprimer l'annonce"}
          </Button>
        }
      />

      {deleteError && (
        <p className="text-sm text-error bg-error/10 rounded-md px-4 py-3 mt-6">
          {deleteError}
        </p>
      )}
    </div>
  )
}