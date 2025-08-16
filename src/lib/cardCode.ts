export type SuitSymbol = '♥' | '♦' | '♣' | '♠'

const rankMap: Record<string, string> = {
  A: 'ace',
  J: 'jack',
  Q: 'queen',
  K: 'king',
}

const suitMap: Record<SuitSymbol, string> = {
  '♥': 'hearts',
  '♦': 'diamonds',
  '♣': 'clubs',
  '♠': 'spades',
}

export function cardCode(rank: string, suit: SuitSymbol): string {
  const rankName = rankMap[rank] ?? rank
  return `${rankName}_of_${suitMap[suit]}`.toLowerCase()
}
