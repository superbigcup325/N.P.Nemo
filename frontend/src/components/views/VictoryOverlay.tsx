interface VictoryOverlayProps {
  turns: number
}

export function VictoryOverlay({ turns }: VictoryOverlayProps) {
  return (
    <g>
      <rect x={200} y={200} width={400} height={200} rx={16} fill="#1a3a1a" stroke="#27ae60" strokeWidth={4} />
      <text x={400} y={270} textAnchor="middle" fill="#27ae60" fontSize={32} fontWeight="bold">VICTORY</text>
      <text x={400} y={320} textAnchor="middle" fill="#aaa" fontSize={16}>You have conquered all floors!</text>
      <text x={400} y={360} textAnchor="middle" fill="#888" fontSize={12}>
        Turns: {turns}
      </text>
    </g>
  )
}
