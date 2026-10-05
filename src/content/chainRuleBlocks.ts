import type { ChainRuleTask } from '../types/game'

export const CHAIN_RULE_TASKS: readonly ChainRuleTask[] = [
  {
    id: 'forwardPassOrder',
    title: 'Put the steps of a neural-network layer in order',
    blocks: [
      {
        id: 'input',
        label: 'Input vector',
        formula: 'x',
        description: 'Start with the information given to the network.',
      },
      {
        id: 'weightedSum',
        label: 'Weighted sum + bias',
        formula: 'z = W·x + b',
        description: 'Multiply by the weights and add the bias.',
      },
      {
        id: 'activation',
        label: 'Activation',
        formula: 'a = ReLU(z)',
        description: 'Apply the activation function to the result.',
      },
      {
        id: 'output',
        label: 'Layer output',
        formula: 'a',
        description: 'Pass this result to the next layer.',
      },
    ],
    correctOrder: ['input', 'weightedSum', 'activation', 'output'],
    contextText:
      'A neural network uses a forward pass to move information through a layer. Put the four steps in order, from the input to the layer output.',
  },
]
