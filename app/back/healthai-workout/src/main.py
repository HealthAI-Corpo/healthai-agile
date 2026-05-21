<<<<<<< HEAD
import os
import httpx
=======
>>>>>>> 48e2171 (release: Sprint 1 (#39))
from fastapi import FastAPI

app = FastAPI(title="HealthAI Workout Service")

<<<<<<< HEAD
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://healthai-ollama-workout:11434")
from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.database_mongo import mongo_db
from src.routers.sessions import router as sessions_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await mongo_db.connect()
    yield
    mongo_db.close()


app = FastAPI(title="HealthAI Workout Service", lifespan=lifespan)

app.include_router(sessions_router)

=======
>>>>>>> 48e2171 (release: Sprint 1 (#39))

@app.get("/")
async def root():
    return {"message": "Workout Service is up and running"}


@app.get("/health")
async def health():
<<<<<<< HEAD
    # Vérification ultra-rapide si Ollama répond au ping
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
=======
    # Verification
    return {"status": "online", "service": "healthai-workout"}
>>>>>>> 48e2171 (release: Sprint 1 (#39))
