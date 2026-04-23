import type { GameState, GameAction, GameStartRequest, GameStartResponse, RewardOffer, SelectRewardRequest, RestActionRequest, ShopOffer, ShopActionRequest } from '../types'

const API_BASE = '/api'

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function transformKeys<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  
  if (Array.isArray(obj)) {
    return obj.map(transformKeys) as T
  }
  
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key)
    result[camelKey] = transformKeys(value)
  }
  return result as T
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    let response: Response
    
    try {
      response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      })
    } catch (networkErr) {
      throw new ApiError(0, `Network error: ${networkErr instanceof Error ? networkErr.message : 'Failed to connect'}`)
    }
    
    if (!response.ok) {
      let detail = 'Unknown error'
      try {
        const errBody = await response.json()
        detail = errBody?.detail || JSON.stringify(errBody) || `HTTP ${response.status}`
      } catch {
        detail = await response.text().catch(() => `HTTP ${response.status}`)
      }
      
      throw new ApiError(response.status, detail, detail)
    }
    
    const data = await response.json()
    return transformKeys<T>(data)
  }
  
  async startGame(request: GameStartRequest): Promise<GameStartResponse> {
    return this.request<GameStartResponse>('/game/start', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }
  
  async getGameState(gameId: string): Promise<GameState> {
    return this.request<GameState>(`/game/${gameId}/state`)
  }
  
  async performAction(gameId: string, action: GameAction): Promise<GameState> {
    return this.request<GameState>(`/game/${gameId}/action`, {
      method: 'POST',
      body: JSON.stringify(action)
    })
  }
  
  async endTurn(gameId: string): Promise<GameState> {
    return this.request<GameState>(`/game/${gameId}/end-turn`, {
      method: 'POST'
    })
  }
  
  async getReward(gameId: string): Promise<RewardOffer> {
    return this.request<RewardOffer>(`/game/${gameId}/reward`)
  }
  
  async selectReward(gameId: string, request: SelectRewardRequest): Promise<GameState> {
    return this.request<GameState>(`/game/${gameId}/reward/select`, {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }
  
  async restAction(gameId: string, request: RestActionRequest): Promise<GameState> {
    return this.request<GameState>(`/game/${gameId}/rest`, {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }
  
  async getShop(gameId: string): Promise<ShopOffer> {
    return this.request<ShopOffer>(`/game/${gameId}/shop`)
  }
  
  async shopAction(gameId: string, request: ShopActionRequest): Promise<GameState> {
    return this.request<GameState>(`/game/${gameId}/shop/action`, {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }
}

export const api = new ApiService()
export { ApiError }
