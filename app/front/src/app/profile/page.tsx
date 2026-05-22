'use client'

import { useEffect, useState } from 'react'
import { api, ProfileData } from '@/lib/api'

const EMPTY: Omit<ProfileData, 'id_profil' | 'id_utilisateur' | 'imc'> = {
  poids_kg: 0,
  taille_cm: 0,
  niveau_activite: '',
  objectif_principal: '',
  equipement_disponible: '',
  hr_rest: null,
  hr_max: null,
  hr_avg: null,
  body_fat_pct: null,
  frequence_entrainement: null,
  experience_sportive: '',
}

export default function ProfilePage() {
  const [form, setForm] = useState(EMPTY)
  const [imc, setImc] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.getProfile()
      .then(p => {
        setForm({
          poids_kg: p.poids_kg,
          taille_cm: p.taille_cm,
          niveau_activite: p.niveau_activite ?? '',
          objectif_principal: p.objectif_principal ?? '',
          equipement_disponible: p.equipement_disponible ?? '',
          hr_rest: p.hr_rest ?? null,
          hr_max: p.hr_max ?? null,
          hr_avg: p.hr_avg ?? null,
          body_fat_pct: p.body_fat_pct ?? null,
          frequence_entrainement: p.frequence_entrainement ?? null,
          experience_sportive: p.experience_sportive ?? '',
        })
        setImc(p.imc ?? null)
      })
      .catch(() => { /* premier login : profil vide, pas d'erreur */ })
      .finally(() => setLoading(false))
  }, [])

  function set(key: keyof typeof form, value: string | number | null) {
    setForm(f => ({ ...f, [key]: value }))
    setSaved(false)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const updated = await api.updateProfile(form)
      setImc(updated.imc ?? null)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-gray-500">Chargement…</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Mon profil sportif</h1>
      {imc && (
        <p className="text-sm text-gray-500 mb-6">IMC calculé : <span className="font-semibold">{imc}</span></p>
      )}

      <form onSubmit={save} className="space-y-8">

        {/* ── Données physiques ── */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Données physiques</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Poids (kg)" required>
              <input
                type="number" step="0.1" min="20" max="300" required
                value={form.poids_kg || ''}
                onChange={e => set('poids_kg', parseFloat(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Taille (cm)" required>
              <input
                type="number" step="1" min="100" max="250" required
                value={form.taille_cm || ''}
                onChange={e => set('taille_cm', parseInt(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="% Masse grasse" optional>
              <input
                type="number" step="0.1" min="1" max="70"
                value={form.body_fat_pct ?? ''}
                onChange={e => set('body_fat_pct', e.target.value ? parseFloat(e.target.value) : null)}
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {/* ── Profil sportif ── */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Profil sportif</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Niveau sportif" required>
              <select required value={form.niveau_activite} onChange={e => set('niveau_activite', e.target.value)} className={inputCls}>
                <option value="">-- Choisir --</option>
                <option value="débutant">Débutant</option>
                <option value="intermédiaire">Intermédiaire</option>
                <option value="avancé">Avancé</option>
              </select>
            </Field>
            <Field label="Objectif" required>
              <select required value={form.objectif_principal} onChange={e => set('objectif_principal', e.target.value)} className={inputCls}>
                <option value="">-- Choisir --</option>
                <option value="endurance">Endurance</option>
                <option value="force">Force</option>
                <option value="perte de poids">Perte de poids</option>
                <option value="bien-être">Bien-être</option>
              </select>
            </Field>
            <Field label="Séances / semaine" optional>
              <input
                type="number" step="1" min="0" max="14"
                value={form.frequence_entrainement ?? ''}
                onChange={e => set('frequence_entrainement', e.target.value ? parseInt(e.target.value) : null)}
                className={inputCls}
              />
            </Field>
            <Field label="Expérience sportive" optional>
              <input
                type="text"
                value={form.experience_sportive ?? ''}
                onChange={e => set('experience_sportive', e.target.value)}
                placeholder="ex : 2 ans de musculation"
                className={inputCls}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Équipement disponible" optional>
              <input
                type="text"
                value={form.equipement_disponible ?? ''}
                onChange={e => set('equipement_disponible', e.target.value)}
                placeholder="ex : Haltères, tapis de course, élastiques"
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {/* ── Données cardiaques ── */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-1">Données cardiaques <span className="normal-case font-normal text-gray-400">(optionnelles — améliorent la prédiction calorique)</span></h2>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <Field label="FC repos (bpm)" optional>
              <input
                type="number" step="1" min="30" max="120"
                value={form.hr_rest ?? ''}
                onChange={e => set('hr_rest', e.target.value ? parseInt(e.target.value) : null)}
                className={inputCls}
              />
            </Field>
            <Field label="FC max (bpm)" optional>
              <input
                type="number" step="1" min="100" max="250"
                value={form.hr_max ?? ''}
                onChange={e => set('hr_max', e.target.value ? parseInt(e.target.value) : null)}
                className={inputCls}
              />
            </Field>
            <Field label="FC moyenne effort (bpm)" optional>
              <input
                type="number" step="1" min="50" max="220"
                value={form.hr_avg ?? ''}
                onChange={e => set('hr_avg', e.target.value ? parseInt(e.target.value) : null)}
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white rounded px-5 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer le profil'}
          </button>
          {saved && <span className="text-green-600 text-sm font-medium">Profil mis à jour</span>}
        </div>
      </form>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const inputCls = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string
  required?: boolean
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {optional && <span className="text-gray-400 ml-1 font-normal text-xs">(optionnel)</span>}
      </label>
      {children}
    </div>
  )
}
