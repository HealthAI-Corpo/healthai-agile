import os
from contextlib import asynccontextmanager
import httpx
from fastapi import FastAPI

from src.database_mongo import mongo_db
from src.routers.sessions import router as sessions_router

# Configuration de l'URL Ollama locale (pointe sur ton conteneur workout)
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://healthai-ollama-workout:11434")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Démarrage propre de la connexion à MongoDB
    await mongo_db.connect()
    yield
    # Fermeture propre à l'extinction du service
    mongo_db.close()

# Une seule et unique instance de l'application FastAPI
app = FastAPI(title="HealthAI Workout Service", lifespan=lifespan)

# Inclusion du routeur contenant toutes les routes /sessions (dont /sessions/generate-mock)
app.include_router(sessions_router)

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