import { useCallback, useState, useEffect } from 'react'
import { SVGCanvas } from './svg'
import {
  MenuBackground,
  GameLayers,
  MapView,
  BattleView,
  RewardView,
  RestSiteView,
  ShopView,
  VictoryOverlay,
  DefeatOverlay
} from './components'
import { useGameStore } from './stores/gameStore'
import { useUIStore } from './stores/uiStore'
import { api } from './services/api'
import { ErrorBoundary } from './components/ErrorBoundary'
import type { GameAction, RewardOffer, ShopOffer, GamePhase } from './types'
import './index.css'

function GameContent() {
  const gameState = useGameStore((s) => s.gameState)
  const isLoading = useGameStore((s) => s.isLoading)
  const error = useGameStore((s) => s.error)
  
  const setGameState = useGameStore((s) => s.setGameState)
  const setLoading = useGameStore((s) => s.setLoading)
  const setError = useGameStore((s) => s.setError)
  
  const setPhase = useUIStore((s) => s.setPhase)
  
  const [rewardData, setRewardData] = useState<RewardOffer | null>(null)
  const [shopData, setShopData] = useState<ShopOffer | null>(null)

  useEffect(() => {
    if (gameState?.phase === 'reward' && !rewardData) {
      api.getReward(gameState.gameId)
        .then(setRewardData)
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch reward'))
    }
    
    if (gameState?.phase === 'shop' && !shopData) {
      api.getShop(gameState.gameId)
        .then(setShopData)
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch shop'))
    }
  }, [gameState?.phase, gameState?.gameId])

  const updatePhase = useCallback((newState: { phase: string }) => {
    setPhase(newState.phase as GamePhase)
  }, [setPhase])

  const handleStartGame = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.startGame({})
      setGameState(response.gameState)
      setPhase('map')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game')
    } finally {
      setLoading(false)
    }
  }, [setGameState, setLoading, setError, setPhase])

  const handleAction = useCallback(async (action: GameAction) => {
    if (!gameState) return
    
    setLoading(true)
    
    try {
      const newState = await api.performAction(gameState.gameId, action)
      if (newState) {
        setGameState(newState)
        updatePhase(newState)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoading(false)
    }
  }, [gameState, setGameState, updatePhase, setLoading, setError])

  const handleEndTurn = useCallback(async () => {
    if (!gameState) return
    
    setLoading(true)
    
    try {
      const newState = await api.endTurn(gameState.gameId)
      if (newState) {
        setGameState(newState)
        updatePhase(newState)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'End turn failed')
    } finally {
      setLoading(false)
    }
  }, [gameState, setGameState, updatePhase, setLoading, setError])

  const handleSelectRewardCard = useCallback(async (cardIndex: number) => {
    if (!gameState) return
    
    setLoading(true)
    
    try {
      const newState = await api.selectReward(gameState.gameId, { cardIndex })
      if (newState) {
        setGameState(newState)
        updatePhase(newState)
        setRewardData(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select reward')
    } finally {
      setLoading(false)
    }
  }, [gameState, setGameState, updatePhase, setLoading, setError])

  const handleSkipReward = useCallback(async () => {
    if (!gameState) return
    
    setLoading(true)
    
    try {
      const newState = await api.selectReward(gameState.gameId, { skip: true })
      if (newState) {
        setGameState(newState)
        updatePhase(newState)
        setRewardData(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip reward')
    } finally {
      setLoading(false)
    }
  }, [gameState, setGameState, updatePhase, setLoading, setError])

  const handleRestAction = useCallback(async (actionType: 'heal' | 'upgrade') => {
    if (!gameState) return
    
    setLoading(true)
    
    try {
      const newState = await api.restAction(gameState.gameId, { actionType })
      if (newState) {
        setGameState(newState)
        updatePhase(newState)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform rest action')
    } finally {
      setLoading(false)
    }
  }, [gameState, setGameState, updatePhase, setLoading, setError])

  const handleShopBuy = useCallback(async (itemIndex: number) => {
    if (!gameState) return
    
    setLoading(true)
    
    try {
      const newState = await api.shopAction(gameState.gameId, { itemIndex, action: 'buy' })
      if (newState) {
        setGameState(newState)
        updatePhase(newState)
        setShopData(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to buy item')
    } finally {
      setLoading(false)
    }
  }, [gameState, setGameState, updatePhase, setLoading, setError])

  const handleShopRemove = useCallback(async (cardIndex: number) => {
    if (!gameState) return
    
    setLoading(true)
    
    try {
      const newState = await api.shopAction(gameState.gameId, { itemIndex: cardIndex, action: 'remove' })
      if (newState) {
        setGameState(newState)
        updatePhase(newState)
        setShopData(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove card')
    } finally {
      setLoading(false)
    }
  }, [gameState, setGameState, updatePhase, setLoading, setError])

  const handleLeaveShop = useCallback(() => {
    setPhase('map')
    setShopData(null)
  }, [setPhase])

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

          {gameState?.phase === 'reward' && rewardData && (
            <RewardView
              reward={rewardData}
              onSelectCard={handleSelectRewardCard}
              onSkip={handleSkipReward}
            />
          )}

          {gameState?.phase === 'rest' && (
            <RestSiteView
              player={gameState.player}
              upgradeCard={gameState.deck.draw_pile[0] || null}
              onHeal={() => handleRestAction('heal')}
              onUpgrade={() => handleRestAction('upgrade')}
            />
          )}

          {gameState?.phase === 'shop' && shopData && (
            <ShopView
              shop={shopData}
              gold={gameState.player.gold}
              allCards={[
                ...gameState.deck.draw_pile,
                ...gameState.deck.discard_pile,
                ...gameState.deck.hand,
                ...gameState.deck.exhaust_pile
              ]}
              onBuyItem={handleShopBuy}
              onRemoveCard={handleShopRemove}
              onLeave={handleLeaveShop}
            />
          )}
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