
var io = require('socket.io-client');

var SerialPort  = require('serialport').SerialPort;



//var portName = '/dev/tty.usbmodem411';
var portName = '/dev/serial/by-id/usb-Dean_Camera_LUFA_CDC_Demo_74035323138351819051-if00';

var serialPort = new SerialPort(portName); // instantiate the serial port.



serialPort.on('open',function(){
	//setDeviceState(storage.getItem('state'));
});

serialPort.on('data',function(data){
	console.log(data.toString());
});


function setDeviceState(state){
	// check connection?
	serialPort.write('$'+state+'\r');
}


socket = io.connect('192.168.33.111', {
    port: 8077
});

socket.on('state', function (state) {
	console.log('state',state);
	setDeviceState(state);
});
// socket.emit('private message', { user: 'me', msg: 'whazzzup?' });

