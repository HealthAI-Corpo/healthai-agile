# Exemples de Requêtes pour POST /calorie-estimation/predict

## Exemple 1: Homme Cardio Intense (Modéré)

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
  "pourcentage_gras": 15.5,
  "consommation_eau_ml": 1500,
  "niveau_experience": 3
}
```

**Profil**: Homme de poids normal, séance cardio modérée, bonne hydratation
**Réponse attendue**: ~450-500 kcal

---

## Exemple 2: Femme Yoga Relaxant (Faible Intensité)

```json
{
  "imc": 21.0,
  "age": 35,
  "sexe": "F",
  "bpm_max": 115,
  "bpm_moyen": 85,
  "bpm_repos": 68,
  "duree_seance_minutes": 60,
  "type_sport": "Yoga",
  "pourcentage_gras": 24.0,
  "consommation_eau_ml": 800,
  "niveau_experience": 2
}
```

**Profil**: Femme saine, séance yoga long mais peu intense, débutante
**Réponse attendue**: ~150-200 kcal

---

## Exemple 3: Homme HIIT Haute Intensité (Élevée)

```json
{
  "imc": 24.5,
  "age": 25,
  "sexe": "M",
  "bpm_max": 195,
  "bpm_moyen": 165,
  "bpm_repos": 50,
  "duree_seance_minutes": 30,
  "type_sport": "HIIT",
  "pourcentage_gras": 10.0,
  "consommation_eau_ml": 2500,
  "niveau_experience": 5
}
```

**Profil**: Homme athlétique, HIIT intense et court, très expérimenté
**Réponse attendue**: ~550-650 kcal

---

## Exemple 4: Femme Strength Training (Force)

```json
{
  "imc": 22.0,
  "age": 32,
  "sexe": "F",
  "bpm_max": 155,
  "bpm_moyen": 115,
  "bpm_repos": 62,
  "duree_seance_minutes": 50,
  "type_sport": "Strength",
  "pourcentage_gras": 20.5,
  "consommation_eau_ml": 2000,
  "niveau_experience": 3
}
```

**Profil**: Femme de bonne condition physique, séance musculation
**Réponse attendue**: ~300-400 kcal

---

## Tester avec cURL

```bash
curl -X POST http://localhost:8002/calorie-estimation/predict \
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
    "pourcentage_gras": 15.5,
    "consommation_eau_ml": 1500,
    "niveau_experience": 3
  }'
```

## Tester avec Python (requests)

```python
import requests

url = "http://localhost:8002/calorie-estimation/predict"

payload = {
    "imc": 23.5,
    "age": 28,
    "sexe": "M",
    "bpm_max": 180,
    "bpm_moyen": 140,
    "bpm_repos": 60,
    "duree_seance_minutes": 45,
    "type_sport": "Cardio",
    "pourcentage_gras": 15.5,
    "consommation_eau_ml": 1500,
    "niveau_experience": 3
}

response = requests.post(url, json=payload)
print(response.json())
```

## Réponse Attendue

```json
{
  "prediction": 450.23,
  "confidence": 0.82,
  "model_version": "1.0.0",
  "features_used": 11,
  "model_name": "CaloriesIA_1_0_0"
}
```

---

## Légende des Features

| Feature | Type | Range | Description |
|---------|------|-------|-------------|
| `imc` | float | 10-50 | Indice de Masse Corporelle |
| `age` | int | 15-100 | Âge en années |
| `sexe` | str | M, F | Sexe de la personne |
| `bpm_max` | float | >0 | BPM maximal pendant séance |
| `bpm_moyen` | float | >0 | BPM moyen pendant séance |
| `bpm_repos` | float | >0 | BPM au repos (repos < moyen < max) |
| `duree_seance_minutes` | float | 1-480 | Durée en minutes |
| `type_sport` | str | Cardio, HIIT, Strength, Yoga | Type d'activité |
| `pourcentage_gras` | float | 0-100 | % de graisse corporelle |
| `consommation_eau_ml` | float | ≥0 | Ml d'eau consommés |
| `niveau_experience` | int | 0-5 | Niveau: 0=débutant, 5=expert |

---

## Erreurs Courantes

❌ **Erreur 422 - BPM incohérent**
```json
{
  "bpm_repos": 80,
  "bpm_moyen": 70,  // ❌ Doit être > repos
  "bpm_max": 180
}
```

✅ **Correct**
```json
{
  "bpm_repos": 60,
  "bpm_moyen": 140,  // ✅ > repos
  "bpm_max": 180     // ✅ > moyen
}
```

---

## Endpoints Associés

- `GET /calorie-estimation/model-info` - Infos du modèle
- `GET /calorie-estimation/metrics` - Métriques (R², MAE, RMSE, MAPE)
- `GET /health` - État de l'API
- `GET /docs` - Documentation Swagger
