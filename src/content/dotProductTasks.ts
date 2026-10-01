import type { DotProductTask } from '../types/game'

export const DOT_PRODUCT_TASKS: readonly DotProductTask[] = [
  {
    id: 'studentDot',
    title: 'Student Scores × Importance Weights',
    vectorA: [85, 90, 3],
    vectorB: [62, 65, 1],
    labelsA: ['Math', 'Science', 'Projects'],
    labelsB: ['Math Wt', 'Science Wt', 'Projects Wt'],
    correctAnswer: 85 * 62 + 90 * 65 + 3 * 1,
    tolerance: 0.001,
    contextText: 'Student A = [85, 90, 3], Student B = [62, 65, 1]. Compute the dot product A · B. Multiply element-wise and sum.',
  },
]
