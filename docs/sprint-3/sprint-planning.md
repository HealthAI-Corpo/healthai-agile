# Sprint Planning — Sprint 3

**Date :** _à compléter le jour de la séance_
**Durée du sprint :** 1 demi-journée
**Participants :** Loric (PO), Jordan (SM), Eliott, Timéo, Wessim

---

## Sprint Goal

> L'estimation calorique ML est opérationnelle (MAE < 50 kcal), l'historique est consultable et supprimable, et le taux de couverture fuzzy est exposé.

---

## Prérequis Sprint 3

Sprint 3 dépend de Sprint 2 Done. Vérifier avant de démarrer :

- [ ] #25 — RF classifier validé (F1 > 0.65) et intégré dans le prompt Ollama
- [ ] #26 — `docs/ml_report_v1.md` versionné
- [ ] #28 — MongoDB opérationnel
- [ ] #9 — `POST /sessions` fonctionnel

---

## Décision de scope

Capacité estimée : **12–14 SP** (4 devs × demi-journée).

| Issue | Titre | SP | Décision |
|-------|-------|----|----------|
| [#18](https://github.com/HealthAI-Corpo/healthai-agile/issues/18) | US ML-cal — Modèle prédiction calories | 5 | **IN — P1** |
| [#12](https://github.com/HealthAI-Corpo/healthai-agile/issues/12) | US 8 — Estimation calories brûlées | 2 | **IN — P1** |
| [#10](https://github.com/HealthAI-Corpo/healthai-agile/issues/10) | US 6 — Historique séances | 2 | **IN** |
| [#13](https://github.com/HealthAI-Corpo/healthai-agile/issues/13) | US 11 — Supprimer séance | 1 | **IN** |
| [#11](https://github.com/HealthAI-Corpo/healthai-agile/issues/11) | US 7 — Taux couverture (PO) | 2 | **IN** |
| [#14](https://github.com/HealthAI-Corpo/healthai-agile/issues/14) | US 9 — Simulation IA (modifier séance) | 5 | **Stretch** |
| [#17](https://github.com/HealthAI-Corpo/healthai-agile/issues/17) | US 10 — Supervision IA historique | 5 | **Post-POC** |
| [#15](https://github.com/HealthAI-Corpo/healthai-agile/issues/15) | US 13 — Évolution BPM/calories | 3 | **Post-POC** |
| [#16](https://github.com/HealthAI-Corpo/healthai-agile/issues/16) | US 12 — Statistiques globales | 2 | **Post-POC** |

**Total Sprint 3 retenu : 12 SP** (+ 5 SP stretch)

---

## Ordre de démarrage

```
#18 (modèle calories — train) ──────────────────► #12 (endpoint estimation)
#10 (historique) ──────────────────────────────── indépendant
#13 (supprimer) ──────────────── dépend #10
#11 (taux couverture) ──────────────────────────── indépendant
#14 simulation IA (stretch) ──── indépendant
```

---

## Répartition

_À définir lors de la séance par le SM — respecter l'ordre de démarrage ci-dessus. Note : #18 et #12 sont couplés, les confier à la même personne._

---

## Sprint Backlog — Tâches techniques

### #18 — US ML-cal : Modèle prédiction calories _(Timéo)_
- [ ] `src/ml/train_calories.py` : features = `poids`, `age`, `bpm_moyen`, `duree_min`, `type_seance_encoded`, `intensite_encoded`
- [ ] Algorithme : `DecisionTreeRegressor` (ou `RandomForestRegressor` si MAE > 50 kcal)
- [ ] Métriques : **MAE < 50 kcal** + R² sur test set (seuil de validation PO)
- [ ] Sérialisation `models/calories_v1.joblib`
- [ ] Rapport `docs/ml_report_calories.md` : MAE, R², feature importance (obligatoire soutenance)

### #12 — US 8 : Estimation calories _(Timéo, après #18 Done)_
- [ ] Chargement singleton `calories_v1.joblib` au démarrage
- [ ] Intégration dans `POST /sessions` : calcul automatique à l'enregistrement
- [ ] `GET /sessions/{id}/calories` — retourne `calories_estimees` + `confidence_range` (±MAE)
- [ ] Tests : estimation cohérente pour profils connus (vérifier ordre de grandeur)

### #10 — US 6 : Historique séances _(Eliott)_
- [ ] `GET /sessions` — liste paginée (`limit`/`offset`), filtrée par `user_id` JWT
- [ ] `GET /sessions/{id}` — détail complet + estimation calories
- [ ] Tests : liste vide, liste avec données, session inexistante (404)

### #13 — US 11 : Supprimer séance _(Eliott, après #10 Done)_
- [ ] `DELETE /sessions/{id}` — suppression PostgreSQL + nettoyage référence MongoDB
- [ ] Vérification ownership : seul le propriétaire peut supprimer (403 sinon)
- [ ] Tests : suppression nominale, tentative autre utilisateur (403), session inexistante (404)

### #11 — US 7 : Taux de couverture PO _(Jordan)_
- [ ] `GET /metrics/matching-coverage` — taux global + par session (% exercices LLM matchés > seuil fuzzy)
- [ ] Persisté dans la collection MongoDB `session_metrics` à chaque génération
- [ ] Tests : calcul correct sur sessions connues

### #14 — US 9 : Simulation IA (stretch) _(Wessim)_
- [ ] `PATCH /sessions/{id}/simulate` — modifier un exercice et demander à Ollama l'impact estimé
- [ ] Retourner l'impact différentiel (calories, muscles couverts) sans persister la modification
- [ ] Tests : simulation sur session valide, exercice inconnu (gracieux)

---

## Critères de succès POC — validation finale

| Critère | Seuil | Issue |
|---------|-------|-------|
| Taux de couverture fuzzy | > 60 % | #11 |
| F1-score macro classifier muscles/intensité | > 0.65 | #26 |
| MAE modèle calories | < 50 kcal | #18 |
| Latence génération séance Ollama | < 10 s | #7 |
| Contraintes utilisateur respectées | 100 % des séances | #7 + #25 |

---

## Definition of Done — rappel

Idem Sprints 1 & 2, avec obligation supplémentaire :
- [ ] `docs/ml_report_calories.md` créé et versionné avant fusion de #18
- [ ] Scénario de démo complet jouable sans erreur (`register → login → profil → generate → historique`)
