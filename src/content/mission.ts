export const MISSION = {
  grade: 10,
  subject: 'Matrices & Neural Networks',
  chapter: 'Linear Algebra for Machine Learning',
  missionName: 'Matrix Master',
  roleName: 'Junior ML Engineer',
  intro:
    'You are a junior ML engineer! Explore how neural networks use vectors, matrices, and activation functions to make predictions. Practise a forward pass, discover how PCA helps reveal patterns in data, and see how a hidden layer helps a network solve XOR — all without needing advanced calculus.',
  stages: [
    { id: 'dotProduct', label: 'Stage 1', title: 'Vectors as Data', icon: '•' },
    { id: 'matrixFill', label: 'Stage 2', title: 'Fill the Matrix', icon: '▦' },
    { id: 'forwardPass', label: 'Stage 3', title: 'Wire the Forward Pass', icon: '⟿' },
    { id: 'lossCalc', label: 'Stage 4', title: 'Neural Network Quick Check', icon: '?' },
    { id: 'chainRule', label: 'Stage 5', title: 'Build the Forward Pass', icon: '⟿' },
    { id: 'xorTraining', label: 'Stage 6', title: 'Solve the XOR Challenge', icon: '🎯' },
  ],
  reflectPrompt:
    'A single-layer network can only draw one straight decision boundary — that\'s why it fails at XOR. What does adding a hidden layer actually let the network do differently? Can you think of another real-world pattern that can\'t be separated by a single straight line?',
}
