# 🎯 Directives Claude Code - Phase 7 (Intégration API)

## A. Contexte du Projet

Tu aides un **développeur junior en machine learning** sur un projet de **microservice HealthAI**.

### Architecture

- **Monorepo** : `app/back/` (backend) et `app/front/` (POC frontend)
- **Microservice d'entraînement** : `app/back/healthai-training-ia-calories-estimation/` (GELÉ après v1_12)
- **Microservice d'inférence** : `app/back/healthai-workout/` (utilise modèle v1_12 sous le nom CaloriesIA_1_0_0)
- **Phase actuelle** : Phase 7 - Intégration API (Calories Estimation), Endpoints CalorieIA uniquement
- **Phase suivante** : Phase 8 - Intégration Ollama (Analyse de séances, génération d'exercices)
- **Modèle de production** : `v1_12_20260522_115951` (VALIDÉ & GELÉ - ne plus modifier)
- **Stockage du modèle** : Copié dans `app/back/healthai-workout/models/CaloriesIA_1_0_0/`

### Objectif Phase 7

Créer une API FastAPI pour servir le modèle v1_12 avec les endpoints CalorieIA :

1. **`GET /health`** : Vérifier l'état de l'API
2. **`GET /calorie-estimation/model-info`** : Infos du modèle (version, features, performance)
3. **`GET /calorie-estimation/metrics`** : Métriques du modèle (R², MAE, RMSE)
4. **`POST /calorie-estimation/predict`** : Prédire calories à partir des 11 features

### Architecture Multi-Endpoints

Le microservice `healthai-workout` est **multi-fonctionnel** et aura plusieurs groupes d'endpoints :

```

Phase 7 (MAINTENANT):
├── /health GET État de l'API
└── /calorie-estimation/
├── predict POST Prédire calories (11 features)
├── model-info GET Infos du modèle
└── metrics GET Métriques du modèle

Phase 8 (À VENIR - Ollama):
└── /????/
├── analyze-workout POST Analyser séance (texte → features)
├── generate-exercises POST Générer des exercices
└── generate-summary POST Générer résumé de séance

```

### Données du Modèle

- **11 features** (dans cet ordre exact) :

    ```
    imc, age, sexe, bpm_max, bpm_moyen, bpm_repos,
    duree_seance_minutes, type_sport, pourcentage_gras,
    consommation_eau_ml, niveau_experience
    ```

- **Encoders** (mapping catégoriques) :
    - `sexe` : "M" → 0, "F" → 1
    - `type_sport` : "Cardio"/"HIIT" → 0, "Strength"/"Yoga" → 1, ou plus globalement, 0 = cardio et 1 = force

- **Métadonnées critiques** : `models/CaloriesIA_1_0_0/transformation_metadata.json`

---

## B. Règles d'Or

### ✅ À FAIRE

1. **Respecter la structure FastAPI existante**
    - Suivre le pattern de `healthai-vision/src/main.py`
    - Utiliser `lifespan` pour charger le modèle au démarrage
    - Endpoints dans `src/routes/` ou `src/api/`

2. **Charger le modèle correctement**
    - Chemin : `models/CaloriesIA_1_0_0/random_forest/model.pkl`
    - Charger aussi : `scaler.pkl`, `transformation_metadata.json`
    - **UNE SEULE FOIS au démarrage** (dans lifespan)

3. **Respecter l'ordre des features**
    - TOUJOURS utiliser `features_cols_order` de `transformation_metadata.json`
    - JAMAIS deviner l'ordre

4. **Validation des entrées**
    - Vérifier que toutes les 11 features sont présentes
    - Vérifier les plages métier (age, bpm, etc.)
    - Retourner HTTPException avec message clair

5. **Réponses détaillées**

    ```json
    {
        "prediction": 200.39,
        "confidence": 0.85,
        "model_version": "1.0.0",
        "features_used": 11
    }
    ```

6. **Logging en stdout**
    - Utiliser `loguru` (comme `healthai-vision`)
    - Logger chaque appel : requête, résultat, temps
    - Format : `[INFO] POST /calorie-estimation/predict - input: {...} → output: 200.39`

7. **Structure d'endpoints claire**
    - Phase 7 : Endpoints CalorieIA sous `/calorie-estimation/`
    - `/health` : accessible à la racine

### ❌ À NE PAS FAIRE

1. **NE PAS modifier** `models/CaloriesIA_1_0_0/`
2. **NE PAS** créer de dépendances nouvelles sans approval
3. **NE PAS** ajouter de logging en fichier (stdout seulement)
4. **NE PAS** modifier l'ordre des features
5. **NE PAS** normaliser/encoder les features manuellement (utiliser le scaler)
6. **NE PAS** créer de base de données pour les prédictions
7. **NE PAS** mélanger Phase 7 (CalorieIA) et Phase 8 (Ollama)

---

## C. Processus Phase 7

**Task 1** : Créer endpoint `/calorie-estimation/predict` POST

- Accepter 11 features
- Charger modèle au démarrage (lifespan)
- Appliquer transformations (scaler)
- Retourner prédiction détaillée
- Vérifier présence des 11 features
- Vérifier plages métier
- Retourner HTTPException 422 si erreur

**Task 2** : Créer endpoints info

- `/health` : état API
- `/calorie-estimation/model-info` : infos du modèle
- `/calorie-estimation/metrics` : métriques (R², MAE, etc.)

**Task 3** : Créer endpoint `/workout/{id}/calculate-calories` (optionnel Phase 7)

- Récupérer séance depuis DB
- Extraire features
- Appeler `/predict` en interne
- Mettre à jour champ `calories_brulees`

**Task 4** : TESTS

- Tester chaque endpoint avec curl/httpx
- Valider le format des réponses
- Tester les cas d'erreur (données manquantes, types invalides)

---

## D. Phase 8 (À VENIR)

Phase 8 ajoutera l'intégration **Ollama** pour :

- Analyser des séances de sport (donner des conceil)
- Générer des exercices recommandés
- Générer des résumés de performance

Ces endpoints seront **séparés** sous `/???/` et n'impacteront pas les endpoints CalorieIA de Phase 7.
