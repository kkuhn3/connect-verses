let socket = null;
let startTime = "";
loPings = [];
if(localStorage.getItem('kpow2Pings') != null){
	loPings = JSON.parse(localStorage.getItem('kpow2Pings'));
}
let opponentTurn = false;
let turnPlayed = false;
let vsAi = false;

function socketStart() {
	socket = new WebSocket(websocketURL);

	socket.addEventListener('open', function (event) {
		socket.send('{"subscribe":"connectverses"}');
	});

	socket.addEventListener('message', function (event) {
		//console.log(event.data);
		if(event.data === "pong") {
			let endTime = Date.now();
			let delta = endTime - startTime;
			loPings.push(delta);
			localStorage.setItem("kpow2Pings", JSON.stringify(loPings));
		}
		else {
			msgObj = JSON.parse(event.data);
			if(msgObj.match === 1) {
				mycolor = "red";
				loadingpop.style.display = "none";
			}
			else if(msgObj.match === 2) {
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
	});
}

function queueUp() {
	start();
	resize();
	socket.send('{"queue":"connectverses'+width+''+height+''+connect+'"}');
	startPop.style.display = "none";
	loadingpop.style.display = "block";
	loadingpop.innerHTML = "Looking for an opponent ...";
}

function onAI() {
	startPop.style.display = "none";
	vsAi = true;
	start();
	resize();
}

function sendTurn(c) {
	if(vsAi) {
		opponentTurn = {
			"column": aiTurn1(board.cloneNode(true), "yellow"),
			"mycolor": "yellow"
		};
		playTurn();
	}
	else {
		socket.send('{"column":"'+c+'","mycolor":"'+mycolor+'"}');
		if(opponentTurn) {
			playTurn();
		}
		else {
			loadingpop.style.display = "block";
			loadingpop.innerHTML = "Waiting for opponent ...";
			turnPlayed = true;
		}
		
		startTime = Date.now();
		socket.send('ping');
	}
}
