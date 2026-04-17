import { type ReactNode } from 'react'

interface SVGCanvasProps {
  width?: number
  height?: number
  children: ReactNode
  className?: string
}

export function SVGCanvas({ 
  width = 800, 
  height = 600, 
  children, 
  className = '' 
}: SVGCanvasProps) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ backgroundColor: '#1a1a2e' }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {children}
    </svg>
  )
}
