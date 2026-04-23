export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1)
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomInRange(min, max + 1))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function sample<T>(array: T[], count: number): T[] {
  const shuffled = shuffleArray(array)
  return shuffled.slice(0, Math.min(count, array.length))
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

export const CARD_COLORS = {
  attack: { bg: '#3d1a1a', stroke: '#c0392b' },
  skill: { bg: '#1a2a3d', stroke: '#2980b9' },
  ability: { bg: '#2a2a1a', stroke: '#f39c12' }
} as const

export const RARITY_COLORS = {
  common: '#95a5a6',
  uncommon: '#3498db',
  rare: '#9b59b6'
} as const

export const INTENT_COLORS = {
  attack: '#e74c3c',
  defend: '#3498db',
  buff: '#27ae60',
  debuff: '#f39c12',
  unknown: '#95a5a6'
} as const

export function getCardColor(type: string) {
  return CARD_COLORS[type as keyof typeof CARD_COLORS] || CARD_COLORS.attack
}

export function getRarityColor(rarity: string) {
  return RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.common
}

export function getIntentColor(intentType: string) {
  return INTENT_COLORS[intentType as keyof typeof INTENT_COLORS] || INTENT_COLORS.unknown
}