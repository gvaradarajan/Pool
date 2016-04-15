var Game = require('./game.js');

var GameView = function (game, ctx) {
  this.game = game;
  this.ctx = ctx;
};

GameView.prototype.hitResult = function () {
  var gameState = setInterval(function () {
    this.game.checkPockets();
    this.ctx.clearRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
    this.ctx.fillStyle = "#0B610B";
    this.ctx.fillRect(0, 0, 400, 750);
    this.game.draw(this.ctx);
    this.game.moveObjects();
    if (this.game.isStationary()) {
      clearInterval(gameState);
    }
  }.bind(this), 20);
};

GameView.prototype.playerTurn = function () {
  // var cueBall = this.game.cueBall();
  this.game.playerMove();
};

module.exports = GameView;
