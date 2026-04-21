import type { Enemy } from '../../types'

interface EnemyPanelProps {
  enemy: Enemy
}

export function EnemyPanel({ enemy }: EnemyPanelProps) {
  const hpRatio = enemy.hp / enemy.maxHp
  
  return (
    <g>
      <rect
        x={550}
        y={80}
        width={200}
        height={120}
        rx={10}
        fill="#2a1a1a"
        stroke="#e74c3c"
        strokeWidth={2}
      />
      <text
        x={650}
        y={115}
        textAnchor="middle"
        fill="#fff"
        fontSize={14}
        fontWeight="bold"
      >
        {enemy.name}
      </text>
      <text
        x={650}
        y={140}
        textAnchor="middle"
        fill="#e74c3c"
        fontSize={18}
        fontWeight="bold"
      >
        {enemy.hp} / {enemy.maxHp}
      </text>
      <rect
        x={570}
        y={155}
        width={160}
        height={10}
        rx={5}
        fill="#333"
      />
      <rect
        x={570}
        y={155}
        width={hpRatio * 160}
        height={10}
        rx={5}
        fill="#e74c3c"
      />
      
      {enemy.block > 0 && (
        <text x={650} y={185} textAnchor="middle" fill="#3498db" fontSize={12}>
          Block: {enemy.block}
        </text>
      )}
    </g>
  )
}
