// Ryan Gliever -- 2015

///////////////////////
// CREATE THE CANVAS //
var canvas = document.createElement("canvas");
canvas.id = 'canvas';
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 15;
document.body.appendChild(canvas);
cWidth = canvas.width;
cHeight = canvas.height;
var countLife = 0;

// ============================NET==========================
const netWidth = 15;
const netHeight = cHeight;
const net = {
  x: cWidth / 2 ,
  // x: cWidth / 2 - netWidth / 2,
  // x:400,
  y: 180,
  width: netWidth,
  height: netHeight,
  color: "black"
};

function drawNet() {
  // set the color of net
  ctx.fillStyle = net.color;

  // syntax --> fillRect(x, y, width, height)
  ctx.fillRect(net.x, net.y, net.width, net.height);
}



// ================Image====================



var gravity = 0.4;
var groundPoint = cHeight - (cHeight / 4);

var drawnBack = false;
var firedArrow = false;


var distBetween = function (p1, p2) {
  return Math.sqrt(Math.pow((p2.x - p1.x), 2)
    + Math.pow((p2.y - p1.y), 2));
}


var isInCircle = function (mousePos) {
  var distFromCenter = distBetween(drawBackCirc, mousePos);
  if (distFromCenter < drawBackCirc.r) return true;
  else return false;
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}



var mousePos;
var mouseDown = false;
var mouseUp = false;

addEventListener("mousemove", function (evt) {
  mousePos = getMousePos(canvas, evt);
}, false);

addEventListener("mousedown", function (evt) {
  mousePos = getMousePos(canvas, evt);
  mouseDown = true;
  mouseUp = false;
}, false);

addEventListener("mouseup", function (evt) {
  mousePos = getMousePos(canvas, evt);
  mouseUp = true;
  mouseDown = false;
}, false);


var drawScene = function () {
  // increased groundPoint so arrows stick where they should in the ground
  var ground = groundPoint + 15;
  // sky
  ctx.fillStyle = "rgba(0,0,200,0.2)";
  ctx.fillRect(0, 0, cWidth, ground);
  // ground
  ctx.beginPath();
  ctx.moveTo(0, ground);
  ctx.lineTo(cWidth, ground);
  ctx.strokeStyle = "rgba(0,100,50,0.6)";
  ctx.stroke();
  ctx.fillStyle = "rgba(74, 27, 5, 0.6)";
  ctx.fillRect(0, ground, cWidth, cHeight);
}

// calculate angle between two points
var angleBetween = function (p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

// SHOOTING CIRCLES //
var getAimCoords = function (mousePos) {
  /* NOTE: angleBetween(p1, p2) is 180deg opposite of angleBetween(p2, p1) */
  var angle = Math.PI / 2 - angleBetween(mousePos, shootingCirc);
  var distance = Math.min(distBetween(shootingCirc, mousePos), shootingCirc.r);
  var x = shootingCirc.x + distance * Math.sin(angle);
  var y = shootingCirc.y + distance * Math.cos(angle);
  return { x: x, y: y };
}
var drawAimer = function () {
  if (drawnBack) {
    aimCoords = getAimCoords(mousePos);
    ctx.beginPath();
    ctx.moveTo(aimCoords.x, aimCoords.y);
    ctx.lineTo(shootingCirc.x, shootingCirc.y);
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.stroke();
  }
}



var catImage = new Image();
catImage.src = "../assets/images/shiba.png";

var dogImage = new Image();
dogImage.src = "../assets/images/pet.png";


var drawcat={
  x:150,
  y: 300,
  speed: 5,
}
var drawdog={
  x: 1050,
  y: 300,
  speed: 5,
  width: 130,
  height: 160,
}
var shootingCirc = {
  // x: 1120,
  x:220,
  y: groundPoint - 60,
  r: 100,
  status: 1,
}
var drawBackCirc = {
  x: shootingCirc.x,
  y: shootingCirc.y,
  r: 15
}

var drawstone ={
  x:shootingCirc.x,
  y: groundPoint-60,
  r: 8,
}


var keys = {};
window.addEventListener('keydown', function (e) {
  keys[e.keyCode] = true;
  e.preventDefault();
});
window.addEventListener('keyup', function (e) {
  delete keys[e.keyCode];
});

function input(drawcat, shootingCirc) {
  if (37 in keys && drawcat.x>0) {
    drawcat.x -= drawcat.speed;
    drawcat.direction = 'left';
    drawBackCirc.x -=drawcat.speed;
    shootingCirc.x -=drawcat.speed;
    drawstone.x -=drawcat.speed;
    
  }
  if (39 in keys && drawcat.x <canvas.width/2 - 100) {
    drawcat.x += drawcat.speed;
    drawcat.direction = 'right';
    drawBackCirc.x += drawcat.speed;
    shootingCirc.x +=drawcat.speed;
    drawstone.x +=drawcat.speed;
  }

}

function input1(drawdog) {
  if (65 in keys && drawdog.x>canvas.width/2) {
    drawdog.x -= drawdog.speed;
    drawdog.direction = 'left';
  }
  if (68 in keys && drawdog.x < canvas.width- 100) {
    drawdog.x += drawdog.speed;
    drawdog.direction = 'right';
  }
  
}


function movecat(){
  input(drawcat, shootingCirc);
  
}

function movedog(){
  input1(drawdog);
}


var drawcatscore = function() {
  ctx.font = "50px Comic Sans MS";
  ctx.fillText(	"Score",
  (canvas.width / 2) - 300,
  50);
}
var drawdogscore = function() {
  ctx.font = "50px Comic Sans MS";
  ctx.fillText(	countLife,
  (canvas.width / 2) + 300,
  50);
}

var playerturn = function(){
  ctx.font = "50px Comic Sans MS";
  ctx.fillText(	"Cat's Turn",
  (canvas.width / 2) - 100,
  50);
}


function switchPlayer(currentPlayer) {
  if (currentPlayer === 'drawdog') {
    movedog();
  } else {
    movecat();
  }
}


var drawCircles = function () {

  ctx.beginPath();
  ctx.drawImage(catImage, drawcat.x, drawcat.y, 120, 150);

  ctx.beginPath();
  ctx.arc(drawBackCirc.x, drawBackCirc.y, drawBackCirc.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(drawstone.x, drawstone.y, drawstone.r, 0, 2 * Math.PI);
  // ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.stroke();
  drawAimer();
}

var drawCircles1 = function () {

  ctx.beginPath();
  ctx.drawImage(dogImage, drawdog.x, drawdog.y, drawdog.width, drawdog.height);
  ctx.beginPath();
  // ctx.arc(drawBackCirc1.x, drawBackCirc1.y, drawBackCirc1.r, 0, 2 * Math.PI);
  ctx.stroke();
  drawAimer();
}

var gameover = function(){
  ctx.font = "50px Comic Sans MS";
  ctx.fillText(	"Cat Won!!!",
  (canvas.width / 2) - 100,
  50);
}
// var gameOver = function(){

// }




// UPDATE //
var update = function () {
  isDrawnBack();
  isFiredArrow();
  if (firedArrow) {
    currArrow.fireArrow();

    firedArrow = false;
  }
  // clear the canvas
  ctx.clearRect(0, 0, cWidth, cHeight);
}




// RENDER //
var render = function () {

  drawcatscore();
  drawdogscore();
  drawNet();
  // playerturn();
  // movecat();
  // movedog();
  switchPlayer();



  drawCircles();
  drawCircles1();
  for (i = 0; i < arrows.length; i++) {
    arrows[i].drawArrow();

    if(arrows[i].collisionnet()) {
      break;
    }
    if(arrows[i].collisiondog()) {
      break;
    }

  }
  // for (i = 0; i < arrows.length; i++) {
  //   arrows[i].collisionnet();
  //   // break;

  // }
    // for (i = 0; i < arrows.length; i++) {
    //   arrows[i].collisiondog();
    // }


  drawScene();
  
}



var main = function () {
  update();
  render();
  requestAnimationFrame(main);
}


var isFiredArrow = function () {
  if (mousePos && drawnBack && mouseUp) {
    drawnBack = false;
    firedArrow = true;
  }
}

var isDrawnBack = function () {
  if (mousePos && isInCircle(mousePos)) {
    if (mouseDown) drawnBack = true;
    else if (mouseUp) drawnBack = false;
  }
}



var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
// add initial arrow
addArrow();
var currArrow = arrows[0];
main();










// var drawcircle = drawCircles();

// var interval;
// var both = 0;

// function moveLeft(){
//   var left = parseInt(window.getComputedStyle(catImage).getPropertyValue("left"));
//   if(left>0){
//       catImage.style.left = left - 2 + "px";
//   }
// }
// function moveRight(){
//   var left = parseInt(window.getComputedStyle(catImage).getPropertyValue("left"));
//   if(left<400){
//       catImage.style.left = left + 2 + "px";
//   }
// }
// document.addEventListener("keydown", event => {
//   if(both==0){
//       both++;
//       if(event.key==="a"){
//           interval = setInterval(moveLeft, 1);
//       }
//       if(event.key==="d"){
//           interval = setInterval(moveRight, 1);
//       }
//   }
// });
// document.addEventListener("keyup", event => {
//   clearInterval(interval);
//   both=0;
// });




  // ctx.beginPath();
  // ctx.arc(shootingCirc1.x, shootingCirc1.y, shootingCirc1.r, 0, 2*Math.PI);
  // ctx.strokeStyle = "rgba(0,0,0,0.5)";
  // ctx.stroke();


