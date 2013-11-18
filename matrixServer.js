
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);


server.listen(8077);


//var io = require('socket.io').listen(8077);


//var state = '0000000000000000';


var storage = require('node-persist');

storage.initSync({interval:10*1000});

if(!storage.getItem('state')){
	storage.setItem('state','0000000000000000');
}



app.get('/', function (req, res) {
  res.sendfile(__dirname + '/web/index.html');
});
app.get('/main.js', function (req, res) {
  res.sendfile(__dirname + '/web/main.js');
});
app.get('/main.css', function (req, res) {
  res.sendfile(__dirname + '/web/main.css');
});



//SERVER
io.sockets.on('connection', function (socket) {

	console.log('connected');

	socket.emit('state',storage.getItem('state'));


	socket.on('state', function (state) {
		console.log('state',state);
		//if(serialPort.)
		//setDeviceState(state);
		storage.setItem('state',state);

		socket.broadcast.emit('state', state);

	});

	socket.on('message', function (msg) {
		console.log('message',msg);
	});

	socket.on('disconnect', function () {
		console.log('disconnected');
	});
});

