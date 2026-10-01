import type { MatrixFillTask } from '../types/game'

export interface MatrixFillAnswers {
  zCells: (number | null)[][]
  reluCells: (number | null)[][]
}

export function scoreMatrixFill(task: MatrixFillTask, answers: MatrixFillAnswers): {
  correct: boolean
  zCorrect: number
  reluCorrect: number
  total: number
  stars: 0 | 1 | 2
} {
  let zCorrect = 0
  for (const cell of task.zCells) {
    const v = answers.zCells[cell.row]?.[cell.col]
    if (v != null && !isNaN(v) && Math.abs(v - cell.correctValue) <= cell.tolerance) {
      zCorrect++
    }
  }
  let reluCorrect = 0
  for (const cell of task.reluCells) {
    const v = answers.reluCells[cell.row]?.[cell.col]
    if (v != null && !isNaN(v) && Math.abs(v - cell.correctValue) <= cell.tolerance) {
      reluCorrect++
    }
  }
  const total = task.zCells.length + task.reluCells.length
  const got = zCorrect + reluCorrect
  const ok = got === total
  let stars: 0 | 1 | 2 = 0
  if (ok) stars = 2
  else if (got >= Math.ceil(total * 0.6)) stars = 1
  return { correct: ok, zCorrect, reluCorrect, total, stars }
}
