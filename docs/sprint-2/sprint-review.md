# Sprint Review — Sprint 2

**Date :** 22/05/2026
**Participants :** Loric (PO), Jordan (SM), Timéo, Wessim + client (Kevin Niel)
**Durée :** 30 min max

---

## Sprint Goal

> Solder les US métier du Sprint 1, poser la persistance MongoDB et livrer les fondations ML (feature engineering + classifier RF).

**Sprint Goal atteint ?** Partiellement ⚠️ — Persistance MongoDB et gestion des séances livrées. Carryovers US métier (#6, #7, #8) et fondations ML (#24, #25, #26) non terminés.

---

## Fonctionnalités terminées (Done)

- [x] #28 — MongoDB Motor async — connexion singleton + fallback gracieux — Loric
- [x] #9 — US 5 : Enregistrer des séances (POST /sessions) — Loric
- [x] #13 — US 11 : Supprimer une séance (DELETE /sessions/{id}) — Loric

## Fonctionnalités non terminées

| Issue | Raison | Report |
|-------|--------|--------|
| #22 — Docker Compose + Ollama | Configuration plus complexe que prévue | Sprint 3 |
| #6 — US 2 Profil sportif | Bloqué sur dépendances infra | Sprint 3 |
| #7 — US 3 Génération séance IA | Bloqué sur #22 non terminé | Sprint 3 |
| #8 — US 4 Matching fuzzy | Bloqué sur #7 | Sprint 3 |
| #12 — US 8 Calories | Modèle lourd à initialiser, bloqué sur #7+#8 | Sprint 3 |
| #24 — Feature engineering | Non démarré (dépendait #7+#8) | Sprint 3 |
| #25 — RF classifier | Non démarré (dépendait #24) | Sprint 3 |
| #26 — CV k-fold + métriques | Non démarré (dépendait #25) | Sprint 3 |

---

## Démo réalisée

Non

**Scénario prévu :**
1. `POST /sessions` → création séance avec exercices et recommendation_id MongoDB
2. `DELETE /sessions/{id}` → suppression propre
3. `GET /health` → `mongodb_connected: true`

---

## Feedback du client

- _à compléter après la séance_

---

## Décisions prises

- #22, #6, #7, #8, #12 reportés Sprint 3 — priorité absolue
- #24, #25, #26 (ML) reportés Sprint 3 — démarrage conditionnel à #7+#8 Done
- Architecture persistance hybride (PostgreSQL + MongoDB) validée

---

## Métriques Sprint 2

| Métrique | Valeur cible | Valeur réelle |
|---------|-------------|--------------|
| Points engagés | 21 SP | 21 SP |
| Points livrés | ≥ 15 SP | 5 SP |
| Vélocité | — | 5 SP |
| MAE modèle ML calories | < 50 kcal | — (non livré) |
| Taux de couverture fuzzy | > 60 % | — (non livré) |
| Tests passants | 100 % | 100 % (périmètre livré) |
