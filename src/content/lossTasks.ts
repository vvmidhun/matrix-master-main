import type { LossTask } from '../types/game'

export const LOSS_TASKS: readonly LossTask[] = [
  {
    id: 'crossEntropy',
    title: 'Cross-Entropy Loss  ℒ = −log(ŷ)',
    outputValue: 0.8,
    trueLabel: 1,
    correctAnswer: 0.2231435513142097,
    tolerance: 0.02,
    contextText:
      'Network output ŷ = 0.8, true label y = 1. Cross-entropy loss when y=1 is ℒ = −log(ŷ). Compute −log(0.8). (answer ≈ 0.223, within ±0.02)',
  },
]
