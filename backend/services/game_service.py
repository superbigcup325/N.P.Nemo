import uuid
import random
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from ..schemas.game import (
    GameStartRequest, GameStartResponse, GameState, GameAction,
    GamePhase, Player, Enemy, EnemyIntent, EnemyIntentType,
    Deck, Card, CardType, CardRarity, GameMap, MapFloor, MapRoom, RoomType
)


class GameService:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def start_game(self, request: GameStartRequest) -> GameStartResponse:
        game_id = str(uuid.uuid4())
        seed = request.seed or str(uuid.uuid4())
        
        initial_deck = self._create_starter_deck()
        game_map = self._generate_map(seed)
        
        game_state = GameState(
            game_id=game_id,
            phase=GamePhase.MAP,
            turn=0,
            player=Player(
                hp=80,
                max_hp=80,
                block=0,
                energy=3,
                max_energy=3,
                gold=99
            ),
            enemies=[],
            deck=Deck(
                draw_pile=initial_deck,
                hand=[],
                discard_pile=[],
                exhaust_pile=[]
            ),
            map=game_map,
            current_floor=0,
            current_room=0,
            rng_seed=seed
        )
        
        return GameStartResponse(game_id=game_id, game_state=game_state)
    
    async def get_game_state(self, game_id: str) -> GameState:
        pass
    
    async def perform_action(self, game_id: str, action: GameAction) -> GameState:
        pass
    
    async def end_turn(self, game_id: str) -> GameState:
        pass
    
    def _create_starter_deck(self) -> list[Card]:
        return [
            Card(id=f"strike_{i}", name="Strike", description="Deal 6 damage.",
                 type=CardType.ATTACK, rarity=CardRarity.COMMON, cost=1, damage=6)
            for i in range(5)
        ] + [
            Card(id=f"defend_{i}", name="Defend", description="Gain 5 block.",
                 type=CardType.SKILL, rarity=CardRarity.COMMON, cost=1, block=5)
            for i in range(4)
        ] + [
            Card(id="bash", name="Bash", description="Deal 8 damage. Apply 2 Vulnerable.",
                 type=CardType.ATTACK, rarity=CardRarity.COMMON, cost=2, damage=8)
        ]
    
    def _generate_map(self, seed: str) -> GameMap:
        rng = random.Random(seed)
        floors = []
        
        for floor_idx in range(3):
            rooms = []
            num_rooms = rng.randint(3, 5)
            
            for room_idx in range(num_rooms):
                room_type = self._random_room_type(rng, floor_idx, room_idx == num_rooms - 1)
                room = MapRoom(
                    id=f"floor_{floor_idx}_room_{room_idx}",
                    type=room_type,
                    completed=False,
                    connections=[]
                )
                rooms.append(room)
            
            floors.append(MapFloor(rooms=rooms))
        
        return GameMap(floors=floors)
    
    def _random_room_type(self, rng: random.Random, floor: int, is_last: bool) -> RoomType:
        if is_last:
            return RoomType.BOSS if floor == 2 else RoomType.ELITE
        
        roll = rng.random()
        if roll < 0.6:
            return RoomType.BATTLE
        elif roll < 0.8:
            return RoomType.REST
        elif roll < 0.9:
            return RoomType.SHOP
        else:
            return RoomType.EVENT
