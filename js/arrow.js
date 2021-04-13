// array of all arrows
var arrows = [];
var flag = true;
// adjusts arrow speed
var speedMod = 4;

var addArrow = function() {
  arrows.unshift(new Arrow()); // unshift adds to FRONT of arrows array
  currArrow = arrows[0];
}

// Arrow prototype
function Arrow() {

  this.x = shootingCirc.x;
  this.y = shootingCirc.y;
  this.status = shootingCirc.status
  this.arrowTipCoords = {
    x: this.x+20,
    y: this.y,
    status : this.status,
    
  };
  // left and right parts of the arrow head
  this.leftTipCoords = {
    x: this.x+17,
    y: this.y-3
  }
  this.rightTipCoords = {
    x: this.x+17,
    y: this.y+3
  }
  this.velX = 0;
  this.velY = 0;
  this.speed = 0;
  this.firing = false;
}






// ======================arrow draw=================
Arrow.prototype.drawArrow = function() {
  this.calcTrajectory();
  this.calcArrowHead();
  var arrowTip = this.arrowTipCoords;
  var leftTip = this.leftTipCoords;
  var rightTip = this.rightTipCoords;

  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(arrowTip.x, arrowTip.y, 100, 100);

  ctx.moveTo(arrowTip.x, arrowTip.y);
  ctx.lineTo(leftTip.x, leftTip.y);

  ctx.moveTo(arrowTip.x, arrowTip.y);
  ctx.lineTo(rightTip.x, rightTip.y);

  ctx.strokeStyle = "black";
  ctx.stroke();


};


// shipPosition.x < asteriodPosition.x + asteriodPosition.width&&
//         shipPosition.x+shipPosition.width > asteriodPosition.x &&
//         shipPosition.y < asteriodPosition.y +asteriodPosition.height &&
//         shipPosition.height+shipPosition.y > asteriodPosition.y

Arrow.prototype.collisionnet = function() 
{

  var arrowTip = this.arrowTipCoords;
  // var leftTip = this.leftTipCoords;
  // var rightTip = this.rightTipCoords;
  var i;
if(arrowTip.x< net.x + net.width && arrowTip.x > net.x && arrowTip.y < net.y + net.height && arrowTip.y > net.y){
  this.firing = false;
  

}
};

Arrow.prototype.collisiondog = function() {

  var arrowTip = this.arrowTipCoords;
  // var leftTip = this.leftTipCoords;
  // var rightTip = this.rightTipCoords;
if(arrowTip.status === 1){
// if(arrowTip.x< drawdog.x + drawdog.width && arrowTip.x > drawdog.x && arrowTip.y < drawdog.y + drawdog.height && arrowTip.y > drawdog.y){
  if(arrowTip.x > drawdog.x && arrowTip.y > drawdog.y && arrowTip.x< drawdog.x + drawdog.width && arrowTip.y < drawdog.y + drawdog.height)  {
    debugger;
    // ctx.clearRect(arrowTip.x, arrowTip.y,);
    var audio = new Audio("assets/images/laugh1.mp3");
    audio.play();
    this.firing = false;
    if(flag){
      // flag = false;
     
      countLife = countLife + 1;
     
      arrowTip.status = 0;
    }
  
   
    console.log(countLife)
    // debugger;
    if (countLife == 5) {

    alert('Cat won!! want to restart?');
    window.location.reload();
 
    }
    return true;
  }
}

}




var cleararrow=function(){
  ctx.clearRect(arrowTip.x, arrowTip.y);
}


Arrow.prototype.fireArrow = function() {
  
  flag=true;
  var audio = new Audio("assets/images/Arrowthrow.mp3");
        audio.play();
  if (mousePos && !this.firing) {
    this.speed = Math.min(shootingCirc.r,
                 distBetween(shootingCirc, mousePos)) / speedMod;
    this.velX = Math.cos(angleBetween(mousePos, shootingCirc))*this.speed;
    this.velY = Math.sin(angleBetween(mousePos, shootingCirc))*this.speed;
    this.firing = true;
   
      addArrow();
    
  }

}


Arrow.prototype.calcTrajectory = function() {
  if (this.y <= groundPoint && this.firing) {
    this.velY += gravity;
    this.x += this.velX;
    this.y += this.velY;
  } else {
    this.velX = 0;
    this.velY = 0;
    this.firing = false;
  }
};


Arrow.prototype.calcArrowHead = function() {
  if (this.firing) {
    var angle = Math.atan2(this.velX, this.velY);
  } else if (mousePos && this == currArrow) {
    var angle = Math.PI/2 - angleBetween(mousePos, shootingCirc);
  } else return;

  this.arrowTipCoords.x = this.x + 20*Math.sin(angle);
  this.arrowTipCoords.y = this.y + 20*Math.cos(angle);
  var arrowTip = {x:this.arrowTipCoords.x, y:this.arrowTipCoords.y}

  this.leftTipCoords.x = arrowTip.x - 3*Math.sin(angle-Math.PI/4);
  this.leftTipCoords.y = arrowTip.y - 3*Math.cos(angle-Math.PI/4);
  this.rightTipCoords.x = arrowTip.x - 3*Math.sin(angle+Math.PI/4);
  this.rightTipCoords.y = arrowTip.y - 3*Math.cos(angle+Math.PI/4);
};

