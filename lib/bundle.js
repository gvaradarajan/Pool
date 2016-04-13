/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(1);
	var Vector = __webpack_require__(3);
	var Game = __webpack_require__(6);
	var GameView = __webpack_require__(5);
	
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(2);
	var Util = __webpack_require__(4);
	
	var DEFAULTS = {
	  RADIUS: 25
	};
	
	var Ball = function (options)  {
	  options.radius = DEFAULTS.RADIUS;
	  MovingObject.call(this, options);
	};
	
	Util.inherits(Ball, MovingObject);
	
	module.exports = Ball;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	var Vector = __webpack_require__(3);
	
	var MovingObject = function (settings) {
	  this.pos = settings.pos;
	  this.vel = settings.vel;
	  this.radius = settings.radius;
	  this.color = settings.color;
	};
	
	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
	  ctx.fill();
	};
	
	MovingObject.prototype.equals = function (otherObj) {
	  if (this.pos[0] === otherObj.pos[0] && this.pos[1] === otherObj.pos[1]) {
	    return true;
	  }
	  return false;
	};
	
	MovingObject.prototype.move = function (coeffFriction, otherObjs) {
	  coeffFriction = coeffFriction || 0;
	  var that = this;
	  otherObjs.forEach(function (obj) {
	    if (that.isCollidedWith(obj) && !that.equals(obj)) {
	      that.handleCollision(obj);
	    }
	  });
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  var bound = 750 - this.radius;
	  var dimXRef = this.pos[0] > bound || this.pos[0] < 0 + this.radius;
	  var dimYRef = this.pos[1] > bound || this.pos[1] < 0 + this.radius;
	  if (dimXRef || dimYRef) {
	    this.pos[0] -= this.vel[0];
	    this.pos[1] -= this.vel[1];
	    this.bounce(dimXRef, dimYRef);
	  }
	  this.vel[0] = this.vel[0] * Math.sqrt(1 - coeffFriction);
	  this.vel[1] = this.vel[1] * Math.sqrt(1 - coeffFriction);
	};
	
	MovingObject.prototype.bounce = function (bounceX, bounceY) {
	  this.vel[0] = bounceX ? -this.vel[0] : this.vel[0];
	  this.vel[1] = bounceY ? -this.vel[1] : this.vel[1];
	};
	
	MovingObject.prototype.getCollisionAngle = function (otherObj) {
	  return this.vel.getRelativeAngle(otherObj.vel);
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObj) {
	  var distance = new Vector(otherObj.pos[0] - this.pos[0], otherObj.pos[1] - this.pos[1]);
	  if (Math.sqrt(distance.norm()) < (this.radius + otherObj.radius)) {
	    return true;
	  }
	  return false;
	};
	
	MovingObject.prototype.handleCollision = function (otherObj) {
	  var collAngle = this.getCollisionAngle(otherObj);
	  var angle1 = this.vel.findTheta();
	  var angle2 = otherObj.vel.findTheta();
	  var thisVel = this.vel;
	  var otherVel = otherObj.vel;
	  this.vel[0] = otherVel.norm() * Math.cos(angle2-collAngle) * Math.cos(collAngle);
	  this.vel[0] += thisVel.norm() * Math.sin(angle1-collAngle) * Math.cos(collAngle + (Math.PI / 2));
	  this.vel[1] = otherVel.norm() * Math.cos(angle2-collAngle) * Math.sin(collAngle);
	  this.vel[1] += thisVel.norm() * Math.sin(angle1-collAngle) * Math.sin(collAngle + (Math.PI / 2));
	  otherObj.vel[0] = thisVel.norm() * Math.cos(angle1-collAngle) * Math.cos(collAngle);
	  otherObj.vel[0] += otherVel.norm() * Math.sin(angle2-collAngle) * Math.cos(collAngle + (Math.PI / 2));
	  otherObj.vel[1] = thisVel.norm() * Math.cos(angle1-collAngle) * Math.sin(collAngle);
	  otherObj.vel[1] += otherVel.norm() * Math.sin(angle2-collAngle) * Math.sin(collAngle + (Math.PI / 2));
	};
	
	MovingObject.prototype.isStationary = function () {
	  if (this.vel[0] === 0 && this.vel[1] === 0) {
	    return true;
	  }
	  return false;
	};
	
	
	
	module.exports = MovingObject;


/***/ },
/* 3 */
/***/ function(module, exports) {

	
	var Vector = function (x, y) {
	  this[0] = x;
	  this[1] = y;
	};
	
	Vector.prototype.findTheta = function () {
	  return Math.atan(this[1] / this[0]) || 0;
	};
	
	Vector.prototype.scalarProd = function (vec) {
	  return (this[0] * vec[0]) + (this[1] * vec[1]);
	};
	
	Vector.prototype.norm = function () {
	  return Math.pow(this[0], 2) + Math.pow(this[1], 2);
	};
	
	Vector.prototype.getRelativeAngle = function (vec) {
	  return Math.acos(this.scalarProd(vec) / (Math.sqrt(this.norm()) * Math.sqrt(vec.norm())));
	};
	
	module.exports = Vector;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Vector = __webpack_require__(3);
	
	var Util = {
	  WIDTH: 750,
	  HEIGHT: 750,
	
	  inherits: function (ChildClass, ParentClass) {
	    var surrogate = function () {};
	    surrogate.prototype = ParentClass.prototype;
	    ChildClass.prototype = new surrogate();
	    ChildClass.prototype.constructror = ChildClass;
	  },
	
	  randomVec: function (length) {
	    var dir = Math.random() * 2 * Math.PI;
	    return new Vector(length * Math.cos(dir), length * Math.sin(dir));
	  }
	};
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(6);
	
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


/***/ },
/* 6 */
/***/ function(module, exports) {

	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map