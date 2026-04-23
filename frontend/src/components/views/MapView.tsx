interface MapViewProps {
  currentFloor: number
  rooms: Array<{
    id: string
    type: string
    completed: boolean
  }>
  onRoomSelect: (roomIndex: number) => void
}

export function MapView({ currentFloor, rooms, onRoomSelect }: MapViewProps) {
  return (
    <>
      <text x={40} y={40} fill="#aaa" fontSize={16} fontWeight="bold">
        Floor {currentFloor + 1}
      </text>
      
      {rooms.map((room, idx) => (
        <g key={room.id} style={{ cursor: 'pointer' }}>
          <rect
            x={60 + idx * 120}
            y={100}
            width={100}
            height={80}
            rx={8}
            fill={room.completed ? '#2a4a3a' : '#3a3a5a'}
            stroke={room.completed ? '#4a8a6a' : '#6a6a8a'}
            strokeWidth={2}
            onClick={() => onRoomSelect(idx)}
          />
          <text
            x={110 + idx * 120}
            y={135}
            textAnchor="middle"
            fill="#ddd"
            fontSize={12}
            fontWeight="bold"
            onClick={() => onRoomSelect(idx)}
          >
            {room.type.toUpperCase()}
          </text>
          <text
            x={110 + idx * 120}
            y={155}
            textAnchor="middle"
            fill={room.completed ? '#6a9a7a' : '#888'}
            fontSize={10}
            onClick={() => onRoomSelect(idx)}
          >
            {room.completed ? 'DONE' : 'READY'}
          </text>
        </g>
      ))}
    </>
  )
}
