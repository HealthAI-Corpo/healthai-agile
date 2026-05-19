# Sprint Planning — Sprint 1

**Date :** _à compléter le jour de la séance_
**Durée du sprint :** 1 demi-journée
**Participants :** Loric (PO), Jordan (SM), Eliott, Timéo, Wessim

---

## Sprint Goal

> Un utilisateur peut s'inscrire, renseigner son profil sportif et recevoir une séance d'entraînement générée par Ollama, dont les exercices sont validés contre le dataset de référence.

---

## Décision de scope — avant le planning

Le backlog Sprint 1 totalise **22 SP candidats**. Capacité réaliste pour une demi-journée à 4 devs : **16–18 SP**.

| Issue | US | SP | Décision |
|-------|----|----|----------|
| [#20](https://github.com/HealthAI-Corpo/healthai-agile/issues/20) | chore: init BDD | 2 | **IN** — bloquant tout |
| [#22](https://github.com/HealthAI-Corpo/healthai-agile/issues/22) | chore: Docker + Ollama | 2 | **IN** — bloquant US 3 |
| [#5](https://github.com/HealthAI-Corpo/healthai-agile/issues/5) | US 1 — Auth | 3 | **IN** |
| [#6](https://github.com/HealthAI-Corpo/healthai-agile/issues/6) | US 2 — Profil | 3 | **IN** |
| [#7](https://github.com/HealthAI-Corpo/healthai-agile/issues/7) | US 3 — Génération séance IA | 5 | **IN** |
| [#8](https://github.com/HealthAI-Corpo/healthai-agile/issues/8) | US 4 — Matching fuzzy | 5 | **IN** |
| [#23](https://github.com/HealthAI-Corpo/healthai-agile/issues/23) | chore: CI GitHub Actions | 1 | **Stretch goal** — si le temps le permet |
| [#21](https://github.com/HealthAI-Corpo/healthai-agile/issues/21) | chore: init UI | 3 | **Reporté Sprint 2** — API REST + Swagger suffit pour la démo |
| [#24](https://github.com/HealthAI-Corpo/healthai-agile/issues/24) | chore: Feature engineering | 3 | **Reporté Sprint 2** — prérequis de #25 qui est déjà S2 |

**Total Sprint 1 retenu : 20 SP** (+ 1 stretch)

---

## Répartition suggérée

> À confirmer / ajuster en début de séance. Logique : coupler les tâches dépendantes sur la même personne.

| Membre | Issues | SP |
|--------|--------|----|
| Eliott | [#5](https://github.com/HealthAI-Corpo/healthai-agile/issues/5) US 1 — Auth | 3 |
| Timéo | [#20](https://github.com/HealthAI-Corpo/healthai-agile/issues/20) init BDD + [#6](https://github.com/HealthAI-Corpo/healthai-agile/issues/6) US 2 — Profil | 2 + 3 |
| Wessim | [#22](https://github.com/HealthAI-Corpo/healthai-agile/issues/22) Docker/Ollama + [#7](https://github.com/HealthAI-Corpo/healthai-agile/issues/7) US 3 — Génération | 2 + 5 |
| Jordan (SM) | [#8](https://github.com/HealthAI-Corpo/healthai-agile/issues/8) US 4 — Matching fuzzy | 5 |
| Loric (PO) | Revue/validation critères + [#23](https://github.com/HealthAI-Corpo/healthai-agile/issues/23) CI si temps | — |

**Ordre de démarrage :** #20 (BDD) et #22 (Ollama) en **premier** — tout le monde en dépend.

---

## Sprint Backlog — Tâches techniques

### #20 — init BDD _(Timéo — à faire en premier)_
- [ ] Choisir le driver SQLite (SQLAlchemy async ou sqlite3 natif)
- [ ] Créer les tables `users`, `profiles`, `sessions` (`src/db/init_db.py`)
- [ ] Script de seed pour données de test
- [ ] `DATABASE_URL` dans `.env.example`

### #22 — Docker Compose + Ollama _(Wessim — à faire en premier)_
- [ ] Ajouter service `ollama` dans `docker-compose.yml`
- [ ] Pull du modèle au démarrage (`llama3.2:3b` par défaut)
- [ ] Vérifier la connectivité depuis Python
- [ ] `OLLAMA_BASE_URL` et `OLLAMA_MODEL` dans `.env.example`

### US 1 — Auth (#5) _(Eliott)_
- [ ] Structure dossiers FastAPI (`src/`, `tests/`, `src/routers/`, `src/models/`)
- [ ] Modèle `User` lié à la BDD (#20)
- [ ] `POST /auth/register` (hash bcrypt)
- [ ] `POST /auth/login` (JWT — expiration configurable)
- [ ] Tests unitaires auth (nominal + cas d'erreur)

### US 2 — Profil (#6) _(Timéo)_
- [ ] Modèle `Profile` (champs HR et masse grasse nullable)
- [ ] `POST /profile`, `GET /profile`, `PATCH /profile`
- [ ] Validation Pydantic — champs obligatoires vs optionnels
- [ ] Tests profil

### US 3 — Génération IA (#7) _(Wessim)_
- [ ] Intégration Ollama — client Python (librairie libre)
- [ ] Prompt système : injecter le profil utilisateur _(pas de classifier à ce stade — Sprint 2)_
- [ ] Parser la réponse LLM → JSON structuré (Pydantic)
- [ ] `POST /sessions/generate`
- [ ] Fallback explicite si Ollama indisponible (message d'erreur clair, pas de crash)

### US 4 — Matching fuzzy (#8) _(Jordan)_
- [ ] Importer le dataset de référence (`data/exercices_reference.csv`)
- [ ] Implémenter le matching RapidFuzz par nom d'exercice
- [ ] `FUZZY_THRESHOLD` configurable dans `.env` (défaut : 75)
- [ ] Calculer et persister le taux de couverture par session
- [ ] Tests : cas exact / cas proche / cas inconnu

### Infra commune
- [ ] `.env.example` consolidé (toutes les clés des issues ci-dessus)
- [ ] `pyproject.toml` + `uv.lock` à jour
- [ ] README : commandes de démarrage (`docker compose up`, `uv run pytest`)

### Stretch — CI (#23) _(Loric si temps)_
- [ ] `.github/workflows/ci.yml` : lint ruff + pytest sur push/PR
- [ ] Badge CI dans le README

---

## Definition of Ready (DoR) — rappel

Avant de commencer une issue, vérifier :
- [ ] Les critères d'acceptation sont clairs et compris
- [ ] Les dépendances sont disponibles (ex: BDD initialisée avant Profil)
- [ ] L'estimation a été validée en équipe

## Definition of Done (DoD) — rappel

Une issue est Done quand :
- [ ] Code ruff propre (`uv run ruff check .`)
- [ ] Tests unitaires passent (`uv run pytest`)
- [ ] PR liée à l'issue, validée par le PO
- [ ] Fusionnée via Squash and Merge dans `develop`
