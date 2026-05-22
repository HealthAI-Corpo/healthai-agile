import os
import json
import httpx
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.session import Session
from src.schemas.session import AIWorkoutResponse, SessionCreate, SessionResponse
from src.services.user_service import verify_user_exists
from src.services.llm_service import generate_llm_prediction
from src.services.workout_generation import generate_ai_workout_session

# ============================================================
# 🤖 CONFIGURATION ET LOGIQUE LLM LOCAL (OLLAMA)
# ============================================================
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://healthai-ollama-workout:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:0.5b")

async def generate_llm_prediction(system_prompt: str, user_prompt: str) -> Dict[str, Any]:
    """
    Interroge le conteneur Ollama local, gère le formatage JSON strict 
    et survit aux lenteurs de chargement du CPU grâce à un timeout étendu.
    """
    url = f"{OLLAMA_BASE_URL}/api/generate"
    
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"System: {system_prompt}\nUser: {user_prompt}",
        "format": "json",
        "stream": False
    }
    
    # Sécurité CPU : 180 secondes pour laisser le temps au modèle de s'activer
    async with httpx.AsyncClient(timeout=180.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        
        result = response.json()
        raw_text = result.get("response", "").strip()
        
        # Nettoyage des balises Markdown (```json ... ```) si le LLM triche
        if raw_text.startswith("```"):
            lines = raw_text.splitlines()
            if lines[0].startswith("```"): 
                lines = lines[1:]
            if lines[-1].startswith("```"): 
                lines = lines[:-1]
            raw_text = "\n".join(lines).strip()
            
        try:
            return json.loads(raw_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"Le LLM n'a pas renvoyé un JSON valide : {raw_text}") from e


async def generate_ai_workout_session(
    user_profile: Dict[str, Any], 
    past_sessions: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Génère une séance de sport personnalisée et structurée via l'IA locale Ollama,
    en se basant sur le profil utilisateur et en évitant les répétitions d'historique.
    """
    history_text = "Aucune séance enregistrée pour le moment (Nouvel utilisateur)."
    if past_sessions:
        history_text = "\n".join([
            f"- {s.get('date')} : {s.get('nom_seance')} (Focus: {s.get('focus')})"
            for s in past_sessions
        ])

    system_prompt = """
Tu es le coach sportif expert de l'application HealthAI. 
Tu dois concevoir une séance d'entraînement sur-mesure unique et structurée.
Tu dois répondre OBLIGATOIREMENT sous forme d'un objet JSON strict en français, sans aucun blabla avant ou après.

Format JSON attendu :
{
  "titre_seance": "Nom de la séance",
  "focus_musculaire": "Muscles ciblés",
  "duree_estimee_minutes": 45,
  "difficulte": "Débutant/Intermédiaire/Avancé",
  "corps_seance": [
    {"exercice": "Nom de l'exercice", "series": 4, "repetitions": "10-12", "conseil": "Astuce"}
  ]
}
"""

    user_prompt = f"""
Voici le profil de l'utilisateur :
- Objectif : {user_profile.get('objectif')}
- Niveau : {user_profile.get('niveau')}
- Restrictions : {user_profile.get('restrictions')}

Historique de ses dernières séances :
{history_text}

Génère la séance idéale en respectant strictement le format JSON demandé.
"""
    return await generate_llm_prediction(system_prompt=system_prompt, user_prompt=user_prompt)


# ============================================================
# 🛣️ ROUTES DE L'API (SESSIONS)
# ============================================================
router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=SessionResponse, status_code=201)
async def create_session(payload: SessionCreate, db: AsyncSession = Depends(get_db)):
    if not await verify_user_exists(payload.user_id):
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    session = Session(
        user_id=payload.user_id,
        exercices=[e.model_dump() for e in payload.exercices],
        calories_estimees=payload.calories_estimees,
        duree_min=payload.duree_min,
        recommendation_id=payload.recommendation_id,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.delete("/{session_id}", status_code=204)
async def delete_session(session_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()

    if session is None:
        raise HTTPException(status_code=404, detail="Séance introuvable")

    await db.delete(session)
    await db.commit()


@router.post("/generate-mock", response_model=AIWorkoutResponse, status_code=200)
async def generate_mock_workout():
    """
    Route de test pour l'US 3 : Génère une séance IA à partir
    de données de profil et d'historique entièrement mockées.
    """
    # 1. MOCK : Profil utilisateur simulé
    mock_profile = {
        "objectif": "Prise de masse musculaire",
        "niveau": "Intermédiaire",
        "restrictions": "Légère douleur au genou droit (éviter les squats lourds)"
    }

    # 2. MOCK : Historique simulé (Pectoraux faits la veille)
    mock_past_sessions = [
        {
            "date": "2026-05-21",
            "nom_seance": "Déchirure des Pectoraux",
            "focus": "Pectoraux et Triceps"
        }
    ]

    try:
        # 3. Appel de la génération IA via la fonction définie ci-dessus
        ai_workout = await generate_ai_workout_session(
            user_profile=mock_profile,
            past_sessions=mock_past_sessions
        )
        
        return {
            "status": "success",
            "meta_data_used": {
                "profile": mock_profile,
                "history_simulated": mock_past_sessions
            },
            "generated_workout": ai_workout
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la génération de la séance : {str(e)}"
        )
