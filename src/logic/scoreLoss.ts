import type { LossTask } from '../types/game'

export function scoreLoss(task: LossTask, answer: number | null): {
  correct: boolean
  stars: 0 | 1 | 2
} {
  if (answer == null || isNaN(answer)) return { correct: false, stars: 0 }
  const ok = Math.abs(answer - task.correctAnswer) <= task.tolerance
  return { correct: ok, stars: ok ? 2 : 0 }
}
