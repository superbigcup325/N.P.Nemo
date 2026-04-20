import uuid
import random
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.game import (
    GameStartRequest, GameStartResponse, GameState, GameAction,
    GamePhase, Player, Enemy, EnemyIntent, EnemyIntentType,
    Deck, Card, CardType, CardRarity, GameMap, MapFloor, MapRoom, RoomType
)
from core.state_machine import GameStateMachine


class GameService:
    _games: dict[str, GameState] = {}
    
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
        
        self._games[game_id] = game_state
        
        return GameStartResponse(game_id=game_id, game_state=game_state)
    
    async def get_game_state(self, game_id: str) -> Optional[GameState]:
        return self._games.get(game_id)
    
    async def perform_action(self, game_id: str, action: GameAction) -> Optional[GameState]:
        state = self._games.get(game_id)
        if not state:
            return None
        
        state_machine = GameStateMachine()
        state_machine._current_phase = state.phase
        
        if action.type == "select_map_room":
            if state_machine.can_transition(GamePhase.BATTLE):
                state_machine.transition(GamePhase.BATTLE)
                state.phase = GamePhase.BATTLE
                
                payload = action.payload or {}
                room_idx = payload.get("room_index", 0)
                
                if room_idx < len(state.map.floors[state.current_floor].rooms):
                    room = state.map.floors[state.current_floor].rooms[room_idx]
                    room.completed = True
                    
                    if room.type in (RoomType.BATTLE, RoomType.ELITE, RoomType.BOSS):
                        state.enemies = [self._create_enemy(room.type)]
                        state.deck.hand = state.deck.draw_pile[:5]
                        state.deck.draw_pile = state.deck.draw_pile[5:]
        
        elif action.type == "play_card":
            payload = action.payload or {}
            card_index = payload.get("card_index", -1)
            
            if 0 <= card_index < len(state.deck.hand):
                card = state.deck.hand.pop(card_index)
                if state.player.energy >= card.cost:
                    state.player.energy -= card.cost
                    
                    if card.damage and state.enemies:
                        target_idx = payload.get("target_index", 0)
                        if target_idx < len(state.enemies):
                            enemy = state.enemies[target_idx]
                            actual_damage = max(0, card.damage - enemy.block)
                            enemy.hp -= actual_damage
                            enemy.block = max(0, enemy.block - card.damage)
                    
                    if card.block:
                        state.player.block += card.block
                    
                    state.deck.discard_pile.append(card)
        
        elif action.type == "end_turn":
            await self.end_turn(game_id)
        
        self._check_battle_result(state)
        
        self._games[game_id] = state
        return state
    
    async def end_turn(self, game_id: str) -> Optional[GameState]:
        state = self._games.get(game_id)
        if not state:
            return None
        
        for card in state.deck.hand:
            state.deck.discard_pile.append(card)
        state.deck.hand = []
        
        draw_count = min(5, len(state.deck.draw_pile))
        state.deck.hand = state.deck.draw_pile[:draw_count]
        state.deck.draw_pile = state.deck.draw_pile[draw_count:]
        
        if not state.deck.draw_pile:
            state.deck.draw_pile = state.deck.discard_pile[:]
            state.deck.discard_pile = []
            
            random.shuffle(state.deck.draw_pile)
        
        state.player.energy = state.player.max_energy
        state.player.block = 0
        state.turn += 1
        
        for enemy in state.enemies:
            if enemy.intent.type == EnemyIntentType.ATTACK and enemy.intent.value:
                damage = max(0, enemy.intent.value - state.player.block)
                state.player.hp = max(0, state.player.hp - damage)
                state.player.block = max(0, state.player.block - enemy.intent.value)
        
        self._check_battle_result(state)
        
        self._games[game_id] = state
        return state
    
    def _check_battle_result(self, state: GameState) -> None:
        if state.phase != GamePhase.BATTLE:
            return
        
        if state.player.hp <= 0:
            state.phase = GamePhase.GAME_OVER
            state.enemies = []
            return
        
        alive_enemies = [e for e in state.enemies if e.hp > 0]
        
        if state.enemies and not alive_enemies:
            if state.current_floor >= len(state.map.floors) - 1 and any(
                r.type == RoomType.BOSS for r in state.map.floors[state.current_floor].rooms
            ):
                state.phase = GamePhase.VICTORY
            else:
                state.phase = GamePhase.REWARD
            state.enemies = []

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
    
    def _create_enemy(self, room_type: RoomType) -> Enemy:
        if room_type == RoomType.BOSS:
            return Enemy(
                id="boss_1",
                name="Guardian",
                hp=200,
                max_hp=200,
                intent=EnemyIntent(type=EnemyIntentType.ATTACK, value=16)
            )
        elif room_type == RoomType.ELITE:
            return Enemy(
                id="elite_1",
                name="Sentinel",
                hp=120,
                max_hp=120,
                intent=EnemyIntent(type=EnemyIntentType.ATTACK, value=12)
            )
        else:
            return Enemy(
                id="mob_1",
                name="Cultist",
                hp=48,
                max_hp=48,
                intent=EnemyIntent(type=EnemyIntentType.ATTACK, value=6)
            )
