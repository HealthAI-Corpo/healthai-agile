'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

const GENRES = ['Homme', 'Femme', 'Autre'] as const

export default function RegisterPage() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    date_de_naissance: '',
    genre: 'Homme',
    mot_de_passe: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.register(form)
      localStorage.setItem('access_token', res.access_token)
      window.location.href = '/session'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inscription</h1>
      <form onSubmit={submit} className="space-y-4">
        {([
          ['nom', 'Nom', 'text'],
          ['prenom', 'Prénom', 'text'],
          ['email', 'Email', 'email'],
          ['date_de_naissance', 'Date de naissance', 'date'],
          ['mot_de_passe', 'Mot de passe (8 car. min.)', 'password'],
        ] as [keyof typeof form, string, string][]).map(([field, label, type]) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type={type}
              required
              minLength={field === 'mot_de_passe' ? 8 : undefined}
              value={form[field]}
              onChange={set(field)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <select
            value={form.genre}
            onChange={set('genre')}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {GENRES.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Inscription…' : 'Créer mon compte'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Déjà un compte ?{' '}
        <a href="/login" className="text-indigo-600 hover:underline">Se connecter</a>
      </p>
    </div>
  )
}
