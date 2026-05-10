import { useState, useEffect, useRef, useMemo } from 'react'
import type { GameState } from '../../types'
import { EnemyPanel } from '../battle/EnemyPanel'
import { PlayerPanel } from '../battle/PlayerPanel'
import { HandArea } from '../battle/HandArea'
import { BattleEffects, type FloatingText } from '../battle/BattleEffects'

interface BattleViewProps {
  gameState: GameState
  onPlayCard: (cardIndex: number) => void
}

export function BattleView({ gameState, onPlayCard }: BattleViewProps) {
  const isPlayerTurn = gameState.battleTurn === 'player'
  const deck = gameState.deck
  const hand = useMemo(() => deck?.hand || [], [deck])
  const enemies = useMemo(() => gameState.enemies || [], [gameState.enemies])

  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])
  const prevStateRef = useRef<GameState | null>(null)

  useEffect(() => {
    const prev = prevStateRef.current
    if (!prev) {
      prevStateRef.current = gameState
      return
    }

    const newTexts: FloatingText[] = []
    const id = Date.now().toString()

    if (enemies.length > 0 && prev.enemies.length > 0) {
      enemies.forEach((enemy, idx) => {
        const prevEnemy = prev.enemies[idx]
        if (prevEnemy && enemy.hp < prevEnemy.hp) {
          const dmg = prevEnemy.hp - enemy.hp
          newTexts.push({
            id: `${id}_edmg_${idx}`,
            x: 650,
            y: 110,
            text: `-${dmg}`,
            color: '#e74c3c',
            fontSize: 24
          })
        }
        if (prevEnemy && enemy.block > prevEnemy.block) {
          newTexts.push({
            id: `${id}_eblk_${idx}`,
            x: 650,
            y: 155,
            text: `+${enemy.block - prevEnemy.block}🛡`,
            color: '#3498db',
            fontSize: 16
          })
        }
      })
    }

    if (gameState.player.hp < prev.player.hp) {
      const dmg = prev.player.hp - gameState.player.hp
      newTexts.push({
        id: `${id}_pdmg`,
        x: 150,
        y: 390,
        text: `-${dmg}`,
        color: '#e74c3c',
        fontSize: 24
      })
    }

    if (gameState.player.block > prev.player.block) {
      newTexts.push({
        id: `${id}_pblk`,
        x: 150,
        y: 435,
        text: `+${gameState.player.block - prev.player.block}🛡`,
        color: '#3498db',
        fontSize: 16
      })
    }

    if (newTexts.length > 0) {
      setFloatingTexts(prev => [...prev, ...newTexts])
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(t => !newTexts.includes(t)))
      }, 1100)
    }

    prevStateRef.current = gameState
  }, [gameState, enemies])

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

      <BattleEffects floatingTexts={floatingTexts} />
    </>
  )
}
