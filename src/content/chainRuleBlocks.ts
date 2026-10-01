import type { ChainRuleTask } from '../types/game'

export const CHAIN_RULE_TASKS: readonly ChainRuleTask[] = [
  {
    id: 'dLossDW2',
    title: '∂ℒ/∂W₂ — Chain from Loss to W₂',
    blocks: [
      { id: 'dLdy', label: '∂ℒ/∂ŷ', formula: '∂/∂ŷ [−y·log ŷ]', description: 'How loss changes with output' },
      { id: 'dydz2', label: '∂ŷ/∂z₂', formula: '∂/∂z₂ sigmoid(z₂)', description: 'How output changes with z₂' },
      { id: 'dz2dW2', label: '∂z₂/∂W₂', formula: '∂/∂W₂ [W₂·a₁+b₂]', description: 'How z₂ changes with W₂' },
    ],
    correctOrder: ['dLdy', 'dydz2', 'dz2dW2'],
    contextText:
      'Assemble the chain-rule product in the correct order. Each link is a partial derivative. Wrong order → chain snaps! Correct → glowing links!',
  },
]
