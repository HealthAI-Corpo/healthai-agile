"""
Service pour les prédictions de calories brûlées avec le modèle CaloriesIA
"""

import logging
import numpy as np
from typing import Dict
from fastapi import HTTPException

logger = logging.getLogger(__name__)


class CalorieService:
    """Service pour gérer les prédictions de calories"""

    def __init__(self, model, scaler, metadata):
        """
        Initialise le service avec le modèle et le scaler

        Args:
            model: RandomForestRegressor chargé
            scaler: StandardScaler pour normalisation
            metadata: Dict avec configuration du modèle
        """
        self.model = model
        self.scaler = scaler
        self.metadata = metadata
        self.features_order = metadata.get('features_cols_order', [])
        self.encoders = metadata.get('encoders', {})

    def _validate_input(self, data: Dict) -> None:
        """
        Valide les contraintes métier sur les données

        Args:
            data: Dict avec les 11 features

        Raises:
            HTTPException: Si les données ne respectent pas les contraintes
        """
        errors = []

        # Age valide
        if data.get('age', 0) < 15 or data.get('age', 0) > 100:
            errors.append("Age doit être entre 15 et 100")

        # BPM cohérent
        bpm_repos = data.get('bpm_repos', 0)
        bpm_moyen = data.get('bpm_moyen', 0)
        bpm_max = data.get('bpm_max', 0)

        if bpm_repos >= bpm_moyen:
            errors.append("BPM repos doit être < BPM moyen")
        if bpm_moyen >= bpm_max:
            errors.append("BPM moyen doit être < BPM max")

        # Durée de séance
        duree = data.get('duree_seance_minutes', 0)
        if duree < 1 or duree > 480:
            errors.append("Durée de séance doit être entre 1 et 480 minutes")

        # IMC valide
        imc = data.get('imc', 0)
        if imc < 10 or imc > 50:
            errors.append("IMC doit être entre 10 et 50")

        # Pourcentage de gras
        pourcentage_gras = data.get('pourcentage_gras', 0)
        if pourcentage_gras < 0 or pourcentage_gras > 100:
            errors.append("Pourcentage de gras doit être entre 0 et 100")

        if errors:
            raise HTTPException(status_code=422, detail="; ".join(errors))

    def _encode_categorical_features(self, data: Dict) -> Dict:
        """
        Encode les features catégoriques selon les encoders des métadonnées

        Args:
            data: Dict avec les features (incluant catégories texte)

        Returns:
            Dict avec les catégories encodées en nombres

        Raises:
            HTTPException: Si la catégorie est invalide
        """
        encoded = data.copy()

        # Encodage du sexe
        if 'sexe' in encoded:
            sexe_encoders = self.encoders.get('sexe', {})
            sexe_value = encoded['sexe'].strip()

            if sexe_value not in sexe_encoders:
                raise HTTPException(
                    status_code=422,
                    detail=f"Sexe invalide: {sexe_value}. Accepté: M ou F"
                )
            encoded['sexe'] = sexe_encoders[sexe_value]

        # Encodage du type_sport
        if 'type_sport' in encoded:
            sport_encoders = self.encoders.get('type_sport', {})
            sport_value = encoded['type_sport'].strip()

            if sport_value not in sport_encoders:
                raise HTTPException(
                    status_code=422,
                    detail=f"Type de sport invalide: {sport_value}. "
                    f"Acceptés: Cardio, HIIT, Strength, Yoga"
                )
            encoded['type_sport'] = sport_encoders[sport_value]

        return encoded

    def _build_feature_vector(self, encoded_data: Dict) -> np.ndarray:
        """
        Construit le vecteur de features dans le bon ordre pour le modèle

        Args:
            encoded_data: Dict avec les features encodées

        Returns:
            np.ndarray de shape (1, 11)

        Raises:
            HTTPException: Si des features manquent
        """
        # Vérifier que toutes les features sont présentes
        missing_features = [f for f in self.features_order if f not in encoded_data]
        if missing_features:
            raise HTTPException(
                status_code=422,
                detail=f"Features manquantes: {', '.join(missing_features)}"
            )

        # Construire le vecteur dans le bon ordre
        feature_vector = np.array([[encoded_data[f] for f in self.features_order]])

        logger.info(
            f"[FEATURE_VECTOR] Ordre respecté: {self.features_order}"
        )

        return feature_vector

    def _normalize_features(self, feature_vector: np.ndarray) -> np.ndarray:
        """
        Normalise les features avec le scaler StandardScaler

        Args:
            feature_vector: np.ndarray de shape (1, 11)

        Returns:
            np.ndarray normalisé
        """
        try:
            normalized = self.scaler.transform(feature_vector)
            logger.info("[NORMALIZATION] Features normalisées avec le scaler")
            return normalized
        except Exception as e:
            logger.error(f"[ERROR] Erreur lors de la normalisation: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Erreur de normalisation: {str(e)}"
            )


    def predict(self, request_data: Dict) -> float:
        """
        Effectue une prédiction complète des calories brûlées

        Args:
            request_data: Dict avec les 11 features

        Returns:
            float: Prédiction des calories brûlées

        Raises:
            HTTPException: En cas d'erreur de validation ou prédiction
        """
        try:
            logger.info(f"[PREDICT_START] Début de prédiction")

            # 1. Valider les contraintes métier
            self._validate_input(request_data)
            logger.info("[VALIDATION] Contraintes métier vérifiées")

            # 2. Encoder les features catégoriques
            encoded_data = self._encode_categorical_features(request_data)
            logger.info(f"[ENCODING] Encodage: sexe={encoded_data.get('sexe')}, "
                       f"type_sport={encoded_data.get('type_sport')}")

            # 3. Construire le vecteur de features
            feature_vector = self._build_feature_vector(encoded_data)

            # 4. Normaliser
            normalized_features = self._normalize_features(feature_vector)

            # 5. Prédiction
            prediction = self.model.predict(normalized_features)[0]
            logger.info(f"[PREDICTION] Prédiction brute: {prediction:.2f} kcal")

            logger.info(
                f"[PREDICT_END] Succès - Prédiction: {prediction:.2f} kcal"
            )

            return float(prediction)

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"[PREDICT_ERROR] Erreur inattendue: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Erreur lors de la prédiction: {str(e)}"
            )
