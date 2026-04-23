import type { RewardOffer, Card } from '../../types'

interface RewardViewProps {
  reward: RewardOffer
  onSelectCard: (cardIndex: number) => void
  onSkip: () => void
}

function RewardCardComponent({ card, x, onClick }: { card: Card; index: number; x: number; onClick: () => void }) {
  const bgColor = card.type === 'attack' ? '#3d1a1a' : card.type === 'skill' ? '#1a2a3d' : '#2a2a1a'
  const strokeColor = card.type === 'attack' ? '#c0392b' : card.type === 'skill' ? '#2980b9' : '#f39c12'
  const rarityColor = card.rarity === 'rare' ? '#9b59b6' : card.rarity === 'uncommon' ? '#3498db' : '#95a5a6'
  
  return (
    <g style={{ cursor: 'pointer' }} onClick={onClick}>
      <rect
        x={x}
        y={280}
        width={100}
        height={140}
        rx={8}
        fill={bgColor}
        stroke={strokeColor}
        strokeWidth={2}
      />
      <rect
        x={x + 5}
        y={285}
        width={90}
        height={16}
        rx={3}
        fill={rarityColor}
        opacity={0.8}
      />
      <text
        x={x + 50}
        y={297}
        textAnchor="middle"
        fill="#fff"
        fontSize={10}
        fontWeight="bold"
      >
        {card.rarity.toUpperCase()}
      </text>
      <text
        x={x + 50}
        y={330}
        textAnchor="middle"
        fill="#fff"
        fontSize={12}
        fontWeight="bold"
      >
        {card.name.length > 14 ? card.name.substring(0, 13) + '…' : card.name}
      </text>
      <text
        x={x + 50}
        y={355}
        textAnchor="middle"
        fill="#aaa"
        fontSize={9}
      >
        {card.description.length > 30 ? card.description.substring(0, 29) + '…' : card.description}
      </text>
      <circle
        cx={x + 15}
        cy={405}
        r={12}
        fill="#1a1a2e"
        stroke="#f39c12"
        strokeWidth={2}
      />
      <text
        x={x + 15}
        y={410}
        textAnchor="middle"
        fill="#f39c12"
        fontSize={14}
        fontWeight="bold"
      >
        {card.cost}
      </text>
      {(card.damage || card.block) && (
        <text
          x={x + 50}
          y={400}
          textAnchor="middle"
          fill="#e74c3c"
          fontSize={11}
          fontWeight="bold"
        >
          {card.damage ? `💥 ${card.damage}` : `🛡️ ${card.block}`}
        </text>
      )}
    </g>
  )
}

export function RewardView({ reward, onSelectCard, onSkip }: RewardViewProps) {
  return (
    <>
      <rect
        x={200}
        y={180}
        width={400}
        height={300}
        rx={20}
        fill="#1a1a2e"
        stroke="#f39c12"
        strokeWidth={4}
        opacity={0.95}
      />
      
      <text
        x={400}
        y={220}
        textAnchor="middle"
        fill="#f39c12"
        fontSize={26}
        fontWeight="bold"
      >
        Choose Your Reward
      </text>
      
      <text
        x={400}
        y={250}
        textAnchor="middle"
        fill="#f1c40f"
        fontSize={18}
        fontWeight="bold"
      >
        💰 +{reward.goldReward} Gold
      </text>

      {reward.cards.map((rewardCard, idx) => (
        <RewardCardComponent
          key={`${rewardCard.card.id}_${idx}`}
          card={rewardCard.card}
          index={idx}
          x={235 + idx * 120}
          onClick={() => onSelectCard(idx)}
        />
      ))}

      {reward.canSkip && (
        <g style={{ cursor: 'pointer' }} onClick={onSkip}>
          <rect
            x={320}
            y={445}
            width={160}
            height={36}
            rx={18}
            fill="#2a3a2a"
            stroke="#666"
            strokeWidth={2}
          />
          <text
            x={400}
            y={468}
            textAnchor="middle"
            fill="#888"
            fontSize={14}
            fontWeight="bold"
          >
            Skip (No Card)
          </text>
        </g>
      )}
    </>
  )
}