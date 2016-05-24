var Game = require('./game.js');

var GameView = function (game, ctx, ctx2) {
  this.game = game;
  this.ctx = ctx;
  this.overflowCtx = ctx2;
};


GameView.prototype.startView = function () {
  document.getElementById("restart").style.display = "none";
  var overlayStatus = document.getElementsByClassName('overflow-cont')[0].classList;
  if (overlayStatus.length > 1) overlayStatus.remove('close');
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
      document.getElementsByClassName("game-status")[0].innerHTML = "READY";
      this.play();
    }
    // console.log("running at " + Date.now());
  }.bind(this), 20);
  console.log(gameState);
};

GameView.prototype.playerTurn = function (callback) {
  this.game.playerMove(callback, this.ctx, this.overflowCtx);
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
    document.getElementsByClassName('overflow-cont')[0].classList.add('close');
    this.restart();
    return;
  }
  if (this.game.isStationary() && !this.game.victory()) {
    this.playerTurn(this.startView.bind(this));
  }
  else {
    var status = document.getElementsByClassName("game-status")[0];
    document.getElementsByClassName('overflow-cont')[0].classList.add('close');
    status.innerHTML = "CONGRATULATIONS! YOU WON!";
    this.restart();
  }
};


module.exports = GameView;
