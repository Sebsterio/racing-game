

/* -- LOAD PICS ---*/

var trackThemes = ["day", "night"];
var currentTheme = 0;

var car1Pic = document.createElement("img");
var car2Pic = document.createElement("img");
var trackPics = []

var picsToLoad;
var picList = [
	{varName: car1Pic, fileName: "player1"},
	{varName: car2Pic, fileName: "player2"},
	{trackType: TRACK_ROAD, fileName: "track_road"},
	{trackType: TRACK_WALL, fileName: "track_wall"},
	{trackType: TRACK_GOAL, fileName: "track_goal"},
	{trackType: TRACK_TREE, fileName: "track_tree"},
	{trackType: TRACK_FLAG, fileName: "track_flag"},
	{trackType: TRACK_OIL, fileName: "track_oil"},
	{trackType: TRACK_GRASS, fileName: "track_grass"},
	{trackType: TRACK_RAMP, fileName: "track_ramp"}
];


function initPics() {
	picsToLoad = picList.length
	for (var i = 0; i< picList.length; i++){
		if (picList[i].trackType != undefined){
			loadTrackPic(picList[i].trackType, picList[i].fileName)
		} else {
			loadPic(picList[i].varName, picList[i].fileName);
		}
	}
}

function loadTrackPic (trackCode, fileName) {
	trackPics[trackCode] = document.createElement("img");
	loadPic(trackPics[trackCode], fileName)
}

function loadPic(picVar, fileName) {
	picVar.onload = picLoaded();
	picVar.src = "images/" + fileName + "_" + trackThemes[currentTheme] +".png";
}

function picLoaded() { 
	picsToLoad--;
	log(picsToLoad);
	if (picsToLoad === 0) {
		if (!gameHasStarted) startGame();
		else log("theme changed succesfully");
	}
}

function nextTheme () {
	currentTheme++;
	if (currentTheme == trackThemes.length) currentTheme = 0;
	initPics();
}


/*--- DRAW ---*/

function drawBitmap(pic, x, y, angle){
	ctx.save();
	ctx.translate(x,y);
	ctx.rotate(angle);
	ctx.drawImage(pic, -pic.width/2, -pic.height/2);
	ctx.restore();
}

function drawCircle (ceterX, centerY, radius, color, alpha) {
	ctx.save();
	ctx.fillStyle = color;
	ctx.globalAlpha = alpha;
	ctx.beginPath();
	ctx.arc(ceterX, centerY, radius, 0, Math.PI*2,true);
	ctx.fill();
	ctx.restore();
}




