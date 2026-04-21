import { useCallback } from 'react'
import { SVGCanvas } from './svg'
import {
  MenuBackground,
  GameLayers,
  MapView,
  BattleView,
  RewardView,
  VictoryOverlay,
  DefeatOverlay
} from './components'
import { useGameStore } from './stores/gameStore'
import { useUIStore } from './stores/uiStore'
import { api } from './services/api'
import { ErrorBoundary } from './components/ErrorBoundary'
import type { GameAction } from './types'
import './index.css'

function GameContent() {
  const gameState = useGameStore((s) => s.gameState)
  const isLoading = useGameStore((s) => s.isLoading)
  const error = useGameStore((s) => s.error)
  
  const setGameState = useGameStore((s) => s.setGameState)
  const setLoading = useGameStore((s) => s.setLoading)
  const setError = useGameStore((s) => s.setError)
  const resetGame = useGameStore((s) => s.resetGame)
  
  const setPhase = useUIStore((s) => s.setPhase)

  const handleStartGame = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.startGame({})
      setGameState(response.gameState)
      setPhase('map')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game')
    }
  }, [setGameState, setLoading, setError, setPhase])

  const handleAction = useCallback(async (action: GameAction) => {
    if (!gameState) return
    
    setLoading(true)
    
    try {
      const newState = await api.performAction(gameState.gameId, action)
      if (newState) {
        setGameState(newState)
        setPhase(newState.phase as any)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoading(false)
    }
  }, [gameState, setGameState, setPhase, setLoading, setError])

  const handleEndTurn = useCallback(async () => {
    if (!gameState) return
    
    setLoading(true)
    
    try {
      const newState = await api.endTurn(gameState.gameId)
      if (newState) {
        setGameState(newState)
        setPhase(newState.phase as any)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'End turn failed')
    } finally {
      setLoading(false)
    }
  }, [gameState, setGameState, setPhase, setLoading, setError])

  const handleReset = useCallback(() => {
    resetGame()
    setPhase('menu')
  }, [resetGame, setPhase])

  const handlePlayCard = useCallback((cardIndex: number) => {
    handleAction({ type: 'play_card', payload: { card_index: cardIndex, target_index: 0 } })
  }, [handleAction])

  const handleRoomSelect = useCallback((roomIndex: number) => {
    handleAction({ type: 'select_map_room', payload: { room_index: roomIndex } })
  }, [handleAction])

  return (
    <div className="app-container">
      <SVGCanvas width={800} height={600}>
        <MenuBackground />
        
        <GameLayers gameState={gameState} isLoading={isLoading} error={error}>
          {gameState?.phase === 'map' && gameState.map && (
            <MapView
              currentFloor={gameState.currentFloor}
              rooms={gameState.map.floors[gameState.currentFloor]?.rooms || []}
              onRoomSelect={handleRoomSelect}
            />
          )}

          {gameState?.phase === 'battle' && (
            <BattleView
              gameState={gameState}
              onPlayCard={handlePlayCard}
            />
          )}

          {gameState?.phase === 'reward' && <RewardView />}
        </GameLayers>
        
        {!gameState && !isLoading && (
          <g style={{ cursor: 'pointer' }}>
            <rect x={320} y={360} width={160} height={44} rx={22} fill="#4a4a6a" stroke="#6a6a8a" strokeWidth={2}
                  onClick={handleStartGame} />
            <text x={400} y={388} textAnchor="middle" fill="#fff" fontSize={16} fontWeight="bold"
                  onClick={handleStartGame}>Start Game</text>
          </g>
        )}
          
        {gameState?.phase === 'battle' && !isLoading && (
          <g style={{ cursor: 'pointer' }}>
            <rect x={600} y={550} width={140} height={36} rx={18} fill="#2a3a2a" stroke="#27ae60" strokeWidth={2}
                  onClick={handleEndTurn} />
            <text x={670} y={574} textAnchor="middle" fill="#27ae60" fontSize={14} fontWeight="bold"
                  onClick={handleEndTurn}>End Turn</text>
          </g>
        )}
          
        {gameState?.phase === 'victory' && (
          <VictoryOverlay turns={gameState.turn} />
        )}
          
        {gameState?.phase === 'game_over' && (
          <DefeatOverlay currentFloor={gameState.currentFloor} turns={gameState.turn} />
        )}
      </SVGCanvas>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <GameContent />
    </ErrorBoundary>
  )
}

export default App
