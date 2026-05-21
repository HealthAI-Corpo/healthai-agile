# Sprint Planning — Sprint 1

**Date :** _à compléter le jour de la séance_
**Durée du sprint :** 1 demi-journée
**Participants :** Loric (PO), Jordan (SM), Eliott, Timéo, Wessim

---

## Sprint Goal

> Un utilisateur peut s'inscrire, renseigner son profil sportif et recevoir une séance d'entraînement générée par Ollama, dont les exercices sont validés contre le référentiel PostgreSQL.

---

## Décision de scope

Capacité estimée : **16–18 SP** (4 devs × demi-journée).

| Issue | Titre | SP | Décision |
|-------|-------|----|----------|
| [#22](https://github.com/HealthAI-Corpo/healthai-agile/issues/22) | chore: Docker Compose + Ollama | 2 | **IN — BLOCKER** |
| [#20](https://github.com/HealthAI-Corpo/healthai-agile/issues/20) | chore: init BDD PostgreSQL | 2 | **IN — BLOCKER** |
| [#5](https://github.com/HealthAI-Corpo/healthai-agile/issues/5) | US 1 — Auth JWT | 3 | **IN** |
| [#6](https://github.com/HealthAI-Corpo/healthai-agile/issues/6) | US 2 — Profil sportif | 3 | **IN** |
| [#7](https://github.com/HealthAI-Corpo/healthai-agile/issues/7) | US 3 — Génération séance IA (Ollama) | 5 | **IN** |
| [#8](https://github.com/HealthAI-Corpo/healthai-agile/issues/8) | US 4 — Matching fuzzy exercices | 3 | **IN** |
| [#23](https://github.com/HealthAI-Corpo/healthai-agile/issues/23) | chore: CI GitHub Actions | 1 | **Stretch** |
| [#21](https://github.com/HealthAI-Corpo/healthai-agile/issues/21) | chore: init Next (UI) | 3 | **Reporté Sprint 2** — Swagger suffit pour la démo |
| [#24](https://github.com/HealthAI-Corpo/healthai-agile/issues/24) | chore: Feature engineering | 3 | **Reporté Sprint 2** — prérequis de #25 (S2) |

**Total Sprint 1 retenu : 18 SP** (+ 1 SP stretch)

---

## Ordre de démarrage

**#22 (Ollama) et #20 (BDD) à lancer en premier** — tout le monde en dépend.

```
#22 ──────────────────────────────► #7 (génération Ollama)
#20 ──────────────────────────────► #6 (profil) ──► #7
                                    #5 (auth) ──────► #7
#8 (fuzzy) ── indépendant, peut démarrer immédiatement
```

Ne pas commencer #6 ou #7 avant que #20 soit Done.
Ne pas commencer #7 avant que #22 soit Done.

---

## Répartition

_À définir lors de la séance par le SM — respecter l'ordre de démarrage ci-dessus._

---

## Sprint Backlog — Tâches techniques

### #22 — Docker Compose + Ollama _(Wessim — PREMIÈRE TÂCHE)_
- [ ] Ajouter service `ollama` dans `docker-compose.yml` (image `ollama/ollama`)
- [ ] Volume `ollama_storage` pour persistance des modèles entre redémarrages
- [ ] Script d'init : pull automatique `llama3.2:3b` au premier démarrage
- [ ] Vérifier connectivité Python → `http://ollama:11434` depuis le service workout
- [ ] **Préparer `tests/fixtures/session_mock.json`** (fallback si Ollama lent en démo — risque élevé)
- [ ] `OLLAMA_BASE_URL` + `OLLAMA_MODEL` dans `.env.example`

### #20 — Init BDD PostgreSQL _(Timéo — PREMIÈRE TÂCHE)_
- [ ] Tables `users`, `profiles`, `sessions` dans `src/db/models.py` (SQLAlchemy async)
- [ ] Connexion asyncpg via `DATABASE_URL`
- [ ] Script de seed : 3 profils de test (débutant / intermédiaire / avancé)
- [ ] `DATABASE_URL` dans `.env.example`

### #5 — US 1 : Auth JWT _(Eliott)_
- [ ] `POST /auth/register` — hash bcrypt, retour JWT + expiration
- [ ] `POST /auth/login` — vérification hash, retour JWT
- [ ] Middleware `Depends(get_current_user)` sur routes protégées
- [ ] Tests : inscription nominale, login mot de passe incorrect, token expiré

### #6 — US 2 : Profil sportif _(Timéo, après #20 Done)_
- [ ] Modèle `Profile` : `niveau` (1–3), `objectif` (enum), `poids`, `bpm_repos`, `limitations` (list), `equipements` (list)
- [ ] `POST /profile`, `GET /profile`, `PATCH /profile`
- [ ] Validation Pydantic stricte (niveau 1–3, objectif enum valide, poids > 0)
- [ ] Tests : création profil, modification partielle, profil inexistant (404)

### #7 — US 3 : Génération séance IA _(Wessim, après #22 + #20 Done)_
- [ ] Client Ollama async (HTTPX) avec timeout explicite 15 s
- [ ] Prompt système : injecter `niveau`, `objectif`, `limitations`, `equipements`
- [ ] Parser la réponse LLM → schéma Pydantic `SessionGeneree` (exercices, séries, reps, repos)
- [ ] **Fallback** : si Ollama timeout → servir `session_mock.json` avec flag `"source": "fallback"`
- [ ] `POST /sessions/generate`
- [ ] Tests : génération nominale (mock Ollama), fallback activé (Ollama simulé KO)

### #8 — US 4 : Matching fuzzy exercices _(Jordan)_
- [ ] Charger la table `exercice` depuis PostgreSQL (873 entrées)
- [ ] Matching RapidFuzz : nom exercice LLM → nom `exercice` (seuil configurable)
- [ ] `FUZZY_THRESHOLD` dans `.env` (défaut : 75)
- [ ] Calculer et retourner `taux_couverture` dans la réponse de `POST /sessions/generate`
- [ ] Tests : match exact (score 100), match proche (>75), inconnu (<75)

---

## Infra commune (tous)

- [ ] `.env.example` consolidé avec toutes les clés du Sprint 1
- [ ] `pyproject.toml` + `uv.lock` à jour
- [ ] README mis à jour : commandes de démarrage (`docker compose up`, `uv run pytest`)

---

## Definition of Ready (DoR) — rappel

Avant de commencer une issue :
- [ ] Critères d'acceptation clairs et compris par le développeur
- [ ] Dépendances disponibles (ex : BDD initialisée avant Profil)
- [ ] Estimation validée en équipe

## Definition of Done (DoD) — rappel

Une issue est Done quand :
- [ ] `uv run ruff check .` passe sans erreur
- [ ] `uv run pytest` passe (cas nominal + cas d'erreur)
- [ ] PR liée à l'issue, validée par le PO
- [ ] Fusionnée via Squash and Merge dans `develop`
