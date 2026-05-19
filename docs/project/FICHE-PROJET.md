# Fiche Projet — healthai-workout

## Vision produit

> **Pour** les sportifs occasionnels et débutants qui veulent un programme d'entraînement sur-mesure sans coach,
> **healthai-workout** génère en quelques secondes une séance personnalisée par IA, adaptée à leur profil physique réel et à leurs objectifs.
> **Contrairement** aux applications de fitness génériques, chaque séance est validée contre un référentiel d'exercices et accompagnée d'une estimation calorique basée sur un modèle ML.

### Critères de succès du POC

| Critère                                      | Seuil de validation |
| -------------------------------------------- | ------------------- |
| Taux de couverture fuzzy (exercices matchés) | > 60 %              |
| F1-score macro classifier muscles/intensité  | > 0.65              |
| MAE modèle calories                          | < 50 kcal           |
| Latence génération séance (Ollama)           | < 10 secondes       |
| Contraintes utilisateur respectées           | 100 % des séances   |

---

## Description courte

POC d'un module de recommandation sportive personnalisée : l'utilisateur reçoit une séance d'entraînement générée par IA, adaptée à son profil physique, avec estimation des calories brûlées via un modèle ML.

## Problème résolu

Les applications de fitness proposent soit des programmes génériques (peu adaptés), soit des outils complexes réservés aux sportifs avancés. healthai-workout génère une séance sur-mesure en quelques secondes à partir d'un simple profil utilisateur.

## Utilisateurs cibles

- Sportifs occasionnels souhaitant un programme personnalisé sans coach
- Personnes débutantes cherchant un accompagnement guidé
- Profils avec contraintes physiques (équipement limité, objectifs spécifiques)

## Fonctionnalités principales envisagées

1. Inscription / Connexion (JWT)
2. Profil sportif et santé (niveau, objectif, données cardiaques, masse grasse)
3. Génération de séance libre par LLM + matching fuzzy sur dataset de référence
4. Prédiction des calories brûlées par modèle ML (arbre de décision, dataset 2)
5. Enregistrement et historique des séances
6. Statistiques et évolution BPM/calories
7. Supervision IA de l'historique (coaching bienveillant)

## Stack technique choisie

| Couche       | Technologie                                |
| ------------ | ------------------------------------------ |
| Langage      | Python 3.14                                |
| API          | FastAPI                                    |
| ML           | scikit-learn (RandomForest / DecisionTree) |
| LLM          | OLLAMA                                     |
| Matching     | RapidFuzz                                  |
| BDD          | SQLite (POC) → PostgreSQL (prod)           |
| Gestion deps | uv                                         |
| Tests        | pytest                                     |
| Lint         | ruff                                       |

## Contraintes identifiées

- POC limité à 3 sprints (3 demi-journées)
- Interface graphique minimale — API REST pouvant être suffisante pour la démo
- Le LLM doit être cantonné à la génération de séance et à la supervision (pas aux calories)
- Le dataset alimentaire (dataset 1) est hors scope de ce module

## Risques techniques

| Risque                                       | Probabilité | Impact   | Mitigation                                                       |
| -------------------------------------------- | ----------- | -------- | ---------------------------------------------------------------- |
| Taux de couverture fuzzy trop bas (< 60 %)   | Moyen       | Élevé    | Ajuster le seuil, enrichir le dataset de référence               |
| LLM génère des exercices hors format attendu | Moyen       | Moyen    | Schéma Pydantic strict + prompt engineering                      |
| MAE modèle ML calories trop élevée           | Faible      | Moyen    | Feature engineering, tuning hyperparamètres                      |
| Ollama indisponible en séance (RAM, réseau)  | Élevé       | Bloquant | Mock JSON `tests/fixtures/session_mock.json` à préparer avant S1 |
| Dataset exercices de référence absent        | Élevé       | Bloquant | Extraire depuis `healthai-ai` avant Sprint 1 (voir #8)           |
