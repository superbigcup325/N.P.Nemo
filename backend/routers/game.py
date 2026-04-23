from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from core.database import get_session
from schemas.game import (
    GameStartRequest, GameStartResponse, GameState, GameAction,
    SelectRewardRequest, RestActionRequest, ShopActionRequest
)
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
    state = await service.get_game_state(game_id)
    if not state:
        raise HTTPException(status_code=404, detail="Game not found")
    return state


@router.post("/{game_id}/action", response_model=GameState)
async def perform_action(
    game_id: str,
    action: GameAction,
    session: AsyncSession = Depends(get_session)
):
    service = GameService(session)
    
    state = await service.get_game_state(game_id)
    if not state:
        raise HTTPException(status_code=404, detail="Game not found")
    
    result = await service.perform_action(game_id, action)
    if not result:
        raise HTTPException(status_code=400, detail="Invalid action for current game state")
    return result


@router.post("/{game_id}/end-turn", response_model=GameState)
async def end_turn(
    game_id: str,
    session: AsyncSession = Depends(get_session)
):
    service = GameService(session)
    
    state = await service.get_game_state(game_id)
    if not state:
        raise HTTPException(status_code=404, detail="Game not found")
    
    result = await service.end_turn(game_id)
    if not result:
        raise HTTPException(status_code=400, detail="Cannot end turn outside battle phase")
    return result


@router.get("/{game_id}/reward")
async def get_reward(
    game_id: str,
    session: AsyncSession = Depends(get_session)
):
    service = GameService(session)
    reward = await service.generate_reward(game_id)
    if not reward:
        raise HTTPException(status_code=400, detail="Cannot generate reward outside reward phase")
    return reward


@router.post("/{game_id}/reward/select", response_model=GameState)
async def select_reward(
    game_id: str,
    request: SelectRewardRequest,
    session: AsyncSession = Depends(get_session)
):
    service = GameService(session)
    result = await service.select_reward(game_id, request.card_index, request.skip)
    if not result:
        raise HTTPException(status_code=400, detail="Cannot select reward outside reward phase")
    return result


@router.post("/{game_id}/rest", response_model=GameState)
async def rest_action(
    game_id: str,
    request: RestActionRequest,
    session: AsyncSession = Depends(get_session)
):
    service = GameService(session)
    result = await service.perform_rest_action(game_id, request.action_type)
    if not result:
        raise HTTPException(status_code=400, detail="Cannot perform rest action outside rest phase")
    return result


@router.get("/{game_id}/shop")
async def get_shop(
    game_id: str,
    session: AsyncSession = Depends(get_session)
):
    service = GameService(session)
    shop = await service.generate_shop(game_id)
    if not shop:
        raise HTTPException(status_code=400, detail="Cannot generate shop outside shop phase")
    return shop


@router.post("/{game_id}/shop/action", response_model=GameState)
async def shop_action(
    game_id: str,
    request: ShopActionRequest,
    session: AsyncSession = Depends(get_session)
):
    service = GameService(session)
    result = await service.perform_shop_action(game_id, request.item_index, request.action)
    if not result:
        raise HTTPException(status_code=400, detail="Cannot perform shop action outside shop phase")
    return result
