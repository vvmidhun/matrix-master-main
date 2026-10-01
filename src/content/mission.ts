export const MISSION = {
  grade: 10,
  subject: 'Matrices & Neural Networks',
  chapter: 'Chapter — Vectors, Matrices & Forward Pass',
  missionName: 'Matrix Master',
  roleName: 'Junior ML Engineer',
  intro:
    'You are a junior ML engineer! Implement a complete 2-layer neural network from scratch using only NumPy — no sklearn, no PyTorch. Your network must: perform forward pass using matrix multiplication, compute cross-entropy loss, implement backpropagation using chain rule, and train on the XOR problem — a classic that requires a hidden layer.',
  stages: [
    { id: 'dotProduct', label: 'Stage 1', title: 'Vectors as Data', icon: '•' },
    { id: 'matrixFill', label: 'Stage 2', title: 'Fill the Matrix', icon: '▦' },
    { id: 'forwardPass', label: 'Stage 3', title: 'Wire the Forward Pass', icon: '⟿' },
    { id: 'lossCalc', label: 'Stage 4', title: 'Compute the Loss', icon: 'ℒ' },
    { id: 'chainRule', label: 'Stage 5', title: 'Trace the Gradient', icon: '∂' },
    { id: 'xorTraining', label: 'Stage 6', title: 'Train on XOR', icon: '🎯' },
  ],
  reflectPrompt:
    'A single-layer network can only draw one straight decision boundary — that\'s why it fails at XOR. What does adding a hidden layer actually let the network do differently? Can you think of another real-world pattern that can\'t be separated by a single straight line?',
}
