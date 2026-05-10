interface MapRoomData {
  id: string
  type: string
  completed: boolean
}

interface MapViewProps {
  currentFloor: number
  currentRoom: number
  rooms: MapRoomData[]
  onRoomSelect: (roomIndex: number) => void
}

function RoomIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    battle: '⚔',
    elite: '⚔',
    boss: '👑',
    rest: '⛺',
    shop: '🏪',
    event: '?'
  }
  return <text fontSize={18}>{icons[type] || '?'}</text>
}

function RoomNode({ room, index, isCurrent, isAccessible, isPast }: {
  room: MapRoomData
  index: number
  isCurrent: boolean
  isAccessible: boolean
  isPast: boolean
}) {
  const x = 80 + index * 130
  const y = 160

  let fill = '#1a1a2e'
  let stroke = '#333'
  let strokeWidth = 2

  if (isPast) {
    fill = '#1a3a2a'
    stroke = '#27ae60'
  } else if (isCurrent && isAccessible) {
    fill = '#2a2a4a'
    stroke = '#f39c12'
    strokeWidth = 3
  }

  const cursorStyle = (isCurrent && isAccessible) ? { cursor: 'pointer' } : { cursor: 'not-allowed', opacity: isPast ? 0.7 : 0.4 }
  const onClickHandler = (isCurrent && isAccessible) ? (() => {}) : undefined

  return (
    <g style={cursorStyle} onClick={() => onClickHandler?.()}>
      <rect
        x={x}
        y={y}
        width={100}
        height={90}
        rx={10}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <g transform={`translate(${x + 50}, ${y + 30})`}>
        <RoomIcon type={room.type} />
      </g>
      <text
        x={x + 50}
        y={y + 58}
        textAnchor="middle"
        fill={isPast ? '#6a9a7a' : isCurrent ? '#f39c12' : '#666'}
        fontSize={11}
        fontWeight="bold"
      >
        {room.type.toUpperCase()}
      </text>
      <text
        x={x + 50}
        y={y + 76}
        textAnchor="middle"
        fill={isPast ? '#4a8a6a' : isCurrent ? '#f5c56a' : '#555'}
        fontSize={9}
      >
        {isPast ? 'DONE' : isCurrent ? 'NEXT' : 'LOCKED'}
      </text>
      {(isCurrent && isAccessible) && (
        <>
          <rect x={x + 35} y={y - 15} width={30} height={16} rx={8} fill="#f39c12" opacity={0.9} />
          <text x={x + 50} y={y - 3} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="bold">
            GO
          </text>
        </>
      )}
    </g>
  )
}

export function MapView({ currentFloor, currentRoom, rooms, onRoomSelect }: MapViewProps) {
  const nextUnfinishedIndex = rooms.findIndex((r, idx) => idx >= currentRoom && !r.completed)
  const isAccessible = (idx: number) => idx === nextUnfinishedIndex || idx === currentRoom + 1

  const handleRoomClick = (idx: number) => {
    if (isAccessible(idx)) {
      onRoomSelect(idx)
    }
  }

  return (
    <>
      <text x={40} y={45} fill="#aaa" fontSize={20} fontWeight="bold">
        Floor {currentFloor + 1} / 3
      </text>

      <text x={40} y={75} fill="#666" fontSize={13}>
        Progress: {rooms.filter(r => r.completed).length} / {rooms.length} rooms completed
      </text>

      {rooms.length > 1 && rooms.map((_, idx) => {
        if (idx === rooms.length - 1) return null
        const x1 = 80 + idx * 130 + 100
        const x2 = 80 + (idx + 1) * 130
        const y = 205
        const isCompletedPath = rooms[idx].completed

        return (
          <line
            key={`path_${idx}`}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            stroke={isCompletedPath ? '#27ae60' : '#444'}
            strokeWidth={isCompletedPath ? 3 : 2}
            strokeDasharray={!isCompletedPath ? '6 4' : undefined}
          />
        )
      })}

      {rooms.map((room, idx) => (
        <g key={room.id} onClick={() => handleRoomClick(idx)}>
          <RoomNode
            room={room}
            index={idx}
            isCurrent={idx >= currentRoom && !room.completed}
            isAccessible={isAccessible(idx)}
            isPast={room.completed || idx < currentRoom}
          />
        </g>
      ))}

      <text x={400} y={300} textAnchor="middle" fill="#555" fontSize={11}>
        Click the highlighted "NEXT" room to proceed
      </text>
    </>
  )
}
