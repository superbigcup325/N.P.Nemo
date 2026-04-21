import type { Card } from '../../types'

interface CardProps {
  card: Card
  index: number
  onPlay: (cardIndex: number) => void
}

export function CardComponent({ card, index, onPlay }: CardProps) {
  const x = 60 + index * 95
  
  const bgColor = card.type === 'attack' ? '#3d1a1a' : card.type === 'skill' ? '#1a2a3d' : '#2a2a1a'
  const strokeColor = card.type === 'attack' ? '#c0392b' : card.type === 'skill' ? '#2980b9' : '#f39c12'
  
  return (
    <g style={{ cursor: 'pointer' }}>
      <rect
        x={x}
        y={480}
        width={85}
        height={110}
        rx={6}
        fill={bgColor}
        stroke={strokeColor}
        strokeWidth={2}
        onClick={() => onPlay(index)}
      />
      <text
        x={x + 42}
        y={520}
        textAnchor="middle"
        fill="#fff"
        fontSize={11}
        fontWeight="bold"
        onClick={() => onPlay(index)}
      >
        {card.name}
      </text>
      <text
        x={x + 42}
        y={545}
        textAnchor="middle"
        fill="#f39c12"
        fontSize={20}
        fontWeight="bold"
        onClick={() => onPlay(index)}
      >
        {card.cost}
      </text>
      {(card.damage || card.block) && (
        <text
          x={x + 42}
          y={575}
          textAnchor="middle"
          fill="#aaa"
          fontSize={10}
          onClick={() => onPlay(index)}
        >
          {card.damage ? `DMG: ${card.damage}` : `BLK: ${card.block}`}
        </text>
      )}
    </g>
  )
}
