# Sprint Planning — Sprint 1

**Date :** _à compléter_  
**Durée du sprint :** 1 demi-journée  
**Participants :** Loric (PO), Jordan (SM), Eliott, Timéo, Wessim

---

## Sprint Goal

> Mettre en place la structure du projet et livrer les fondations : authentification, profil utilisateur et génération de séance IA avec matching fuzzy.

---

## User Stories sélectionnées

| Issue | US | Story Points | Assigné à |
|-------|----|-------------|-----------|
| [#5](https://github.com/HealthAI-Corpo/healthai-agile/issues/5) | US 1 — Inscription / Connexion | 3 | _à définir_ |
| [#6](https://github.com/HealthAI-Corpo/healthai-agile/issues/6) | US 2 — Profil sportif | 3 | _à définir_ |
| [#7](https://github.com/HealthAI-Corpo/healthai-agile/issues/7) | US 3 — Génération séance IA | 5 | _à définir_ |
| [#8](https://github.com/HealthAI-Corpo/healthai-agile/issues/8) | US 4 — Matching fuzzy | 3 | _à définir_ |

**Total Sprint 1 :** 14 points

---

## Sprint Backlog — Tâches techniques

### US 1 — Auth
- [ ] Initialiser le projet FastAPI + structure de dossiers
- [ ] Modèle `User` (BDD SQLite)
- [ ] `POST /auth/register` (hash bcrypt)
- [ ] `POST /auth/login` (JWT)
- [ ] Tests unitaires auth

### US 2 — Profil
- [ ] Modèle `Profile` avec champs HR et masse grasse (nullable)
- [ ] `POST /profile`, `GET /profile`, `PATCH /profile`
- [ ] Validation Pydantic des champs
- [ ] Tests profil

### US 3 — Génération IA
- [ ] Intégration API Claude (Anthropic SDK)
- [ ] Prompt système : injecter le profil utilisateur
- [ ] Parser la réponse LLM → JSON structuré (Pydantic)
- [ ] `POST /sessions/generate`
- [ ] Gestion d'erreur si API LLM indisponible

### US 4 — Matching fuzzy
- [ ] Charger le dataset de référence des exercices
- [ ] Implémenter le matching RapidFuzz par nom d'exercice
- [ ] Seuil de confiance configurable (`.env`)
- [ ] Calculer et loguer le taux de couverture
- [ ] Tests matching (cas nominal, cas proche, cas inconnu)

### Infra commune
- [ ] `.env.example` avec les clés nécessaires
- [ ] `uv` configuré, `pyproject.toml` complété
- [ ] Pipeline CI GitHub Actions (lint + tests)
- [ ] README initial

---

## Répartition du travail

| Membre | Périmètre |
|--------|-----------|
| _à définir_ | US 1 — Auth |
| _à définir_ | US 2 — Profil |
| _à définir_ | US 3 — Génération IA |
| _à définir_ | US 4 — Matching fuzzy |
| _à définir_ | Infra / CI |
