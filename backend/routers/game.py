from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_session
from schemas.game import GameStartRequest, GameStartResponse, GameState, GameAction
from services.game_service import GameService

router = APIRouter()


@router.post("/start", response_model=GameStartResponse)
async def start_game(
    request: GameStartRequest,
    session: AsyncSession = Depends(get_session)
):
    service = GameService(session)
    return await service.start_game(request)


@router.get("/{game_id}/state", response_model=GameState)
async def get_game_state(
    game_id: str,
    session: AsyncSession = Depends(get_session)
):
    service = GameService(session)
    return await service.get_game_state(game_id)


@router.post("/{game_id}/action", response_model=GameState)
async def perform_action(
    game_id: str,
    action: GameAction,
    session: AsyncSession = Depends(get_session)
):
    service = GameService(session)
    return await service.perform_action(game_id, action)


@router.post("/{game_id}/end-turn", response_model=GameState)
async def end_turn(
    game_id: str,
    session: AsyncSession = Depends(get_session)
):
    service = GameService(session)
    return await service.end_turn(game_id)
