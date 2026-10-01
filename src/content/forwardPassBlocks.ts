import type { ForwardPassTask } from '../types/game'

export const FORWARD_PASS_TASKS: readonly ForwardPassTask[] = [
  {
    id: 'twoLayer',
    title: 'Build the 2-Layer Forward Pass',
    blocks: [
      { id: 'z1', text: 'z₁ = W₁·x + b₁', formula: 'weighted sum layer 1', color: 'cyan' },
      { id: 'a1', text: 'a₁ = ReLU(z₁)', formula: 'hidden activation', color: 'green' },
      { id: 'z2', text: 'z₂ = W₂·a₁ + b₂', formula: 'weighted sum layer 2', color: 'violet' },
      { id: 'out', text: 'ŷ = sigmoid(z₂)', formula: 'final output (0-1)', color: 'fuchsia' },
    ],
    correctOrder: ['z1', 'a1', 'z2', 'out'],
    contextText:
      'Tap in order to wire the 2-layer pipeline: hidden layer weighted sum → hidden activation → output weighted sum → sigmoid output.',
  },
]
