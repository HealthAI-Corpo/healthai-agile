"""
Router pour les endpoints de prédiction de calories CaloriesIA
"""

import logging
from fastapi import APIRouter, HTTPException

from src.schemas import (
    CalorieEstimationRequest,
    CalorieEstimationResponse,
    ModelInfoResponse,
    MetricsResponse,
    CalorieEstimationWithDefaultsRequest,
    CalorieEstimationWithDefaultsResponse,
)
from src.services.calorie_service import CalorieService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/calorie-estimation", tags=["CaloriesIA"])


# Initialiser le service au premier appel
_service = None


def get_service() -> CalorieService:
    """
    Retourne l'instance du service de prédiction
    Initialise le service si nécessaire

    Import tardivement pour éviter les imports circulaires
    """
    global _service

    if _service is None:
        # Import local pour éviter les imports circulaires
        from src.main import MODEL, SCALER, METADATA

        if MODEL is None or SCALER is None or METADATA is None:
            raise HTTPException(
                status_code=503,
                detail="Modèle non chargé. Veuillez redémarrer l'API."
            )
        _service = CalorieService(MODEL, SCALER, METADATA)
        logger.info("[SERVICE] CalorieService initialisé")

    return _service


@router.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info() -> ModelInfoResponse:
    """
    Obtenir les informations du modèle CaloriesIA

    Retourne:
    - Nom du modèle
    - Version du modèle
    - Liste des 11 features requises
    - Type de modèle (RandomForest)
    - Date d'entraînement
    - Statut (PRODUCTION)
    - Nombre d'échantillons de test
    """
    # Import local pour éviter les imports circulaires
    from src.main import MODEL, METADATA

    if MODEL is None or METADATA is None:
        logger.warning("[MODEL-INFO] Modèle non chargé")
        return ModelInfoResponse(features_required=[])

    features = METADATA.get('features_cols_order', [])
    logger.info("[MODEL-INFO] Requête des infos du modèle")

    return ModelInfoResponse(
        model_name="CaloriesIA_1_0_0",
        model_version="1.0.0",
        features_required=features,
        model_type="RandomForest",
        training_date="2026-05-22",
        status="PRODUCTION",
        n_samples_test=491
    )


@router.get("/metrics", response_model=MetricsResponse)
async def get_metrics() -> MetricsResponse:
    """
    Obtenir les métriques de performance du modèle CaloriesIA

    Retourne:
    - R² Score: 0.175 (explique 17.5% de la variance)
    - MAE: 200.39 calories (erreur absolue moyenne)
    - RMSE: 280.22 calories (racine de l'erreur quadratique moyenne)
    - MAPE: 24.59% (pourcentage d'erreur absolu)
    """
    # Import local pour éviter les imports circulaires
    from src.main import MODEL, METADATA

    if MODEL is None or METADATA is None:
        logger.warning("[METRICS] Modèle non chargé")
        return MetricsResponse(
            r2_score=0.0,
            mae=0.0,
            rmse=0.0,
            mape=0.0
        )

    logger.info("[METRICS] Requête des métriques du modèle")

    return MetricsResponse(
        r2_score=0.1751498562391377,
        mae=200.38720793270784,
        rmse=280.22221121281746,
        mape=24.592865626059794,
        model_version="1.0.0"
    )


@router.post("/predict", response_model=CalorieEstimationResponse)
async def predict_calories(
    request: CalorieEstimationRequest,
) -> CalorieEstimationResponse:
    """
    Prédire les calories brûlées à partir de 11 features

    **Features requises (dans l'ordre):**
    - imc: float - Indice de Masse Corporelle (10-50)
    - age: int - Âge du pratiquant (15-100)
    - sexe: str - "M" ou "F"
    - bpm_max: float - BPM maximal pendant la séance
    - bpm_moyen: float - BPM moyen pendant la séance
    - bpm_repos: float - BPM au repos
    - duree_seance_minutes: float - Durée en minutes (1-480)
    - type_sport: str - "Cardio"/"HIIT" (0) ou "Strength"/"Yoga" (1)
    - pourcentage_gras: float - Pourcentage de graisse corporelle (0-100)
    - consommation_eau_ml: float - Eau consommée en ml (≥0)
    - niveau_experience: int - Niveau d'expérience (0-5)

    **Réponse:**
    - prediction: float - Calories brûlées estimées
    - model_version: str - Version du modèle
    - features_used: int - Nombre de features (toujours 11)
    - model_name: str - Nom du modèle

    **Erreurs possibles:**
    - 422: Validation échouée (données manquantes ou invalides)
    - 503: Modèle non chargé
    - 500: Erreur interne
    """

    try:
        logger.info(f"[ENDPOINT] POST /calorie-estimation/predict - Requête reçue")

        # Obtenir le service
        service = get_service()

        # Convertir la requête en dictionnaire
        request_data = request.model_dump()

        # Prédire
        prediction = service.predict(request_data)

        # Construire la réponse
        response = CalorieEstimationResponse(
            prediction=round(prediction, 2),
            model_version="1.0.0",
            features_used=11,
            model_name="CaloriesIA_1_0_0"
        )

        logger.info(
            f"[ENDPOINT] Réponse: prediction={response.prediction} kcal"
        )

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ENDPOINT_ERROR] Erreur inattendue: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du traitement: {str(e)}"
        )


@router.post("/predict-with-defaults", response_model=CalorieEstimationWithDefaultsResponse)
async def predict_calories_with_defaults(
    request: CalorieEstimationWithDefaultsRequest,
) -> CalorieEstimationWithDefaultsResponse:
    """
    Prédire les calories avec imputation des features manquantes

    Les features manquantes sont remplacées par les moyennes du dataset d'entraînement.

    **Features optionnelles:**
    - imc, age, sexe, bpm_max, bpm_moyen, bpm_repos
    - duree_seance_minutes, type_sport, pourcentage_gras
    - consommation_eau_ml, niveau_experience

    **Réponse:**
    - prediction: Calories estimées
    - imputed_features: Dict des features imputées avec leurs valeurs
    - original_values: Dict des features originales fournies
    - model_version, features_used, model_name

    **Cas d'usage:**
    - Quand l'utilisateur ne peut pas fournir tous les paramètres
    - Imputation utilise les moyennes de l'ensemble d'entraînement
    - ⚠️ Les prédictions avec features imputées sont moins fiables

    **Erreurs possibles:**
    - 422: Validation des valeurs fournies échouée
    - 500: Erreur de prédiction
    """

    try:
        logger.info(f"[ENDPOINT] POST /calorie-estimation/predict-with-defaults - Requête reçue")

        # Obtenir le service
        service = get_service()

        # Convertir la requête en dictionnaire
        request_data = request.model_dump()

        # Prédire avec imputation
        prediction, imputed_features, original_values = service.predict_with_defaults(request_data)

        # Construire la réponse
        response = CalorieEstimationWithDefaultsResponse(
            prediction=round(prediction, 2),
            model_version="1.0.0",
            features_used=11,
            model_name="CaloriesIA_1_0_0",
            imputed_features=imputed_features,
            original_values=original_values
        )

        logger.info(
            f"[ENDPOINT] Réponse: prediction={response.prediction} kcal, "
            f"features_imputees={len(imputed_features)}"
        )

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ENDPOINT_ERROR] Erreur inattendue: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du traitement: {str(e)}"
        )

