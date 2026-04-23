import type { Player, Card } from '../../types'

interface RestSiteViewProps {
  player: Player
  upgradeCard: Card | null
  onHeal: () => void
  onUpgrade: () => void
}

export function RestSiteView({ player, upgradeCard, onHeal, onUpgrade }: RestSiteViewProps) {
  const healAmount = Math.floor(player.maxHp * 0.3)
  const actualHeal = Math.min(healAmount, player.maxHp - player.hp)
  
  return (
    <>
      <rect
        x={200}
        y={180}
        width={400}
        height={280}
        rx={20}
        fill="#1a2a1a"
        stroke="#27ae60"
        strokeWidth={4}
        opacity={0.95}
      />
      
      <text
        x={400}
        y={220}
        textAnchor="middle"
        fill="#27ae60"
        fontSize={26}
        fontWeight="bold"
      >
        {'🏕️'} Rest Site
      </text>
      
      <text
        x={400}
        y={250}
        textAnchor="middle"
        fill="#aaa"
        fontSize={14}
      >
        Take a moment to recover...
      </text>

      <g style={{ cursor: 'pointer' }} onClick={onHeal}>
        <rect
          x={230}
          y={280}
          width={160}
          height={80}
          rx={12}
          fill="#1a3a2a"
          stroke={actualHeal > 0 ? '#27ae60' : '#555'}
          strokeWidth={3}
        />
        <text
          x={310}
          y={315}
          textAnchor="middle"
          fill="#27ae60"
          fontSize={18}
          fontWeight="bold"
        >
          {'❤️'} Heal
        </text>
        <text
          x={310}
          y={340}
          textAnchor="middle"
          fill={actualHeal > 0 ? '#fff' : '#666'}
          fontSize={13}
        >
          {`+${actualHeal} HP (30%)`}
        </text>
        {actualHeal <= 0 && (
          <text
            x={310}
            y={355}
            textAnchor="middle"
            fill="#e74c3c"
            fontSize={10}
          >
            Already at full HP
          </text>
        )}
      </g>

      <g style={{ cursor: 'pointer' }} onClick={onUpgrade}>
        <rect
          x={410}
          y={280}
          width={160}
          height={80}
          rx={12}
          fill="#2a2a1a"
          stroke={upgradeCard ? '#f39c12' : '#555'}
          strokeWidth={3}
        />
        <text
          x={490}
          y={315}
          textAnchor="middle"
          fill="#f39c12"
          fontSize={18}
          fontWeight="bold"
        >
          {'⬆️'} Upgrade
        </text>
        {upgradeCard ? (
          <>
            <text
              x={490}
              y={338}
              textAnchor="middle"
              fill="#fff"
              fontSize={11}
            >
              {upgradeCard.name}
            </text>
            <text
              x={490}
              y={353}
              textAnchor="middle"
              fill="#aaa"
              fontSize={10}
            >
              +DMG/+BLK, -Cost
            </text>
          </>
        ) : (
          <text
            x={490}
            y={343}
            textAnchor="middle"
            fill="#666"
            fontSize={12}
          >
            No cards to upgrade
          </text>
        )}
      </g>
    </>
  )
}