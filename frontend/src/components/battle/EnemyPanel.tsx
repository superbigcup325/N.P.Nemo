import { motion } from 'framer-motion'
import type { Enemy, EnemyIntentType } from '../../types'

interface EnemyPanelProps {
  enemy: Enemy
}

function IntentIcon({ type, value }: { type: EnemyIntentType; value?: number }) {
  const iconConfig = {
    attack: { symbol: '⚔️', color: '#e74c3c', label: 'Attack' },
    defend: { symbol: '🛡️', color: '#3498db', label: 'Defend' },
    buff: { symbol: '⬆️', color: '#27ae60', label: 'Buff' },
    debuff: { symbol: '⬇️', color: '#f39c12', label: 'Debuff' },
    unknown: { symbol: '❓', color: '#95a5a6', label: 'Unknown' }
  }
  
  const config = iconConfig[type] || iconConfig.unknown
  
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <rect
        x={580}
        y={178}
        width={140}
        height={28}
        rx={14}
        fill="#1a1a2e"
        stroke={config.color}
        strokeWidth={2}
      />
      <text x={600} y={197} fontSize={14} textAnchor="start">
        {config.symbol}
      </text>
      <text
        x={620}
        y={197}
        textAnchor="start"
        fill={config.color}
        fontSize={12}
        fontWeight="bold"
      >
        {config.label}
      </text>
      {value !== undefined && value > 0 && (
        <motion.text
          x={710}
          y={197}
          textAnchor="end"
          fill="#fff"
          fontSize={13}
          fontWeight="bold"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ duration: 0.3 }}
        >
          {value}
        </motion.text>
      )}
    </motion.g>
  )
}

export function EnemyPanel({ enemy }: EnemyPanelProps) {
  const hpRatio = enemy.hp / enemy.maxHp
  
  return (
    <motion.g
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <rect
        x={550}
        y={70}
        width={200}
        height={145}
        rx={10}
        fill="#2a1a1a"
        stroke="#e74c3c"
        strokeWidth={2}
      />
      <text
        x={650}
        y={100}
        textAnchor="middle"
        fill="#fff"
        fontSize={14}
        fontWeight="bold"
      >
        {enemy.name}
      </text>
      <text
        x={650}
        y={125}
        textAnchor="middle"
        fill="#e74c3c"
        fontSize={18}
        fontWeight="bold"
      >
        {enemy.hp} / {enemy.maxHp}
      </text>
      <rect
        x={570}
        y={138}
        width={160}
        height={10}
        rx={5}
        fill="#333"
      />
      <motion.rect
        x={570}
        y={138}
        width={hpRatio * 160}
        height={10}
        rx={5}
        fill="#e74c3c"
        initial={{ width: 0 }}
        animate={{ width: hpRatio * 160 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      
      {enemy.block > 0 && (
        <motion.text
          x={650}
          y={165}
          textAnchor="middle"
          fill="#3498db"
          fontSize={11}
          initial={{ opacity: 0, y: 160 }}
          animate={{ opacity: 1, y: 165 }}
          transition={{ delay: 0.2 }}
        >
          🛡️ Block: {enemy.block}
        </motion.text>
      )}
      
      <IntentIcon type={enemy.intent.type} value={enemy.intent.value} />
    </motion.g>
  )
}