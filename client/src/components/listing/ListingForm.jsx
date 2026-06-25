/**
 * Emplacement : client/src/components/listing/ListingForm.jsx
 *
 * Formulaire de logement, partagé entre PublishPage (création) et
 * EditListingPage (modification). Reçoit des valeurs initiales et
 * une fonction onSubmit, sans rien savoir lui-même de l'API.
 *
 * Usage :
 *   <ListingForm
 *     initialValues={EMPTY_LISTING_FORM}
 *     submitLabel="Publier mon annonce"
 *     onSubmit={async (formData) => { ... }}
 *   />
 */

import { useState } from 'react'
import Button from '../ui/Button'

const TYPES_LOGEMENT = ['Appartement', 'Maison', 'Villa', 'Studio', 'Chalet', 'Loft', 'Autre']

const EQUIPEMENTS_DISPONIBLES = [
  'WiFi haut débit', 'Chauffage central', 'Climatisation', 'Cuisine équipée',
  'Machine à laver', 'TV connectée', 'Parking privé', 'Ascenseur',
  'Animaux acceptés', 'Local à vélos', 'Self check-in', 'Espace de travail',
]

export const EMPTY_LISTING_FORM = {
  nom_logement: '',
  type_de_logement: 'Appartement',
  description: '',
  adresse: '',
  ville: '',
  code_postal: '',
  quartier: '',
  surface: '',
  capacite: '',
  chambres: '',
  salles_de_bain: '',
  etage: '',
  prix: '',
  equipement: [],
  regle: '',
  meuble: false,
  animaux: false,
}

export default function ListingForm({ initialValues, submitLabel, onSubmit, extraActions }) {
  const [form, setForm]       = useState({ ...EMPTY_LISTING_FORM, ...initialValues })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleEquipement(item) {
    setForm((prev) => ({
      ...prev,
      equipement: prev.equipement.includes(item)
        ? prev.equipement.filter((e) => e !== item)
        : [...prev.equipement, item],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.nom_logement || !form.adresse || !form.ville || !form.code_postal || !form.prix) {
      setError('Merci de remplir tous les champs obligatoires.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        ...form,
        surface: Number(form.surface),
        capacite: Number(form.capacite),
        chambres: Number(form.chambres) || 0,
        salles_de_bain: Number(form.salles_de_bain) || 0,
        etage: Number(form.etage) || 0,
        prix: Number(form.prix),
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue, veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">

      <section>
        <h2 className="text-xl font-bold text-minuit dark:text-white mb-6">Informations générales</h2>
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-minuit dark:text-white mb-2">
              Nom de l'annonce *
            </label>
            <input
              type="text"
              required
              value={form.nom_logement}
              onChange={(e) => updateField('nom_logement', e.target.value)}
              placeholder="Appartement lumineux avec balcon"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-minuit dark:text-white mb-2">
              Type de logement *
            </label>
            <select
              value={form.type_de_logement}
              onChange={(e) => updateField('type_de_logement', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
            >
              {TYPES_LOGEMENT.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-minuit dark:text-white mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Décrivez votre logement, son ambiance, son quartier..."
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite resize-none"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border pt-10">
        <h2 className="text-xl font-bold text-minuit dark:text-white mb-6">Localisation</h2>
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-minuit dark:text-white mb-2">
              Adresse *
            </label>
            <input
              type="text"
              required
              value={form.adresse}
              onChange={(e) => updateField('adresse', e.target.value)}
              placeholder="12 rue de Rivoli"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-minuit dark:text-white mb-2">
                Code postal *
              </label>
              <input
                type="text"
                required
                value={form.code_postal}
                onChange={(e) => updateField('code_postal', e.target.value)}
                placeholder="75001"
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-minuit dark:text-white mb-2">
                Ville *
              </label>
              <input
                type="text"
                required
                value={form.ville}
                onChange={(e) => updateField('ville', e.target.value)}
                placeholder="Paris"
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-minuit dark:text-white mb-2">
              Quartier <span className="text-gris dark:text-[#8AADC5] font-normal">(optionnel)</span>
            </label>
            <input
              type="text"
              value={form.quartier}
              onChange={(e) => updateField('quartier', e.target.value)}
              placeholder="Paris 10e"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border pt-10">
        <h2 className="text-xl font-bold text-minuit dark:text-white mb-6">Caractéristiques</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ['surface', 'Surface (m²) *', true],
            ['capacite', 'Capacité (pers.) *', true],
            ['chambres', 'Chambres', false],
            ['salles_de_bain', 'Salles de bain', false],
            ['etage', 'Étage', false],
          ].map(([field, label, required]) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-minuit dark:text-white mb-2">
                {label}
              </label>
              <input
                type="number"
                min={0}
                required={required}
                value={form[field]}
                onChange={(e) => updateField(field, e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-6 mt-6">
          <label className="flex items-center gap-2 text-sm text-charbon dark:text-[#B8C5D6] cursor-pointer">
            <input
              type="checkbox"
              checked={form.meuble}
              onChange={(e) => updateField('meuble', e.target.checked)}
              className="w-4 h-4 accent-terrecuite"
            />
            Logement meublé
          </label>
          <label className="flex items-center gap-2 text-sm text-charbon dark:text-[#B8C5D6] cursor-pointer">
            <input
              type="checkbox"
              checked={form.animaux}
              onChange={(e) => updateField('animaux', e.target.checked)}
              className="w-4 h-4 accent-terrecuite"
            />
            Animaux acceptés
          </label>
        </div>
      </section>

      <section className="border-t border-border pt-10">
        <h2 className="text-xl font-bold text-minuit dark:text-white mb-6">Équipements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {EQUIPEMENTS_DISPONIBLES.map((item) => {
            const isActive = form.equipement.includes(item)
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleEquipement(item)}
                className={
                  isActive
                    ? 'px-4 py-3 rounded-lg border-2 border-terrecuite bg-terrecuite/10 text-sm font-semibold text-minuit dark:text-white text-left'
                    : 'px-4 py-3 rounded-lg border border-border text-sm text-charbon dark:text-[#B8C5D6] text-left'
                }
              >
                {item}
              </button>
            )
          })}
        </div>
      </section>

      <section className="border-t border-border pt-10">
        <h2 className="text-xl font-bold text-minuit dark:text-white mb-6">Règlement intérieur</h2>
        <textarea
          rows={3}
          value={form.regle}
          onChange={(e) => updateField('regle', e.target.value)}
          placeholder="Non-fumeur, pas de fêtes, horaires de check-in..."
          className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite resize-none"
        />
      </section>

      <section className="border-t border-border pt-10">
        <h2 className="text-xl font-bold text-minuit dark:text-white mb-6">Tarification</h2>
        <div className="max-w-xs">
          <label className="block text-sm font-semibold text-minuit dark:text-white mb-2">
            Prix par nuit (€) *
          </label>
          <input
            type="number"
            min={0}
            required
            value={form.prix}
            onChange={(e) => updateField('prix', e.target.value)}
            placeholder="89"
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-terrecuite"
          />
        </div>
      </section>

      {error && (
        <p className="text-sm text-error bg-error/10 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      <div className="border-t border-border pt-10 flex items-center gap-4">
        <Button type="submit" variant="primary" size="lg" disabled={loading}>
          {loading ? 'Enregistrement…' : submitLabel}
        </Button>
        {extraActions}
      </div>
    </form>
  )
}