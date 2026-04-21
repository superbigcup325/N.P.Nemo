import type { Card } from '../../types'
import { CardComponent } from './CardComponent'

interface HandAreaProps {
  cards: Card[]
  onPlayCard: (cardIndex: number) => void
}

export function HandArea({ cards, onPlayCard }: HandAreaProps) {
  return (
    <>
      {cards.map((card, idx) => (
        <CardComponent
          key={card.id}
          card={card}
          index={idx}
          onPlay={onPlayCard}
        />
      ))}
    </>
  )
}
