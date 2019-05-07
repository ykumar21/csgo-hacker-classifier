const bodyParser = require('body-parser');
const model = require('./model.js');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function(app) {

  app.get('/', function(request, response) {
    response.render('index.ejs');
  });

  app.post('/train', function(request,response) {
    model.trainModel(app);
  });

  app.post('/predict', function(request,response) {
    predict();
  });

}
