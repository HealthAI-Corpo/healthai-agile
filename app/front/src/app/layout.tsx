import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HealthAI Workout',
  description: 'Génération de séances personnalisées par IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <span className="font-semibold text-indigo-600">HealthAI Workout</span>
          <div className="flex gap-4 text-sm">
            <a href="/session" className="hover:text-indigo-600">Séance</a>
            <a href="/profile" className="hover:text-indigo-600">Profil</a>
            <a href="/login" className="hover:text-indigo-600">Connexion</a>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  )
}
