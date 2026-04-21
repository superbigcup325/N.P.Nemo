export function RewardView() {
  return (
    <g>
      <rect
        x={250}
        y={200}
        width={300}
        height={200}
        rx={15}
        fill="#2a2a1a"
        stroke="#f39c12"
        strokeWidth={3}
      />
      <text
        x={400}
        y={260}
        textAnchor="middle"
        fill="#f39c12"
        fontSize={24}
        fontWeight="bold"
      >
        Victory!
      </text>
      <text
        x={400}
        y={300}
        textAnchor="middle"
        fill="#888"
        fontSize={14}
      >
        Choose a reward (coming soon)
      </text>
    </g>
  )
}
