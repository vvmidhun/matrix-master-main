export interface LossQuestion {
    id: string
    question: string
    choices: readonly string[]
    correctIndex: number
    explanation: string
}

export const LOSS_TASKS: readonly LossQuestion[] = [
    {
        id: 'forward-pass',
        question: 'What is a forward pass in a neural network?',
        choices: [
            'Moving the prediction backward to change the input',
            'Moving input data through the network to make a prediction',
            'Sorting inputs from smallest to largest',
            'Removing all the weights from the network',
        ],
        correctIndex: 1,
        explanation: 'A forward pass moves input data through each layer to produce an output.',
    },
    {
        id: 'pca',
        question: 'Why can PCA reduce many data features to two components?',
        choices: [
            'To make every data value equal to zero',
            'To add more students to the dataset',
            'To keep the most important patterns while making data easier to view',
            'To turn the data into a neural-network prediction',
        ],
        correctIndex: 2,
        explanation: 'PCA creates fewer components that preserve important patterns, making data easier to visualise.',
    },
    {
        id: 'relu-rule',
        question: 'What does ReLU do to a negative value?',
        choices: [
            'It changes it to 1',
            'It leaves it unchanged',
            'It changes it to 0',
            'It adds the value to the input',
        ],
        correctIndex: 2,
        explanation: 'ReLU returns max(0, z), so negative values become 0 and positive values stay.',
    },
    {
        id: 'loss-function',
        question: 'What is the main purpose of a loss function in a neural network?',
        choices: [
            'To measure how far the network’s prediction is from the actual target',
            'To speed up the internet connection during training',
            'To automatically generate new training images',
            'To count the total number of layers in the model',
        ],
        correctIndex: 0,
        explanation: 'The loss function quantifies prediction error; a lower loss value indicates a better-performing model.',
    },
    {
        id: 'learning-rate',
        question: 'What happens if the learning rate during gradient descent is set too high?',
        choices: [
            'The network learns perfectly in one single step',
            'The training process might overshoot the optimal weights and fail to converge',
            'The model deletes all dataset features automatically',
            'The loss score immediately drops to zero',
        ],
        correctIndex: 1,
        explanation: 'A learning rate that is too high causes steps that are too large, leading to unstable training or overshooting the minimum loss.',
    },
]