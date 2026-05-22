import os
import pickle
import json
import logging
from pathlib import Path
from contextlib import asynccontextmanager

import httpx
import joblib
from fastapi import FastAPI

from src.database_mongo import mongo_db
from src.routers.sessions import router as sessions_router
from src.routers.calorie_estimation import router as calorie_router

# Configuration logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Variables globales pour le modèle et les métadonnées
MODEL = None
SCALER = None
METADATA = None

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://ollama:11434")                                                                    

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Charge le modèle CaloriesIA au démarrage de l'API"""
    global MODEL, SCALER, METADATA

    # Connexion MongoDB
    await mongo_db.connect()
    logger.info("[STARTUP] MongoDB connecté")

    # Chemins des fichiers du modèle
    base_dir = Path(__file__).parent.parent
    model_dir = base_dir / "models" / "CaloriesIA_1_0_0"
    model_path = model_dir / "random_forest" / "model.pkl"
    scaler_path = model_dir / "scaler.pkl"  # Scaler à la racine du modèle
    metadata_path = model_dir / "transformation_metadata.json"

    try:
        # Vérifier que les fichiers existent
        if not model_path.exists():
            raise FileNotFoundError(f"❌ Modèle introuvable: {model_path}")
        if not scaler_path.exists():
            raise FileNotFoundError(f"❌ Scaler introuvable: {scaler_path}")
        if not metadata_path.exists():
            raise FileNotFoundError(f"❌ Métadonnées introuvables: {metadata_path}")

        # Charger le modèle (essayer joblib d'abord, puis pickle)
        try:
            MODEL = joblib.load(model_path)
            logger.info(f"✅ Modèle chargé avec joblib depuis {model_path}")
        except Exception as e:
            logger.warning(f"joblib échoue ({str(e)}), essai avec pickle...")
            with open(model_path, "rb") as f:
                MODEL = pickle.load(f)
            logger.info(f"✅ Modèle chargé avec pickle depuis {model_path}")

        # Charger le scaler (essayer joblib d'abord, puis pickle)
        try:
            SCALER = joblib.load(scaler_path)
            logger.info(f"✅ Scaler chargé avec joblib depuis {scaler_path}")
        except Exception as e:
            logger.warning(f"joblib échoue ({str(e)}), essai avec pickle...")
            with open(scaler_path, "rb") as f:
                SCALER = pickle.load(f)
            logger.info(f"✅ Scaler chargé avec pickle depuis {scaler_path}")

        # Charger les métadonnées
        with open(metadata_path, "r") as f:
            METADATA = json.load(f)
        logger.info(f"✅ Métadonnées chargées depuis {metadata_path}")

        features = METADATA.get('features_cols_order', [])
        logger.info(f"✅ Features attendues ({len(features)}): {', '.join(features)}")

    except Exception as e:
        logger.error(f"❌ Erreur lors du chargement du modèle: {str(e)}")
        raise

    yield
    # Fermeture propre à l'extinction du service
    mongo_db.close()
    logger.info("[SHUTDOWN] API en cours d'arrêt...")

# Une seule et unique instance de l'application FastAPI
app = FastAPI(title="HealthAI Workout Service", version="1.0.0", lifespan=lifespan)

# Inclusion du routeur contenant toutes les routes /sessions (dont /sessions/generate-mock)
app.include_router(sessions_router)
app.include_router(calorie_router)

@app.get("/")
async def root():
    return {"message": "Workout Service is up and running"}

@app.get("/health")
async def health():
    """Endpoint de santé pour valider la connectivité avec Ollama."""
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            ollama_status = (
                "connected" if response.status_code == 200 else "error"
            )
    except Exception:
        ollama_status = "disconnected"

    return {
        "status": "online",
        "service": "healthai-workout",
        "ollama_integration": ollama_status,
    }
