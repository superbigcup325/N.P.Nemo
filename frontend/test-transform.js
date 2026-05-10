function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function transformKeys(obj) {
  if (obj === null || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map(transformKeys)
  }

  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key)
    result[camelKey] = transformKeys(value)
  }
  return result
}

// Test with backend response structure
const backendResponse = {
  game_id: "test123",
  game_state: {
    game_id: "test123",
    phase: "battle",
    battle_turn: "player",
    turn: 0,
    player: { hp: 80, max_hp: 80, energy: 3, max_energy: 3, gold: 99, block: 0 },
    enemies: [],
    deck: {
      draw_pile: [
        { id: "strike_1", name: "Strike", cost: 1, damage: 6, block: null, type: "attack", rarity: "common", description: "Deal 6 damage.", upgraded: false }
      ],
      hand: [
        { id: "strike_2", name: "Strike", cost: 1, damage: 6, block: null, type: "attack", rarity: "common", description: "Deal 6 damage.", upgraded: false }
      ],
      discard_pile: [],
      exhaust_pile: []
    },
    map: { floors: [] },
    current_floor: 0,
    current_room: 0,
    rng_seed: "seed123",
    pending_rewards: []
  }
}

const transformed = transformKeys(backendResponse)

console.log("=== Transform Test ===")
console.log("gameId:", transformed.gameId)
console.log("gameState keys:", Object.keys(transformed.gameState))
console.log("gameState.gameId:", transformed.gameState.gameId)
console.log("gameState.battleTurn:", transformed.gameState.battleTurn)
console.log("gameState.deck keys:", Object.keys(transformed.gameState.deck))
console.log("gameState.deck.hand length:", transformed.gameState.deck.hand?.length)
console.log("gameState.deck.hand[0]:", transformed.gameState.deck.hand?.[0])
console.log("gameState.deck.drawPile length:", transformed.gameState.deck.drawPile?.length)
