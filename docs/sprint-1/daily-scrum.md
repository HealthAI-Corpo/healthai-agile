# Daily Scrum — Sprint 1

**Animé par :** Jordan (SM)
**Durée :** 15 min max — debout, pas de discussion technique

> **Format :** chacun répond aux 3 questions en 2 min max. Les blocages sont notés ici et traités immédiatement après par le SM (pas pendant le daily).

---

## Daily #1 — 21/05/2026

### État du Sprint Backlog

| Issue | Titre | À faire | En cours | Fait | DEV |
|-------|-------|:-------:|:--------:|:----:|-----|
| [#22](https://github.com/HealthAI-Corpo/healthai-agile/issues/22) | chore: Docker Compose + Ollama | X | | | Jordan |
| [#20](https://github.com/HealthAI-Corpo/healthai-agile/issues/20) | chore: init BDD PostgreSQL | X | | | Timéo |
| [#5](https://github.com/HealthAI-Corpo/healthai-agile/issues/5) | US 1 — Auth JWT | X | | | Eliott |
| [#6](https://github.com/HealthAI-Corpo/healthai-agile/issues/6) | US 2 — Profil sportif | X | | | Wessim |
| [#7](https://github.com/HealthAI-Corpo/healthai-agile/issues/7) | US 3 — Génération séance IA | X | | | Timéo + Jordan |
| [#8](https://github.com/HealthAI-Corpo/healthai-agile/issues/8) | US 4 — Matching fuzzy | X | | | Timéo |
| [#12](https://github.com/HealthAI-Corpo/healthai-agile/issues/12) | US 8 — Estimation calories | X | | | Timéo |

### Loric (PO)

- **Ce que j'ai fait :** Sprint planning acté — backlog priorisé, critères d'acceptation validés avec l'équipe.
- **Ce que je vais faire :** Disponible pour questions sur les critères d'acceptation. Valider la DoR de chaque issue avant démarrage.
- **Mes blocages :** Aucun.

### Jordan (SM)

- **Ce que j'ai fait :** Sprint planning animé, répartition définie, ordre de démarrage communiqué.
- **Ce que je vais faire :** Démarrer #22 Docker Compose + Ollama (blocker pour #7). Surveiller les dépendances inter-issues.
- **Mes blocages :** Aucun.

### Eliott

- **Ce que j'ai fait :** Sprint planning — prise en charge US 1 (#5 Auth JWT).
- **Ce que je vais faire :** Démarrer #5 — `POST /auth/register` + `POST /auth/login` + middleware JWT.
- **Mes blocages :** Aucun — #5 est indépendante, peut démarrer immédiatement.

### Timéo

- **Ce que j'ai fait :** Sprint planning — prise en charge #20 BDD, #7, #8, #12.
- **Ce que je vais faire :** Démarrer #20 init BDD PostgreSQL (blocker pour #6 et #7) en parallèle du #22 de Jordan.
- **Mes blocages :** Aucun pour #20. Ne commencera #7 qu'une fois #20 et #22 Done.

### Wessim

- **Ce que j'ai fait :** Sprint planning — prise en charge US 2 (#6 Profil sportif).
- **Ce que je vais faire :** Préparer les modèles Pydantic et la structure des routes profil en attendant que #20 (BDD) soit Done.
- **Mes blocages :** Bloqué sur #6 tant que #20 n'est pas Done.

---

## Blocages identifiés

| Blocage | Qui | Action SM |
|---------|-----|-----------|
| #6 Profil bloqué sur #20 BDD | Wessim | Jordan monitore l'avancement #20, escalade si > 30 min |
| #7 Génération bloqué sur #20 + #22 | Timéo | Jordan traite #22 en priorité absolue |

> Blocages à traiter immédiatement après le daily — ne pas laisser quelqu'un bloqué plus de 30 min sans escalade.

---

## Prochains dailys

| Daily | Date | Notes |
|-------|------|-------|
| #2 | _à planifier_ | |
| #3 | _à planifier_ | |
