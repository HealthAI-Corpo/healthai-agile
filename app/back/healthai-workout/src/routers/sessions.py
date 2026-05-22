from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.session import Session
from src.schemas.session import SessionCreate, SessionResponse
from src.services.user_service import verify_user_exists

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("", response_model=list[SessionResponse])
async def list_sessions(
    user_id: int = Query(...),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Session)
        .where(Session.user_id == user_id)
        .order_by(Session.timestamp.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(session_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()
    if session is None:
        raise HTTPException(status_code=404, detail="Séance introuvable")
    return session


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
