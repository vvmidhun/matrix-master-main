import type { XorTrainingTask } from '../types/game'

function linearBoundary(slope: number, intercept: number): readonly (readonly [number, number])[] {
  const pts: [number, number][] = []
  for (let x = 0; x <= 1; x += 0.02) {
    pts.push([x, slope * x + intercept])
  }
  return pts
}

function curvedBoundary(t: number): readonly (readonly [number, number])[] {
  const pts: [number, number][] = []
  for (let x = 0; x <= 1; x += 0.02) {
    const y = 0.5 + t * 0.5 * Math.sin(x * Math.PI * 2) + (0.5 - x) * (1 - t) * 0.4
    pts.push([x, Math.max(0, Math.min(1, y))])
  }
  return pts
}

function makeEpochs(): any[] {
  const epochs: any[] = []
  const totalEpochs = 12

  for (let i = 0; i <= totalEpochs; i++) {
    const t = i / totalEpochs
    const loss = Math.max(0.02, 0.693 * Math.exp(-t * 3.2))
    const curveT = Math.max(0, (t - 0.25) / 0.75)
    const boundary = t < 0.2 ? linearBoundary(-1.2, 1.1) : curvedBoundary(curveT)

    let classifications: any
    if (i < 3) {
      classifications = { '0,0': 1, '0,1': 1, '1,0': 0, '1,1': 0 }
    } else if (i < 6) {
      classifications = { '0,0': 1, '0,1': 1, '1,0': 1, '1,1': 0 }
    } else {
      classifications = { '0,0': 0, '0,1': 1, '1,0': 1, '1,1': 0 }
    }

    const descriptions = [
      'Epoch 0: Random init. Straight boundary — can\'t solve XOR yet.',
      'Training… loss dropping. Still just a straight line.',
      'Hidden layer starting to activate. Line about to bend!',
      'Boundary morphing… watch the curve form!',
      'Curving now. 3 points correct, 1 left!',
      'Almost there… boundary wrapping around (1,1).',
      'All 4 XOR points classified correctly! 🎉',
      'Fine-tuning weights. Loss keeps decreasing.',
      'Confidence increasing. Watch the loss tick down!',
      'Network stabilizing. Decision boundary sharpening.',
      'Final refinements…',
      'Almost at minimum loss.',
      'TRAINING COMPLETE. You just solved XOR with a neural network!',
    ]

    epochs.push({
      epoch: i,
      loss,
      weightsW1: [
        [+(2.4 + t * 0.8).toFixed(2), +(-0.4 + t * 2.5).toFixed(2)],
        [+(1.8 + t * 1.2).toFixed(2), +(2.1 - t * 0.4).toFixed(2)],
      ],
      weightsW2: [+(1.6 + t * 1.0).toFixed(2), +(-2.2 + t * 0.6).toFixed(2)],
      biasesB1: [+(-0.4 + t * 0.5).toFixed(2), +(-1.2 + t * 1.1).toFixed(2)],
      biasB2: +(-0.5 + t * 1.2).toFixed(2),
      boundaryPoints: boundary,
      classifications,
      description: descriptions[Math.min(i, descriptions.length - 1)],
    })
  }
  return epochs
}

export const XOR_TRAINING_TASKS: readonly XorTrainingTask[] = [
  {
    id: 'xorMain',
    title: 'Solve the XOR challenge',
    epochs: makeEpochs(),
    winEpoch: 6,
    contextText:
      'Solve three quick steps: choose the XOR output for each input pair, decide whether one straight line can separate the outputs, then watch a hidden layer learn the pattern.',
  },
]
