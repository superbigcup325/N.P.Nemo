import type { GameState, GameAction, GameStartRequest, GameStartResponse } from '../types'

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

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new ApiError(
        response.status, 
        error.detail || `HTTP ${response.status}`,
        error
      )
    }
    
    return response.json()
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
}

export const api = new ApiService()
export { ApiError }
