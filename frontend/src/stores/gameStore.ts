import { create } from 'zustand'
import type { GameState, Player, Enemy, Card } from '../types'

interface GameStore {
  gameState: GameState | null
  isLoading: boolean
  error: string | null
  
  setGameState: (state: GameState) => void
  updatePlayer: (player: Partial<Player>) => void
  updateEnemies: (enemies: Enemy[]) => void
  updateHand: (hand: Card[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: null,
  isLoading: false,
  error: null,
  
  setGameState: (state) => set({ gameState: state, isLoading: false, error: null }),
  
  updatePlayer: (playerUpdate) => set((state) => ({
    gameState: state.gameState ? {
      ...state.gameState,
      player: { ...state.gameState.player, ...playerUpdate }
    } : null
  })),
  
  updateEnemies: (enemies) => set((state) => ({
    gameState: state.gameState ? {
      ...state.gameState,
      enemies
    } : null
  })),
  
  updateHand: (hand) => set((state) => ({
    gameState: state.gameState ? {
      ...state.gameState,
      hand
    } : null
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  resetGame: () => set({ gameState: null, isLoading: false, error: null })
}))
