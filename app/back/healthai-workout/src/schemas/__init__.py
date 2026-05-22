from pydantic import BaseModel, Field
from typing import List, Dict, Any


class ModelInfoResponse(BaseModel):
    """Infos du modèle"""
    model_name: str = Field(default="CaloriesIA_1_0_0", description="Nom du modèle")
    model_version: str = Field(default="1.0.0", description="Version du modèle")
    features_required: List[str] = Field(..., description="Features requises (11)")
    model_type: str = Field(default="RandomForest", description="Type de modèle")
    training_date: str = Field(default="2026-05-22", description="Date d'entraînement")
    status: str = Field(default="PRODUCTION", description="Statut du modèle")
    n_samples_test: int = Field(default=491, description="Nombre d'échantillons de test")


class MetricsResponse(BaseModel):
    """Métriques du modèle"""
    r2_score: float = Field(..., description="R² score")
    mae: float = Field(..., description="Mean Absolute Error")
    rmse: float = Field(..., description="Root Mean Squared Error")
    mape: float = Field(..., description="Mean Absolute Percentage Error")
    model_version: str = Field(default="1.0.0", description="Version du modèle")


class CalorieEstimationRequest(BaseModel):
    """Modèle d'entrée pour prédiction de calories"""
    imc: float = Field(..., gt=0, description="Indice de Masse Corporelle")
    age: int = Field(..., gt=0, lt=150, description="Âge du pratiquant")
    sexe: str = Field(..., pattern="^[MFmf]$", description="Sexe: M ou F")
    bpm_max: float = Field(..., gt=0, description="BPM maximal pendant la séance")
    bpm_moyen: float = Field(..., gt=0, description="BPM moyen pendant la séance")
    bpm_repos: float = Field(..., gt=0, description="BPM au repos")
    duree_seance_minutes: float = Field(..., gt=0, description="Durée de la séance en minutes")
    type_sport: str = Field(..., description="Type de sport: Cardio/HIIT ou Strength/Yoga")
    pourcentage_gras: float = Field(..., ge=0, le=100, description="Pourcentage de graisse corporelle")
    consommation_eau_ml: float = Field(..., ge=0, description="Eau consommée en ml")
    niveau_experience: int = Field(..., ge=0, le=5, description="Niveau d'expérience (0-5)")


class CalorieEstimationResponse(BaseModel):
    """Modèle de réponse pour prédiction"""
    prediction: float = Field(..., description="Calories brûlées estimées")
    model_version: str = Field(default="1.0.0", description="Version du modèle")
    features_used: int = Field(default=11, description="Nombre de features utilisées")
    model_name: str = Field(default="CaloriesIA_1_0_0", description="Nom du modèle")


class CalorieEstimationWithDefaultsRequest(BaseModel):
    """Modèle d'entrée avec features optionnelles (imputées par défaut)"""
    imc: float | None = Field(None, gt=0, description="Indice de Masse Corporelle")
    age: int | None = Field(None, gt=0, lt=150, description="Âge du pratiquant")
    sexe: str | None = Field(None, pattern="^[MFmf]$", description="Sexe: M ou F")
    bpm_max: float | None = Field(None, gt=0, description="BPM maximal")
    bpm_moyen: float | None = Field(None, gt=0, description="BPM moyen")
    bpm_repos: float | None = Field(None, gt=0, description="BPM au repos")
    duree_seance_minutes: float | None = Field(None, gt=0, description="Durée en minutes")
    type_sport: str | None = Field(None, description="Type de sport")
    pourcentage_gras: float | None = Field(None, ge=0, le=100, description="Pourcentage gras")
    consommation_eau_ml: float | None = Field(None, ge=0, description="Eau ml")
    niveau_experience: int | None = Field(None, ge=0, le=5, description="Niveau expérience")


class CalorieEstimationWithDefaultsResponse(BaseModel):
    """Réponse avec indication des valeurs imputées"""
    prediction: float = Field(..., description="Calories brûlées estimées")
    model_version: str = Field(default="1.0.0", description="Version du modèle")
    features_used: int = Field(default=11, description="Nombre de features")
    model_name: str = Field(default="CaloriesIA_1_0_0", description="Nom du modèle")
    imputed_features: dict = Field(default_factory=dict, description="Features imputées avec leurs valeurs par défaut")
    original_values: dict = Field(default_factory=dict, description="Features originales fournies")
