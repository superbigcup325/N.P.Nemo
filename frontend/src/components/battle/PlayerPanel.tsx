import type { Player } from '../../types'

interface PlayerPanelProps {
  player: Player
}

export function PlayerPanel({ player }: PlayerPanelProps) {
  const hpRatio = player.hp / player.maxHp
  
  return (
    <g>
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
      <rect
        x={70}
        y={420}
        width={hpRatio * 160}
        height={10}
        rx={5}
        fill="#27ae60"
      />
      
      <text x={90} y={455} fill="#f39c12" fontSize={12}>
        Energy: {player.energy}/{player.maxEnergy}
      </text>
    </g>
  )
}
