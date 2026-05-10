import { motion, AnimatePresence } from 'framer-motion'

export interface FloatingText {
  id: string
  x: number
  y: number
  text: string
  color: string
  fontSize?: number
}

interface BattleEffectsProps {
  floatingTexts: FloatingText[]
}

export function DamageNumber({ x, y, text, color, fontSize = 22 }: FloatingText) {
  return (
    <motion.g
      initial={{ opacity: 1, y, scale: 0.5 }}
      animate={{ opacity: 0, y: y - 50, scale: 1.2 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: 'easeOut' }}
    >
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fill={color}
        fontSize={fontSize}
        fontWeight="bold"
        stroke="#000"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {text}
      </text>
    </motion.g>
  )
}

export function AttackFlash({ x, y }: { x: number; y: number }) {
  return (
    <motion.g
      initial={{ opacity: 1, scale: 0.3 }}
      animate={{ opacity: 0, scale: 2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <circle cx={x} cy={y} r={20} fill="#e74c3c" opacity={0.6} />
      <line x1={x - 15} y1={y - 15} x2={x + 15} y2={y + 15} stroke="#fff" strokeWidth={3} />
      <line x1={x + 15} y1={y - 15} x2={x - 15} y2={y + 15} stroke="#fff" strokeWidth={3} />
    </motion.g>
  )
}

export function BlockEffect({ x, y }: { x: number; y: number }) {
  return (
    <motion.g
      initial={{ opacity: 0.8, scale: 0.5 }}
      animate={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <rect
        x={x - 20}
        y={y - 25}
        width={40}
        height={50}
        rx={6}
        fill="none"
        stroke="#3498db"
        strokeWidth={3}
      />
    </motion.g>
  )
}

export function BattleEffects({ floatingTexts }: BattleEffectsProps) {
  return (
    <AnimatePresence>
      {floatingTexts.map((ft) => (
        <DamageNumber key={ft.id} {...ft} />
      ))}
    </AnimatePresence>
  )
}
