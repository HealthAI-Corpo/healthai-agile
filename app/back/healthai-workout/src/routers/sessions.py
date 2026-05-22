from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.session import Session
from src.schemas.session import SessionCreate, SessionResponse
from src.services.user_service import verify_user_exists

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
