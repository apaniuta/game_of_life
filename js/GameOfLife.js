/*All parameters:
	var game = new GameOfLife({
	canvasId: 'field',  //!required! your id of canvas element
	cellSize: 10,       //in px
	color: '#000000',   //in HEX
	sizeX: 50,          //in px
	sizeY: 50,          //in px
	speed: 100          //im ms
	});
	Initial parameters need to be equal input values.
*/

function GameOfLife(params) {
	'use strict';

	//Initial parameters
	var canvasId = params['canvasId'],
			cellSize = params['cellSize'] || 10,
			color = params['color'] || '#000000',
			sizeX = params['sizeX'] || 50,
			sizeY = params['sizeY'] || 50,
			speed = params['speed'] || 100;

	var field = document.getElementById(canvasId),
			ctx = field.getContext('2d');

	//Calculations
	var currentArray = initArray(),
			timerId = null;

	function initArray() {
		currentArray = [];

		for (var y = 0; y < sizeY; y++) {
			currentArray[y] = [];
			for (var x = 0; x < sizeX; x++) {
				currentArray[y][x] = 0;
			}
		}

		return currentArray;
	}

	function generateNextArray() {
		var nextArray = [];
		for (var i = 0; i < currentArray.length; i++) {
			nextArray[i] = currentArray[i].slice();
		}

		for (var y = 0; y < sizeY; y++) {
			for (var x = 0; x < sizeX; x++) {

				var topY = (y-1 < 0) ? sizeY-1 : y-1,
						bottomY = (y+1 > sizeY-1) ? 0 : y+1,
						leftX = (x-1 < 0) ? sizeX-1 : x-1,
						rightX = (x+1 > sizeX-1) ? 0 : x+1;

				var neighbors = {
					top: currentArray[topY][x],
					bottom: currentArray[bottomY][x],
					left: currentArray[y][leftX],
					right: currentArray[y][rightX],
					topLeft: currentArray[topY][leftX],
					topRight: currentArray[topY][rightX],
					bottomLeft: currentArray[bottomY][leftX],
					bottomRight: currentArray[bottomY][rightX]
				};

				var neighborsSum = 0;
				for (var neighbor in neighbors) {
					neighborsSum = neighborsSum + neighbors[neighbor];
				}

				if (currentArray[y][x] === 1) {
					if (neighborsSum < 2 || neighborsSum > 3) {
					nextArray[y][x] = 0;
					} else if (neighborsSum === 2 || neighborsSum === 3) {
					nextArray[y][x] = 1;
					}
				} else {
					if (neighborsSum === 3) {
					nextArray[y][x] = 1;
					}
				}
			}
		}

		return nextArray;
	}

	function generateRandomArray() {
		var randArr = [];

		for (var y = 0; y < sizeY; y++) {
			randArr[y] = [];
			for (var x = 0; x < sizeX; x++) {
				randArr[y][x] = Math.round(Math.random());
			}
		}
		
		return randArr;
	}

	//Draw
	function drawField(cellSize) {
		field.width = sizeX * cellSize;
		field.height = sizeY * cellSize;
		ctx.strokeStyle = '#4c4747';
		ctx.lineWidth = 0.3;

		for (var y = 0; y < sizeY; y++) {
			for (var x = 0; x < sizeX; x++) {
				ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
			}
		}
	}

	function fill(x, y, cellSize) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, cellSize, cellSize);
	}

	function drawArray(array) {
		for (var y = 0; y < sizeY; y++) {
			for (var x = 0; x < sizeX; x++) {
				ctx.clearRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
				if (array[y][x] === 1) {
					fill(x * cellSize + 1, y * cellSize + 1, cellSize - 2);
				}
			}
		}
	}

	//Events
	var mouseDown = false,
			status = 'paused',
			cellX = 0,
			cellY = 0;

	function getCoords(elem) {
		var box = elem.getBoundingClientRect();
		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};
	}
	
	function mouseSwitch(event, cellX, cellY) {

		event.preventDefault();

		if (status !== 'working') {
			if (currentArray[cellY][cellX] === 0) {
				currentArray[cellY][cellX] = 1;
				fill(cellX * cellSize + 1, cellY * cellSize + 1, cellSize - 2);
			} else {
				currentArray[cellY][cellX] = 0;
				ctx.clearRect(cellX * cellSize + 1, cellY * cellSize + 1, cellSize - 2, cellSize - 2);
			}
		}
	}

	function mousePosition(e) {
		var fieldCoords = getCoords(field);
		var cellX = Math.floor((event.pageX - fieldCoords.left) / cellSize);
		var cellY = Math.floor((event.pageY - fieldCoords.top) / cellSize);
		return [cellX, cellY]
	}

	function fieldMouseDown(e) {
		var position = mousePosition(e);
		mouseSwitch(e, position[0], position[1]);
		cellX = position[0];
		cellY = position[1];
		mouseDown = true;
	}

	function fieldMouseUp() {
		mouseDown = false;
	}

	function fieldMouseMove(e) {
		if (mouseDown) {
			var position = mousePosition(e);
			if ((position[0] !== cellX) || (position[1] !== cellY)) {
				mouseSwitch(e, position[0], position[1]);
				cellX = position[0];
				cellY = position[1];
			}
		}
	}

	field.addEventListener('mousemove', function(e) {fieldMouseMove(e)});
	field.addEventListener('mousedown', function(e) {fieldMouseDown(e)});
	field.addEventListener('mouseup', function(e) {fieldMouseUp()});

	//Actions
	function step() {
		currentArray = generateNextArray();
		drawArray(currentArray);
	}

	function clear() {
		for (var y = 0; y < sizeY; y++) {
			for (var x = 0; x < sizeX; x++) {
				currentArray[y][x] = 0;
				ctx.clearRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
			}
		}
	}

	function start() {
		if (status !== 'working') {
			step();
			timerId = setInterval(step, speed);
			status = 'working';
		}
	}

	function pause() {
		if (status !== 'paused') {
		clearInterval(timerId);
		status = 'paused';
		}
	}

	function random() {
		if (status !== 'working') {
			currentArray = generateRandomArray();
			drawArray(currentArray);
		}
	}

	//Initial field
	drawField(cellSize);
	drawArray(currentArray);

	//Parameters setters
	this.clearField = function() {
		if (status !== 'working') {
			clear();
		}
	}

	this.setCellSize = function(value) {
		if (cellSize !== +value) {
			pause();
			cellSize = +value;
			drawField(cellSize);
			drawArray(currentArray);
		}
	}

	this.setColor = function(value) {
		if (color !== value) {
			pause();
			color = value;
			drawArray(currentArray);
		}
	}

	this.setSizeX = function(value) {
		if (sizeX !== +value) {
			pause();
			sizeX = +value;
			drawField(cellSize);
			currentArray = initArray();
			drawArray(currentArray);
		}
	}

	this.setSizeY = function(value) {
		if (sizeY !== +value) {
			pause();
			sizeY = +value;
			drawField(cellSize);
			currentArray = initArray();
			drawArray(currentArray);
		}
	}

	this.setSpeed = function(value) {
		if (speed !== +value) {
			pause();
			speed = +value;
		}
	}

	this.step = step;
	this.clear = clear;
	this.start = start;
	this.pause = pause;
	this.random = random;
};
