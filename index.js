let width = 7;
let height = 6;
let connect = 4;
let mycolor = "red";
let turn = 1;
let mycolumn = 0;

function start() {
	board.innerHTML = "";
	for(let r = 0; r < height + 1; r++) {
		let row = board.insertRow(r);
		if(r == 0) {
			row.className = "view";
		}
		for(let c = 0; c < width; c++) {
			let cell = row.insertCell(c);
			cell.onclick = function() {
				if(canDropPiece(c)) {
					mycolumn = c;
					sendTurn(c);
				}
			};
			cell.onmouseover = function() {onMouseOver(c);};
			cell.onmouseout = function() {onMouseOut(c);};
			if(r != 0) {
				cell.className = "drop";
			}
		}
	}
	loadingpop.style.display = "none";
	window.addEventListener('resize', resize);
}

function resize() {
	const cellWidth = (window.innerWidth * .9) / width;
	const cellHeight = (window.innerHeight * .9) / (height + 1);
	let cellSize = cellHeight;
	if(cellWidth < cellHeight) {
		cellSize = cellWidth;
	}
	for(let r = 0; r < height + 1; r++) {
		for(let c = 0; c < width; c++) {
			let cell = board.rows[r].getElementsByTagName("td")[c];
			cell.width = cellSize;
			cell.height = cellSize;
		}
	}
	let popupWidthScale = width - 2;
	if(popupWidthScale < 1) {
		popupWidthScale = 2;
	}
	if(popupWidthScale < 0) {
		popupWidthScale = 1;
	}
	let offSetWidth = 1;
	if(width < 3) {
		offSetWidth = 0;
	}
	let popupHeightScale = height - 4;
	if(popupHeightScale < 1) {
		popupHeightScale = 1;
	}
	const loPopups = document.getElementsByClassName("popup");
	for(let i = 0; i < loPopups.length; i++) {
		loPopups[i].style.width = cellSize * popupWidthScale + popupWidthScale * 4;
		loPopups[i].style.height = cellSize * popupHeightScale + popupHeightScale * 2;
		loPopups[i].style.top = board.offsetTop + cellSize + 2;
		loPopups[i].style.left = board.offsetLeft + cellSize * offSetWidth + offSetWidth * 4;
	}
}

function playTurn() {
	if(turn % 2 === 1) {
		if(mycolor === "red") {
			dropPiece(mycolumn, mycolor);
			dropPiece(opponentTurn.column, opponentTurn.mycolor); 
		}
		else {
			dropPiece(opponentTurn.column, opponentTurn.mycolor); 
			dropPiece(mycolumn, mycolor);
		}
	}
	else {
		if(mycolor === "red") {
			dropPiece(opponentTurn.column, opponentTurn.mycolor); 
			dropPiece(mycolumn, mycolor);
		}
		else {
			dropPiece(mycolumn, mycolor);
			dropPiece(opponentTurn.column, opponentTurn.mycolor); 
		}
	}
	turn = turn + 1;
	turnPlayed = false;
	opponentTurn = false;
	const isGameOver = checkGameOver();
	if(isGameOver) {
		gameOver(isGameOver);
	}
}
function canDropPiece(c) {
	if(startPop.style.display === "none" && loadingpop.style.display === "none"){
		return board.rows[1].getElementsByTagName("td")[c].className === "drop";
	}
	return false;
}
function dropPiece(c, color) {
	for(let r = height; r > 0; r--) {
		let cell = board.rows[r].getElementsByTagName("td")[c];
		if(cell.className === "drop") {
			cell.className = color;
			return true;
		}
	}
}
function gameOver(winnerString) {
	startPop.style.display = "block";
	winningText.innerHTML = "Victory for: " + winnerString;
}

function checkGameOver() {
	let isAtie = true;
	for(let r = 1; r < height + 1; r++) {
		for(let c = 0; c < width; c++) {
			let cell = board.rows[r].getElementsByTagName("td")[c];
			if(cell.className === "red") {
				if(countDown(r, c, "red") === connect) {
					return "red";
				}
				if(countRight(r, c, "red") === connect) {
					return "red";
				}
				if(countDownRight(r, c, "red") === connect) {
					return "red";
				}
				if(countDownLeft(r, c, "red") === connect) {
					return "red";
				}
			}
			else if(cell.className === "yellow") {
				if(countDown(r, c, "yellow") === connect) {
					return "yellow";
				}
				if(countRight(r, c, "yellow") === connect) {
					return "yellow";
				}
				if(countDownRight(r, c, "yellow") === connect) {
					return "yellow";
				}
				if(countDownLeft(r, c, "yellow") === connect) {
					return "yellow";
				}
			}
			else {
				isAtie = false;
			}
		}
	}
	if(isAtie) {
		return "WAH?>! No One!";
	}
	return false;
}
function countDown(r, c, color) {
	let count = 0;
	for(let d = 0; d < connect; d++) {
		if(r + d < height + 1) {
			const cell = board.rows[r+d].getElementsByTagName("td")[c];
			if(cell.className === color) {
				count = count + 1;
			}
		}
	}
	return count;
}
function countRight(r, c, color) {
	let count = 0;
	for(let d = 0; d < connect; d++) {
		if(c + d < width) {
			const cell = board.rows[r].getElementsByTagName("td")[c+d];
			if(cell.className === color) {
				count = count + 1;
			}
		}
	}
	return count;
}
function countDownRight(r, c, color) {
	let count = 0;
	for(let d = 0; d < connect; d++) {
		if(c + d < width && r + d < height + 1) {
			const cell = board.rows[r+d].getElementsByTagName("td")[c+d];
			if(cell.className === color) {
				count = count + 1;
			}
		}
	}
	return count;
}
function countDownLeft(r, c, color) {
	let count = 0;
	for(let d = 0; d < connect; d++) {
		if(c - d > -1 && r + d < height + 1) {
			const cell = board.rows[r+d].getElementsByTagName("td")[c-d];
			if(cell.className === color) {
				count = count + 1;
			}
		}
	}
	return count;
}

function changeSize(inw, inh, inc) {
	width = parseInt(inw);
	height = parseInt(inh);
	connect = parseInt(inc);
	start();
	resize();
}

function onMouseOver(c) {
	let cell = board.rows[0].getElementsByTagName("td")[c];
	cell.className = mycolor;
}

function onMouseOut(c) {
	let cell = board.rows[0].getElementsByTagName("td")[c];
	cell.className = "";
}