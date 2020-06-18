// 451

var canvas, ctx;
var FPS = 60;
var gameIsOn = true; // i.e. not paused
var gameHasStarted = false;  // to prevent double interval when changin theme
var PvPMode = true;

var p1 = new carClass();
var p2 = new carClass();

var time0;
var timeLastPaused;
var totalPauseDuration = 0;  // to exclude time puased from race time


window.onload = function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	initPics(); // (ready) => startGame()
	loadTrack();
	p2.initCar(car2Pic, "Yellow Car");
	p1.initCar(car1Pic, "Blue Car");
	initInput();
}

function startGame() {
	gameHasStarted = true;
	time0 = new Date().getTime();
	log("game started");
	setInterval(function(){
		if (gameIsOn){
			moveEverything();
			drawEverything();
		} 
	}, 1000/FPS);
}

function moveEverything(){
	p1.moveCar();
	if (!PvPMode) AI(p2);
	p2.moveCar();
	p1.checkCollissions(p2);
	p2.checkCollissions(p1);
}

function drawEverything(){
	drawTracks();
	p1.drawCar();
	p2.drawCar();
	dashboard();
}

function loadNextRound(winnerName) {
	log(winnerName + " won the race!");
	nextTrack();
	loadTrack();
	p1.resetCar();
	p2.resetCar();
}

function pauseGame() {
	var timeNow = new Date().getTime();
	if (gameIsOn) timeLastPaused = timeNow;
	else {
		totalPauseDuration += timeNow - timeLastPaused;
	}
	gameIsOn = !gameIsOn;
	dashboard(); // TEMP; TODO: display "game paused" msg
}

function log(msg){
	document.getElementById("debugText").innerHTML = msg;
}

function dashboard() {
	var speed = Math.floor(p1.carSpeed*100)/100
	var isPaused = gameIsOn ? "Running..." : "Paused...";
	document.getElementById("dashboard").innerHTML =
		"speed: " + speed + 
		" | " +
		"NoZ: " + p1.boost_fuel + " / " + p2.boost_fuel + 
		" | " +
	 	"time: " + timeElapsed(time0) + 
	 	" | " +
	 	isPaused;
}

function timeElapsed(t0) {
	var time = new Date().getTime() - t0 - totalPauseDuration;
	return convertTime(time);
}

function convertTime(ms){
	var s = Math.floor((ms / 100) % 600)/10;
	s = s.toFixed(1);
	if (s.length<4) s="0"+s;
	var m = Math.floor((ms / (60 * 1000)) % 60).toFixed();
	if (m.length==1) m="0"+m;
	return m + ":" + s;
}