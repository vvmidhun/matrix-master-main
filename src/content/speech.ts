export const SPEECH = {
  home: 'Welcome, Junior ML Engineer! Today we\'ll build a neural network from scratch. Six stages: vectors, matrices, forward pass, loss, gradients, and the grand XOR training finale. Let\'s go!',
  howto: 'Here\'s how this works: Each stage teaches one piece of the neural network. Some stages need you to type numbers — others need you to tap in the right order. For the big finale, you\'ll press a button to actually train a network and watch it learn XOR!',
  dotProduct: 'Alright, Stage 1: the dot product. This is how neurons multiply inputs by weights and sum them up. Student A has scores [85, 90, 3] and weights... wait, no — actually just compute A · B. Multiply each pair, add \'em up!',
  matrixFill: 'Stage 2: Fill in the output matrix! Each cell z₁, z₂ is the dot product of the weight row with input x, plus the bias b. Then apply ReLU: max(0, z). Type numbers directly into the grid!',
  forwardPass: 'Stage 3: Build the forward pass pipeline. Tap the blocks in order: first z₁ = W₁·x + b₁, then activation, then z₂, then the final sigmoid. Tap to light up each step!',
  lossCalc: 'Stage 4: Cross-entropy loss! If the network says 0.8 but the answer is 1, we compute -log(output). That tells us how wrong the prediction was. The closer to 0, the better!',
  chainRule: 'Stage 5: The chain rule! Connect the gradient links in order: from loss back through the output and z₂, all the way to W₂. Wrong order? The chain snaps! Get it right and it glows.',
  xorTraining: 'FINALE: Train on XOR! Watch the straight line fail at first — it can\'t separate the 4 points. Press "Train 1 Epoch" again and again. The hidden layer will bend the boundary until all 4 points are correct. That\'s why neural networks need depth!',
  results: 'Mission complete! Let\'s see how many stars you earned across all 6 stages.',
  badge: 'CONGRATULATIONS! You earned the Matrix Master badge. You just implemented a neural network — forward pass, loss, backprop, and XOR training. That\'s real ML engineering!',
  reflect: 'Now think about it: Why does a single straight line fail at XOR? What does the hidden layer let you draw instead? Real-world patterns that aren\'t linearly separable — like fraud detection or face shapes — need this too!',
}
