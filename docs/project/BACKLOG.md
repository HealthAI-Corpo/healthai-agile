# Product Backlog Complet

| ID            | Role        | Action                                         | But                               | Priorité | Estimation (Fibonacci) | Sprint |
| :------------ | :---------- | :--------------------------------------------- | :-------------------------------- | :------- | :--------------------- | :----- |
| **US 1**      | Utilisateur | M'inscrire et me connecter                     | Accéder à l'application           | 1        | 3                      | 1      |
| **US 2**      | Utilisateur | Créer mon profil sportif                       | Personnaliser les recommandations | 1        | 3                      | 1      |
| **US 3**      | Utilisateur | Générer une séance via Ollama                  | Obtenir un programme personnalisé | 1        | 5                      | 1      |
| **US 4**      | Système     | Matcher les exercices (Fuzzy)                  | Lier la génération au référentiel | 1        | 5                      | 1      |
| **US ML**     | Système     | Classifier RF muscles/intensité (plan hybride) | Alimenter le prompt Ollama        | 1        | 5                      | 2      |
| **US CV**     | Système     | Cross-validation + métriques P/R/F1            | Valider le classifier (RNCP)      | 1        | 5                      | 2      |
| **US 5**      | Utilisateur | Enregistrer mes séances                        | Constituer un historique          | 2        | 2                      | 2      |
| **US 6**      | Utilisateur | Consulter mon historique                       | Suivre ma progression             | 2        | 2                      | 2      |
| **US ML-cal** | Système     | Modèle prédiction calories (dataset 2)         | Estimer la dépense énergétique    | 1        | 5                      | 2      |
| **US 8**      | Utilisateur | Estimation des calories brûlées                | Suivre la dépense énergétique     | 1        | 3                      | 2      |
| **US 11**     | Utilisateur | Supprimer une séance                           | Garder un historique propre       | 2        | 1                      | 2      |
| **US 7**      | PO          | Voir le taux de couverture                     | Évaluer l'efficacité de l'IA      | 3        | 2                      | 2      |
| **US 9**      | Utilisateur | Modifier une séance (simulation IA)            | Voir l'impact avant validation    | 2        | 5                      | 3      |
| **US 13**     | Utilisateur | Évolution BPM/calories dans le temps           | Analyser ma progression           | 2        | 3                      | 3      |
| **US 12**     | Utilisateur | Statistiques globales                          | Visualiser mes performances       | 3        | 2                      | 3      |
| **US 10**     | Utilisateur | Supervision IA de l'historique                 | Coaching bienveillant             | 3        | 5                      | 3      |

## Definition of Done (DoD)

- Code revu et linteur passé (Ruff).
- Tests unitaires validés.
- Documentation mise à jour.
- Validé par le PO.
