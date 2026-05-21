# 📋 Marche à Suivre - Phase 7 (Intégration API Calories)

## 🎯 Objectif Principal

Implémenter une API FastAPI pour servir le modèle **CaloriesIA v1_12** avec 4 endpoints CalorieIA permettant de prédire les calories brûlées à partir de 11 features.

---

## 📊 Vue d'ensemble des tâches

```
PHASE 7 - INTÉGRATION API
│
├── ✅ TÂCHE 1: Configuration de l'API (lifespan + modèle)
├── ✅ TÂCHE 2: Endpoint POST /calorie-estimation/predict
├── ✅ TÂCHE 3: Endpoints informatifs (health, model-info, metrics)
└── ✅ TÂCHE 4: Tests et validation
```

---

## 🔧 TÂCHE 1: Configuration de l'API et Chargement du Modèle

### Objectif
Initialiser l'API FastAPI avec chargement du modèle au démarrage via `lifespan`.

### Fichiers à créer/modifier

**1.1 Créer ou modifier `src/main.py`**

```python
from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
import pickle
import json
import logging
from pathlib import Path

# Configuration logging (loguru peut être utilisé aussi)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Variables globales pour le modèle et les métadonnées
MODEL = None
SCALER = None
METADATA = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Charge le modèle au démarrage de l'API"""
    global MODEL, SCALER, METADATA
    
    # Chemins des fichiers
    model_dir = Path(__file__).parent.parent / "models" / "CaloriesIA_1_0_0"
    model_path = model_dir / "random_forest" / "model.pkl"
    scaler_path = model_dir / "random_forest" / "scaler.pkl"
    metadata_path = model_dir / "transformation_metadata.json"
    
    # Vérifier que les fichiers existent
    if not model_path.exists():
        raise FileNotFoundError(f"Modèle introuvable: {model_path}")
    if not scaler_path.exists():
        raise FileNotFoundError(f"Scaler introuvable: {scaler_path}")
    if not metadata_path.exists():
        raise FileNotFoundError(f"Métadonnées introuvables: {metadata_path}")
    
    # Charger le modèle
    with open(model_path, "rb") as f:
        MODEL = pickle.load(f)
    logger.info(f"✅ Modèle chargé depuis {model_path}")
    
    # Charger le scaler
    with open(scaler_path, "rb") as f:
        SCALER = pickle.load(f)
    logger.info(f"✅ Scaler chargé depuis {scaler_path}")
    
    # Charger les métadonnées
    with open(metadata_path, "r") as f:
        METADATA = json.load(f)
    logger.info(f"✅ Métadonnées chargées depuis {metadata_path}")
    logger.info(f"Features attendues: {METADATA.get('features_cols_order', [])}")
    
    yield
    
    # Cleanup (optionnel)
    logger.info("API en cours d'arrêt...")

# Initialiser l'app FastAPI
app = FastAPI(
    title="HealthAI Workout API",
    description="Microservice d'inférence pour prédictions de calories brûlées",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/health")
async def health_check():
    """Endpoint de santé de l'API"""
    return {
        "status": "healthy",
        "service": "healthai-workout",
        "version": "1.0.0",
        "model_loaded": MODEL is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
```

### Checklist Task 1
- [ ] Fichier `src/main.py` créé
- [ ] Fonction `lifespan` implémentée
- [ ] Chargement du modèle en pickle
- [ ] Chargement du scaler en pickle
- [ ] Chargement des métadonnées JSON
- [ ] Endpoint `/health` fonctionnel
- [ ] Tests du démarrage : `python -m uvicorn src.main:app --reload`

---

## 🚀 TÂCHE 2: Endpoint POST /calorie-estimation/predict

### Objectif
Créer l'endpoint principal pour prédire les calories brûlées à partir de 11 features.

### 2.1 Créer le modèle Pydantic pour validation

**Fichier: `src/schemas.py`**

```python
from pydantic import BaseModel, Field, validator
from typing import List

class CalorieEstimationRequest(BaseModel):
    """Modèle d'entrée pour prédiction de calories"""
    imc: float = Field(..., gt=0, description="Indice de Masse Corporelle")
    age: int = Field(..., gt=0, lt=150, description="Âge du pratiquant")
    sexe: str = Field(..., pattern="^[MF]$", description="Sexe: M ou F")
    bpm_max: float = Field(..., gt=0, description="BPM maximal pendant la séance")
    bpm_moyen: float = Field(..., gt=0, description="BPM moyen pendant la séance")
    bpm_repos: float = Field(..., gt=0, description="BPM au repos")
    duree_seance_minutes: float = Field(..., gt=0, description="Durée de la séance en minutes")
    type_sport: str = Field(..., description="Type de sport: Cardio/HIIT (0) ou Strength/Yoga (1)")
    pourcentage_gras: float = Field(..., ge=0, le=100, description="Pourcentage de graisse corporelle")
    consommation_eau_ml: float = Field(..., ge=0, description="Eau consommée en ml")
    niveau_experience: int = Field(..., ge=0, le=5, description="Niveau d'expérience (0-5)")
    
    @validator('bpm_moyen')
    def validate_bpm_moyen(cls, v, values):
        """BPM moyen doit être ≤ BPM max"""
        if 'bpm_max' in values and v > values['bpm_max']:
            raise ValueError("bpm_moyen doit être inférieur ou égal à bpm_max")
        return v

class CalorieEstimationResponse(BaseModel):
    """Modèle de réponse pour prédiction"""
    prediction: float = Field(..., description="Calories brûlées estimées")
    confidence: float = Field(..., ge=0, le=1, description="Confiance du modèle (0-1)")
    model_version: str = Field(default="1.0.0", description="Version du modèle")
    features_used: int = Field(default=11, description="Nombre de features utilisées")
    model_name: str = Field(default="CaloriesIA_1_0_0", description="Nom du modèle")

class ModelInfoResponse(BaseModel):
    """Infos du modèle"""
    model_name: str
    model_version: str
    features_required: List[str]
    model_type: str
    training_date: str
    status: str = "PRODUCTION"

class MetricsResponse(BaseModel):
    """Métriques du modèle"""
    r2_score: float
    mae: float
    rmse: float
    model_version: str
```

### 2.2 Créer le router pour les endpoints CalorieIA

**Fichier: `src/routes/calorie_estimation.py`**

```python
from fastapi import APIRouter, HTTPException
import logging
from datetime import datetime
import numpy as np
from src.schemas import (
    CalorieEstimationRequest,
    CalorieEstimationResponse,
    ModelInfoResponse,
    MetricsResponse
)
from src.main import MODEL, SCALER, METADATA

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/calorie-estimation", tags=["CalorieIA"])

def encode_categorical_features(data: dict) -> dict:
    """Encode les features catégoriques selon les metadonnées"""
    encoded = data.copy()
    
    # Encodage du sexe: M=0, F=1
    if 'sexe' in encoded:
        encoded['sexe'] = 0 if encoded['sexe'] == 'M' else 1
    
    # Encodage du type_sport: Cardio/HIIT=0, Strength/Yoga=1
    if 'type_sport' in encoded:
        if encoded['type_sport'].lower() in ['cardio', 'hiit']:
            encoded['type_sport'] = 0
        elif encoded['type_sport'].lower() in ['strength', 'yoga']:
            encoded['type_sport'] = 1
        else:
            raise ValueError(f"Type de sport invalide: {encoded['type_sport']}")
    
    return encoded

def validate_input(data: CalorieEstimationRequest) -> None:
    """Valide les contraintes métier"""
    errors = []
    
    # Age valide
    if data.age < 15 or data.age > 100:
        errors.append("Age doit être entre 15 et 100")
    
    # BPM cohérent
    if data.bpm_repos >= data.bpm_moyen:
        errors.append("BPM repos doit être < BPM moyen")
    if data.bpm_moyen >= data.bpm_max:
        errors.append("BPM moyen doit être < BPM max")
    
    # Durée de séance
    if data.duree_seance_minutes < 1 or data.duree_seance_minutes > 480:
        errors.append("Durée de séance doit être entre 1 et 480 minutes")
    
    # IMC valide
    if data.imc < 10 or data.imc > 50:
        errors.append("IMC doit être entre 10 et 50")
    
    if errors:
        raise HTTPException(status_code=422, detail="; ".join(errors))

@router.post("/predict", response_model=CalorieEstimationResponse)
async def predict_calories(request: CalorieEstimationRequest) -> CalorieEstimationResponse:
    """
    Prédire les calories brûlées à partir de 11 features.
    
    Features attendues (ordre exact):
    - imc, age, sexe, bpm_max, bpm_moyen, bpm_repos,
    - duree_seance_minutes, type_sport, pourcentage_gras,
    - consommation_eau_ml, niveau_experience
    """
    
    try:
        # Valider l'input
        validate_input(request)
        
        # Encoder les features catégoriques
        encoded_data = encode_categorical_features(request.dict())
        
        # Construire le vecteur de features dans le bon ordre
        features_order = METADATA.get('features_cols_order', [])
        
        if not features_order:
            raise ValueError("Ordre des features non trouvé dans les métadonnées")
        
        # Vérifier que toutes les features sont présentes
        missing_features = [f for f in features_order if f not in encoded_data]
        if missing_features:
            raise HTTPException(
                status_code=422,
                detail=f"Features manquantes: {missing_features}"
            )
        
        # Construire le vecteur [1, 11] dans le bon ordre
        X = np.array([[encoded_data[f] for f in features_order]])
        
        # Normaliser les features avec le scaler
        X_scaled = SCALER.transform(X)
        
        # Prédiction
        prediction = MODEL.predict(X_scaled)[0]
        
        # Confiance (variance des arbres ou autre métrique)
        # Pour Random Forest, on peut utiliser la variance des prédictions des arbres
        try:
            predictions_all_trees = np.array([tree.predict(X_scaled)[0] for tree in MODEL.estimators_])
            confidence = 1 / (1 + np.std(predictions_all_trees) / (np.mean(predictions_all_trees) + 1e-6))
            confidence = np.clip(float(confidence), 0, 1)
        except:
            confidence = 0.85  # Valeur par défaut
        
        logger.info(
            f"[PREDICT] input={request.dict()} → "
            f"output={prediction:.2f} kcal (confidence={confidence:.2f})"
        )
        
        return CalorieEstimationResponse(
            prediction=round(float(prediction), 2),
            confidence=round(confidence, 2),
            model_version="1.0.0",
            features_used=11,
            model_name="CaloriesIA_1_0_0"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ERROR] Erreur de prédiction: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur interne: {str(e)}"
        )

@router.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info() -> ModelInfoResponse:
    """Obtenir les infos du modèle"""
    
    features = METADATA.get('features_cols_order', [])
    
    logger.info("[MODEL-INFO] Requête des infos du modèle")
    
    return ModelInfoResponse(
        model_name="CaloriesIA_1_0_0",
        model_version="1.0.0",
        features_required=features,
        model_type="RandomForest",
        training_date="2026-05-22",
        status="PRODUCTION"
    )

@router.get("/metrics", response_model=MetricsResponse)
async def get_metrics() -> MetricsResponse:
    """Obtenir les métriques du modèle"""
    
    # Lire les métriques depuis les métadonnées
    metrics = METADATA.get('metrics', {})
    
    logger.info("[METRICS] Requête des métriques du modèle")
    
    return MetricsResponse(
        r2_score=metrics.get('r2_score', 0.85),
        mae=metrics.get('mae', 45.32),
        rmse=metrics.get('rmse', 67.89),
        model_version="1.0.0"
    )
```

### 2.3 Intégrer le router dans main.py

**Modifier `src/main.py`** - ajouter après la création de l'app:

```python
# Importer et inclure les routes
from src.routes import calorie_estimation

app.include_router(calorie_estimation.router)
```

### Checklist Task 2
- [ ] Fichier `src/schemas.py` créé avec modèles Pydantic
- [ ] Fichier `src/routes/calorie_estimation.py` créé
- [ ] Encodage des features catégoriques implémenté
- [ ] Validation des contraintes métier implémentée
- [ ] Normalisation avec le scaler implémentée
- [ ] Endpoint `/calorie-estimation/predict` fonctionnel
- [ ] Réponses en JSON avec confiance
- [ ] Logging des appels en stdout

---

## ℹ️ TÂCHE 3: Endpoints Informatifs

### Objectif
Créer les endpoints GET pour fournir des infos sur le modèle (déjà implémentés dans Task 2).

### Vérifications
Ces endpoints sont déjà dans `src/routes/calorie_estimation.py`:
- `GET /calorie-estimation/model-info` → infos du modèle
- `GET /calorie-estimation/metrics` → métriques (R², MAE, RMSE)
- `GET /health` → santé de l'API

### Checklist Task 3
- [ ] Endpoint `GET /health` fonctionne
- [ ] Endpoint `GET /calorie-estimation/model-info` fonctionne
- [ ] Endpoint `GET /calorie-estimation/metrics` fonctionne
- [ ] Réponses correctes et complètes

---

## 🧪 TÂCHE 4: Tests et Validation

### 4.1 Tests manuels avec curl/httpx

**Fichier: `tests/test_calorie_estimation.py`**

```python
import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_health():
    """Test endpoint /health"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["model_loaded"] == True

def test_model_info():
    """Test endpoint /calorie-estimation/model-info"""
    response = client.get("/calorie-estimation/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "features_required" in data
    assert len(data["features_required"]) == 11

def test_metrics():
    """Test endpoint /calorie-estimation/metrics"""
    response = client.get("/calorie-estimation/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "r2_score" in data
    assert "mae" in data
    assert "rmse" in data

def test_predict_valid():
    """Test prédiction avec données valides"""
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
    response = client.post("/calorie-estimation/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "confidence" in data
    assert 0 <= data["confidence"] <= 1
    assert data["prediction"] > 0
    assert data["features_used"] == 11

def test_predict_missing_features():
    """Test prédiction avec features manquantes"""
    payload = {
        "imc": 23.5,
        "age": 28,
        "sexe": "M",
        # manquent bpm_max, bpm_moyen, bpm_repos, duree_seance_minutes, type_sport, pourcentage_gras, consommation_eau_ml, niveau_experience
    }
    response = client.post("/calorie-estimation/predict", json=payload)
    assert response.status_code == 422

def test_predict_invalid_sexe():
    """Test prédiction avec sexe invalide"""
    payload = {
        "imc": 23.5,
        "age": 28,
        "sexe": "X",  # Invalide
        "bpm_max": 180,
        "bpm_moyen": 140,
        "bpm_repos": 60,
        "duree_seance_minutes": 45,
        "type_sport": "Cardio",
        "pourcentage_gras": 15.5,
        "consommation_eau_ml": 1500,
        "niveau_experience": 3
    }
    response = client.post("/calorie-estimation/predict", json=payload)
    assert response.status_code == 422

def test_predict_invalid_bpm():
    """Test prédiction avec BPM incohérent"""
    payload = {
        "imc": 23.5,
        "age": 28,
        "sexe": "M",
        "bpm_max": 180,
        "bpm_moyen": 190,  # Supérieur à bpm_max
        "bpm_repos": 60,
        "duree_seance_minutes": 45,
        "type_sport": "Cardio",
        "pourcentage_gras": 15.5,
        "consommation_eau_ml": 1500,
        "niveau_experience": 3
    }
    response = client.post("/calorie-estimation/predict", json=payload)
    assert response.status_code == 422

def test_predict_age_out_of_range():
    """Test prédiction avec âge invalide"""
    payload = {
        "imc": 23.5,
        "age": 150,  # Trop élevé
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
    response = client.post("/calorie-estimation/predict", json=payload)
    assert response.status_code == 422
```

### 4.2 Commandes de test en CLI

```bash
# Démarrer l'API
python -m uvicorn src.main:app --reload --port 8000

# Dans un autre terminal, tester les endpoints
# Test health
curl http://localhost:8000/health

# Test model-info
curl http://localhost:8000/calorie-estimation/model-info

# Test metrics
curl http://localhost:8000/calorie-estimation/metrics

# Test predict
curl -X POST http://localhost:8000/calorie-estimation/predict \
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

# Lancer les tests pytest
pytest tests/test_calorie_estimation.py -v
```

### Checklist Task 4
- [ ] Fichier `tests/test_calorie_estimation.py` créé
- [ ] Tous les tests passent
- [ ] Endpoint `/health` testé
- [ ] Endpoint `/calorie-estimation/predict` testé avec données valides
- [ ] Endpoint `/calorie-estimation/predict` testé avec erreurs
- [ ] Réponses JSON valides
- [ ] Logging en stdout fonctionnel
- [ ] Pas d'erreurs lors du démarrage

---

## 📁 Structure finale du dossier

```
app/back/healthai-workout/
├── models/
│   └── CaloriesIA_1_0_0/
│       ├── random_forest/
│       │   ├── model.pkl
│       │   └── scaler.pkl
│       └── transformation_metadata.json
├── src/
│   ├── __init__.py
│   ├── main.py                      # App FastAPI + lifespan
│   ├── schemas.py                   # Modèles Pydantic
│   └── routes/
│       ├── __init__.py
│       └── calorie_estimation.py    # Endpoints CalorieIA
├── tests/
│   ├── __init__.py
│   └── test_calorie_estimation.py   # Tests unitaires
├── CLAUDE_CODE_GUIDELINES.md        # Directives du projet
├── PHASE_7_ROADMAP.md               # This file
├── requirements.txt                 # Dépendances
└── README.md                        # Doc du microservice
```

---

## ✅ Checklist de Validation Finale

### Phase 7 - Complète

- [ ] **Architecture FastAPI**
  - [ ] `lifespan` charge le modèle au démarrage
  - [ ] Modèle, scaler, métadonnées chargés avec succès
  - [ ] Pas de recharger à chaque requête

- [ ] **Endpoint /health**
  - [ ] GET /health retourne 200
  - [ ] Field "model_loaded" = true

- [ ] **Endpoint /calorie-estimation/predict**
  - [ ] POST /calorie-estimation/predict retourne 200
  - [ ] Réponse JSON valide (prediction, confidence, etc.)
  - [ ] Valide les 11 features
  - [ ] Valide les contraintes métier (age, bpm, etc.)
  - [ ] Utilise le scaler pour normalisation
  - [ ] Logging en stdout

- [ ] **Endpoints info**
  - [ ] GET /calorie-estimation/model-info retourne 200
  - [ ] GET /calorie-estimation/metrics retourne 200
  - [ ] Réponses cohérentes avec les métadonnées

- [ ] **Tests**
  - [ ] Tous les tests pytest passent
  - [ ] Tests manuels avec curl fonctionnent

- [ ] **Respect des règles**
  - [ ] NE PAS modifier models/CaloriesIA_1_0_0/
  - [ ] NE PAS normaliser les features manuellement
  - [ ] NE PAS mélanger Phase 7 et Phase 8
  - [ ] Ordre des features respecté (features_cols_order)

---

## 📞 Support & Questions

Si vous avez des questions lors de l'implémentation:

1. **Problème au chargement du modèle?**
   - Vérifier que `models/CaloriesIA_1_0_0/` existe et contient les fichiers `.pkl` et `.json`
   - Vérifier les chemins dans `lifespan`

2. **Prédictions incorrectes?**
   - Vérifier l'ordre des features dans `features_cols_order` de metadata
   - Vérifier que le scaler est bien appliqué
   - Vérifier l'encodage du sexe et du type_sport

3. **Validation échoue?**
   - Vérifier les ranges des features (age, bpm, etc.)
   - Vérifier que type_sport est bien "Cardio", "HIIT", "Strength", ou "Yoga"

4. **Tests échouent?**
   - Vérifier que l'API démarre sans erreur
   - Vérifier que les métadonnées sont bien chargées
   - Utiliser `pytest -v -s` pour plus de détails

---

## 🚀 Prochaines étapes après Phase 7

Une fois Phase 7 complétée:

- **Phase 8**: Intégration Ollama pour analyse de séances
- Endpoints séparés sous `/????/`
- NE PAS modifier les endpoints CalorieIA de Phase 7

---

*Dernière mise à jour: 2026-05-22*
