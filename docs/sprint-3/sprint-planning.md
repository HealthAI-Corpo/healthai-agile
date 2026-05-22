# Sprint Planning — Sprint 3

**Date :** 22/05/2026  
**Durée du sprint :** 1 demi-journée  
**Participants :** Loric (PO), Jordan (SM + Dev), Timéo, Wessim, Eliott

---

## Sprint Goal

> Débloquer le pipeline IA end-to-end (génération Ollama + fuzzy matching), brancher le frontend sur le backend (auth + séances), et livrer l'estimation calorique.

---

## Prérequis Sprint 3

- [x] #22 — Docker Compose + Ollama — résolu (PR #43)
- [x] #28 — MongoDB Motor opérationnel
- [x] #9 — `POST /sessions` fonctionnel
- [x] #13 — `DELETE /sessions/{id}` fonctionnel

---

## Scope retenu

| Issue | Titre | Assigné | Statut | Dépend de |
|-------|-------|---------|--------|-----------|
| [#7](https://github.com/HealthAI-Corpo/healthai-agile/issues/7) | US 3 — Générer une séance via l'IA | Timéo / Jordan | À faire | #22 ✅ |
| [#8](https://github.com/HealthAI-Corpo/healthai-agile/issues/8) | US 4 — Matching fuzzy exercices | Timéo | À faire | #7 |
| [#12](https://github.com/HealthAI-Corpo/healthai-agile/issues/12) | US 8 — Estimation calories brûlées | Timéo | À faire | #7 + #8 |
| [#10](https://github.com/HealthAI-Corpo/healthai-agile/issues/10) | Front — Page Séance + CRUD + intégration API | Wessim | À faire | #9 ✅, #13 ✅ |
| [#46](https://github.com/HealthAI-Corpo/healthai-agile/issues/46) | Front — Intégration auth (login / register) | Eliott | À faire | #5 ✅ |

---

## Chaîne de dépendances

```
#7 (génération IA) ──────────────────────────────► #8 (fuzzy matching) ──► #12 (calories)
Front Page Séance ──► CRUD afficher ──► CRUD enregistrer/modifier
                  └──► CRUD supprimer
                  └──► Intégration front ↔ back Séance (Wessim)
Intégration auth (Eliott) ── indépendant
```

---

## Sprint Backlog — Tâches techniques

### [#7] — US 3 : Générer une séance via l'IA _(Timéo / Jordan)_
- [ ] `POST /sessions/generate` — appel Ollama avec le profil utilisateur (poids, âge, objectif, contraintes)
- [ ] Prompt structuré : exercices, séries, répétitions, intensité
- [ ] Retourner la séance générée au format JSON
- [ ] Tests : génération nominale, profil invalide (400), Ollama injoignable (503 gracieux)

### [#8] — US 4 : Matching fuzzy exercices _(Timéo, après #7 Done)_
- [ ] Charger le référentiel d'exercices depuis PostgreSQL
- [ ] Fuzzy-matching (RapidFuzz) des exercices LLM → référentiel (seuil configurable)
- [ ] Stocker le taux de couverture par séance dans MongoDB (`session_metrics`)
- [ ] Tests : exercice connu (match > seuil), exercice inconnu (non matché), couverture calculée

### [#12] — US 8 : Estimation des calories brûlées _(Timéo, après #7 + #8 Done)_
- [ ] Modèle calories (`models/calories_v1.joblib`) — features : poids, âge, bpm_moyen, durée, type, intensité
- [ ] Intégration dans `POST /sessions/generate` : calcul automatique à l'enregistrement
- [ ] `GET /sessions/{id}/calories` — retourne `calories_estimees` + `confidence_range`
- [ ] Rapport `docs/ml_report_calories.md` : MAE, R², feature importance
- [ ] Tests : estimation cohérente pour profils connus

### [#10] — Front Séances : page + CRUD + intégration API _(Wessim)_
- [ ] Page `/seances` — liste avec composant `SeanceCard` (date, type, exercices, calories si dispo)
- [ ] Page `/seances/[id]` — détail complet de la séance
- [ ] Formulaire enregistrement d'une séance (appel `POST /sessions`)
- [ ] Bouton suppression avec confirmation (appel `DELETE /sessions/{id}`)
- [ ] Hooks/services API : `getSessions()`, `getSession(id)`, `createSession()`, `deleteSession(id)`
- [ ] URL back configurable via `.env.local`, JWT transmis dans les requêtes
- [ ] Gestion des états chargement / erreur / vide

### [#46] — Intégration auth front ↔ back _(Eliott)_
- [ ] Page `/login` branchée sur `POST /auth/login` — stockage JWT
- [ ] Page `/register` branchée sur `POST /auth/register`
- [ ] Route guard — rediriger vers `/login` si non authentifié
- [ ] Déconnexion (suppression token + redirection)

---

## Critères de succès POC — validation finale

| Critère | Seuil | Issue |
|---------|-------|-------|
| Taux de couverture fuzzy | > 60 % | #8 |
| MAE modèle calories | < 50 kcal | #12 |
| Latence génération séance Ollama | < 10 s | #7 |
| Contraintes utilisateur respectées | 100 % des séances | #7 |
| Scénario démo complet sans erreur | — | intégration |

---

## Definition of Done — rappel

- [ ] Code `ruff` propre (`uv run ruff check .`)
- [ ] Tests unitaires passent (`uv run pytest`) — cas nominal + cas d'erreur
- [ ] PR liée à l'issue, validée par le PO
- [ ] Fusionnée via Squash and Merge dans `develop`
- [ ] `docs/ml_report_calories.md` créé et versionné avant fusion de #12
