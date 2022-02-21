//ryyrryyr
//12345678
let turnArr = ["red", "yellow", "yellow", "red"];

function aiTurn1(aBoard, aiColor) {
	const depth = 4;
	let opposingColor = "yellow";
	if(aiColor === "yellow") {
		opposingColor = "red";
	}
	let specificTurn = (turn-1)*2;
	let bestCol = 0;
	if(turnArr[specificTurn % 4] !== aiColor) {
		let worstc = minimax(aBoard, opposingColor, 1, specificTurn)[0];
		dropPiece(worstc, opposingColor, aBoard);
		let best = minimax(aBoard, aiColor, depth, specificTurn + 1);
		bestCol = best[0];
	}
	else {
		let best = minimax(aBoard, aiColor, depth, specificTurn);
		bestCol = best[0];
	}
	return bestCol;
}

function minimax(aBoard, color, depth, specificTurn) {
	let opposingColor = "yellow";
	if(color === "yellow") {
		opposingColor = "red";
	}
	if(depth === 0) {
		return [-1, heuristic(aBoard, color) - heuristic(aBoard, opposingColor)];
	}
	if(checkGameOver(aBoard)) {
		return [-1, heuristic(aBoard, color) - heuristic(aBoard, opposingColor)];
	}
	
	// Max player
	if(turnArr[specificTurn % 4] === color) {
		let bestScore = -1 * Number.MAX_SAFE_INTEGER;
		let bestCols = [];
		for(let c = 0; c < width; c++) {
			if(aBoard.rows[1].getElementsByTagName("td")[c].className === "drop") {
				let evalBoard = aBoard.cloneNode(true);
				dropPiece(c, color, evalBoard);
				const result = minimax(evalBoard, color, depth-1, specificTurn+1);
				if(result[1] > bestScore) {
					bestScore = result[1];
					bestCols = [c];
				}
				else if(result[1] === bestScore) {
					bestCols.push(c);
				}
			}
		}
		let bestCol = bestCols[Math.floor(Math.random() * bestCols.length)];
		return [bestCol, bestScore];
	}
	
	// Min player
	else {
		let bestScore = Number.MAX_SAFE_INTEGER;
		for(let c = 0; c < width; c++) {
			if(aBoard.rows[1].getElementsByTagName("td")[c].className === "drop") {
				let evalBoard = aBoard.cloneNode(true);
				dropPiece(c, opposingColor, evalBoard);
				const result = minimax(evalBoard, color, depth-1, specificTurn+1);
				if(result[1] < bestScore) {
					bestScore = result[1];
				}
			}
		}
		return [-1, bestScore];
	}
}

function heuristic(aBoard, color) {
	let evalBoard = aBoard.cloneNode(true);
	for(let r = 1; r < height+1; r++) {
		for(let c = 0; c < width; c++) {
			let cell = evalBoard.rows[r].getElementsByTagName("td")[c];
			if(cell.className === color) {
				if(countDown(r, c, color, evalBoard) === connect) {
					return Number.MAX_SAFE_INTEGER;
				}
				if(countRight(r, c, color, evalBoard) === connect) {
					return Number.MAX_SAFE_INTEGER;
				}
				if(countDownRight(r, c, color, evalBoard) === connect) {
					return Number.MAX_SAFE_INTEGER;
				}
				if(countDownLeft(r, c, color, evalBoard) === connect) {
					return Number.MAX_SAFE_INTEGER;
				}
			}
		}
	}
	for(let r = 1; r < height+1; r++) {
		for(let c = 0; c < width; c++) {
			let cell = evalBoard.rows[r].getElementsByTagName("td")[c];
			if(cell.className === "drop") {
				cell.className = color;
			}
		}
	}
	let score = 0;
	for(let r = 1; r < height+1; r++) {
		for(let c = 0; c < width; c++) {
			let cell = evalBoard.rows[r].getElementsByTagName("td")[c];
			if(cell.className === color) {
				if(countDown(r, c, color, evalBoard) === connect) {
					score = score + 1;
				}
				if(countRight(r, c, color, evalBoard) === connect) {
					score = score + 1;
				}
				if(countDownRight(r, c, color, evalBoard) === connect) {
					score = score + 1;
				}
				if(countDownLeft(r, c, color, evalBoard) === connect) {
					score = score + 1;
				}
			}
		}
	}
	return score;
}
