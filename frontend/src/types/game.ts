export type CardType = 'attack' | 'skill' | 'ability'
export type CardRarity = 'common' | 'uncommon' | 'rare'
export type EnemyIntentType = 'attack' | 'defend' | 'buff' | 'debuff' | 'unknown'

export interface Card {
  id: string
  name: string
  description: string
  type: CardType
  rarity: CardRarity
  cost: number
  damage?: number
  block?: number
  effects?: CardEffect[]
  upgraded?: boolean
}

export interface CardEffect {
  type: string
  value?: number
  target?: 'self' | 'enemy' | 'all_enemies'
}

export interface Player {
  hp: number
  maxHp: number
  block: number
  energy: number
  maxEnergy: number
  gold: number
  buffs: Buff[]
  debuffs: Debuff[]
}

export interface Enemy {
  id: string
  name: string
  hp: number
  maxHp: number
  block: number
  intent: EnemyIntent
  buffs: Buff[]
  debuffs: Debuff[]
}

export interface EnemyIntent {
  type: EnemyIntentType
  value?: number
}

export interface Buff {
  id: string
  name: string
  stacks: number
}

export interface Debuff {
  id: string
  name: string
  stacks: number
}

export interface Deck {
  drawPile: Card[]
  hand: Card[]
  discardPile: Card[]
  exhaustPile: Card[]
}

export type GamePhase = 'map' | 'battle' | 'reward' | 'shop' | 'rest' | 'event'

export interface GameState {
  gameId: string
  phase: GamePhase
  turn: number
  player: Player
  enemies: Enemy[]
  deck: Deck
  map: GameMap
  currentFloor: number
  currentRoom: number
  rngSeed: string
}

export interface GameMap {
  floors: MapFloor[]
}

export interface MapFloor {
  rooms: MapRoom[]
}

export interface MapRoom {
  id: string
  type: RoomType
  completed: boolean
  connections: string[]
}

export type RoomType = 'battle' | 'elite' | 'boss' | 'rest' | 'shop' | 'event' | 'unknown'

export interface GameAction {
  type: 'play_card' | 'end_turn' | 'select_reward' | 'select_map_room' | 'rest_action' | 'shop_action'
  payload?: Record<string, unknown>
}

export interface GameStartRequest {
  character?: string
  seed?: string
  ascension?: number
}

export interface GameStartResponse {
  gameId: string
  gameState: GameState
}
