from enum import Enum
from typing import List, Optional
from pydantic import BaseModel


class CardType(str, Enum):
    ATTACK = "attack"
    SKILL = "skill"
    ABILITY = "ability"


class CardRarity(str, Enum):
    COMMON = "common"
    UNCOMMON = "uncommon"
    RARE = "rare"


class EnemyIntentType(str, Enum):
    ATTACK = "attack"
    DEFEND = "defend"
    BUFF = "buff"
    DEBUFF = "debuff"
    UNKNOWN = "unknown"


class GamePhase(str, Enum):
    MAP = "map"
    BATTLE = "battle"
    REWARD = "reward"
    SHOP = "shop"
    REST = "rest"
    EVENT = "event"
    VICTORY = "victory"
    GAME_OVER = "game_over"


class RoomType(str, Enum):
    BATTLE = "battle"
    ELITE = "elite"
    BOSS = "boss"
    REST = "rest"
    SHOP = "shop"
    EVENT = "event"
    UNKNOWN = "unknown"


class CardEffect(BaseModel):
    type: str
    value: Optional[int] = None
    target: Optional[str] = None


class Card(BaseModel):
    id: str
    name: str
    description: str
    type: CardType
    rarity: CardRarity
    cost: int
    damage: Optional[int] = None
    block: Optional[int] = None
    effects: Optional[List[CardEffect]] = None
    upgraded: bool = False


class Buff(BaseModel):
    id: str
    name: str
    stacks: int


class Debuff(BaseModel):
    id: str
    name: str
    stacks: int


class EnemyIntent(BaseModel):
    type: EnemyIntentType
    value: Optional[int] = None


class Enemy(BaseModel):
    id: str
    name: str
    hp: int
    max_hp: int
    block: int = 0
    intent: EnemyIntent
    buffs: List[Buff] = []
    debuffs: List[Debuff] = []


class Player(BaseModel):
    hp: int
    max_hp: int
    block: int = 0
    energy: int
    max_energy: int
    gold: int
    buffs: List[Buff] = []
    debuffs: List[Debuff] = []


class Deck(BaseModel):
    draw_pile: List[Card]
    hand: List[Card]
    discard_pile: List[Card]
    exhaust_pile: List[Card] = []


class MapRoom(BaseModel):
    id: str
    type: RoomType
    completed: bool = False
    connections: List[str] = []


class MapFloor(BaseModel):
    rooms: List[MapRoom]


class GameMap(BaseModel):
    floors: List[MapFloor]


class GameState(BaseModel):
    game_id: str
    phase: GamePhase
    turn: int
    player: Player
    enemies: List[Enemy] = []
    deck: Deck
    map: GameMap
    current_floor: int
    current_room: int
    rng_seed: str
    pending_rewards: List[Card] = []


class GameStartRequest(BaseModel):
    character: Optional[str] = "ironclad"
    seed: Optional[str] = None
    ascension: Optional[int] = 0


class GameStartResponse(BaseModel):
    game_id: str
    game_state: GameState


class GameAction(BaseModel):
    type: str
    payload: Optional[dict] = None


class RewardCard(BaseModel):
    card: Card
    selected: bool = False


class RewardOffer(BaseModel):
    cards: List[RewardCard]
    gold_reward: int = 0
    can_skip: bool = True


class SelectRewardRequest(BaseModel):
    card_index: Optional[int] = None
    skip: bool = False


class RestActionRequest(BaseModel):
    action_type: str  # 'heal' or 'upgrade'


class ShopItem(BaseModel):
    card: Card
    price: int
    item_type: str  # 'card_add' or 'card_remove'


class ShopOffer(BaseModel):
    items: List[ShopItem]
    remove_price: int = 50


class ShopActionRequest(BaseModel):
    item_index: int
    action: str  # 'buy' or 'remove'
