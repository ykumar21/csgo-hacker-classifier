const tf = require('@tensorflow/tfjs');
const loadDataset = require('./loadDataset.js');

module.exports = function() {
  // Generate a new neural network
  const model = tf.sequential();

  // Variable to hold dataset params
  let inputs;
  let target;

  // Hyperparameters
  const learningRate = 0.1;
  const inputNodes = 5;
  const hiddenNodes = 4;
  const outputNodes = 2;

  // Creating an optimizer which uses stocastic gradient descent
  const sgdOpt = tf.train.sgd(learningRate);

  const modelConfig = {
   optimizer: sgdOpt,
   loss: 'meanSquaredError'
  };

  // Dense hidden layer with 4 nodes and 5 inputs
  const hidden = tf.layers.dense({
   units: hiddenNodes, // 4 nodes
   inputShape: [inputNodes], // 5 inputs
   activation: 'sigmoid',
   useBias: 1,
   kernelInitializer: 'randomNormal', // Initialises the weight matrix randomly
   biasInitializer: 'randomNormal', // Initialises the bias matrix randomly
   dtype: 'float32'
  });

  // Dense output layer with 2 nodes and 4 inputs
  const output = tf.layers.dense({
   units: outputNodes, // 2 nodes
   activation: 'sigmoid',
   useBias: 1,
   kernelInitializer: 'randomNormal', // Initialises the weight matrix randomly
   biasInitializer: 'randomNormal', // Initialises the bias matrix randomly
   dtype: 'float32'
  });

  // Add the hidden and output layers
  model.add(hidden);
  model.add(output);

  // Compiling the neural network
  model.compile(modelConfig);

  // Get the dataset and train the model
  
}
