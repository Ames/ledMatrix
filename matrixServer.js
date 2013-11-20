
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(express.logger());


var port = process.env.PORT || 8077;
server.listen(port);


// init persist
var storage = require('node-persist');
storage.initSync({interval:10*1000});
if(!storage.getItem('state')){
	storage.setItem('state','0000000000000000');
}


// static routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/web/index.html');
});
app.get('/main.js', function (req, res) {
  res.sendfile(__dirname + '/web/main.js');
});
app.get('/main.css', function (req, res) {
  res.sendfile(__dirname + '/web/main.css');
});



// socket server

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {

	console.log('connected');

	// send the current state to the new client
	socket.emit('state',storage.getItem('state'));

	socket.on('state', function (state) {
		socket.broadcast.emit('state', state);
		storage.setItem('state',state);
	});

	socket.on('message', function (msg) {
		console.log('message',msg);
	});

	socket.on('disconnect', function () {
		console.log('disconnected');
	});
});

