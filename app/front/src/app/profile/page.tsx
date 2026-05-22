'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.getProfile()
      .then(setProfile)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    setSaved(false)
    try {
      const updated = await api.updateProfile(profile)
      setProfile(updated)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-gray-500">Chargement…</p>

  if (error) return (
    <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      <p className="font-medium">API profil non disponible</p>
      <p className="mt-1 text-amber-700">{error}</p>
      <p className="mt-2 text-amber-600">L&apos;endpoint <code>/api/v1/profile</code> sera disponible avec US 2 (Wessim).</p>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mon profil sportif</h1>
      <form onSubmit={save} className="space-y-4">
        {Object.entries(profile ?? {}).map(([key, val]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{key}</label>
            <input
              type="text"
              value={String(val ?? '')}
              onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {saved && <span className="text-green-600 text-sm">Profil mis à jour</span>}
        </div>
      </form>
    </div>
  )
}
