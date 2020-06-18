/*

  -  INSTEAD OF FINALZ, DO ACCELATRATIONZ

*/


const ACCELERATE_POWER = 0.08;
const DECELARATE_POWER = -0.15;
const REVERSE_POWER = -0.03;
const MAX_SPEED = 6;
const MAX_REVERSE_SPEED = -1.5;
const SPEED_DECAY_MULT = 0.985;
const TURN_RATE = 0.022;

const COLLISION_DISTANCE = 20; // temp

function carClass() {

  this.carX;
  this.carY;
  this.carZ;
  this.finalZ; // height it will reach at the peak of ramp jump
  this.carSpeed;
  this.carAng;

  this.homeX;
  this.homeY;

  this.state_accelerate = false;
  this.state_decelarate = false;
  this.state_turnLeft = false;
  this.state_turnRight = false;
  this.state_boost = false;

  this.boost_fuel = 60;

  this.setupControls = function (forwardKey, backKey, leftKey, rightKey, boostKey) {
    this.controlAccelerate = forwardKey;
    this.controlReverse = backKey;
    this.controlLeft = leftKey;
    this.controlRight = rightKey;
    this.controlBoost = boostKey;
  }
  
  this.initCar = function(pic, name) {
    this.bitmap = pic;
    this.name = name;
    this.resetCar();
  }
  
  this.resetCar = function() {
    if (this.homeX == undefined){
      for (var i=0; i<trackGrid.length; i++){
        if (trackGrid[i] == 2){
          var carRow = Math.floor(i/TRACK_COLS);
          var carCol = i%TRACK_COLS;
          this.homeX = (carCol * TRACK_SIZE) + (TRACK_SIZE / 2);
          this.homeY = (carRow * TRACK_SIZE) + (TRACK_SIZE / 2);
          trackGrid[i] = 0;
          break;
        }
      }
    }
    this.carX = this.homeX;
    this.carY = this.homeY;
    this.carZ = 0;
    this.finalZ = 0;
    this.carSpeed = 0;
    this.carAng = CarStartAngle * Math.PI;
  }

  /*----movement----*/

  this.moveCar = function() {

    /* acceleration */
    var currentTile = checkPosition(this.carX, this.carY);
    if (currentTile != TRACK_OIL && this.carZ == 0){
      if (this.state_boost && this.boost_fuel > 0){
        if (currentTile == TRACK_ROAD) this.carSpeed += ACCELERATE_POWER*3;
        if (currentTile == TRACK_GRASS) this.carSpeed += ACCELERATE_POWER/4;
        this.boost_fuel--;
      }
      else if (this.state_accelerate && this.carSpeed < MAX_SPEED){
        if (currentTile == TRACK_ROAD) this.carSpeed += ACCELERATE_POWER;
        if (currentTile == TRACK_GRASS) this.carSpeed += ACCELERATE_POWER/4;
      }
      else if (this.state_decelarate){
        if (this.carSpeed > 0) this.carSpeed += DECELARATE_POWER;
        else if (this.carSpeed > MAX_REVERSE_SPEED) this.carSpeed += REVERSE_POWER;
      }
    }
    this.carSpeed *= SPEED_DECAY_MULT;

    /* turning */
    if (Math.abs(this.carSpeed) >= 0.1 && currentTile != TRACK_OIL && this.carZ == 0){
      if (this.carSpeed > 0){
        if (this.state_turnLeft){
          this.carAng -= Math.PI * TURN_RATE;
        }
        if (this.state_turnRight){
          this.carAng += Math.PI * TURN_RATE;
        }
      } else {
        if (this.state_turnLeft){
          this.carAng += Math.PI * TURN_RATE;
        }
        if (this.state_turnRight){
          this.carAng -= Math.PI * TURN_RATE;
        }
      }
    }

    /* jumping */
    if (currentTile == TRACK_RAMP){
      this.finalZ = this.carSpeed*10;
      this.carZ++;
    }
    if (this.carZ > 0) {                // car airborne
      if (this.finalZ > 0){             // car climbing
        if (this.carZ < this.finalZ) this.carZ = this.carZ + 10;
        else this.finalZ = 0;
      } else if (this.finalZ == 0) {    // car falling    
        this.carZ = this.carZ - 10;
      }
    } else if (this.carZ < 0) this.carZ = 0;
    

    /* position */
    var nextX = this.carX + (Math.cos(this.carAng) * this.carSpeed);
    var nextY = this.carY + (Math.sin(this.carAng) * this.carSpeed);
    var nextTile = checkPosition(nextX, nextY);
    if (nextTile === TRACK_ROAD || nextTile == TRACK_OIL ||
        nextTile == TRACK_GRASS || nextTile == TRACK_RAMP ){
      this.carX = nextX;
      this.carY = nextY;
    } else if (nextTile == TRACK_GOAL){
      loadNextRound(this.name);
    } else {
      this.carSpeed = 0;
    }
  }

  this.checkCollissions = function(other) {
    var offsetX = other.carX - this.carX;
    var offsetY = other.carY - this.carY;
    var distance = Math.sqrt( Math.pow(offsetX,2) + Math.pow(offsetY,2) );
    if (distance <= COLLISION_DISTANCE) {
      this.carX -= offsetX/6;
      this.carY -= offsetY/6;
      other.carX += offsetX/6;
      other.carY += offsetY/6;
    }
  }

  /*----draw----*/

  this.drawCar = function(){
    drawCircle(this.carX, this.carY, 20, "black", .5)
    drawBitmap(this.bitmap, this.carX, this.carY-this.carZ, this.carAng);
  }
}

function getGridPos(x,y) {
  var gridX = Math.floor(x / TRACK_SIZE);
  var gridY = Math.floor(y / TRACK_SIZE);
  var gridIndex = (gridY * TRACK_COLS) + gridX;
  return {
    x: gridX,
    y: gridY,
    i: gridIndex,
  };
};

function AI(p) {
  var random = Math.floor(Math.random()*10)
  switch (random){
    case 1: p.state_accelerate = !p.state_accelerate; break;
    case 2: p.state_decelarate = !p.state_decelarate; break;
    case 3: p.state_turnLeft = !p.state_turnLeft;     break;
    case 4: p.state_turnRight = !p.state_turnRight;   break;
  }
}

function checkPosition(x,y){
  if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return 1;
  var gridPos = getGridPos(x,y);
  //var carGridX = gridPos.x;
  //var carGridY = gridPos.y;
  var carIndex = gridPos.i;
  return trackGrid[carIndex];
}