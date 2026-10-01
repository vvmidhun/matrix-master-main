import type { XorTrainingTask } from '../types/game'

export function scoreXorTraining(task: XorTrainingTask, reachedEpoch: number): {
  correct: boolean
  stars: 0 | 1 | 2
} {
  if (reachedEpoch < task.winEpoch) return { correct: false, stars: 0 }
  if (reachedEpoch >= task.epochs.length - 1) return { correct: true, stars: 2 }
  return { correct: true, stars: 1 }
}
