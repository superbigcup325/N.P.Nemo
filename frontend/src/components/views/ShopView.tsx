import { useState } from 'react'
import type { ShopOffer, Card } from '../../types'

interface ShopViewProps {
  shop: ShopOffer
  gold: number
  allCards: Card[]
  onBuyItem: (itemIndex: number) => void
  onRemoveCard: (cardIndex: number) => void
  onLeave: () => void
}

function ShopCardItem({ card, price, canAfford, onClick }: {
  card: Card
  price: number
  canAfford: boolean
  onClick: () => void
}) {
  const bgColor = card.type === 'attack' ? '#3d1a1a' : card.type === 'skill' ? '#1a2a3d' : '#2a2a1a'
  const strokeColor = canAfford ? (card.type === 'attack' ? '#c0392b' : card.type === 'skill' ? '#2980b9' : '#f39c12') : '#555'
  const rarityColor = card.rarity === 'rare' ? '#9b59b6' : card.rarity === 'uncommon' ? '#3498db' : '#95a5a6'

  return (
    <g style={{ cursor: canAfford ? 'pointer' : 'not-allowed', opacity: canAfford ? 1 : 0.5 }} onClick={canAfford ? onClick : undefined}>
      <rect
        x={0}
        y={0}
        width={90}
        height={120}
        rx={8}
        fill={bgColor}
        stroke={strokeColor}
        strokeWidth={2}
      />
      <rect x={5} y={5} width={80} height={14} rx={3} fill={rarityColor} opacity={0.8} />
      <text x={45} y={16} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="bold">
        {card.rarity.toUpperCase()}
      </text>
      <text x={45} y={42} textAnchor="middle" fill="#fff" fontSize={11} fontWeight="bold">
        {card.name.length > 12 ? card.name.substring(0, 11) + '…' : card.name}
      </text>
      <text x={45} y={62} textAnchor="middle" fill="#aaa" fontSize={8}>
        {card.description.length > 25 ? card.description.substring(0, 24) + '…' : card.description}
      </text>
      <circle cx={15} cy={105} r={11} fill="#1a1a2e" stroke="#f39c12" strokeWidth={2} />
      <text x={15} y={110} textAnchor="middle" fill="#f39c12" fontSize={13} fontWeight="bold">
        {card.cost}
      </text>
      {(card.damage || card.block) && (
        <text x={45} y={100} textAnchor="middle" fill="#e74c3c" fontSize={10} fontWeight="bold">
          {card.damage ? `⚔${card.damage}` : `🛡${card.block}`}
        </text>
      )}
      <rect x={55} y={96} width={32} height={18} rx={9} fill={canAfford ? '#27ae60' : '#666'} />
      <text x={71} y={109} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="bold">
        {price}g
      </text>
    </g>
  )
}

function PlayerCardItem({ card, isSelected, onClick }: {
  card: Card
  isSelected: boolean
  onClick: () => void
}) {
  const bgColor = card.type === 'attack' ? '#3d1a1a' : card.type === 'skill' ? '#1a2a3d' : '#2a2a1a'
  const strokeColor = isSelected ? '#e74c3c' : (card.type === 'attack' ? '#c0392b' : card.type === 'skill' ? '#2980b9' : '#f39c12')

  return (
    <g style={{ cursor: 'pointer' }} onClick={onClick}>
      <rect
        x={0}
        y={0}
        width={80}
        height={50}
        rx={6}
        fill={bgColor}
        stroke={strokeColor}
        strokeWidth={isSelected ? 3 : 1}
      />
      <text x={40} y={20} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="bold">
        {card.name.length > 10 ? card.name.substring(0, 9) + '…' : card.name}
      </text>
      <text x={40} y={38} textAnchor="middle" fill="#aaa" fontSize={8}>
        {card.type}
      </text>
      <circle cx={12} cy={40} r={8} fill="#1a1a2e" stroke="#f39c12" strokeWidth={1} />
      <text x={12} y={44} textAnchor="middle" fill="#f39c12" fontSize={9} fontWeight="bold">
        {card.cost}
      </text>
    </g>
  )
}

export function ShopView({ shop, gold, allCards, onBuyItem, onRemoveCard, onLeave }: ShopViewProps) {
  const [selectedRemoveIndex, setSelectedRemoveIndex] = useState<number | null>(null)
  const canAffordRemove = gold >= shop.removePrice

  const handleRemoveClick = () => {
    if (canAffordRemove && selectedRemoveIndex !== null) {
      onRemoveCard(selectedRemoveIndex)
      setSelectedRemoveIndex(null)
    }
  }

  return (
    <>
      <rect
        x={150}
        y={80}
        width={500}
        height={460}
        rx={20}
        fill="#1a1a2e"
        stroke="#f39c12"
        strokeWidth={4}
        opacity={0.97}
      />

      <text
        x={400}
        y={115}
        textAnchor="middle"
        fill="#f39c12"
        fontSize={24}
        fontWeight="bold"
      >
        Merchant's Shop
      </text>

      <text
        x={400}
        y={142}
        textAnchor="middle"
        fill="#f1c40f"
        fontSize={16}
        fontWeight="bold"
      >
        Gold: {gold}
      </text>

      <text
        x={170}
        y={170}
        textAnchor="start"
        fill="#aaa"
        fontSize={12}
        fontWeight="bold"
      >
        Cards for Sale:
      </text>

      {shop.items.map((item, idx) => (
        <g key={`shop_item_${idx}`} transform={`translate(${170 + idx * 100}, 180)`}>
          <ShopCardItem
            card={item.card}
            price={item.price}
            canAfford={gold >= item.price}
            onClick={() => onBuyItem(idx)}
          />
        </g>
      ))}

      <line x1={160} y1={310} x2={640} y2={310} stroke="#444" strokeWidth={2} />

      <text
        x={170}
        y={330}
        textAnchor="start"
        fill="#aaa"
        fontSize={12}
        fontWeight="bold"
      >
        Remove a Card ({shop.removePrice}g):
      </text>

      {allCards.length > 0 ? (
        <>
          {allCards.map((card, idx) => (
            <g key={`remove_card_${card.id}_${idx}`} transform={`translate(${170 + (idx % 5) * 90}, ${345 + Math.floor(idx / 5) * 58})`}>
              <PlayerCardItem
                card={card}
                isSelected={selectedRemoveIndex === idx}
                onClick={() => setSelectedRemoveIndex(idx)}
              />
            </g>
          ))}

          <g
            style={{ cursor: canAffordRemove && selectedRemoveIndex !== null ? 'pointer' : 'not-allowed', opacity: canAffordRemove && selectedRemoveIndex !== null ? 1 : 0.5 }}
            onClick={handleRemoveClick}
          >
            <rect
              x={320}
              y={420}
              width={160}
              height={32}
              rx={16}
              fill={canAffordRemove && selectedRemoveIndex !== null ? '#3a1a1a' : '#333'}
              stroke={canAffordRemove && selectedRemoveIndex !== null ? '#e74c3c' : '#555'}
              strokeWidth={2}
            />
            <text
              x={400}
              y={441}
              textAnchor="middle"
              fill={canAffordRemove && selectedRemoveIndex !== null ? '#e74c3c' : '#666'}
              fontSize={12}
              fontWeight="bold"
            >
              Confirm Remove ({shop.removePrice}g)
            </text>
          </g>
        </>
      ) : (
        <text x={400} y={380} textAnchor="middle" fill="#666" fontSize={12}>
          No cards to remove
        </text>
      )}

      <g style={{ cursor: 'pointer' }} onClick={onLeave}>
        <rect
          x={520}
          y={490}
          width={100}
          height={30}
          rx={15}
          fill="#2a2a3a"
          stroke="#888"
          strokeWidth={2}
        />
        <text
          x={570}
          y={510}
          textAnchor="middle"
          fill="#888"
          fontSize={12}
          fontWeight="bold"
        >
          Leave Shop
        </text>
      </g>
    </>
  )
}
