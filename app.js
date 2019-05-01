const config = {
  altPort: '8080',
  engine: 'ejs',
  router: './routes.js',
  staticSrc: 'public'
};

const express = require('express');
const engine = require(config.engine);

const app = express();
const routes = require(config.router)(app);

app.set('view engine', config.engine);
app.use(express.static(config.staticSrc));

let server = app.listen(process.env.PORT || config.altPort, function() {
  console.log('Listening to port: ' + server.address().port);
});
