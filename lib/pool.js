var Ball = require('./ball.js');
var Vector = require('./vector.js');
var Game = require('./game.js');
var GameView = require('./gameView.js');
var Util = require('./util.js');

// ratio of ball to length 1:42
// ratio of width to length 1:2

var table = document.getElementById('canvas');
var c = table.getContext('2d');
var overflow = document.getElementById('overflow');
var s = overflow.getContext('2d');

var game = new Game();

var modalIsOpen = true;

var closeModal = function (e) {
  document.getElementsByClassName('modal')[0].classList.add('close');
  modalIsOpen = false;
  e.currentTarget.removeEventListener("click", closeModal);
};



document.getElementsByClassName('close-badge')[0].addEventListener("click", closeModal);

var gameView = new GameView(game, c, s);
gameView.startView();
