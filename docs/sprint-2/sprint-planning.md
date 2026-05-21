# Sprint Planning — Sprint 2

**Date :** _à compléter le jour de la séance_
**Durée du sprint :** 1 demi-journée
**Participants :** Loric (PO), Jordan (SM), Eliott, Timéo, Wessim

---

## Sprint Goal

> Le classifier Random Forest est entraîné, validé (F1 macro > 0.65), intégré dans le prompt Ollama, et les séances générées sont persistées en MongoDB.

---

## Prérequis Sprint 2

Sprint 2 dépend intégralement de Sprint 1 Done. Vérifier avant de démarrer :

- [ ] #22 — Ollama opérationnel et joignable depuis le service
- [ ] #20 — BDD PostgreSQL initialisée avec données de seed
- [ ] #6 — Profil utilisateur disponible (`GET /profile` fonctionnel)
- [ ] #7 — `POST /sessions/generate` fonctionnel (même en fallback)

---

## Décision de scope

Capacité estimée : **15–17 SP** (4 devs × demi-journée).

| Issue | Titre | SP | Décision |
|-------|-------|----|----------|
| [#24](https://github.com/HealthAI-Corpo/healthai-agile/issues/24) | chore: Feature engineering | 3 | **IN — BLOCKER ML** |
| [#25](https://github.com/HealthAI-Corpo/healthai-agile/issues/25) | feat: RF classifier + intégration prompt | 5 | **IN — P1** |
| [#26](https://github.com/HealthAI-Corpo/healthai-agile/issues/26) | feat: CV k-fold + métriques P/R/F1 | 5 | **IN — P1** |
| [#28](https://github.com/HealthAI-Corpo/healthai-agile/issues/28) | chore: MongoDB Motor — persistance recommendations | 2 | **IN — P1** |
| [#9](https://github.com/HealthAI-Corpo/healthai-agile/issues/9) | US 5 — Enregistrer séances | 2 | **IN** |
| [#10](https://github.com/HealthAI-Corpo/healthai-agile/issues/10) | US 6 — Historique séances | 2 | **Stretch** |
| [#18](https://github.com/HealthAI-Corpo/healthai-agile/issues/18) | US ML-cal — Modèle calories | 5 | **Reporté Sprint 3** — dépend validation RF |
| [#11](https://github.com/HealthAI-Corpo/healthai-agile/issues/11) | US 7 — Taux couverture PO | 2 | **Reporté Sprint 3** |
| [#13](https://github.com/HealthAI-Corpo/healthai-agile/issues/13) | US 11 — Supprimer séance | 1 | **Reporté Sprint 3** |

**Total Sprint 2 retenu : 17 SP** (+ 2 SP stretch)

---

## Ordre de démarrage

```
#24 (feature engineering) ──────────────────────► #25 (RF train) ──► #26 (CV metrics)
                                                         │
                                                         └──► #7 mise à jour (inject RF → prompt)
#28 (MongoDB) ──────────────────────────────────────────────► #9 (sessions)
```

**#24 et #28 en premier** — tout le monde en dépend.

---

## Répartition

_À définir lors de la séance par le SM — respecter l'ordre de démarrage ci-dessus. Note : #24, #25, #26 sont fortement couplés, les confier de préférence à la même personne._

---

## Sprint Backlog — Tâches techniques

### #24 — Feature engineering _(Timéo — PREMIÈRE TÂCHE)_
- [ ] Charger `dataset_historique_seance_exercice` depuis PostgreSQL (asyncpg)
- [ ] Définir features X : `age`, `imc`, `niveau`, `objectif_encoded`, `limitations_*` (one-hot), `frequence_7j`, `muscles_travailles_7j_*`
- [ ] Définir labels y (multi-label) : `muscles_cibles[]`, `intensite`, `type_seance`
- [ ] Exporter `data/features_workout.csv` propre + rapport de distribution (valeurs manquantes, balance des classes)
- [ ] Tests : DataFrame sans NaN sur les features clés, distribution des labels documentée

### #25 — RF MultiOutputClassifier + intégration prompt _(Timéo, après #24 Done)_
- [ ] `src/ml/train.py` : `MultiOutputClassifier(RandomForestClassifier(n_estimators=100, random_state=42))`
- [ ] Split 80/20 stratifié sur l'objectif utilisateur
- [ ] Sérialisation → `models/recommender_v1.joblib`
- [ ] Chargement singleton au démarrage FastAPI (lifespan)
- [ ] **Injection dans le prompt Ollama** : `muscles_cibles` + `intensite` prédits injectés dans le prompt système de `POST /sessions/generate`
- [ ] Tests : chargement modèle, prédiction sur profil de test, vérification format sortie multi-label

### #26 — Cross-validation k-fold + métriques P/R/F1 _(Timéo, en parallèle de #25)_
- [ ] k-fold cross-validation (k=5, stratifié sur objectif)
- [ ] `GridSearchCV` sur `n_estimators`, `max_depth`, `min_samples_split`
- [ ] `classification_report` par label (muscles, intensité, type)
- [ ] **Seuil de validation PO : F1 macro > 0.65** — PR bloquée si non atteint
- [ ] Matrice de confusion par catégorie
- [ ] Rapport obligatoire : `docs/ml_report_v1.md` (métriques + interprétation + feature importance)

### #28 — MongoDB Motor async _(Eliott — PREMIÈRE TÂCHE)_
- [ ] Connexion Motor async dans `src/database_mongo.py` (singleton, pattern identique à `healthai-vision`)
- [ ] Schéma document collection `recommendations` (voir PLAN_HYBRIDE_RECOMMANDATION.md)
- [ ] `MONGODB_URL` + `MONGODB_DB_NAME` dans `.env.example`
- [ ] Fallback gracieux si MongoDB indisponible (log warning, pas de crash)
- [ ] Tests : insert document, retrieve par `utilisateur_id`, connexion KO

### #9 — US 5 : Enregistrer séances _(Eliott, après #28 Done)_
- [ ] Modèle `Session` : `user_id`, `exercices[]`, `calories_estimees` (null à ce stade), `duree_min`, `timestamp`
- [ ] `POST /sessions` — persiste en PostgreSQL + lie `recommendation_id` MongoDB (ObjectId en string)
- [ ] Tests : création session, utilisateur inexistant (404), exercices vides (400)

---

## Definition of Done — rappel

Idem Sprint 1, avec obligation supplémentaire :
- [ ] `docs/ml_report_v1.md` créé et versionné avant fusion de #26

---

## Risques Sprint 2

| Risque | Probabilité | Mitigation |
|--------|------------|------------|
| F1 < 0.65 sur dataset 1800 lignes | Moyen | Augmenter `n_estimators`, réduire le nombre de labels, tester XGBoost |
| MongoDB non joignable en dev | Faible | Le service démarre sans MongoDB (fallback gracieux dans #28) |
| Temps insuffisant pour #26 | Moyen | #25 et #26 sont couplés — Timéo doit prioriser #26 avant la fin de la démo |
