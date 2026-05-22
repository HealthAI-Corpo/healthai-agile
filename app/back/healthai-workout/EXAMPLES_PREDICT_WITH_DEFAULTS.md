# Exemples pour POST /calorie-estimation/predict-with-defaults

## ℹ️ À Propos

Cette route permet de faire des **prédictions même avec des données manquantes**.

Les features manquantes (null) sont imputées avec les **moyennes du dataset d'entraînement**.

**⚠️ Limitation**: Les prédictions avec imputation sont moins fiables que celles avec données réelles.

---

## Exemple 1: Données Minimales (Minimum Required)

**Fournir seulement les données essentielles, les autres sont imputées**

```json
{
  "imc": 23.5,
  "age": 28,
  "sexe": "M",
  "bpm_max": 180,
  "bpm_moyen": 140,
  "bpm_repos": 60,
  "duree_seance_minutes": 45,
  "type_sport": "Cardio",
  "pourcentage_gras": null,
  "consommation_eau_ml": null,
  "niveau_experience": null
}
```

**Réponse**:
```json
{
  "prediction": 420.15,
  "model_version": "1.0.0",
  "features_used": 11,
  "model_name": "CaloriesIA_1_0_0",
  "imputed_features": {
    "pourcentage_gras": {
      "value": 24.145,
      "source": "scaler_stats_mean"
    },
    "consommation_eau_ml": {
      "value": 2677.178,
      "source": "scaler_stats_mean"
    },
    "niveau_experience": {
      "value": 1.781,
      "source": "scaler_stats_mean"
    }
  },
  "original_values": {
    "imc": 23.5,
    "age": 28,
    "sexe": "M",
    "bpm_max": 180,
    "bpm_moyen": 140,
    "bpm_repos": 60,
    "duree_seance_minutes": 45,
    "type_sport": "Cardio"
  }
}
```

---

## Exemple 2: Données Partielles (Partial Data)

```json
{
  "imc": 21.5,
  "age": 35,
  "sexe": "F",
  "bpm_max": 160,
  "bpm_moyen": null,
  "bpm_repos": 65,
  "duree_seance_minutes": 50,
  "type_sport": "Yoga",
  "pourcentage_gras": 22.0,
  "consommation_eau_ml": 1200,
  "niveau_experience": null
}
```

**Résultat**: 1 feature imputée (`bpm_moyen`, `niveau_experience`)

---

## Exemple 3: Données Très Minimalistes

```json
{
  "imc": 25.0,
  "age": 40,
  "sexe": "M",
  "bpm_max": 170,
  "bpm_moyen": null,
  "bpm_repos": null,
  "duree_seance_minutes": 40,
  "type_sport": "Strength",
  "pourcentage_gras": null,
  "consommation_eau_ml": null,
  "niveau_experience": null
}
```

**Résultat**: 5 features imputées avec les moyennes

---

## Valeurs Imputées (Moyennes du Dataset)

| Feature | Valeur Imputée | Unité |
|---------|----------------|-------|
| imc | 23.70 | kg/m² |
| age | 36.03 | ans |
| sexe | 0.49 | (M=0, F=1) |
| bpm_max | 179.97 | bpm |
| bpm_moyen | 145.02 | bpm |
| bpm_repos | 63.19 | bpm |
| duree_seance_minutes | 80.58 | min |
| type_sport | 0.51 | (Cardio=0, Force=1) |
| pourcentage_gras | 24.15 | % |
| consommation_eau_ml | 2677.18 | ml |
| niveau_experience | 1.78 | (0-5) |

---

## cURL Example

```bash
curl -X POST http://localhost:8002/calorie-estimation/predict-with-defaults \
  -H "Content-Type: application/json" \
  -d '{
    "imc": 23.5,
    "age": 28,
    "sexe": "M",
    "bpm_max": 180,
    "bpm_moyen": 140,
    "bpm_repos": 60,
    "duree_seance_minutes": 45,
    "type_sport": "Cardio",
    "pourcentage_gras": null,
    "consommation_eau_ml": null,
    "niveau_experience": null
  }'
```

---

## Python Example

```python
import requests

url = "http://localhost:8002/calorie-estimation/predict-with-defaults"

payload = {
    "imc": 23.5,
    "age": 28,
    "sexe": "M",
    "bpm_max": 180,
    "bpm_moyen": 140,
    "bpm_repos": 60,
    "duree_seance_minutes": 45,
    "type_sport": "Cardio",
    "pourcentage_gras": None,  # Sera imputée
    "consommation_eau_ml": None,  # Sera imputée
    "niveau_experience": None  # Sera imputée
}

response = requests.post(url, json=payload)
data = response.json()

print(f"Prédiction: {data['prediction']} kcal")
print(f"Features imputées: {data['imputed_features'].keys()}")
print(f"Valeurs originales: {data['original_values'].keys()}")
```

---

## Comparaison: /predict vs /predict-with-defaults

| Aspect | /predict | /predict-with-defaults |
|--------|----------|----------------------|
| Features manquantes | ❌ Erreur 422 | ✅ Imputées automatiquement |
| Fiabilité | Haute | Modérée |
| Cas d'usage | Données complètes | Données incomplètes |
| Imputation | N/A | Moyennes dataset |

---

## Quand Utiliser Chaque Route?

### `/predict` ✅
- Vous avez **toutes les 11 features**
- Vous voulez **maximum de fiabilité**
- Les données viennent d'une **source complète** (capteurs, app, etc.)

### `/predict-with-defaults` ⚠️
- Vous avez **quelques features manquantes**
- Vous acceptez **moins de fiabilité**
- C'est un **pré-calcul exploratoire**
- L'utilisateur **ne peut pas fournir** tous les paramètres

---

## Points Importants

⚠️ **L'imputation n'est PAS précise**:
- Utilise les moyennes du dataset d'entraînement
- Peut donner des résultats très différents si les vraies valeurs s'écartent de la moyenne
- À utiliser avec prudence

✅ **L'imputation est transparente**:
- La réponse inclut `imputed_features`
- Vous savez exactement quelle valeur a été utilisée
- Vous savez quelles features sont originales vs imputées

---

**Dernière mise à jour**: 2026-05-22
