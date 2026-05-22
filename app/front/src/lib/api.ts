const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'

function token(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }
  const tk = token()
  if (tk) headers['Authorization'] = `Bearer ${tk}`

  const res = await fetch(`${BASE}${path}`, { ...init, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message ?? `Erreur ${res.status}`)
  }

  return res.json() as Promise<T>
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string
  token_type: string
  utilisateur: {
    id_utilisateur: number
    nom: string
    prenom: string
    email: string
    date_de_naissance: string
    genre: string
    type_abonnement: string
    date_inscription: string
  }
}

// ── Profile ───────────────────────────────────────────────────────────────────

export interface ProfileData {
  id_profil?: number
  id_utilisateur?: number
  age?: number
  poids_kg: number
  taille_cm: number
  imc?: number | null
  niveau_activite: string
  objectif_principal: string
  equipement_disponible?: string | null
  hr_rest?: number | null
  hr_max?: number | null
  hr_avg?: number | null
  body_fat_pct?: number | null
  frequence_entrainement?: number | null
  experience_sportive?: string | null
}

// ── API client ────────────────────────────────────────────────────────────────

export const api = {
  login(form: { email: string; mot_de_passe: string }): Promise<AuthResponse> {
    return request('/auth/login', { method: 'POST', body: JSON.stringify(form) })
  },

  register(form: {
    nom: string
    prenom: string
    email: string
    date_de_naissance: string
    genre: string
    mot_de_passe: string
    type_abonnement?: string
  }): Promise<AuthResponse> {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(form) })
  },

  getProfile(): Promise<ProfileData> {
    return request('/profile')
  },

  updateProfile(data: Omit<ProfileData, 'id_profil' | 'id_utilisateur' | 'imc'>): Promise<ProfileData> {
    return request('/profile', { method: 'PATCH', body: JSON.stringify(data) })
  },
}
