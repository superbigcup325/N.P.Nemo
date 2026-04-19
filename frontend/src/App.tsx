import { useState, useCallback } from 'react'
import { SVGCanvas, BackgroundLayer, GameObjectsLayer, FXLayer, UILayer } from './svg'
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

  return (
    <div className="app-container">
      <SVGCanvas width={800} height={600}>
        <BackgroundLayer>
          <rect x={0} y={0} width={800} height={600} fill="#1a1a2e" />
          
          {!gameState && (
            <text x={400} y={280} textAnchor="middle" fill="#4a4a6a" fontSize={32} fontWeight="bold">
              N.P.Nemo
            </text>
          )}
          
          {!gameState && (
            <text x={400} y={320} textAnchor="middle" fill="#888" fontSize={14}>
              SVG Card Roguelike
            </text>
          )}
        </BackgroundLayer>
        
        <GameObjectsLayer>
          {gameState?.phase === 'map' && gameState.map && (
            <>
              <text x={40} y={40} fill="#aaa" fontSize={16} fontWeight="bold">
                Floor {gameState.current_floor + 1}
              </text>
              
              {gameState.map.floors[gameState.current_floor]?.rooms.map((room, idx) => (
                <g key={room.id} 
                   onClick={() => handleAction({ type: 'select_map_room', payload: { room_index: idx } })}
                   style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={60 + idx * 120}
                    y={100}
                    width={100}
                    height={80}
                    rx={8}
                    fill={room.completed ? '#2a4a3a' : '#3a3a5a'}
                    stroke={room.completed ? '#4a8a6a' : '#6a6a8a'}
                    strokeWidth={2}
                  />
                  <text
                    x={110 + idx * 120}
                    y={135}
                    textAnchor="middle"
                    fill="#ddd"
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {room.type.toUpperCase()}
                  </text>
                  <text
                    x={110 + idx * 120}
                    y={155}
                    textAnchor="middle"
                    fill={room.completed ? '#6a9a7a' : '#888'}
                    fontSize={10}
                  >
                    {room.completed ? 'DONE' : 'READY'}
                  </text>
                </g>
              ))}
            </>
          )}

          {gameState?.phase === 'battle' && (
            <>
              <text x={40} y={40} fill="#e74c3c" fontSize={16} fontWeight="bold">
                BATTLE - Turn {gameState.turn + 1}
              </text>

              {gameState.enemies.map((enemy) => (
                <g key={enemy.id}>
                  <rect
                    x={550}
                    y={80}
                    width={200}
                    height={120}
                    rx={10}
                    fill="#2a1a1a"
                    stroke="#e74c3c"
                    strokeWidth={2}
                  />
                  <text
                    x={650}
                    y={115}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={14}
                    fontWeight="bold"
                  >
                    {enemy.name}
                  </text>
                  <text
                    x={650}
                    y={140}
                    textAnchor="middle"
                    fill="#e74c3c"
                    fontSize={18}
                    fontWeight="bold"
                  >
                    {enemy.hp} / {enemy.max_hp}
                  </text>
                  <rect
                    x={570}
                    y={155}
                    width={160}
                    height={10}
                    rx={5}
                    fill="#333"
                  />
                  <rect
                    x={570}
                    y={155}
                    width={(enemy.hp / enemy.max_hp) * 160}
                    height={10}
                    rx={5}
                    fill="#e74c3c"
                  />
                  
                  {enemy.block > 0 && (
                    <text x={650} y={185} textAnchor="middle" fill="#3498db" fontSize={12}>
                      Block: {enemy.block}
                    </text>
                  )}
                </g>
              ))}

              <g>
                <rect
                  x={50}
                  y={350}
                  width={200}
                  height={120}
                  rx={10}
                  fill="#1a2a1a"
                  stroke="#27ae60"
                  strokeWidth={2}
                />
                <text
                  x={150}
                  y={380}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={14}
                  fontWeight="bold"
                >
                  Player
                </text>
                <text
                  x={150}
                  y={405}
                  textAnchor="middle"
                  fill="#27ae60"
                  fontSize={18}
                  fontWeight="bold"
                >
                  {gameState.player.hp} / {gameState.player.maxHp}
                </text>
                
                <rect
                  x={70}
                  y={420}
                  width={160}
                  height={10}
                  rx={5}
                  fill="#333"
                />
                <rect
                  x={70}
                  y={420}
                  width={(gameState.player.hp / gameState.player.maxHp) * 160}
                  height={10}
                  rx={5}
                  fill="#27ae60"
                />
                
                <text x={90} y={455} fill="#f39c12" fontSize={12}>
                  Energy: {gameState.player.energy}/{gameState.player.maxEnergy}
                </text>
              </g>
              
              {gameState.deck.hand.map((card, idx) => (
                <g key={card.id}
                   onClick={() => handleAction({ type: 'play_card', payload: { card_index: idx, target_index: 0 } })}
                   style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={60 + idx * 95}
                    y={480}
                    width={85}
                    height={110}
                    rx={6}
                    fill={card.type === 'attack' ? '#3d1a1a' : card.type === 'skill' ? '#1a2a3d' : '#2a2a1a'}
                    stroke={card.type === 'attack' ? '#c0392b' : card.type === 'skill' ? '#2980b9' : '#f39c12'}
                    strokeWidth={2}
                  />
                  <text
                    x={102 + idx * 95}
                    y={520}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={11}
                    fontWeight="bold"
                  >
                    {card.name}
                  </text>
                  <text
                    x={102 + idx * 95}
                    y={545}
                    textAnchor="middle"
                    fill="#f39c12"
                    fontSize={20}
                    fontWeight="bold"
                  >
                    {card.cost}
                  </text>
                  {(card.damage || card.block) && (
                    <text
                      x={102 + idx * 95}
                      y={575}
                      textAnchor="middle"
                      fill="#aaa"
                      fontSize={10}
                    >
                      {card.damage ? `DMG: ${card.damage}` : `BLK: ${card.block}`}
                    </text>
                  )}
                </g>
              ))}
            </>
          )}

          {gameState?.phase === 'reward' && (
            <g>
              <rect
                x={250}
                y={200}
                width={300}
                height={200}
                rx={15}
                fill="#2a2a1a"
                stroke="#f39c12"
                strokeWidth={3}
              />
              <text
                x={400}
                y={260}
                textAnchor="middle"
                fill="#f39c12"
                fontSize={24}
                fontWeight="bold"
              >
                Victory!
              </text>
              <text
                x={400}
                y={300}
                textAnchor="middle"
                fill="#888"
                fontSize={14}
              >
                Choose a reward (coming soon)
              </text>
            </g>
          )}
        </GameObjectsLayer>
        
        <FXLayer></FXLayer>
        
        <UILayer>
          {error && (
            <g>
              <rect x={200} y={240} width={400} height={60} rx={8} fill="#3a1a1a" stroke="#e74c3c" strokeWidth={2} />
              <text x={400} y={275} textAnchor="middle" fill="#e74c3c" fontSize={14}>{error}</text>
            </g>
          )}
          
          {!gameState && !isLoading && (
            <g onClick={handleStartGame} style={{ cursor: 'pointer' }}>
              <rect x={320} y={360} width={160} height={44} rx={22} fill="#4a4a6a" stroke="#6a6a8a" strokeWidth={2} />
              <text x={400} y={388} textAnchor="middle" fill="#fff" fontSize={16} fontWeight="bold">Start Game</text>
            </g>
          )}
          
          {isLoading && (
            <text x={400} y={382} textAnchor="middle" fill="#888" fontSize={14}>Loading...</text>
          )}
          
          {gameState && (
            <g onClick={handleReset} style={{ cursor: 'pointer' }}>
              <rect x={700} y={555} width={80} height={30} rx={4} fill="#3a2a2a" stroke="#666" strokeWidth={1} />
              <text x={740} y={575} textAnchor="middle" fill="#888" fontSize={11}>Reset</text>
            </g>
          )}
          
          {gameState?.phase === 'battle' && !isLoading && (
            <g onClick={handleEndTurn} style={{ cursor: 'pointer' }}>
              <rect x={600} y={550} width={140} height={36} rx={18} fill="#2a3a2a" stroke="#27ae60" strokeWidth={2} />
              <text x={670} y={574} textAnchor="middle" fill="#27ae60" fontSize={14} fontWeight="bold">End Turn</text>
            </g>
          )}
          
          <text x={20} y={585} fill="#555" fontSize={11}>
            Phase: {gameState?.phase || 'menu'} | Turn: {gameState?.turn ?? 0}
          </text>
        </UILayer>
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
