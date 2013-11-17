
var io = require('socket.io-client');

var SerialPort  = require('serialport').SerialPort;



var portName = '/dev/tty.usbmodem411';
var serialPort = new SerialPort(portName); // instantiate the serial port.



serialPort.on('open',function(){
	//setDeviceState(storage.getItem('state'));
});


function setDeviceState(state){
	// check connection?
	serialPort.write('$'+state+'\r');
}


socket = io.connect('localhost', {
    port: 8077
});

socket.on('state', function (state) {
	console.log('state',state);
	setDeviceState(state);
});
// socket.emit('private message', { user: 'me', msg: 'whazzzup?' });

