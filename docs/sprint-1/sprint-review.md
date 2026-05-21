# Sprint Review — Sprint 1

**Date :** 21/05/2026
**Participants :** Loric (PO), Jordan (SM), Eliott, Timéo, Wessim + client (Kevin Niel)
**Durée :** 30 min max

---

## Sprint Goal

> Mettre en place la structure du projet et livrer les fondations : authentification, profil utilisateur et génération de séance IA avec matching fuzzy.

**Sprint Goal atteint ?** Partiellement — Les fondations techniques sont livrées (BDD, Docker, Auth, UI). Les US métier profil, génération IA et matching n'ont pas été terminées.

---

## Fonctionnalités terminées (Done)

- [x] #20 — Init BDD PostgreSQL (schéma + seed) — Timéo
- [x] #22 — Docker Compose + Ollama opérationnel — Jordan
- [x] #35 — Intégration module healthai-vision — Timéo
- [x] #5 — US 1 Inscription / Connexion (JWT) — Eliott
- [x] #21 — Init UI Next.js (login, register, profil, séance) — Loric

## Fonctionnalités non terminées

| Issue | Raison | Report |
|-------|--------|--------|
| #6 — US 2 Profil sportif | Sprint trop court, dépendait de #20 | Sprint 2 |
| #7 — US 3 Génération séance IA | Bloqué sur #20 + #22 non terminés à temps | Sprint 2 |
| #8 — US 4 Matching fuzzy | Dépend de #7 | Sprint 2 |
| #12 — US 8 Calories | Tiré en avance, non commencé | Sprint 2 |
| #23 — CI GitHub Actions | Stretch goal non atteint | Sprint 2 |

---

## Démo réalisée

Oui — via Swagger UI + interface Next.js

**Scénario de démo :**

1. `POST /api/v1/auth/register` → création compte `demo@healthai.local`
2. `POST /api/v1/auth/login` → récupération JWT
3. Interface Next.js → http://localhost:3001 (login + register fonctionnels)
4. `GET /api/v1/auth/me` → validation token JWT
5. `docker compose up` → stack complète (Postgres, Mongo, services back, front)

---

## Feedback du client

- _à compléter après la séance_

---

## Décisions prises

- #6, #7, #8 reportés en Sprint 2 — priorité absolue
- Architecture microservices validée (NestJS auth + FastAPI workout/vision)
- Module vision intégré en tant que fondation commune du POC global

---

## Métriques Sprint 1

| Métrique | Valeur cible | Valeur réelle |
|---------|-------------|--------------|
| Points engagés | 20 | 23 (ajouts en cours de sprint) |
| Points livrés | ≥ 16 | 10 SP |
| Vélocité | — | 10 SP |
| Taux de couverture fuzzy (US 4) | > 60 % | — (non livré) |
| Tests passants | 100 % | 100 % (périmètre livré) |
