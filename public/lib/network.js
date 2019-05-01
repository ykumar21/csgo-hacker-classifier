function sigmoid(x) {
  return 1/ (1 + Math.exp(-x));
}

function gradient(y) {
  return y * (1-y);
}

class Network {

  constructor(input, hidden, output, lr) {
    this.input_nodes = input;
    this.hidden_nodes = hidden;
    this.output_nodes = output;
    this.learning_rate = lr;

    this.weights_i = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_h = new Matrix(this.output_nodes, this.hidden_nodes);

    this.weights_i.randomize();
    this.weights_h.randomize();

    this.bias_i = new Matrix(this.hidden_nodes, 1);
    this.bias_h = new Matrix(this.output_nodes, 1);

    this.bias_i.randomize();
    this.bias_h.randomize();
  }

  feedforward(input_arr) {
    let input = Matrix.fromArray(input_arr);

    // Generating hidden outputs
    let hidden = Matrix.multiply(this.weights_i, input);
    hidden.add(this.bias_i);
    hidden.map(sigmoid);

    // Generating output outputs
    let output = Matrix.multiply(this.weights_h, hidden);
    output.add(this.bias_h);
    output.map(sigmoid);

    return output.toArray();


  }

  train(inputs, targets) {
    let input = Matrix.fromArray(inputs);

    // Generating hidden outputs
    let hidden = Matrix.multiply(this.weights_i, input);
    hidden.add(this.bias_i);
    hidden.map(sigmoid);

    // Generating output outputs
    let output = Matrix.multiply(this.weights_h, hidden);
    output.add(this.bias_h);
    output.map(sigmoid);

    targets = Matrix.fromArray(targets);
    let output_errors = Matrix.subtract(targets, output);
    let hidden_errors = Matrix.multiply(Matrix.transpose(this.weights_h), output_errors);
    let input_errors = Matrix.multiply(Matrix.transpose(this.weights_i), hidden_errors);

    let gradients = Matrix.map(output, gradient);
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_rate);

    let weight_h_delta = Matrix.multiply(gradients, Matrix.transpose(hidden));
    this.weights_h.add(weight_h_delta);
    this.bias_h.add(gradients);

    let hidden_gradients = Matrix.map(hidden, gradient);
    hidden_gradients.multiply(this.learning_rate);
    hidden_gradients.multiply(hidden_errors);

    let weights_i_delta = Matrix.multiply(hidden_gradients, Matrix.transpose(input));
    this.weights_i.add(weights_i_delta);
    this.bias_i.add(hidden_gradients);

  }
}
