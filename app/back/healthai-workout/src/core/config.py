from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Configuration du serveur
    SERVICE_PORT: int = 8002

    # Connexions BDD (Pydantic ira chercher les valeurs dans le .env)
    MONGODB_URL: str = "mongodb://mongo:27017"
    MONGODB_DB_NAME: str = "healthai_workout"
    DATABASE_URL: str = "postgresql+asyncpg://healthai:healthai@localhost:5432/healthai_db"

    # Authentification inter-services
    INTERNAL_API_URL: str = "http://healthai-api:3000"
    INTERNAL_API_KEY: str = "change-me-min-32-chars-xxxxxxxxxxxxxxxx"

    # ML
    MODEL_PATH: str = "/app/models/recommender_v1.joblib"


settings = Settings()
