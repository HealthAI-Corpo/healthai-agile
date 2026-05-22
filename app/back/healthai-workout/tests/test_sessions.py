from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from src.database import get_db
from src.main import app

VALID_PAYLOAD = {
    "user_id": 1,
    "exercices": [
        {"nom": "Squat", "series": 3, "repetitions": 10, "repos_sec": 60}
    ],
    "duree_min": 45,
}


def make_mock_db(existing_session=None):
    mock_db = MagicMock()
    mock_db.add = MagicMock()
    mock_db.commit = AsyncMock()
    mock_db.delete = AsyncMock()

    def fake_refresh(obj):
        obj.id = 1
        obj.timestamp = datetime(2026, 5, 22, 11, 0, 0)

    mock_db.refresh = AsyncMock(side_effect=fake_refresh)

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = existing_session
    mock_db.execute = AsyncMock(return_value=mock_result)

    return mock_db


@pytest.fixture(autouse=True)
def override_db():
    mock_session = make_mock_db()

    async def _get_db():
        yield mock_session

    app.dependency_overrides[get_db] = _get_db
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def client():
    return TestClient(app)


def test_create_session_success(client):
    with patch("src.routers.sessions.verify_user_exists", new=AsyncMock(return_value=True)):
        response = client.post("/sessions", json=VALID_PAYLOAD)

    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == 1
    assert len(data["exercices"]) == 1
    assert data["exercices"][0]["nom"] == "Squat"


def test_create_session_user_not_found(client):
    with patch("src.routers.sessions.verify_user_exists", new=AsyncMock(return_value=False)):
        response = client.post("/sessions", json=VALID_PAYLOAD)

    assert response.status_code == 404
    assert response.json()["detail"] == "Utilisateur introuvable"


def test_create_session_empty_exercices(client):
    payload = {**VALID_PAYLOAD, "exercices": []}

    with patch("src.routers.sessions.verify_user_exists", new=AsyncMock(return_value=True)):
        response = client.post("/sessions", json=payload)

    assert response.status_code == 422


def test_create_session_with_recommendation_id(client):
    payload = {**VALID_PAYLOAD, "recommendation_id": "507f1f77bcf86cd799439011"}

    with patch("src.routers.sessions.verify_user_exists", new=AsyncMock(return_value=True)):
        response = client.post("/sessions", json=payload)

    assert response.status_code == 201
    assert response.json()["recommendation_id"] == "507f1f77bcf86cd799439011"


def test_delete_session_success(client):
    mock_session = MagicMock()
    mock_session.id = 1

    async def _get_db_with_session():
        yield make_mock_db(existing_session=mock_session)

    app.dependency_overrides[get_db] = _get_db_with_session
    response = client.delete("/sessions/1")
    assert response.status_code == 204


def test_delete_session_not_found(client):
    async def _get_db_empty():
        yield make_mock_db(existing_session=None)

    app.dependency_overrides[get_db] = _get_db_empty
    response = client.delete("/sessions/99")
    assert response.status_code == 404
    assert response.json()["detail"] == "Séance introuvable"
