var Ball = require('./ball.js');
var Vector = require('./vector.js');
var Game = require('./game.js');
var GameView = require('./gameView.js');

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
var v1 = new Vector(3, 0);
var v2 = new Vector(-2, 0);
var newObj = new Ball({pos: [370, 370],
                               vel: v1,
                               radius: 20,
                               color: "#00FF00"});
var newObj2 = new Ball({pos: [470, 370],
                                vel: v2,
                                radius: 20,
                                color: "#FF0000"});
var game = new Game();
game.addBall(newObj);
game.addBall(newObj2);
var gameView = new GameView(game, c);
gameView.start();
