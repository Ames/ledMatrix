
var theTable;
var tabMatrix;
var setForm;


//var drawing = 

function setMessage(msg){
	document.getElementById('message').innerHTML=msg;
}


//var socket = io.connect('http://192.168.33.111:8077');
var socket = io.connect();
socket.on('connect', function () {
	socket.send('hi');

	setMessage('connected');

	socket.on('message', function (msg) {
    	console.log('message',msg);
	});
	socket.on('disconnect',function(){
		setMessage('disconnected');
	});

	socket.on('state',function(newState){
		setState(newState);
	});
});



function init(){
	setForm = document.getElementById('setForm')
	generateTable();
	//setState('080c0eff0e0c0800');
	//setState('0066660000817E3C');
}

function clearButtonPressed(){
	setState('0000000000000000');
}

function setFormSubmit(){
	setState(setForm.value);
	//setForm.value=getState();
}

function generateTable(){

	theTable = document.getElementById('mainTable');

	tabMatrix = [];
	for(var row=0;row<8;row++){
		tabMatrix[row]=[];

		var tabRow = document.createElement('tr');

		for(var col=0;col<8;col++){

			var tabDat = document.createElement('td');

			var check = document.createElement('input');
			check.type = 'checkbox';
			tabMatrix[row][col]=check;

			check.onclick = stateChanged;

			tabDat.appendChild(check);

			tabRow.appendChild(tabDat);

		}
		theTable.appendChild(tabRow);
	}
}

function stateChanged(){
	var state = getState();
	setForm.value=state;

	socket.emit('state',state);
	//console.log(getState());
}

function getState(){
	// read the checkboxes and pack the bits as hex

	var state = '';

	for(var row=0;row<8;row++){
		var rowVal = 0;
		for(var col=0;col<8;col++){
			rowVal|=tabMatrix[row][col].checked<<col;
		}
		state+=('0'+rowVal.toString(16)).slice(-2); 
	}
	return state.toUpperCase();
}

function setState(state){
	// set the checkboxes to state stored in state

	if(state==getState())
		return;

	for(var row=0;row<8;row++){
		var rowVal = parseInt(state.substr(row*2,2),16);
		for(var col=0;col<8;col++){
			tabMatrix[row][col].checked = (rowVal>>col)&1;
		}
	}

	setForm.value=state;
	socket.emit('state',state);
}
