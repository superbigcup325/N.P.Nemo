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
  card: Card; 
  price: number; 
  canAfford: boolean;
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
          {card.damage ? `💥${card.damage}` : `🛡️${card.block}`}
        </text>
      )}
      <rect x={55} y={96} width={32} height={18} rx={9} fill={canAfford ? '#27ae60' : '#666'} />
      <text x={71} y={109} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="bold">
        {price}g
      </text>
    </g>
  )
}

export function ShopView({ shop, gold, onBuyItem, onRemoveCard, onLeave }: ShopViewProps) {
  const canAffordRemove = gold >= shop.removePrice
  
  return (
    <>
      <rect
        x={150}
        y={100}
        width={500}
        height={400}
        rx={20}
        fill="#1a1a2e"
        stroke="#f39c12"
        strokeWidth={4}
        opacity={0.97}
      />
      
      <text
        x={400}
        y={140}
        textAnchor="middle"
        fill="#f39c12"
        fontSize={28}
        fontWeight="bold"
      >
        🏪 Merchant's Shop
      </text>
      
      <text
        x={400}
        y={170}
        textAnchor="middle"
        fill="#f1c40f"
        fontSize={20}
        fontWeight="bold"
      >
        💰 Your Gold: {gold}
      </text>

      <text
        x={180}
        y={205}
        textAnchor="start"
        fill="#aaa"
        fontSize={14}
        fontWeight="bold"
      >
        Cards for Sale:
      </text>

      {shop.items.map((item, idx) => (
        <g key={`shop_item_${idx}`} transform={`translate(${180 + idx * 100}, 220)`}>
          <ShopCardItem
            card={item.card}
            price={item.price}
            gold={gold}
            canAfford={gold >= item.price}
            onClick={() => onBuyItem(idx)}
          />
        </g>
      ))}

      <line x1={170} y1={360} x2={630} y2={360} stroke="#444" strokeWidth={2} />

      <text
        x={180}
        y={385}
        textAnchor="start"
        fill="#aaa"
        fontSize={14}
        fontWeight="bold"
      >
        Remove a Card:
      </text>

      <g style={{ cursor: canAffordRemove ? 'pointer' : 'not-allowed', opacity: canAffordRemove ? 1 : 0.5 }}>
        <rect
          x={350}
          y={365}
          width={140}
          height={35}
          rx={17}
          fill={canAffordRemove ? '#2a3a2a' : '#333'}
          stroke={canAffordRemove ? '#e74c3c' : '#555'}
          strokeWidth={2}
          onClick={canAffordRemove ? () => onRemoveCard(0) : undefined}
        />
        <text
          x={420}
          y={388}
          textAnchor="middle"
          fill={canAffordRemove ? '#e74c3c' : '#666'}
          fontSize={12}
          fontWeight="bold"
          onClick={canAffordRemove ? () => onRemoveCard(0) : undefined}
        >
          Remove ({shop.removePrice}g)
        </text>
      </g>

      <g style={{ cursor: 'pointer' }} onClick={onLeave}>
        <rect
          x={520}
          y={465}
          width={110}
          height={32}
          rx={16}
          fill="#2a2a3a"
          stroke="#888"
          strokeWidth={2}
        />
        <text
          x={575}
          y={486}
          textAnchor="middle"
          fill="#888"
          fontSize={13}
          fontWeight="bold"
        >
          Leave Shop
        </text>
      </g>
    </>
  )
}