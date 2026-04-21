interface DefeatOverlayProps {
  currentFloor: number
  turns: number
}

export function DefeatOverlay({ currentFloor, turns }: DefeatOverlayProps) {
  return (
    <g>
      <rect x={200} y={200} width={400} height={200} rx={16} fill="#3a1a1a" stroke="#c0392b" strokeWidth={4} />
      <text x={400} y={270} textAnchor="middle" fill="#c0392b" fontSize={32} fontWeight="bold">DEFEAT</text>
      <text x={400} y={320} textAnchor="middle" fill="#aaa" fontSize={16}>You have fallen...</text>
      <text x={400} y={355} textAnchor="middle" fill="#888" fontSize={12}>
        Floor: {currentFloor + 1} | Turn: {turns}
      </text>
    </g>
  )
}
