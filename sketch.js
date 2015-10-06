var trump = {
  x:0,
  y:0,
  w:100,
  h:138,
  speedx:0,
  speedy:0,
};

var candidates = [];

var paddleL;
var paddleR;

var trumpSpeed = 8;
var paddleSpeed = 6;

var instructions = "Player 1 \nA = move up\nZ = move down\n\n\nPress any key to begin.";
var instructions2 = "Player 2 \nUp Arrow = move up \nDown Arrow = move down";
var replay = "Press ENTER to play again.";
var welcome = "Trumpong!";
var star;

var startHeight;
var stage = 0;
var player = 0;

var choose1 = "Player 1: Choose your candidate!";
var choose2 = "Now, Player 2: Choose your candidate!";
var errorMsg = "Candidate already in play, choose again!";
var error = false;

function preload() {
  trump.img = loadImage("assets/trumphead.png");
  star = loadImage("assets/star.png");
}

function setup() {
  createCanvas(1280, 600);
  smooth();
  
  imageMode(CENTER);
  rectMode(CENTER);
  
  fill(0,0,255);
  textStyle(BOLD);
  textFont("Georgia");
  textSize(48);
  
  // declare all candidates
  var ben = new Candidate("ben", 0, 0, 100, 147);
  candidates.push(ben);
  
  var carly = new Candidate("carly", 0, 0, 105, 145);
  candidates.push(carly);
  
  var chris = new Candidate("chris", 0, 0, 100, 154);
  candidates.push(chris);
  
  var jeb = new Candidate("jeb", 0, 0, 100, 141);
  candidates.push(jeb);
  
  var john = new Candidate("john", 0, 0, 100, 136);
  candidates.push(john);
  
  var marco = new Candidate("marco", 0, 0, 100, 136);
  candidates.push(marco);
  
  var mike = new Candidate("mike", 0, 0, 100, 137);
  candidates.push(mike);
  
  var rand = new Candidate("rand", 0, 0, 100, 134);
  candidates.push(rand);
  
  var ted = new Candidate("ted", 0, 0, 100, 130);
  candidates.push(ted);
  
  
  
  // load all candidates
  for (var i = 0; i < candidates.length; i++) {
    candidates[i].load();
  }
  
}

function draw() {
  
  if (stage === 0) {
    homeScreen();
  }
  
  if (stage === 1) {
    pickPlayer();
  }

  else if (stage === 2) {
    playGame();
  }
  
  else if (stage === 3) {
    playAgain(); 
  }
  
}

////////////////////////// Stage 0 ////////////////////
function homeScreen() {
  background(255,0,0);

  image(star, width/7, height/3, 500, 500);
  image(trump.img, width/7, height/3, trump.w, trump.h);
  
  textSize(100);
  text(welcome, width/2-50, height/2+50, 200, 500);
  
  textSize(25);
  text(instructions, width/2+100, height/2, 500, 50);
  text(instructions2, width/2+450, height/2, 500, 50);
  
  if (keyIsPressed === true) {
    stage += 1;
  }
}

////////////////////////// Stage 1 ////////////////////

function pickPlayer() {
  background(255,0,0);

  // show candidate line up 
  for (var i = 0; i < candidates.length; i++) {
    candidates[i].lineUp(i);
    candidates[i].display();
  }
  textSize(35);
  textStyle(CENTER);
  
  if (player === 0) {
    text(choose1, width/2, height/3, 600, 100);
  } else {
    text(choose2, width/2, height/3, 800, 100);
  }
  
  if (error === true) {
    textSize(20);
    text(errorMsg, width/2, height/8*7, 600, 100);
  }
  
}

function keyTyped() {
  
  if (candidates[key] !== undefined && stage > 0) { 
    if (paddleL === undefined) {
      paddleL = candidates[key];
      player += 1;
      console.log(player);
    } else if (paddleR === undefined) {
      if (candidates[key].name === paddleL.name) {
        error = true;
      } else {
          paddleR = candidates[key];
          stage += 1;
          setBoard();
      }
    } 
   
  }
}

////////////////////////// Stage 2 ////////////////////

function playGame() {
  background(255,0,0);

  // load trump 
  image(trump.img, trump.x, trump.y, trump.w, trump.h);
  
  // keep trump moving 
  moveTrump();
  
  // keep trump on board
  if (trump.y > height || trump.y < 0) {
    bounceTrump();
  }

  // define candidates starting positions
  paddleL.display();
  paddleR.display();


  // paddleL up and down controls 
  if (keyIsDown(65)) {
    paddleUp(paddleL);
  }
  
  if (keyIsDown(90)) {
    paddleDown(paddleL);
  }
  
  // paddleR up and down controls
  if (keyIsDown(UP_ARROW)) {
    paddleUp(paddleR);
  }
  
  if (keyIsDown(DOWN_ARROW)) {
    paddleDown(paddleR);
  }
  
  // keep paddleL from moving off border of page
  if (paddleL.y <= 0) {
    paddleResetTop(paddleL);
  }
  
  if (paddleL.y >= height) {
    paddleResetBottom(paddleL);
  }
  
  // keep paddleR from moving off border of page
  if (paddleR.y <= 0) {
    paddleResetTop(paddleR);
  }
  
  if (paddleR.y >= height) {
    paddleResetBottom(paddleR);
  }

  // bounce trump off paddleL paddle
  if (trump.x >= getLeft(paddleL) && trump.x <= getRight(paddleL)) {
    if (trump.y >= getTop(paddleL) && trump.y <= getBottom(paddleL)){
    trump.speedx = Math.abs(trump.speedx) * 1.1;
    } 
  }
  
  // bounce trump off paddleR paddle
  if (trump.x >= getLeft(paddleR) && trump.x <= getRight(paddleR)) {
    if (trump.y >= getTop(paddleR) && trump.y <= getBottom(paddleR)){
    trump.speedx = Math.abs(trump.speedx) * -1.1;
    } 
  }
  
  // declare winners 
  if (trump.x > width) {
    declareWinner(paddleL);
  } 
  
  if (trump.x < 0) {  
    declareWinner(paddleR);
  } 
}

////////////////////////// Stage 3 ////////////////////
function playAgain() {
  textSize(30);
  textAlign(CENTER);
  text(replay, width/2, height/2+100, 500, 200);
    
  if (keyIsDown(ENTER)) {
    stage = 2;
    setBoard();
  }
}


////////////////////// Declare functions //////////////


// candidate constructor function object
function Candidate(tempName,tempX, tempY, tempW, tempH) {
  this.name = tempName;
  this.x = tempX;
  this.y = tempY;
  this.w = tempW;
  this.h = tempH;

  this.load = function () {
    this.img = loadImage("assets/"+this.name+".png"); 
  }

  this.display = function() {
    image(this.img, this.x, this.y, this.w, this.h);
  };
  
  this.lineUp = function(i) {
    this.x = width/8 + 120 * i;
    this.y = height/2;
    textSize(20);
    textAlign(CENTER);
    text(i+" - "+this.name, this.x, this.y+100);
  }
  
  this.wins = function() {
    return this.name.toUpperCase()+" WINS!!!";
  };
}
  
  



// board setup
function setBoard() {
    paddleL.img = loadImage("assets/"+paddleL.name+".png"); 
    paddleR.img = loadImage("assets/"+paddleR.name+".png");
    
    trump.x= width/2,
    paddleR.x = width-50;
    paddleL.x = 50;
    
    startHeight = height/2;
    
    trump.y= startHeight; 
    paddleR.y = startHeight;
    paddleL.y = startHeight;
    
    trump.speedx = trumpSpeed;
    trump.speedy = trumpSpeed;
}

// Trump movements
function moveTrump() {
  trump.x = trump.x + trump.speedx;
  trump.y = trump.y + trump.speedy;
}

function bounceTrump() {
  trump.speedy = trump.speedy * -1;
}

// Paddle movements
function paddleUp(player) {
  player.y -= paddleSpeed;
}

function paddleDown(player) {
  player.y += paddleSpeed;
}
 
function paddleResetTop(player) {
  player.y = 1; 
}

function paddleResetBottom(player) {
  player.y = height-1;
}
 
function getTop(paddle) {
    return paddle.y - paddle.h;
  }
  
function getBottom(paddle) {
    return paddle.y + paddle.h;
  }
  
function getLeft(paddle) {
    return paddle.x - paddle.w;
  }
  
function getRight(paddle) {
    return paddle.x + paddle.w;
  }

// Winner declaration 
function declareWinner(winner) {
  trump.speedx = 0;
  trump.speedy = 0;
  
  textAlign(CENTER);
  text(winner.wins(), width/2, height/2, 500, 200);
  
  stage +=1;
}





