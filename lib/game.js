
var Game = function () {
  this.balls = [];
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
  this.balls.forEach(function (ball) {
    ball.move();
  });
};
