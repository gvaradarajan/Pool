var Ball = require('./ball.js');
var Vector = require('./vector.js');

var _holesPos = [[10, 10], [390, 10], [10, 740], [390, 740]];


var Game = function () {
  var newObj = new Ball({pos: [170, 200],
    vel: new Vector(0, 0),
    radius: 20,
    color: "#00FF00"});
  var newObj2 = new Ball({pos: [200, 600],
    vel: new Vector(0, 0),
    radius: 20,
    color: "#FFFFFF"});
  var newObj3 = new Ball({pos: [230, 200],
    vel: new Vector(0, 0),
    radius: 20,
    color: "#FFF000"});
  var newObj4 = new Ball({pos: [200, 242],
    vel: new Vector(0, 0),
    radius: 20,
    color: "#FF0000"});
  var newObj5 = new Ball({pos: [30, 700],
    vel: new Vector(0, 0),
    radius: 20,
    color: "#FFF000"});
  this.makingMove = false;
  this.balls = [newObj, newObj2, newObj3, newObj4];
  this.DIM_X = 400;
  this.DIM_Y = 750;
  this.holes = _holesPos;
};

Game.prototype.addBall = function (ball) {
  this.balls.push(ball);
};

Game.prototype.draw = function (ctx) {
  this.holes.forEach(function (hole) {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(hole[0], hole[1], 20, 0, 2 * Math.PI, false);
    ctx.fill();
  });
  this.balls.forEach(function (ball) {
    ball.draw(ctx);
  });
};

Game.prototype.drawStick = function (pointX, pointY, angle, ctx) {
  var stickCorners = [];
  var recAngle = angle - (Math.PI / 2);

  ctx.beginPath();
  ctx.moveTo(pointX, pointY);
  pointX += 2.5 * Math.cos(recAngle);
  pointY -= 2.5 * Math.sin(recAngle);
  stickCorners.push([pointX, pointY]);
  ctx.lineTo(pointX, pointY);
  pointX += 300 * Math.cos(angle);
  pointY -= 300 * Math.sin(angle);
  stickCorners.push([pointX, pointY]);
  ctx.lineTo(pointX, pointY);
  pointX += 5 * Math.cos(recAngle + Math.PI);
  pointY -= 5 * Math.sin(recAngle + Math.PI);
  stickCorners.push([pointX, pointY]);
  ctx.lineTo(pointX, pointY);
  pointX += 300 * Math.cos(angle + Math.PI);
  pointY -= 300 * Math.sin(angle + Math.PI);
  stickCorners.push([pointX, pointY]);
  ctx.lineTo(pointX, pointY);
  pointX += 2.5 * Math.cos(recAngle);
  pointY -= 2.5 * Math.sin(recAngle);
  stickCorners.push([pointX, pointY]);
  ctx.lineTo(pointX, pointY);
  ctx.closePath();
  ctx.fillStyle = "#ad8508";
  ctx.fill();
};

Game.prototype.moveObjects = function () {
  document.getElementsByClassName("game-status")[0].innerHTML = "";
  // var t1 = Date.now();
  this.balls.forEach(function (ball) {
    ball.move(0.02, this.DIM_X, this.DIM_Y);
  }.bind(this));
  // console.log(Date.now() - t1);
};

Game.prototype.handleCollisions = function () {
  var unchecked = this.balls.slice();
  for(var i = 0; i < this.balls.length; i++) {
    unchecked.shift();
    for(var j = 0; j < unchecked.length; j++) {
      if (unchecked.length === 0) continue;
      if (this.balls[i].isCollidedWith(unchecked[j])) {
        this.balls[i].handleCollision(unchecked[j]);
      }
    }
  }
};


Game.prototype.checkPockets = function () {
  var deleteIndices = [];
  this.balls.forEach(function (ball, idx) {
    for (var i = 0; i < this.holes.length; i++) {
      var connVec = new Vector(this.holes[i][0] - ball.pos[0], this.holes[i][1] - ball.pos[1]);
      if (connVec.mag() <= 30) {
        deleteIndices.push(idx);
        continue;
      }
    }
  }.bind(this));
  deleteIndices.forEach(function (idx) {
    this.balls.splice(idx, 1);
  }.bind(this));
};

Game.prototype.isStationary = function () {
  for(var i = 0; i < this.balls.length; i++) {
    if (!this.balls[i].isStationary()) {
      return false;
    }
  }
  return true;
};

Game.prototype.getCueBall = function () {
  for(var i = 0; i < this.balls.length; i++) {
    if (this.balls[i].color === "#FFFFFF") return this.balls[i];
  }
  return false;
};

Game.prototype.getCueBallBounds = function () {
  var cueBall = null;
  this.balls.forEach(function (ball) {
    if (ball.color === "#FFFFFF") cueBall = ball;
  });
  return [[cueBall.pos[0] - cueBall.radius, cueBall.pos[0] + cueBall.radius],
          [cueBall.pos[1] + cueBall.radius, cueBall.pos[1] - cueBall.radius]];
};

Game.prototype.victory = function () {
  if (this.balls.length === 1) return true;
  return false;
};


Game.prototype.playerMove = function (callback, ctx, overflowCtx) {
  if (!this.isStationary()) return;

  var canvas = document.getElementsByTagName("canvas")[0];
  var overlay = document.getElementsByTagName("canvas")[1];
  var offsetX = overlay.getBoundingClientRect().left - canvas.getBoundingClientRect().left;
  var offsetY = overlay.getBoundingClientRect().top - canvas.getBoundingClientRect().top;

  var holdDown = function (ctx, overflowCtx, e) {
    var newOrigin = [canvas.getBoundingClientRect().left, canvas.getBoundingClientRect().top];
    var newOverflowOrigin = [overlay.getBoundingClientRect().left, overlay.getBoundingClientRect().top];
    if (!this.isStationary()) {
      overlay.removeEventListener("mousedown", holdDown);
      return;
    }

    var cueBall = this.getCueBall();
    var bounds = cueBall ? this.getCueBallBounds() : [[0,0],[0,0]];
    var clickCoords = [e.clientX - newOrigin[0], e.clientY - newOrigin[1]];
    if (clickCoords[0] <= bounds[0][1] &&
        clickCoords[0] >= bounds[0][0] &&
        clickCoords[1] >= bounds[1][1] &&
        clickCoords[1] <= bounds[1][0]) {


      var moveStick = function (ctx, overflowCtx, e3) {
        overflowCtx.clearRect(0, 0, 1000, 1000);
        ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
        ctx.fillStyle = "#0B610B";
        ctx.fillRect(0, 0, 400, 750);
        this.draw(ctx);
        // debugger
        var x = e3.clientX - newOverflowOrigin[0];
        var y = e3.clientY - newOverflowOrigin[1];
        var stickAxis = new Vector(x - (cueBall.pos[0] - offsetX), y - (cueBall.pos[1] - offsetY));
        this.drawStick(x, y, stickAxis.findTheta(), overflowCtx);
      }.bind(this, ctx, overflowCtx);


      var letGo = function (overflowCtx, e2) {
        overflowCtx.clearRect(0, 0, 1000, 1000);
        var cueBall = this.getCueBall();
        this.makingMove = true;
        var newVel = [(cueBall.pos[0] - e2.clientX + newOrigin[0]) / 10,
                      (cueBall.pos[1] - e2.clientY + newOrigin[1]) / 10];
        cueBall.vel[0] = Math.abs(newVel[0]) < 20 ? newVel[0] : (20 * Math.sign(newVel[0]));
        cueBall.vel[1] = Math.abs(newVel[1]) < 20 ? newVel[1] : (20 * Math.sign(newVel[1]));
        console.log(cueBall.vel);
        overlay.removeEventListener("mousemove", moveStick);
        overlay.removeEventListener("mouseup", letGo);
        callback();
      }.bind(this, overflowCtx);

      overlay.addEventListener("mousemove", moveStick);

      overlay.addEventListener("mouseup", letGo);
      overlay.removeEventListener("mousedown", holdDown);
    }
  }.bind(this, ctx, overflowCtx);


  overlay.addEventListener("mousedown", holdDown);
};

module.exports = Game;
