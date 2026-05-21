# Product Backlog — healthai-workout

> Source de vérité PO. Les sprints sont indicatifs — le SM a le dernier mot sur le scope retenu en planning.

## User Stories & Chores

| ID | Type | Titre | But | Priorité | SP | Sprint |
|:---|:-----|:------|:----|:---------|:---|:-------|
| [#22](https://github.com/HealthAI-Corpo/healthai-agile/issues/22) | chore | Docker Compose + Ollama | Rendre Ollama joignable depuis le service | P1 | 2 | 1 |
| [#20](https://github.com/HealthAI-Corpo/healthai-agile/issues/20) | chore | Init BDD PostgreSQL | Tables users / profiles / sessions + seed | P1 | 2 | 1 |
| [#5](https://github.com/HealthAI-Corpo/healthai-agile/issues/5) | US 1 | M'inscrire et me connecter | Accéder à l'application de façon sécurisée | P1 | 3 | 1 |
| [#6](https://github.com/HealthAI-Corpo/healthai-agile/issues/6) | US 2 | Modifier mon profil sportif | Personnaliser les recommandations IA | P1 | 3 | 1 |
| [#7](https://github.com/HealthAI-Corpo/healthai-agile/issues/7) | US 3 | Générer une séance via l'IA | Obtenir un programme personnalisé par Ollama | P1 | 5 | 1 |
| [#8](https://github.com/HealthAI-Corpo/healthai-agile/issues/8) | US 4 | Matching fuzzy exercices → référentiel | Lier les exercices LLM au dataset PostgreSQL | P1 | 3 | 1 |
| [#23](https://github.com/HealthAI-Corpo/healthai-agile/issues/23) | chore | CI GitHub Actions (lint + tests) | Garantir la qualité à chaque PR | P2 | 1 | 1 (stretch) |
| [#21](https://github.com/HealthAI-Corpo/healthai-agile/issues/21) | chore | Init Next (UI minimale) | Interface utilisateur pour la démo | P2 | 3 | 2 |
| [#24](https://github.com/HealthAI-Corpo/healthai-agile/issues/24) | chore | Feature engineering dataset | Préparer les données pour le classifier RF | P1 | 3 | 2 |
| [#25](https://github.com/HealthAI-Corpo/healthai-agile/issues/25) | US ML | RF classifier muscles/intensité + prompt | Alimenter le prompt Ollama avec les prédictions | P1 | 5 | 2 |
| [#26](https://github.com/HealthAI-Corpo/healthai-agile/issues/26) | US CV | Cross-validation k-fold + métriques P/R/F1 | Valider le classifier (critère RNCP) | P1 | 5 | 2 |
| [#28](https://github.com/HealthAI-Corpo/healthai-agile/issues/28) | chore | MongoDB Motor — persistance recommendations | Tracer l'historique IA en NoSQL | P1 | 2 | 2 |
| [#9](https://github.com/HealthAI-Corpo/healthai-agile/issues/9) | US 5 | Enregistrer des séances d'entraînement | Constituer un historique personnel | P2 | 2 | 2 |
| [#10](https://github.com/HealthAI-Corpo/healthai-agile/issues/10) | US 6 | Consulter mon historique de séances | Suivre ma progression | P2 | 2 | 2 (stretch) → 3 |
| [#18](https://github.com/HealthAI-Corpo/healthai-agile/issues/18) | US ML-cal | Modèle prédiction calories (dataset 2) | Estimer la dépense énergétique | P1 | 5 | 3 |
| [#12](https://github.com/HealthAI-Corpo/healthai-agile/issues/12) | US 8 | Estimation des calories brûlées | Afficher l'estimation sur chaque séance | P1 | 2 | 3 |
| [#13](https://github.com/HealthAI-Corpo/healthai-agile/issues/13) | US 11 | Supprimer une séance enregistrée | Garder un historique propre | P2 | 1 | 3 |
| [#11](https://github.com/HealthAI-Corpo/healthai-agile/issues/11) | US 7 | Voir le taux de couverture fuzzy | Évaluer la qualité du matching (métrique PO) | P3 | 2 | 3 |
| [#14](https://github.com/HealthAI-Corpo/healthai-agile/issues/14) | US 9 | Simulation IA (modifier une séance) | Voir l'impact avant validation | P2 | 5 | 3 (stretch) |
| [#17](https://github.com/HealthAI-Corpo/healthai-agile/issues/17) | US 10 | Supervision IA de l'historique | Coaching bienveillant sur les tendances | P3 | 5 | Post-POC |
| [#15](https://github.com/HealthAI-Corpo/healthai-agile/issues/15) | US 13 | Évolution BPM / calories dans le temps | Analyser la progression sur la durée | P2 | 3 | Post-POC |
| [#16](https://github.com/HealthAI-Corpo/healthai-agile/issues/16) | US 12 | Statistiques globales de performances | Visualiser ses résultats | P3 | 2 | Post-POC |

---

## Récapitulatif par sprint

| Sprint | Issues | SP total | SP stretch |
|--------|--------|---------|------------|
| Sprint 1 | #22, #20, #5, #6, #7, #8 | 18 | +1 (#23) |
| Sprint 2 | #24, #25, #26, #28, #9 | 17 | +2 (#10) |
| Sprint 3 | #18, #12, #10, #13, #11 | 12 | +5 (#14) |
| Post-POC | #17, #15, #16 | — | — |

---

## Critères de succès POC

| Critère | Seuil | Issue |
|---------|-------|-------|
| Taux de couverture fuzzy | > 60 % | #11 |
| F1-score macro classifier muscles/intensité | > 0.65 | #26 |
| MAE modèle calories | < 50 kcal | #18 |
| Latence génération séance Ollama | < 10 s | #7 |
| Contraintes utilisateur respectées | 100 % des séances | #7 + #25 |

---

## Definition of Done (DoD)

Une US est Done quand :
- [ ] Code `ruff` propre (`uv run ruff check .`)
- [ ] Tests unitaires passent (`uv run pytest`) — cas nominal + cas d'erreur
- [ ] PR liée à l'issue, validée par le PO
- [ ] Fusionnée via Squash and Merge dans `develop`
