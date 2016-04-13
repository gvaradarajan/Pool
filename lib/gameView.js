var Game = require('./game.js');

var GameView = function (game, ctx) {
  this.game = game;
  this.ctx = ctx;
};

GameView.prototype.start = function () {
  setInterval(function () {
    this.ctx.clearRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
    this.game.draw(this.ctx);
    this.game.moveObjects();
  }.bind(this), 20);
};

module.exports = GameView;
