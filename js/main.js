var game = new GameOfLife({
	canvasId: 'field'
});

var startStop = document.getElementById('play_stop');

var start = document.getElementById('start');
start.addEventListener('click', function(){
	game.start();
	applyButton.disabled = true;
	start.disabled = true;
	oneStep.disabled = true;
	random.disabled = true;
	clear.disabled = true;
});

var pause = document.getElementById('pause');
pause.addEventListener('click', function(){
	game.pause();
	applyButton.disabled = false;
	start.disabled = false;
	oneStep.disabled = false;
	random.disabled = false;
	clear.disabled = false;
});

var oneStep = document.getElementById('one_step');
oneStep.addEventListener('click', game.step);
oneStep.addEventListener('mouseup', function () {
	this.blur();
});

var random = document.getElementById('random');
random.addEventListener('click', game.random);
random.addEventListener('mouseup', function () {
	this.blur();
});

var clear = document.getElementById('clear');
clear.addEventListener('click', game.clearField);
clear.addEventListener('mouseup', function () {
	this.blur();
});

var sizeX = document.getElementById('sizeX');
var sizeY = document.getElementById('sizeY');
var cellSize = document.getElementById('cellSize');
var color = document.getElementById('color');
var speed = document.getElementById('speed');
var applyButton = document.getElementById('apply');

applyButton.addEventListener('mouseup', function () {
	this.blur();
});
applyButton.addEventListener('click', function(e){

	if ((sizeX.value > 0 && sizeX.value <= 200) && (sizeY.value > 0 && sizeY.value <= 200)) {
		game.setSizeX(sizeX.value);
		game.setSizeY(sizeY.value);
	} else {
		alert('Размер вселенной должен быть от 1 до 200');
	}

	if (cellSize.value > 0 && cellSize.value <= 200) {
		game.setCellSize(cellSize.value);
	} else {
		alert('Размер клетки должен быть от 1 до 200');
	}
		if (speed.value > 0 && speed.value <= 2000) {
		game.setSpeed(speed.value);
	} else {
		alert('Размер клетки должен быть от 1 до 2000 (2 сек)');
	}

	game.setColor(color.value);
});

var footer = document.getElementById('footer');
if (document.body.clientHeight < window.innerHeight) {
	footer.style.top = window.innerHeight - footer.clientHeight + "px";
}
window.addEventListener('resize', function() {
	if (document.body.clientHeight < window.innerHeight) {
		footer.style.top = window.innerHeight - footer.clientHeight + "px";
	}
});	
window.addEventListener('scroll', function() {
	footer.style.top = -window.pageYOffset + document.body.clientHeight - footer.clientHeight + "px";
});