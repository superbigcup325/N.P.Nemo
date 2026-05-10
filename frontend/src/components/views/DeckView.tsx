import { useState } from 'react'
import type { Card, Deck } from '../../types'

interface DeckViewProps {
  deck: Deck
  onClose: () => void
}

type FilterType = 'all' | 'attack' | 'skill' | 'ability'

function DeckCard({ card, x, y }: { card: Card; x: number; y: number }) {
  const bgColor = card.type === 'attack' ? '#3d1a1a' : card.type === 'skill' ? '#1a2a3d' : '#2a2a1a'
  const strokeColor = card.type === 'attack' ? '#c0392b' : card.type === 'skill' ? '#2980b9' : '#f39c12'
  const rarityColor = card.rarity === 'rare' ? '#9b59b6' : card.rarity === 'uncommon' ? '#3498db' : '#95a5a6'

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={85}
        height={115}
        rx={6}
        fill={bgColor}
        stroke={strokeColor}
        strokeWidth={card.upgraded ? 3 : 2}
      />
      {card.upgraded && (
        <rect x={x + 2} y={y + 2} width={81} height={111} rx={5} fill="none" stroke="#f39c12" strokeWidth={1} strokeDasharray="4 2" />
      )}
      <rect x={x + 4} y={y + 4} width={77} height={13} rx={3} fill={rarityColor} opacity={0.8} />
      <text x={x + 42} y={y + 14} textAnchor="middle" fill="#fff" fontSize={8} fontWeight="bold">
        {card.rarity.toUpperCase()}
      </text>
      <text x={x + 42} y={y + 38} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="bold">
        {card.name.length > 11 ? card.name.substring(0, 10) + '…' : card.name}
      </text>
      <text x={x + 42} y={y + 55} textAnchor="middle" fill="#aaa" fontSize={7}>
        {card.description.length > 22 ? card.description.substring(0, 21) + '…' : card.description}
      </text>
      <circle cx={x + 14} cy={y + 100} r={10} fill="#1a1a2e" stroke="#f39c12" strokeWidth={2} />
      <text x={x + 14} y={y + 105} textAnchor="middle" fill="#f39c12" fontSize={12} fontWeight="bold">
        {card.cost}
      </text>
      {(card.damage || card.block) && (
        <text x={x + 42} y={y + 85} textAnchor="middle" fill={card.damage ? '#e74c3c' : '#3498db'} fontSize={10} fontWeight="bold">
          {card.damage ? `⚔${card.damage}` : `🛡${card.block}`}
        </text>
      )}
      {card.upgraded && (
        <text x={x + 70} y={y + 105} textAnchor="middle" fill="#f39c12" fontSize={9} fontWeight="bold">
          +UP
        </text>
      )}
    </g>
  )
}

export function DeckView({ deck, onClose }: DeckViewProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const allCards = [
    ...deck.drawPile,
    ...deck.hand,
    ...deck.discardPile,
    ...deck.exhaustPile
  ]

  const filteredCards = filter === 'all' ? allCards : allCards.filter(c => c.type === filter)

  const attackCount = allCards.filter(c => c.type === 'attack').length
  const skillCount = allCards.filter(c => c.type === 'skill').length
  const abilityCount = allCards.filter(c => c.type === 'ability').length

  const cardsPerRow = 7
  const startX = 50
  const startY = 140
  const cardWidth = 95
  const cardHeight = 125

  return (
    <>
      <rect
        x={30}
        y={30}
        width={740}
        height={540}
        rx={16}
        fill="#0d0d1a"
        stroke="#6a6a8a"
        strokeWidth={3}
        opacity={0.98}
      />

      <text x={400} y={65} textAnchor="middle" fill="#ddd" fontSize={22} fontWeight="bold">
        Deck Browser
      </text>

      <text x={400} y={90} textAnchor="middle" fill="#888" fontSize={13}>
        Total: {allCards.length} cards (Draw: {deck.drawPile.length} | Hand: {deck.hand.length} | Discard: {deck.discardPile.length})
      </text>

      <g>
        {(['all', 'attack', 'skill', 'ability'] as FilterType[]).map((f, idx) => {
          const isActive = filter === f
          const count = f === 'all' ? allCards.length : f === 'attack' ? attackCount : f === 'skill' ? skillCount : abilityCount
          const label = f === 'all' ? `All (${count})` : f === 'attack' ? `⚔ Attack (${count})` : f === 'skill' ? `🛡 Skill (${count})` : `★ Ability (${count})`
          const colors: Record<string, string> = { all: '#6a6a8a', attack: '#c0392b', skill: '#2980b9', ability: '#f39c12' }

          return (
            <g key={f} style={{ cursor: 'pointer' }} onClick={() => setFilter(f)}>
              <rect
                x={120 + idx * 150}
                y={100}
                width={130}
                height={28}
                rx={14}
                fill={isActive ? colors[f] : '#1a1a2e'}
                stroke={colors[f]}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 1 : 0.6}
              />
              <text x={185 + idx * 150} y={119} textAnchor="middle" fill="#fff" fontSize={11} fontWeight="bold">
                {label}
              </text>
            </g>
          )
        })}
      </g>

      {filteredCards.length > 0 ? (
        filteredCards.map((card, idx) => {
          const row = Math.floor(idx / cardsPerRow)
          const col = idx % cardsPerRow
          const x = startX + col * cardWidth
          const y = startY + row * cardHeight

          if (y + cardHeight > 550) return null

          return (
            <DeckCard
              key={`${card.id}_${idx}`}
              card={card}
              x={x}
              y={y}
            />
          )
        })
      ) : (
        <text x={400} y={300} textAnchor="middle" fill="#666" fontSize={14}>
          No cards match this filter
        </text>
      )}

      <g style={{ cursor: 'pointer' }} onClick={onClose}>
        <rect
          x={340}
          y={530}
          width={120}
          height={30}
          rx={15}
          fill="#2a2a3a"
          stroke="#888"
          strokeWidth={2}
        />
        <text x={400} y={550} textAnchor="middle" fill="#aaa" fontSize={13} fontWeight="bold">
          Close
        </text>
      </g>
    </>
  )
}
