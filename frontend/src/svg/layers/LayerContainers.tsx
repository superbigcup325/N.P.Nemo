import { type ReactNode } from 'react'

interface LayerProps {
  children: ReactNode
}

export function BackgroundLayer({ children }: LayerProps) {
  return (
    <g id="layer-background" style={{ isolation: 'isolate' }}>
      {children}
    </g>
  )
}

export function GameObjectsLayer({ children }: LayerProps) {
  return (
    <g id="layer-gameobjects" style={{ isolation: 'isolate' }}>
      {children}
    </g>
  )
}

export function FXLayer({ children }: LayerProps) {
  return (
    <g id="layer-fx" style={{ isolation: 'isolate' }}>
      {children}
    </g>
  )
}

export function UILayer({ children }: LayerProps) {
  return (
    <g id="layer-ui" style={{ isolation: 'isolate' }}>
      {children}
    </g>
  )
}
