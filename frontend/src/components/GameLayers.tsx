import type { ReactNode } from 'react'
import { BackgroundLayer, GameObjectsLayer, FXLayer, UILayer } from '../svg'
import type { GameState } from '../types'

interface GameSceneProps {
  gameState: GameState | null
  isLoading: boolean
  error: string | null
  children: ReactNode
}

export function MenuBackground() {
  return (
    <BackgroundLayer>
      <rect x={0} y={0} width={800} height={600} fill="#1a1a2e" />
    </BackgroundLayer>
  )
}

export function GameLayers({ gameState, isLoading, error, children }: GameSceneProps) {
  return (
    <>
      <GameObjectsLayer>{children}</GameObjectsLayer>
      <FXLayer />
      <UILayer>
        {error && (
          <g>
            <rect x={150} y={230} width={500} height={80} rx={8} fill="#3a1a1a" stroke="#e74c3c" strokeWidth={2} />
            <text x={400} y={260} textAnchor="middle" fill="#e74c3c" fontSize={14} fontWeight="bold">Error</text>
            <text x={400} y={285} textAnchor="middle" fill="#f5a0a0" fontSize={12}>{error}</text>
          </g>
        )}
        
        {!gameState && !isLoading && (
          <g>
            <text x={400} y={280} textAnchor="middle" fill="#4a4a6a" fontSize={32} fontWeight="bold">
              N.P.Nemo
            </text>
            <text x={400} y={320} textAnchor="middle" fill="#888" fontSize={14}>
              SVG Card Roguelike
            </text>
          </g>
        )}
        
        {isLoading && (
          <text x={400} y={382} textAnchor="middle" fill="#888" fontSize={14}>Loading...</text>
        )}
        
        {gameState && (
          <g style={{ cursor: 'pointer' }}>
            <rect x={20} y={555} width={60} height={30} rx={4} fill="#3a2a2a" stroke="#666" strokeWidth={1} />
            <text x={50} y={575} textAnchor="middle" fill="#888" fontSize={11}>Reset</text>
          </g>
        )}
        
        <text x={20} y={585} fill="#555" fontSize={11}>
          Phase: {gameState?.phase || 'menu'} | Turn: {gameState?.turn ?? 0}
        </text>
      </UILayer>
    </>
  )
}
