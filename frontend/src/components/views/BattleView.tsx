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

  return (
    <>
      <text x={40} y={40} fill="#e74c3c" fontSize={16} fontWeight="bold">
        BATTLE - Turn {gameState.turn + 1}
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

      {gameState.enemies.map((enemy) => (
        <EnemyPanel key={enemy.id} enemy={enemy} />
      ))}

      <PlayerPanel player={gameState.player} />

      {isPlayerTurn && (
        <HandArea cards={gameState.deck.hand} onPlayCard={onPlayCard} />
      )}
    </>
  )
}