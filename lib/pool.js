var Ball = require('./ball.js');
var Vector = require('./vector.js');
var Game = require('./game.js');
var GameView = require('./gameView.js');
var Util = require('./util.js');

// ratio of ball to length 1:42
// ratio of width to length 1:2

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

var newObj = new Ball({pos: [170, 200],
                               vel: new Vector(0, 0),
                               radius: 20,
                               color: "#00FF00"});
var newObj2 = new Ball({pos: [200, 600],
                                vel: new Vector(0, 0),
                                radius: 20,
                                color: "#FFFFFF"});
var newObj3 = new Ball({pos: [230, 200],
                                vel: new Vector(0, 0),
                                radius: 20,
                                color: "#FFF000"});
var newObj4 = new Ball({pos: [200, 242],
                                vel: new Vector(0, 0),
                                radius: 20,
                                color: "#FF0000"});
var newObj5 = new Ball({pos: [30, 700],
                                vel: new Vector(0, 0),
                                radius: 20,
                                color: "#FFF000"});
var game = new Game();

game.addBall(newObj);
game.addBall(newObj2);
game.addBall(newObj3);
game.addBall(newObj4);
// game.addBall(newObj5);
var gameView = new GameView(game, c);
gameView.startView();
// gameView.play();
