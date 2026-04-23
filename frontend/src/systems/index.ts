export interface BattleSystemConfig {
  maxHandSize: number
  cardsPerTurn: number
  energyPerTurn: number
}

export const DEFAULT_BATTLE_CONFIG: BattleSystemConfig = {
  maxHandSize: 10,
  cardsPerTurn: 5,
  energyPerTurn: 3
}

export class BattleSystem {
  private config: BattleSystemConfig

  constructor(config: BattleSystemConfig = DEFAULT_BATTLE_CONFIG) {
    this.config = config
  }

  canPlayCard(handSize: number): boolean {
    return handSize < this.config.maxHandSize
  }

  getCardsToDraw(drawPileSize: number): number {
    return Math.min(this.config.cardsPerTurn, drawPileSize)
  }

  resetEnergy(): number {
    return this.config.energyPerTurn
  }
}

export interface MapSystemConfig {
  floorsPerRun: number
  minRoomsPerFloor: number
  maxRoomsPerFloor: number
  roomTypeWeights: Record<string, number>
}

export const DEFAULT_MAP_CONFIG: MapSystemConfig = {
  floorsPerRun: 3,
  minRoomsPerFloor: 3,
  maxRoomsPerFloor: 5,
  roomTypeWeights: {
    battle: 60,
    rest: 20,
    shop: 10,
    event: 10
  }
}

export class MapSystem {
  private config: MapSystemConfig

  constructor(config: MapSystemConfig = DEFAULT_MAP_CONFIG) {
    this.config = config
  }

  isLastFloor(currentFloor: number): boolean {
    return currentFloor >= this.config.floorsPerRun - 1
  }

  generateRoomCount(): number {
    const min = this.config.minRoomsPerFloor
    const max = this.config.maxRoomsPerFloor
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

export interface RewardSystemConfig {
  cardsOffered: number
  goldMinReward: number
  goldMaxReward: number
}

export const DEFAULT_REWARD_CONFIG: RewardSystemConfig = {
  cardsOffered: 3,
  goldMinReward: 15,
  goldMaxReward: 35
}

export class RewardSystem {
  private config: RewardSystemConfig

  constructor(config: RewardSystemConfig = DEFAULT_REWARD_CONFIG) {
    this.config = config
  }

  generateGoldReward(): number {
    const { min, max } = {
      min: this.config.goldMinReward,
      max: this.config.goldMaxReward
    }
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

export const battleSystem = new BattleSystem()
export const mapSystem = new MapSystem()
export const rewardSystem = new RewardSystem()