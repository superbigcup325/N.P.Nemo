import { motion } from 'framer-motion'
import type { Player } from '../../types'

interface PlayerPanelProps {
  player: Player
}

export function PlayerPanel({ player }: PlayerPanelProps) {
  const hpRatio = player.hp / player.maxHp
  const energyRatio = player.energy / player.maxEnergy
  
  return (
    <motion.g
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <rect
        x={50}
        y={350}
        width={200}
        height={120}
        rx={10}
        fill="#1a2a1a"
        stroke="#27ae60"
        strokeWidth={2}
      />
      <text
        x={150}
        y={380}
        textAnchor="middle"
        fill="#fff"
        fontSize={14}
        fontWeight="bold"
      >
        Player
      </text>
      <text
        x={150}
        y={405}
        textAnchor="middle"
        fill="#27ae60"
        fontSize={18}
        fontWeight="bold"
      >
        {player.hp} / {player.maxHp}
      </text>
      
      <rect
        x={70}
        y={420}
        width={160}
        height={10}
        rx={5}
        fill="#333"
      />
      <motion.rect
        x={70}
        y={420}
        width={hpRatio * 160}
        height={10}
        rx={5}
        fill="#27ae60"
        initial={{ width: 0 }}
        animate={{ width: hpRatio * 160 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      
      <motion.text 
        x={90} 
        y={448} 
        fill="#f39c12" 
        fontSize={12}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Energy: {player.energy}/{player.maxEnergy}
      </motion.text>

      <rect
        x={70}
        y={455}
        width={160}
        height={6}
        rx={3}
        fill="#333"
      />
      <motion.rect
        x={70}
        y={455}
        width={energyRatio * 160}
        height={6}
        rx={3}
        fill="#f39c12"
        initial={{ width: 0 }}
        animate={{ width: energyRatio * 160 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />

      {player.block > 0 && (
        <motion.text
          x={150}
          y={465}
          textAnchor="middle"
          fill="#3498db"
          fontSize={11}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        >
          🛡️ Block: {player.block}
        </motion.text>
      )}
    </motion.g>
  )
}