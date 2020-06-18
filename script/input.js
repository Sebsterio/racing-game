const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT =37;
const KEY_RIGHT = 39;
const KEY_NUM_0 = 96;
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_SHIFT = 16;
const KEY_SPACE = 32;
const KEY_F1 = 112;
const KEY_F5 = 116;  // refresh page; no custom functionality
const KEY_F6 = 117;  // unused


function initInput () {
	document.addEventListener("keydown", keyPressed);
	document.addEventListener("keyup", keyReleased);
	p1.setupControls(KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_NUM_0);
	if (PvPMode) p2.setupControls(KEY_W, KEY_S, KEY_A, KEY_D, KEY_SHIFT);
}

function keyPressed (e) {
	if (e.keyCode != KEY_F5) 		e.preventDefault();
	if (e.keyCode == KEY_F1) 		nextTheme();
	if (e.keyCode == KEY_SPACE)	pauseGame();
	changeState(e.keyCode, p1, true);
	changeState(e.keyCode, p2, true);
}

function keyReleased (e) {
	e.preventDefault();
	changeState(e.keyCode, p1, false);
	changeState(e.keyCode, p2, false);
}

function changeState(keyCode, p, change) {
	//log("keyCode " + (change ? "Pressed" : "Released") + ": " + keyCode)
	switch (keyCode){
		case p.controlAccelerate: p.state_accelerate = change;	break;
		case p.controlReverse: 		p.state_decelarate = change;	break;
		case p.controlLeft: 			p.state_turnLeft = change;		break;
		case p.controlRight: 			p.state_turnRight = change;		break;
		case p.controlBoost: 			p.state_boost = change; 			break;
	}
}


