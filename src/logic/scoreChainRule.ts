import type { ChainRuleTask } from '../types/game'

export function scoreChainRule(task: ChainRuleTask, order: readonly string[]): {
  correct: boolean
  stars: 0 | 1 | 2
} {
  if (order.length !== task.correctOrder.length) return { correct: false, stars: 0 }
  const ok = order.every((id, i) => id === task.correctOrder[i])
  return { correct: ok, stars: ok ? 2 : 0 }
}
