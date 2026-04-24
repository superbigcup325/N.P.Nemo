import type { GameState } from '../../types'
import { EnemyPanel } from '../battle/EnemyPanel'
import { PlayerPanel } from '../battle/PlayerPanel'
import { HandArea } from '../battle/HandArea'

interface BattleViewProps {
  gameState: GameState
  onPlayCard: (cardIndex: number) => void
}

export function BattleView({ gameState, onPlayCard }: BattleViewProps) {
  const isPlayerTurn = gameState.battleTurn === 'player'
  const deck = gameState.deck
  const hand = deck?.hand || []
  const enemies = gameState.enemies || []

  return (
    <>
      <text x={40} y={40} fill="#e74c3c" fontSize={16} fontWeight="bold">
        BATTLE - Turn {(gameState.turn || 0) + 1}
      </text>

      <text
        x={400}
        y={40}
        textAnchor="middle"
        fill={isPlayerTurn ? '#27ae60' : '#e74c3c'}
        fontSize={14}
        fontWeight="bold"
      >
        {isPlayerTurn ? 'Your Turn' : "Enemy's Turn"}
      </text>

      {enemies.map((enemy) => (
        <EnemyPanel key={enemy.id} enemy={enemy} />
      ))}

      <PlayerPanel player={gameState.player} />

      {isPlayerTurn && hand.length > 0 && (
        <HandArea cards={hand} onPlayCard={onPlayCard} />
      )}

      {isPlayerTurn && hand.length === 0 && (
        <text x={400} y={520} textAnchor="middle" fill="#888" fontSize={14}>
          No cards in hand
        </text>
      )}
    </>
  )
}