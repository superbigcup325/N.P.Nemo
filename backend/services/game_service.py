import json
import uuid
import random
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from schemas.game import (
    GameStartRequest, GameStartResponse, GameState, GameAction,
    GamePhase, Player, Enemy, EnemyIntent, EnemyIntentType,
    Deck, Card, CardType, CardRarity, GameMap, MapFloor, MapRoom, RoomType
)
from core.state_machine import GameStateMachine
from models.game import GameModel


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
        
        game_record = GameModel(id=game_id, state=game_state.model_dump_json())
        self.session.add(game_record)
        await self.session.commit()
        await self.session.refresh(game_record)
        
        return GameStartResponse(game_id=game_id, game_state=game_state)
    
    async def get_game_state(self, game_id: str) -> Optional[GameState]:
        result = await self.session.execute(
            select(GameModel).where(GameModel.id == game_id)
        )
        game_record = result.scalar_one_or_none()
        
        if not game_record:
            return None
        
        return GameState.model_validate_json(game_record.state)
    
    async def _save_game_state(self, state: GameState) -> None:
        result = await self.session.execute(
            select(GameModel).where(GameModel.id == state.game_id)
        )
        game_record = result.scalar_one_or_none()
        
        if game_record:
            game_record.state = state.model_dump_json()
            await self.session.commit()
    
    async def perform_action(self, game_id: str, action: GameAction) -> Optional[GameState]:
        state = await self.get_game_state(game_id)
        if not state:
            return None
        
        state_machine = GameStateMachine()
        state_machine._current_phase = state.phase
        
        if action.type == "select_map_room":
            payload = action.payload or {}
            room_idx = payload.get("room_index", 0)
            
            if room_idx < len(state.map.floors[state.current_floor].rooms):
                room = state.map.floors[state.current_floor].rooms[room_idx]
                room.completed = True
                
                if room.type in (RoomType.BATTLE, RoomType.ELITE, RoomType.BOSS):
                    state.phase = GamePhase.BATTLE
                    state.enemies = [self._create_enemy(room.type)]
                    state.deck.hand = state.deck.draw_pile[:5]
                    state.deck.draw_pile = state.deck.draw_pile[5:]
                    
                elif room.type == RoomType.REST:
                    state.phase = GamePhase.REST
                    
                elif room.type == RoomType.SHOP:
                    state.phase = GamePhase.SHOP
                    
                elif room.type == RoomType.EVENT:
                    state.phase = GamePhase.MAP
        
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
            return await self.get_game_state(game_id)
        
        self._check_battle_result(state)
        
        await self._save_game_state(state)
        return state
    
    async def end_turn(self, game_id: str) -> Optional[GameState]:
        state = await self.get_game_state(game_id)
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
        
        await self._save_game_state(state)
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

    def _get_reward_card_pool(self) -> list[Card]:
        return [
            Card(id="reward_heavy_blade", name="Heavy Blade", description="Deal 14 damage.",
                 type=CardType.ATTACK, rarity=CardRarity.COMMON, cost=2, damage=14),
            Card(id="reward_pommel_strike", name="Pommel Strike", description="Deal 9 damage. Draw 1 card.",
                 type=CardType.ATTACK, rarity=CardRarity.COMMON, cost=1, damage=9),
            Card(id="reward_carnage", name="Carnage", description="Deal 20 damage.",
                 type=CardType.ATTACK, rarity=CardRarity.UNCOMMON, cost=2, damage=20),
            Card(id="reward_iron_wave", name="Iron Wave", description="Gain 5 block. Deal 5 damage.",
                 type=CardType.ATTACK, rarity=CardRarity.COMMON, cost=1, damage=5, block=5),
            Card(id="reward_armaments", name="Armaments", description="Gain 5 block.",
                 type=CardType.SKILL, rarity=CardRarity.COMMON, cost=1, block=5),
            Card(id="reward_battle_trance", name="Battle Trance", description="Draw 3 cards.",
                 type=CardType.SKILL, rarity=CardRarity.UNCOMMON, cost=0),
            Card(id="reward_flame_barrier", name="Flame Barrier", description="Gain 8 block. Deal 4 damage to ALL enemies when attacked.",
                 type=CardType.SKILL, rarity=CardRarity.UNCOMMON, cost=2, block=8),
            Card(id="reward_flex", name="Flex", description="Gain 10 strength this turn. Lose 2 strength at end of turn.",
                 type=CardType.SKILL, rarity=CardRarity.COMMON, cost=0),
            Card(id="reward_bloodletting", name="Bloodletting", description="Lose 3 HP. Gain 3 Energy.",
                 type=CardType.SKILL, rarity=CardRarity.UNCOMMON, cost=0),
            Card(id="reward_inflame", name="Inflame", description="Gain 2 Strength.",
                 type=CardType.ABILITY, rarity=CardRarity.UNCOMMON, cost=1),
            Card(id="reward_metallicize", name="Metallicize", description="Gain 3 Plated Armor.",
                 type=CardType.ABILITY, rarity=CardRarity.RARE, cost=1),
            Card(id="reward_evolve", name="Evolve", description="+1 card drawn at start of turn.",
                 type=CardType.ABILITY, rarity=CardRarity.RARE, cost=1),
        ]

    async def generate_reward(self, game_id: str):
        state = await self.get_game_state(game_id)
        if not state or state.phase != GamePhase.REWARD:
            return None

        rng = random.Random(state.rng_seed + f"_reward_{state.turn}")
        card_pool = self._get_reward_card_pool()
        
        reward_cards = rng.sample(card_pool, min(3, len(card_pool)))
        
        gold_reward = rng.randint(15, 35)
        
        state.player.gold += gold_reward
        
        reward_offer = {
            "cards": [{"card": card.model_dump(), "selected": False} for card in reward_cards],
            "gold_reward": gold_reward,
            "can_skip": True
        }
        
        await self._save_game_state(state)
        return reward_offer

    async def select_reward(self, game_id: str, card_index: int = None, skip: bool = False):
        state = await self.get_game_state(game_id)
        if not state or state.phase != GamePhase.REWARD:
            return None

        if not skip and card_index is not None:
            rng = random.Random(state.rng_seed + f"_reward_{state.turn}")
            card_pool = self._get_reward_card_pool()
            reward_cards = rng.sample(card_pool, min(3, len(card_pool)))
            
            if 0 <= card_index < len(reward_cards):
                selected_card = reward_cards[card_index]
                new_card_id = f"{selected_card.id}_{uuid.uuid4().hex[:8]}"
                selected_card.id = new_card_id
                state.deck.draw_pile.append(selected_card)

        state.phase = GamePhase.MAP
        
        await self._save_game_state(state)
        return state

    async def perform_rest_action(self, game_id: str, action_type: str):
        state = await self.get_game_state(game_id)
        if not state or state.phase != GamePhase.REST:
            return None

        if action_type == "heal":
            heal_amount = int(state.player.maxHp * 0.3)
            state.player.hp = min(state.player.maxHp, state.player.hp + heal_amount)
        elif action_type == "upgrade":
            if state.deck.draw_pile:
                card_to_upgrade = state.deck.draw_pile[0]
                if not card_to_upgrade.upgraded:
                    card_to_upgrade.upgraded = True
                    if card_to_upgrade.damage:
                        card_to_upgrade.damage += 3
                    if card_to_upgrade.block:
                        card_to_upgrade.block += 2
                    card_to_upgrade.cost = max(0, card_to_upgrade.cost - 1)
        
        state.phase = GamePhase.MAP
        
        await self._save_game_state(state)
        return state

    def _get_shop_card_pool(self) -> list[Card]:
        return [
            Card(id="shop_heavy_blade", name="Heavy Blade", description="Deal 14 damage.",
                 type=CardType.ATTACK, rarity=CardRarity.COMMON, cost=2, damage=14),
            Card(id="shop_pommel_strike", name="Pommel Strike", description="Deal 9 damage. Draw 1 card.",
                 type=CardType.ATTACK, rarity=CardRarity.COMMON, cost=1, damage=9),
            Card(id="shop_carnage", name="Carnage", description="Deal 20 damage.",
                 type=CardType.ATTACK, rarity=CardRarity.UNCOMMON, cost=2, damage=20),
            Card(id="shop_iron_wave", name="Iron Wave", description="Gain 5 block. Deal 5 damage.",
                 type=CardType.ATTACK, rarity=CardRarity.COMMON, cost=1, damage=5, block=5),
            Card(id="shop_armaments", name="Armaments", description="Gain 5 block.",
                 type=CardType.SKILL, rarity=CardRarity.COMMON, cost=1, block=5),
            Card(id="shop_battle_trance", name="Battle Trance", description="Draw 3 cards.",
                 type=CardType.SKILL, rarity=CardRarity.UNCOMMON, cost=0),
            Card(id="shop_flame_barrier", name="Flame Barrier", description="Gain 8 block. Deal 4 damage to ALL enemies when attacked.",
                 type=CardType.SKILL, rarity=CardRarity.UNCOMMON, cost=2, block=8),
            Card(id="shop_flex", name="Flex", description="Gain 10 strength this turn. Lose 2 strength at end of turn.",
                 type=CardType.SKILL, rarity=CardRarity.COMMON, cost=0),
            Card(id="shop_inflame", name="Inflame", description="Gain 2 Strength.",
                 type=CardType.ABILITY, rarity=CardRarity.UNCOMMON, cost=1),
            Card(id="shop_metallicize", name="Metallicize", description="Gain 3 Plated Armor.",
                 type=CardType.ABILITY, rarity=CardRarity.RARE, cost=1),
        ]

    async def generate_shop(self, game_id: str):
        state = await self.get_game_state(game_id)
        if not state or state.phase != GamePhase.SHOP:
            return None

        rng = random.Random(state.rng_seed + f"_shop_{state.turn}")
        card_pool = self._get_shop_card_pool()
        
        shop_items = []
        num_items = rng.randint(3, 5)
        
        selected_cards = rng.sample(card_pool, min(num_items, len(card_pool)))
        
        for card in selected_cards:
            price = 50 if card.rarity == CardRarity.COMMON else (75 if card.rarity == CardRarity.UNCOMMON else 150)
            shop_items.append({
                "card": card.model_dump(),
                "price": price,
                "item_type": "card_add"
            })
        
        shop_offer = {
            "items": shop_items,
            "remove_price": 50
        }
        
        return shop_offer

    async def perform_shop_action(self, game_id: str, item_index: int, action: str):
        state = await self.get_game_state(game_id)
        if not state or state.phase != GamePhase.SHOP:
            return None

        if action == "buy":
            rng = random.Random(state.rng_seed + f"_shop_{state.turn}")
            card_pool = self._get_shop_card_pool()
            num_items = min(rng.randint(3, 5), len(card_pool))
            selected_cards = rng.sample(card_pool, num_items)
            
            if 0 <= item_index < len(selected_cards):
                card_to_buy = selected_cards[item_index]
                
                price = 50 if card_to_buy.rarity == CardRarity.COMMON else (75 if card_to_buy.rarity == CardRarity.UNCOMMON else 150)
                
                if state.player.gold >= price:
                    state.player.gold -= price
                    new_card_id = f"{card_to_buy.id}_{uuid.uuid4().hex[:8]}"
                    card_to_buy.id = new_card_id
                    state.deck.draw_pile.append(card_to_buy)
                    
        elif action == "remove":
            remove_price = 50
            
            all_cards = (state.deck.draw_pile + state.deck.discard_pile + 
                        state.deck.hand + state.deck.exhaust_pile)
            
            if state.player.gold >= remove_price and all_cards and 0 <= item_index < len(all_cards):
                state.player.gold -= remove_price
                card_to_remove = all_cards[item_index]
                
                if card_to_remove in state.deck.draw_pile:
                    state.deck.draw_pile.remove(card_to_remove)
                elif card_to_remove in state.deck.discard_pile:
                    state.deck.discard_pile.remove(card_to_remove)
                elif card_to_remove in state.deck.hand:
                    state.deck.hand.remove(card_to_remove)
                elif card_to_remove in state.deck.exhaust_pile:
                    state.deck.exhaust_pile.remove(card_to_remove)
        
        state.phase = GamePhase.MAP
        
        await self._save_game_state(state)
        return state
