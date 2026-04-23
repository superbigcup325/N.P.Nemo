import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Card } from '../../types'

interface CardProps {
  card: Card
  index: number
  onPlay: (cardIndex: number) => void
}

export function CardComponent({ card, index, onPlay }: CardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const x = 60 + index * 95
  const baseY = 480
  const hoverOffset = isHovered ? -20 : 0
  
  const bgColor = card.type === 'attack' ? '#3d1a1a' : card.type === 'skill' ? '#1a2a3d' : '#2a2a1a'
  const strokeColor = card.type === 'attack' ? '#c0392b' : card.type === 'skill' ? '#2980b9' : '#f39c12'
  
  return (
    <motion.g
      style={{ cursor: 'pointer' }}
      animate={{ 
        y: hoverOffset,
        scale: isHovered ? 1.08 : 1,
      }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(index)}
    >
      <motion.rect
        x={x}
        y={baseY}
        width={85}
        height={110}
        rx={6}
        fill={bgColor}
        stroke={strokeColor}
        strokeWidth={isHovered ? 3 : 2}
        animate={{
          filter: isHovered 
            ? 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.3))'
            : 'brightness(1)'
        }}
        transition={{ duration: 0.15 }}
      />
      <text
        x={x + 42}
        y={baseY + 40}
        textAnchor="middle"
        fill="#fff"
        fontSize={11}
        fontWeight="bold"
        pointerEvents="none"
      >
        {card.name.length > 12 ? card.name.substring(0, 11) + '…' : card.name}
      </text>
      <circle
        cx={x + 14}
        cy={baseY + 90}
        r={12}
        fill="#1a1a2e"
        stroke="#f39c12"
        strokeWidth={2}
        pointerEvents="none"
      />
      <text
        x={x + 14}
        y={baseY + 95}
        textAnchor="middle"
        fill="#f39c12"
        fontSize={16}
        fontWeight="bold"
        pointerEvents="none"
      >
        {card.cost}
      </text>
      {(card.damage || card.block) && (
        <text
          x={x + 42}
          y={baseY + 75}
          textAnchor="middle"
          fill={card.damage ? '#e74c3c' : '#3498db'}
          fontSize={11}
          fontWeight="bold"
          pointerEvents="none"
        >
          {card.damage ? `💥 ${card.damage}` : `🛡️ ${card.block}`}
        </text>
      )}
    </motion.g>
  )
}