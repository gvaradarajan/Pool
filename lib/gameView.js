var Game = require('./game.js');

var GameView = function (game, ctx) {
  this.game = game;
  this.ctx = ctx;
};


GameView.prototype.startView = function () {
  document.getElementById("restart").style.display = "none";
  var gameState = setInterval(function () {
    this.game.checkPockets();
    this.ctx.clearRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
    this.ctx.fillStyle = "#0B610B";
    this.ctx.fillRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
    this.game.draw(this.ctx);
    this.game.handleCollisions();
    this.game.moveObjects();
    if (this.game.isStationary()) {
      clearInterval(gameState);
      // this.game.makingMove = false;
      document.getElementsByClassName("game-status")[0].innerHTML = "READY";
      this.play();
    }
  }.bind(this), 20);
};

GameView.prototype.playerTurn = function (callback) {
  // var cueBall = this.game.cueBall();
  this.game.playerMove(callback, this.ctx);
};


GameView.prototype.restart = function () {
  this.game = new Game();
  var replay = document.getElementById("restart");
  replay.style.display = "block";
  replay.addEventListener('click', this.startView.bind(this));
  // debugger
};

GameView.prototype.play = function () {
  if (!this.game.getCueBall()) {
    document.getElementsByClassName("game-status")[0].innerHTML = "YOU LOST";
    this.restart();
    return;
  }
  if (this.game.isStationary() && !this.game.victory()) {
    this.playerTurn(this.startView.bind(this));
  }
  else {
    var status = document.getElementsByClassName("game-status")[0];
    status.innerHTML = "CONGRATULATIONS! YOU WON!";
    this.restart();
  }
};


module.exports = GameView;
