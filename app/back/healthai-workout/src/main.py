import os
import httpx
from fastapi import FastAPI

app = FastAPI(title="HealthAI Workout Service")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://healthai-ollama-workout:11434")


@app.get("/")
async def root():
    return {"message": "Workout Service is up and running"}


@app.get("/health")
async def health():
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