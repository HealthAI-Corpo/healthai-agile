# Training Log - v1_1_20260521_164314

**Date d'entraînement** : 2026-05-21 16:43:14

---

## 📊 Résumé Général

| Métrique | Valeur |
|----------|--------|
| Version | v1_1_20260521_164314 |
| Échantillons Train | 1963 |
| Échantillons Test | 491 |
| Temps RF | 0.18s |
| Temps GB | 0.44s |

---

## 🌲 Random Forest Regressor

### Paramètres
- `n_estimators`: 100
- `max_depth`: 15
- `min_samples_split`: 5
- `min_samples_leaf`: 2
- `random_state`: 42
- `n_jobs`: -1

### Résultats d'Évaluation
| Métrique | Valeur |
|----------|--------|
| R² | 0.1684 |
| MAE | 201.28 |
| RMSE | 281.36 |
| MSE | 79165.04 |
| MAPE (%) | 24.72 |
| Median AE | 137.05 |

---

## 🚀 Gradient Boosting Regressor

### Paramètres
- `n_estimators`: 100
- `learning_rate`: 0.1
- `max_depth`: 5
- `min_samples_split`: 5
- `min_samples_leaf`: 2
- `random_state`: 42

### Résultats d'Évaluation
| Métrique | Valeur |
|----------|--------|
| R² | 0.1510 |
| MAE | 202.46 |
| RMSE | 284.29 |
| MSE | 80823.05 |
| MAPE (%) | 24.66 |
| Median AE | 133.24 |

---

## 📦 Baseline (DummyRegressor - Mean)

### Résultats d'Évaluation
| Métrique | Valeur |
|----------|--------|
| R² | -0.0030 |
| MAE | 247.93 |
| RMSE | 309.01 |
| MSE | 95486.97 |
| MAPE (%) | 31.93 |
| Median AE | 206.82 |

---

## 🏆 Comparaison et Rankings

**Meilleur modèle global** : `RANDOM_FOREST`

### Points par Métrique
| Métrique | RF | GB | Baseline | Gagnant |
|----------|----|----|----------|---------|
| r2 | 1 | 2 | 3 | RANDOM FOREST |
| mae | 1 | 2 | 3 | RANDOM FOREST |
| mse | 1 | 2 | 3 | RANDOM FOREST |
| rmse | 1 | 2 | 3 | RANDOM FOREST |
| mape | 2 | 1 | 3 | GRADIENT BOOSTING |
| median_absolute_error | 2 | 1 | 3 | GRADIENT BOOSTING |


---

## 📌 Fichiers Sauvegardés

- ✅ Modèles (.pkl)
- ✅ Métriques (metrics.json)
- ✅ Données d'entraînement (CSV)
- ✅ Métadonnées de transformation (transformation_metadata.json)
- ✅ Scaler (scaler.pkl)
- ✅ Log d'entraînement (training_log.md)
