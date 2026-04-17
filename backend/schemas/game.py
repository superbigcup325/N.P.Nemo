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
