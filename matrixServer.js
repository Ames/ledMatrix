
var SerialPort  = require('serialport').SerialPort;
var io = require('socket.io').listen(8077);


//var state = '0000000000000000';


var storage = require('node-persist');

storage.initSync({interval:10*1000});

if(!storage.getItem('state')){
	storage.setItem('state','0000000000000000');
}

// //SERIAL
var portName = '/dev/tty.usbmodem411';
var serialPort = new SerialPort(portName); // instantiate the serial port.



serialPort.on('open',function(){
	setDeviceState(storage.getItem('state'));
});


function setDeviceState(state){
	// check connection?
	serialPort.write('$'+state+'\r');
}


//SERVER
io.sockets.on('connection', function (socket) {

	console.log('connected');

	socket.emit('state',storage.getItem('state'));


	socket.on('state', function (state) {
		console.log('state',state);
		//if(serialPort.)
		setDeviceState(state);
		storage.setItem('state',state);
	});

	socket.on('message', function (msg) {
		console.log('message',msg);
	});

	socket.on('disconnect', function () {
		console.log('disconnected');
	});
});

