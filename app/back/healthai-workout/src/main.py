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


@app.get("/")
async def root():
    return {"message": "Workout Service is up and running"}


@app.get("/health")
async def health():
    return {
        "status": "online",
        "service": "healthai-workout",
        "mongodb_connected": mongo_db.db is not None,
    }
