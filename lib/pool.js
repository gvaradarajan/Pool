var Ball = require('./ball.js');
var Vector = require('./vector.js');
var Game = require('./game.js');
var GameView = require('./gameView.js');
var Util = require('./util.js');

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
var v1 = new Vector(0, 5);
var v2 = new Vector(0, -5);
var v3 = new Vector(0, 3);
var v4 = new Vector(3, 1);
var newObj = new Ball({pos: [200, 30],
                               vel: v1,
                               radius: 20,
                               color: "#00FF00"});
var newObj2 = new Ball({pos: [200, 500],
                                vel: v2,
                                radius: 20,
                                color: "#FFFFFF"});
var newObj3 = new Ball({pos: [30, 300],
                                vel: v3,
                                radius: 20,
                                color: "#FFF000"});
var newObj4 = new Ball({pos: [100, 200],
                                vel: v4,
                                radius: 20,
                                color: "#FFF000"});
var newObj5 = new Ball({pos: [30, 700],
                                vel: v3,
                                radius: 20,
                                color: "#FFF000"});
var game = new Game();
game.addBall(newObj);
game.addBall(newObj2);
game.addBall(newObj3);
// game.addBall(newObj4);
// game.addBall(newObj5);
var gameView = new GameView(game, c);
gameView.hitResult();
gameView.play();
