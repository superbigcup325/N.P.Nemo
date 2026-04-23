import { create } from 'zustand'
import type { GamePhase as BackendGamePhase } from '../types'

type GamePhase = 'menu' | BackendGamePhase
type AnimationState = 'idle' | 'playing' | 'paused'

interface UIStore {
  currentPhase: GamePhase
  animationState: AnimationState
  selectedCardId: string | null
  selectedEnemyId: string | null
  isPlayerTurn: boolean
  showDeckView: boolean
  showSettings: boolean
  
  setPhase: (phase: GamePhase) => void
  setAnimationState: (state: AnimationState) => void
  selectCard: (cardId: string | null) => void
  selectEnemy: (enemyId: string | null) => void
  setPlayerTurn: (isPlayerTurn: boolean) => void
  toggleDeckView: () => void
  toggleSettings: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  currentPhase: 'menu',
  animationState: 'idle',
  selectedCardId: null,
  selectedEnemyId: null,
  isPlayerTurn: true,
  showDeckView: false,
  showSettings: false,
  
  setPhase: (currentPhase) => set({ currentPhase }),
  
  setAnimationState: (animationState) => set({ animationState }),
  
  selectCard: (selectedCardId) => set({ selectedCardId }),
  
  selectEnemy: (selectedEnemyId) => set({ selectedEnemyId }),
  
  setPlayerTurn: (isPlayerTurn) => set({ isPlayerTurn, selectedCardId: null, selectedEnemyId: null }),
  
  toggleDeckView: () => set((state) => ({ showDeckView: !state.showDeckView })),
  
  toggleSettings: () => set((state) => ({ showSettings: !state.showSettings }))
}))
