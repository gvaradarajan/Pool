var Ball = require('./ball.js');
var Vector = require('./vector.js');

var _holesPos = [[20, 20], [380, 20], [20, 730], [380, 730]];

var Game = function () {
  this.makingMove = false;
  this.balls = [];
  this.DIM_X = 400;
  this.DIM_Y = 750;
  this.holes = _holesPos.map(function (pos) {
    return new Ball({pos: pos, radius: 20, color: "#000000"});
  });
};

Game.prototype.addBall = function (ball) {
  this.balls.push(ball);
};

Game.prototype.draw = function (ctx) {
  this.holes.forEach(function (hole) {
    hole.draw(ctx);
  });
  this.balls.forEach(function (ball) {
    ball.draw(ctx);
  });
  // this.drawStick(200, 20, Math.PI / 4, ctx);
};

Game.prototype.drawStick = function (pointX, pointY, angle, ctx) {
  var stickCorners = [];
  var recAngle = angle - (Math.PI / 2);


  ctx.fillStyle = "#ad8508";
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
  ctx.fill();
};

Game.prototype.moveObjects = function () {
  var checked = [];
  document.getElementsByClassName("game-status")[0].innerHTML = "";
  this.balls.forEach(function (ball) {
    checked.push(ball);
  });
  // var t1 = Date.now();
  this.balls.forEach(function (ball) {
    ball.move(0.0054, checked);
    var idx = checked.indexOf(ball);
    checked.splice(idx, 1);
  });
  // console.log(Date.now() - t1);
};

Game.prototype.checkPockets = function () {
  var deleteIndices = [];
  this.balls.forEach(function (ball, idx) {
    for(var i = 0; i < this.holes.length; i++) {
      if (ball.isCollidedWith(this.holes[i])) {
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
    console.log(this.balls[i].color + ": " + this.balls[i].isStationary());
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





Game.prototype.playerMove = function (callback, ctx) {
  if (!this.isStationary()) return;

  var canvas = document.getElementsByTagName("canvas")[0];
  var newOrigin = [canvas.getBoundingClientRect().left, canvas.getBoundingClientRect().top];

  var holdDown = function (ctx, e) {
    if (this.makingMove || !this.isStationary()) {
      canvas.removeEventListener("mousedown", holdDown);
      return;
    }

    var cueBall = this.getCueBall();
    var bounds = cueBall ? this.getCueBallBounds() : [[0,0],[0,0]];
    var clickCoords = [e.clientX - newOrigin[0], e.clientY - newOrigin[1]];
    if (clickCoords[0] <= bounds[0][1] &&
        clickCoords[0] >= bounds[0][0] &&
        clickCoords[1] >= bounds[1][1] &&
        clickCoords[1] <= bounds[1][0]) {


      var moveStick = function (ctx, e3) {
        ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
        ctx.fillStyle = "#0B610B";
        ctx.fillRect(0, 0, 400, 750);
        this.draw(ctx);
        var x = e3.clientX - newOrigin[0];
        var y = e3.clientY - newOrigin[1];
        var stickAxis = new Vector(x - cueBall.pos[0], y - cueBall.pos[1]);
        this.drawStick(x, y, stickAxis.findTheta(), ctx);
      }.bind(this, ctx);


      var letGo = function (e2) {
        var cueBall = this.getCueBall();
        this.makingMove = true;
        cueBall.vel[0] = (cueBall.pos[0] - e2.clientX + newOrigin[0]) / 10;
        cueBall.vel[1] = (cueBall.pos[1] - e2.clientY + newOrigin[1]) / 10;
        canvas.removeEventListener("mousemove", moveStick);
        canvas.removeEventListener("mouseup", letGo);
        callback();
      }.bind(this);

      canvas.addEventListener("mousemove", moveStick);

      canvas.addEventListener("mouseup", letGo);
      canvas.removeEventListener("mousedown", holdDown);
    }
  }.bind(this, ctx);


  canvas.addEventListener("mousedown", holdDown);
};

module.exports = Game;
