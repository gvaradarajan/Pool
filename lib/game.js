
var Game = function () {
  this.balls = [];
  this.DIM_X = 750;
  this.DIM_Y = 750;
};

Game.prototype.addBall = function (ball) {
  this.balls.push(ball);
};

Game.prototype.draw = function (ctx) {
  this.balls.forEach(function (ball) {
    ball.draw(ctx);
  });
};

Game.prototype.moveObjects = function () {
  var checked = [];
  this.balls.forEach(function (ball) {
    checked.push(ball);
  });
  this.balls.forEach(function (ball) {
    ball.move(0.027, checked);
    var idx = checked.indexOf(ball);
    checked.splice(idx, 1);
  });
};

Game.prototype.checkCollisions = function () {

};

module.exports = Game;
