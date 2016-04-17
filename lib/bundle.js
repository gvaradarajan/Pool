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
	var Game = __webpack_require__(5);
	var GameView = __webpack_require__(6);
	var Util = __webpack_require__(4);
	
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
	                                color: "#FF0000"});
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
	
	var _trunc = function (num) {
	  return parseFloat(num.toFixed(4));
	};
	
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
	  this.radius = 20;
	  coeffFriction = coeffFriction || 0;
	  var that = this;
	  otherObjs.forEach(function (obj) {
	    if (that.isCollidedWith(obj) && !that.equals(obj)) {
	      if (that.isGlancingWith(obj)) {
	        that.handleGlancingCollision(obj);
	      }
	      else {
	        if (obj.isStationary()) {
	          that.handleStationaryCollision(obj);
	        }
	        else {
	          that.handleCollision(obj);
	        }
	      }
	    }
	  });
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  var Ybound = 750 - this.radius;
	  var Xbound = 400 - this.radius;
	  var dimXRef = this.pos[0] > Xbound || this.pos[0] < 0 + this.radius;
	  var dimYRef = this.pos[1] > Ybound || this.pos[1] < 0 + this.radius;
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
	  if (distance.mag() <= (this.radius + otherObj.radius)) {
	    return true;
	  }
	  return false;
	};
	
	MovingObject.prototype.isGlancingWith = function (otherObj) {
	  var collAngle = _trunc(this.getCollisionAngle(otherObj));
	  if (collAngle === _trunc(Math.PI) || collAngle === 0) {
	    var connVec = new Vector(this.pos[0] - otherObj.pos[0], this.pos[1] - otherObj.pos[1]);
	    var connVecAngle = _trunc(connVec.findTheta());
	    if (connVecAngle !== _trunc(Math.PI) && connVecAngle !== 0) {
	      return true;
	    }
	  }
	  return false;
	};
	
	MovingObject.prototype.handleCollision = function (otherObj) {
	  if (this.isStationary()) {
	    otherObj.handleStationaryCollision(this);
	    return;
	  }
	
	  if (this.vel[0] === 0 && otherObj.vel[0] === 0) {
	    this.bounce(false, true);
	    otherObj.bounce(false, true);
	    return;
	  }
	
	
	  var collAngle = this.getCollisionAngle(otherObj);
	  var angle1 = this.vel.findTheta();
	  var angle2 = otherObj.vel.findTheta();
	  var thisVel = new Vector(this.vel[0], -this.vel[1]);
	  var otherVel = new Vector(otherObj.vel[0], -otherObj.vel[1]);
	  // var thisVel = new Vector(this.vel[0], -this.vel[1]);
	  // var otherVel = new Vector(otherObj.vel[0], -otherObj.vel[1]);
	
	
	  this.vel[0] = otherVel.mag() * _trunc(Math.cos(angle2-collAngle)) * _trunc(Math.cos(collAngle));
	  this.vel[0] += thisVel.mag() * _trunc(Math.sin(angle1-collAngle)) * _trunc(Math.cos(collAngle + (Math.PI / 2)));
	  this.vel[1] = otherVel.mag() * _trunc(Math.cos(angle2-collAngle)) * _trunc(Math.sin(collAngle));
	  this.vel[1] += thisVel.mag() * _trunc(Math.sin(angle1-collAngle)) * _trunc(Math.sin(collAngle + (Math.PI / 2)));
	
	  this.vel[0] = _trunc(this.vel[0]);
	  this.vel[1] = _trunc(this.vel[1]);
	
	  otherObj.vel[0] = thisVel.mag() * _trunc(Math.cos(angle1-collAngle)) * _trunc(Math.cos(collAngle));
	  otherObj.vel[0] += otherVel.mag() * _trunc(Math.sin(angle2-collAngle)) * _trunc(Math.cos(collAngle + (Math.PI / 2)));
	  otherObj.vel[1] = thisVel.mag() * _trunc(Math.cos(angle1-collAngle)) * _trunc(Math.sin(collAngle));
	  otherObj.vel[1] += otherVel.mag() * _trunc(Math.sin(angle2-collAngle)) * _trunc(Math.sin(collAngle + (Math.PI / 2)));
	
	  otherObj.vel[0] = _trunc(otherObj.vel[0]);
	  otherObj.vel[1] = _trunc(otherObj.vel[1]);
	
	//
	  // otherObj.vel[1] = -otherObj.vel[1];
	  // this.vel[1] = -this.vel[1];
	//
	
	};
	
	MovingObject.prototype.isStationary = function () {
	  if (this.vel.mag() < 0.01) {
	    return true;
	  }
	  return false;
	};
	
	MovingObject.prototype.handleStationaryCollision = function (stillObj) {
	  if (!this.isStationary()) {
	    stillObj.vel[0] = this.vel[0];
	    stillObj.vel[1] = this.vel[1];
	    this.vel[0] = 0;
	    this.vel[1] = 0;
	  }
	};
	
	MovingObject.prototype.handleGlancingCollision = function (otherObj) {
	  if (otherObj.isStationary()) {
	    otherObj.handleGlancingCollision(this);
	    return;
	  }
	
	
	  var resultRotation = this.vel.findTheta();
	
	  var connVec = new Vector(this.pos[0] - otherObj.pos[0], this.pos[1] - otherObj.pos[1]);
	  var thisVel = new Vector(this.vel.mag(), 0);
	  var collAngle = _trunc(thisVel.getRelativeAngle(connVec));
	  var otherDir = connVec.findTheta();
	  var otherVel = new Vector(otherObj.vel.mag() * Math.cos(otherDir),
	                            otherObj.vel.mag() * Math.sin(otherDir));
	  var angle1 = 0;
	  var angle2 = Math.PI - collAngle;
	
	  var newThis = new Vector();
	  var newOther = new Vector();
	
	  newThis[0] = otherVel.mag() * _trunc(Math.cos(angle2-collAngle)) * _trunc(Math.cos(collAngle));
	  newThis[0] += thisVel.mag() * _trunc(Math.sin(angle1-collAngle)) * _trunc(Math.cos(collAngle + (Math.PI / 2)));
	  newThis[1] = otherVel.mag() * _trunc(Math.cos(angle2-collAngle)) * _trunc(Math.sin(collAngle));
	  newThis[1] += thisVel.mag() * _trunc(Math.sin(angle1-collAngle)) * _trunc(Math.sin(collAngle + (Math.PI / 2)));
	
	  newThis[0] = _trunc(newThis[0]);
	  newThis[1] = _trunc(newThis[1]);
	
	  newOther[0] = thisVel.mag() * _trunc(Math.cos(angle1-collAngle)) * _trunc(Math.cos(collAngle));
	  newOther[0] += otherVel.mag() * _trunc(Math.sin(angle2-collAngle)) * _trunc(Math.cos(collAngle + (Math.PI / 2)));
	  newOther[1] = thisVel.mag() * _trunc(Math.cos(angle1-collAngle)) * _trunc(Math.sin(collAngle));
	  newOther[1] += otherVel.mag() * _trunc(Math.sin(angle2-collAngle)) * _trunc(Math.sin(collAngle + (Math.PI / 2)));
	
	  newOther[0] = _trunc(newOther[0]);
	  newOther[1] = _trunc(newOther[1]);
	
	  this.vel = newThis.rotate(resultRotation);
	  otherObj.vel = newOther.rotate(resultRotation);
	
	  this.vel[1] = -this.vel[1];
	  otherObj.vel[1] = -otherObj.vel[1];
	
	};
	
	
	
	module.exports = MovingObject;


/***/ },
/* 3 */
/***/ function(module, exports) {

	
	var Vector = function (x, y) {
	  this[0] = x;
	  this[1] = y;
	};
	
	var _trunc = function (num) {
	  return parseFloat(num.toFixed(4));
	};
	
	
	Vector.prototype.findTheta = function () {
	  if (this[0] === 0) {
	    if (this[1] > 0) {
	      return Math.PI / 2;
	    }
	    else {
	      return -Math.PI / 2;
	    }
	  }
	  if (this[1] === 0) {
	    if (this[0] > 0) {
	      return 0;
	    }
	    else {
	      return Math.PI;
	    }
	  }
	  if (this[0] > 0) {
	    return Math.atan(-this[1] / this[0]);
	  }
	  else {
	    return Math.atan(-this[1] / this[0]) + Math.PI;
	  }
	};
	
	Vector.prototype.scalarProd = function (vec) {
	  return (this[0] * vec[0]) + (this[1] * vec[1]);
	};
	
	Vector.prototype.norm = function () {
	  return Math.pow(this[0], 2) + Math.pow(this[1], 2);
	};
	
	Vector.prototype.mag = function () {
	  return Math.sqrt(this.norm());
	};
	
	Vector.prototype.getRelativeAngle = function (vec) {
	  var innerVal = this.scalarProd(vec) / (Math.sqrt(this.norm()) * Math.sqrt(vec.norm()));
	  if (_trunc(innerVal) === 1) {
	    if (this.norm() === vec.norm()) {
	      return 0;
	    }
	    return false;
	  }
	  return Math.acos(_trunc(innerVal));
	};
	
	Vector.prototype.rotate = function (angle) {
	  var newX = this[0] * Math.cos(angle) - this[1] * Math.sin(angle);
	  var newY = this[0] * Math.sin(angle) - this[1] * Math.cos(angle);
	  return new Vector(newX, newY);
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
	    ChildClass.prototype.constructor = ChildClass;
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

	var Ball = __webpack_require__(1);
	
	var _holesPos = [[20, 20], [380, 20], [20, 730], [380, 730]];
	
	var Game = function () {
	  this.balls = [];
	  this.DIM_X = 400;
	  this.DIM_Y = 750;
	  this.holes = _holesPos.map(function (pos) {
	    return new Ball({pos: pos, radius: 20, color: "#000000"});
	  });
	};
	
	Game.prototype.addBall = function (ball) {
	  this.balls.push(ball);
	};
	
	Game.prototype.draw = function (ctx) {
	  this.holes.forEach(function (hole) {
	    hole.draw(ctx);
	  });
	  this.balls.forEach(function (ball) {
	    ball.draw(ctx);
	  });
	};
	
	Game.prototype.moveObjects = function () {
	  var checked = [];
	  this.balls.forEach(function (ball) {
	    checked.push(ball);
	  });
	  // var t1 = Date.now();
	  this.balls.forEach(function (ball) {
	    ball.move(0.0054, checked);
	    var idx = checked.indexOf(ball);
	    checked.splice(idx, 1);
	  });
	  // console.log(Date.now() - t1);
	};
	
	Game.prototype.checkPockets = function () {
	  var deleteIndices = [];
	  this.balls.forEach(function (ball, idx) {
	    for(var i = 0; i < this.holes.length; i++) {
	      if (ball.isCollidedWith(this.holes[i])) {
	        deleteIndices.push(idx);
	        continue;
	      }
	    }
	  }.bind(this));
	  deleteIndices.forEach(function (idx) {
	    this.balls.splice(idx, 1);
	  }.bind(this));
	};
	
	Game.prototype.isStationary = function () {
	  for(var i = 0; i < this.balls.length; i++) {
	    if (!this.balls[i].isStationary()) {
	      return false;
	    }
	  }
	  return true;
	};
	
	Game.prototype.getCueBallBounds = function () {
	  var cueBall = null;
	  this.balls.forEach(function (ball) {
	    if (ball.color === "#FFFFFF") cueBall = ball;
	  });
	  return [[cueBall.pos[0] - cueBall.radius, cueBall.pos[0] + cueBall.radius],
	          [cueBall.pos[1] + cueBall.radius, cueBall.pos[1] - cueBall.radius]];
	};
	
	Game.prototype.victory = function () {
	  if (this.balls.length === 1) return true;
	  return false;
	};
	
	module.exports = Game;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(5);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map