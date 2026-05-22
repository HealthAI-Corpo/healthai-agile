# Sprint Review — Sprint 3 (finale)

**Date :** 22/05/2026  
**Participants :** Loric (PO), Jordan (SM), Eliott, Timéo, Wessim + client (Kevin Niel)  
**Durée :** 30 min max

---

## Sprint Goal

> Débloquer le pipeline IA end-to-end (génération Ollama + fuzzy matching), brancher le frontend sur le backend (auth + séances), et livrer l'estimation calorique.

**Sprint Goal atteint ?** Partiellement ⚠️ — génération IA et estimation calorique livrées, fuzzy matching et frontend séances non terminés.

---

## Fonctionnalités terminées (Done)

- [x] #6 — US 2 : Modifier mon profil sportif — Loric / Eliott
- [x] #7 — US 3 : Générer une séance via l'IA (endpoint + services Ollama) — Timéo / Jordan
- [x] #12 — US 8 : Estimation des calories brûlées via analyse IA — Timéo
- [x] #46 — Intégration auth front ↔ back (login / register) — Eliott

## Fonctionnalités non terminées

| Issue | Raison | Report |
|-------|--------|--------|
| #8 — US 4 Matching fuzzy | Dépendait de #7, pas assez de temps | Post-POC |
| #10 — US 6 Front séances (historique, CRUD) | En cours — Wessim | Post-POC |
| #11 — US 7 Taux couverture | Bloqué sur #8 | Post-POC |
| #24 / #25 / #26 — Pipeline ML RF classifier | Non démarré | Post-POC |

---

## Démo réalisée

Oui — partielle (dev local)

**Scénario jouable :**
1. `POST /api/v1/auth/register` → création compte
2. `POST /api/v1/auth/login` → JWT retourné
3. `PATCH /api/v1/profile` → profil sportif mis à jour
4. `POST /sessions/generate-mock` → séance IA générée via Ollama (profil mocké)
5. `POST /sessions` + `GET /sessions?user_id=X` → enregistrement et historique

**Scénarios non démontrables :**
- Matching fuzzy (#8 non livré)
- Taux couverture (#11 non livré)
- Frontend séances complet (Wessim en cours)

---

## Feedback du client

- _à compléter après la séance_

---

## Bilan projet complet

| Métrique | Sprint 1 | Sprint 2 | Sprint 3 |
|---------|---------|---------|---------|
| Points livrés | 13 SP | 5 SP | ~13 SP |
| Vélocité | 13 | 5 | ~13 |
| Taux couverture fuzzy | — | — | non mesuré (#8 non livré) |
| MAE modèle ML calories | — | — | non mesuré (#18 en cours) |

---

## Justification des choix techniques

> Architecture hybride LLM + ML : le LLM (Ollama / qwen2.5) génère librement la séance pour l'expérience utilisateur, le matching fuzzy lie les exercices au dataset de référence (valeur MSPR), et le modèle ML prédit les calories de manière déterministe et traçable. Le service est découplé en 3 microservices (NestJS auth, FastAPI workout, FastAPI vision) pour faciliter la parallélisation des développements.
