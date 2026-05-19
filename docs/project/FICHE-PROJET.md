# Fiche Projet — healthai-workout

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

| Couche | Technologie |
|--------|------------|
| Langage | Python 3.14 |
| API | FastAPI |
| ML | scikit-learn (RandomForest / DecisionTree) |
| LLM | API Claude (Anthropic) |
| Matching | RapidFuzz |
| BDD | SQLite (POC) → PostgreSQL (prod) |
| Gestion deps | uv |
| Tests | pytest |
| Lint | ruff |

## Contraintes identifiées

- POC limité à 3 sprints (3 demi-journées)
- Pas d'interface graphique requise — API REST suffisante pour la démo
- Le LLM doit être cantonné à la génération de séance et à la supervision (pas aux calories)
- Le dataset alimentaire (dataset 1) est hors scope de ce module

## Risques techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| Taux de couverture fuzzy trop bas (< 60 %) | Moyen | Élevé | Ajuster le seuil, enrichir le dataset de référence |
| LLM génère des exercices hors format attendu | Moyen | Moyen | Schéma Pydantic strict + prompt engineering |
| MAE modèle ML calories trop élevée | Faible | Moyen | Feature engineering, tuning hyperparamètres |
| API LLM indisponible en démo | Faible | Élevé | Réponse de fallback mocquée pour la démo |
