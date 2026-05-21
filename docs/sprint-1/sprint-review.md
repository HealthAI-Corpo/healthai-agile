# Sprint Review — Sprint 1

**Date :** _à compléter_
**Participants :** Loric (PO), Jordan (SM), Eliott, Timéo, Wessim + client (Kevin Niel)
**Durée :** 30 min max

---

## Sprint Goal

> Un utilisateur peut s'inscrire, renseigner son profil sportif et recevoir une séance d'entraînement générée par Ollama, dont les exercices sont validés contre le dataset de référence.

**Sprint Goal atteint ?** Oui / Non / Partiellement

---

## Fonctionnalités terminées (Done)

- [ ] #20 — init BDD (schéma `users/profiles/sessions`)
- [ ] #22 — Docker Compose + Ollama opérationnel
- [ ] #5 — US 1 Inscription / Connexion
- [ ] #6 — US 2 Profil sportif
- [ ] #7 — US 3 Génération séance IA (Ollama)
- [ ] #8 — US 4 Matching fuzzy
- [ ] #23 — CI GitHub Actions _(stretch goal)_

## Fonctionnalités non terminées

_À compléter — préciser la raison et si report Sprint 2_

| Issue | Raison | Report |
|-------|--------|--------|
| | | |

---

## Démo réalisée

Oui / Non

**Scénario de démo préparé** _(à jouer devant le client) :_

1. `POST /auth/register` → création compte `demo@healthai.local`
2. `POST /auth/login` → récupération JWT
3. `POST /profile` → profil : niveau intermédiaire, objectif perte de poids, équipement haltères
4. `POST /sessions/generate` → Ollama génère une séance JSON structurée
5. Afficher le matching fuzzy : exercices liés au dataset + taux de couverture
6. `GET /metrics/matching-coverage` → taux de couverture global (cible > 60 %)

> **Fallback démo si Ollama lent :** montrer la réponse JSON d'une génération précédente.

---

## Feedback du client

- _à compléter_

---

## Décisions prises

- _à compléter_

---

## Métriques Sprint 1

| Métrique | Valeur cible | Valeur réelle |
|---------|-------------|--------------|
| Points engagés | 20 | _à compléter_ |
| Points livrés | ≥ 16 | _à compléter_ |
| Vélocité (points livrés) | — | _à compléter_ |
| Taux de couverture fuzzy (US 4) | > 60 % | _à compléter_ % |
| Tests passants | 100 % | _à compléter_ |
