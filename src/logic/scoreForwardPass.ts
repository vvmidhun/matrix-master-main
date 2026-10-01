import type { ForwardPassTask } from '../types/game'

export function scoreForwardPass(task: ForwardPassTask, order: readonly string[]): {
  correct: boolean
  stars: 0 | 1 | 2
} {
  if (order.length !== task.correctOrder.length) return { correct: false, stars: 0 }
  const ok = order.every((id, i) => id === task.correctOrder[i])
  return { correct: ok, stars: ok ? 2 : 0 }
}
