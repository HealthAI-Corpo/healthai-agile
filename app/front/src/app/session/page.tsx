'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export default function SessionPage() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await api.generateSession({})
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de génération')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Générer une séance</h1>
      <p className="text-gray-500 text-sm mb-6">
        La séance est générée par Ollama et validée contre le référentiel d&apos;exercices.
      </p>

      <button
        onClick={generate}
        disabled={loading}
        className="bg-indigo-600 text-white rounded px-5 py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Génération en cours…' : 'Générer ma séance'}
      </button>

      {error && (
        <div className="mt-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">API non disponible</p>
          <p className="mt-1 text-amber-700">{error}</p>
          <p className="mt-2 text-amber-600">
            L&apos;endpoint <code>/api/v1/sessions/generate</code> sera disponible avec US 3 (Timéo).
          </p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Résultat</h2>
          <pre className="bg-gray-900 text-green-300 rounded p-4 text-xs overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
