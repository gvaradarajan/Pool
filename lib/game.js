var Ball = require('./ball.js');

var _holesPos = [[20, 20], [380, 20], [20, 730], [380, 730]];

var Game = function () {
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
};

Game.prototype.moveObjects = function () {
  var checked = [];
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
    if (!this.balls[i].isStationary()) {
      return false;
    }
  }
  return true;
};

module.exports = Game;
