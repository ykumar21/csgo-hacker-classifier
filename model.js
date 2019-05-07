const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const papa = require('papaparse');
const request = require('request');

function GetSign(x) {
  return 1/(1+(Math.exp(-x)));
}


  //Create a new neural network
  const model = tf.sequential();

  // Variable to hold dataset params
  let inputs = [];
  let targets = [];

  // Hyperparameters
  const learningRate = 0.001;
  const inputNodes = 36;
  const hiddenNodes = 8;
  const outputNodes = 1;

  // Training parameters
  const numExamples = 1014;
  const epoch = 500;

  // Creating an optimizer which uses stocastic gradient descent
  const adamOpt  = tf.train.adam(learningRate);

  const modelConfig = {
   optimizer: adamOpt,
   loss: 'meanSquaredError'
  };

  // Dense hidden layer with 4 nodes and 5 inputs
  const hidden = tf.layers.dense({
   units: hiddenNodes, // 4 nodes
   inputShape: [inputNodes], // 5 inputs
   activation: 'sigmoid',
   useBias: 1,
   dtype: 'float32'
  });

  // Dense output layer with 2 nodes and 4 inputs
  const output = tf.layers.dense({
   units: outputNodes, // 2 nodes
   activation: 'sigmoid',
   useBias: 1,
   dtype: 'float32'
  });

  // Add the hidden and output layers
  model.add(hidden);
  model.add(output);

  // Compiling the neural network
  model.compile(modelConfig);


exports.trainModel = function(app,callback) {

  let io = app.get('socketio');


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

  async function Train(iTensor, tTensor) {
    for(let i = 0; i < epoch; i++) {
      const response = await model.fit(iTensor,tTensor);


      console.log(response.history.loss[0]);

    }
  }

  loadData().then(() => {
    // Convert 2D arrays to tensors for training
    let inputTensor = tf.tensor2d(inputs);
    let targetsTensor = tf.tensor2d(targets);
    let losses = [];

    Train(inputTensor, targetsTensor).then(() => {
      io.emit('complete');
      console.log("Training completed!");

    });



  }).catch( (err) => {
    console.log(err);
  });


}

exports.predict = function(steamId,callback) {
  let key = 'F50F9C4B0B022F23427614F9A3A2D71B';
  let url = "http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key="+key+"&steamid="+steamId;
  request(url, function(err, response, body) {
    if(err) {
      console.log(err);
    } else {
      console.log(response.body);
    }
  });
}
