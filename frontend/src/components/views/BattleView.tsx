import type { GameState } from '../../types'
import { EnemyPanel } from './EnemyPanel'
import { PlayerPanel } from './PlayerPanel'
import { HandArea } from './HandArea'

interface BattleViewProps {
  gameState: GameState
  onPlayCard: (cardIndex: number) => void
}

export function BattleView({ gameState, onPlayCard }: BattleViewProps) {
  return (
    <>
      <text x={40} y={40} fill="#e74c3c" fontSize={16} fontWeight="bold">
        BATTLE - Turn {gameState.turn + 1}
      </text>

      {gameState.enemies.map((enemy) => (
        <EnemyPanel key={enemy.id} enemy={enemy} />
      ))}

      <PlayerPanel player={gameState.player} />

      <HandArea cards={gameState.deck.hand} onPlayCard={onPlayCard} />
    </>
  )
}
