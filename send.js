const socket = new WebSocket('ws://kpow2.com:7777/connect-verses');
let lookingForMatch = false;
let waitingForOpponent = false;
const myId = uuidv4();
let yourId = "";
let startTime = "";
loPings = [];
if(localStorage.getItem('kpow2Pings') != null){
	loPings = JSON.parse(localStorage.getItem('kpow2Pings'));
}
let opponentTurn = false;
let turnPlayed = false;

function socketStart() {
	socket.addEventListener('open', function (event) {});

	socket.addEventListener('message', function (event) {
		console.log(event.data);
		if(event.data === "pong") {
			let endTime = Date.now();
			let delta = endTime - startTime;
			loPings.push(delta);
			localStorage.setItem("kpow2Pings", JSON.stringify(loPings));
		}
		else {
			msgObj = JSON.parse(event.data);
			if(lookingForMatch && msgObj.queueing) {
				if(width == msgObj.width &&
					height == msgObj.height &&
					connect == msgObj.connect) {
						yourId = msgObj.myId;
						lookingForMatch = false;
						socket.send('{"match":"'+true+'","myId":"'+myId+'","yourId":"'+yourId+'"}');
						mycolor = "red";
						loadingpop.style.display = "none";
				}
			}
			else if(msgObj.yourId === myId) {
				if(msgObj.match && msgObj.yourId === myId) {
					lookingForMatch = false;
					yourId = msgObj.myId;
					mycolor = "yellow";
					loadingpop.style.display = "none";
				}
				else if(msgObj.column) {
					loadingpop.style.display = "none";
					opponentTurn = msgObj;
					if(turnPlayed) {
						playTurn();
					}
				}
			}
		}
	});
}

function queueUp() {
	socket.send('{"queueing":"'+true+'","myId":"'+myId+'","width":"'+width+'","height":"'+height+'","connect":"'+connect+'"}');
	lookingForMatch = true;
	startPop.style.display = "none";
	loadingpop.style.display = "block";
	loadingpop.innerHTML = "Looking for an opponent ...";
}

function sendTurn(c) {
	socket.send('{"column":"'+c+'","mycolor":"'+mycolor+'","myId":"'+myId+'","yourId":"'+yourId+'"}');
	if(opponentTurn) {
		playTurn();
	}
	else {
		loadingpop.style.display = "block";
		turnPlayed = true;
	}
	
	startTime = Date.now();
	socket.send('ping');
}

function uuidv4() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}
