import type { MatrixFillTask } from '../types/game'

export const MATRIX_FILL_TASKS: readonly MatrixFillTask[] = [
  {
    id: 'forwardExample',
    title: 'z = W·x + b  then  ReLU(z)',
    vectorX: [0.8, 0.3, 0.9],
    matrixW: [
      [0.6, 0.4, 0.7],
      [0.3, 0.8, 0.2],
    ],
    biasB: [0.1, -0.2],
    zCells: [
      { row: 0, col: 0, correctValue: 1.33, tolerance: 0.01 },
      { row: 1, col: 0, correctValue: 0.46, tolerance: 0.01 },
    ],
    reluCells: [
      { row: 0, col: 0, correctValue: 1.33, tolerance: 0.01 },
      { row: 1, col: 0, correctValue: 0.46, tolerance: 0.01 },
    ],
    contextText:
      'x = [0.8, 0.3, 0.9], W = [[0.6,0.4,0.7],[0.3,0.8,0.2]], b = [0.1, -0.2]. Compute z = W·x + b (2 cells). Then apply ReLU: max(0, z).',
  },
]
