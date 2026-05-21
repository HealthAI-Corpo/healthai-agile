# healthai-front

Interface Next.js 15 pour le module healthai-workout.

## Démarrage

```bash
cp .env.example .env.local
npm install
npm run dev
# → http://localhost:3001
```

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Connexion |
| `/register` | Inscription |
| `/profile` | Profil sportif (disponible avec US 2) |
| `/session` | Génération de séance IA (disponible avec US 3) |

## Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | URL de l'API NestJS |
