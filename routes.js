const loadDataset = require('./loadDataset.js');
const bodyParser = require('body-parser');
const trainModel = require('./model.js');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function(app) {

  app.get('/', function(request, response) {
    response.render('index.ejs');
  });

  app.post('/load', function(request,response) {
    let data;
    loadDataset('dataset', function(results) {
      data = JSON.stringify(results);
      response.send(data);
    });
  });

  app.post('/train', function(request,response) {
    trainModel();
  });


}
