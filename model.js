const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const papa = require('papaparse');

module.exports = function() {
  // Generate a new neural network
  const model = tf.sequential();

  // Variable to hold dataset params
  let inputs = [];
  let targets = [];

  // Hyperparameters
  const learningRate = 0.1;
  const inputNodes = 6;
  const hiddenNodes = 4;
  const outputNodes = 1;

  // Training parameters
  const numExamples = 1014;

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

  function loadData() {
    return new Promise( function(resolve, reject) {
      const f = fs.createReadStream('./public/data/dataset.csv');
      papa.parse(f, {
        complete: function(results) {
          for(let i = 1; i < numExamples; i++) {

            // Convert each element of array to a number
            results.data[i] = results.data[i].map(Number);

            let row = results.data[i]; // Get the full row from dataset
            let tar = results.data[i].pop(); // Remove last element from each row
            inputs.push(row); // Push sliced row into input array
            targets.push([tar]); // Push popped element into target array
          }
          resolve();
        }
      });
    });
  }

  // Converting arrays to tensors
  loadData().then(() => {

    let inputTensor = tf.tensor2d(inputs);
    let targetsTensor = tf.tensor2d(targets);

    model.predict(inputTensor).print();

    //targetsTensor.print();
  }).catch( (err) => {
    console.log(err);
  });


}
