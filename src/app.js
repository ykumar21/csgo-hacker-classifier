const config = {
  altPort: '8080',
  engine: 'ejs',
  router: './routes.js',
  staticSrc: 'public'
};

const express = require('express');
const engine = require(config.engine);
const socket = require('socket.io');

const app = express();

app.set('view engine', config.engine);
app.use(express.static(config.staticSrc));

const server = app.listen(process.env.PORT || config.altPort, function() {
  console.log('Listening to port: ' + server.address().port);
});
const io = socket(server);

app.set('socketio', io);

const routes = require(config.router)(app);
