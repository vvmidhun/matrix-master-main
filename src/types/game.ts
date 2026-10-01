export type Phase =
  | 'home'
  | 'howto'
  | 'dotProduct'
  | 'matrixFill'
  | 'forwardPass'
  | 'lossCalc'
  | 'chainRule'
  | 'xorTraining'
  | 'results'
  | 'badge'
  | 'reflect'

export type CoachMood = 'idle' | 'cheer' | 'oops' | 'wow'

export interface DotProductTask {
  id: string
  title: string
  vectorA: readonly number[]
  vectorB: readonly number[]
  labelsA: readonly string[]
  labelsB: readonly string[]
  correctAnswer: number
  tolerance: number
  contextText: string
}

export interface MatrixFillCell {
  row: number
  col: number
  correctValue: number
  tolerance: number
}

export interface MatrixFillTask {
  id: string
  title: string
  vectorX: readonly number[]
  matrixW: readonly (readonly number[])[]
  biasB: readonly number[]
  zCells: readonly MatrixFillCell[]
  reluCells: readonly MatrixFillCell[]
  contextText: string
}

export interface ForwardPassBlock {
  id: string
  text: string
  formula: string
  color: string
}

export interface ForwardPassTask {
  id: string
  title: string
  blocks: readonly ForwardPassBlock[]
  correctOrder: readonly string[]
  contextText: string
}

export interface LossTask {
  id: string
  title: string
  outputValue: number
  trueLabel: number
  correctAnswer: number
  tolerance: number
  contextText: string
}

export interface ChainRuleBlock {
  id: string
  label: string
  formula: string
  description: string
}

export interface ChainRuleTask {
  id: string
  title: string
  blocks: readonly ChainRuleBlock[]
  correctOrder: readonly string[]
  contextText: string
}

export interface XorEpochState {
  epoch: number
  loss: number
  weightsW1: readonly (readonly number[])[]
  weightsW2: readonly number[]
  biasesB1: readonly number[]
  biasB2: number
  boundaryPoints: readonly (readonly [number, number])[]
  classifications: {
    '0,0': number
    '0,1': number
    '1,0': number
    '1,1': number
  }
  description: string
}

export interface XorTrainingTask {
  id: string
  title: string
  epochs: readonly XorEpochState[]
  winEpoch: number
  contextText: string
}

export interface PerStepStars {
  dotProduct: 0 | 1 | 2
  matrixFill: 0 | 1 | 2
  forwardPass: 0 | 1 | 2
  lossCalc: 0 | 1 | 2
  chainRule: 0 | 1 | 2
  xorTraining: 0 | 1 | 2
}

export interface ScoreSnap {
  correct: number
  possible: number
  stars: number
  perStep: PerStepStars
  overallStars: 0 | 1 | 2 | 3 | 4 | 5
  stageAccuracy: {
    dotProduct: { correct: number; total: number }
    matrixFill: { correct: number; total: number }
    forwardPass: { correct: number; total: number }
    lossCalc: { correct: number; total: number }
    chainRule: { correct: number; total: number }
    xorTraining: { correct: number; total: number }
  }
}
