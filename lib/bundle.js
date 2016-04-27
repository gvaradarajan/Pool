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
	
	var modalIsOpen = true;
	
	var closeModal = function (e) {
	  // debugger
	  document.getElementsByClassName('modal')[0].classList.add('close');
	  modalIsOpen = false;
	  e.currentTarget.removeEventListener("click", closeModal);
	};
	
	// debugger
	
	document.getElementsByClassName('close-badge')[0].addEventListener("click", closeModal);
	
	
	// while (modalIsOpen) {
	//
	// }
	
	game.addBall(newObj);
	game.addBall(newObj2);
	game.addBall(newObj3);
	game.addBall(newObj4);
	// game.addBall(newObj5);
	var gameView = new GameView(game, c);
	gameView.startView();
	// gameView.play();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(2);
	var Util = __webpack_require__(4);
	
	var DEFAULTS = {
	  RADIUS: 20
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
	  if (num === null) return num;
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
	
	// MovingObject.prototype.holeDraw = function (ctx) {
	//   ctx.fillStyle = this.color;
	//   ctx.beginPath();
	//   ctx.arc(this.pos[0], this.pos[1], this.radius, 0, -Math.PI, false);
	//   ctx.fill();
	// };
	
	MovingObject.prototype.equals = function (otherObj) {
	  // if (otherObj === undefined) {
	  //   debugger
	  // }
	  if (this.pos[0] === otherObj.pos[0] && this.pos[1] === otherObj.pos[1]) {
	    return true;
	  }
	  return false;
	};
	
	MovingObject.prototype.move = function (coeffFriction, dimX, dimY) {
	  this.radius = 20;
	  coeffFriction = coeffFriction || 0;
	  var that = this;
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  var Ybound = dimY - this.radius;
	  var Xbound = dimX - this.radius;
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
	
	
	
	MovingObject.prototype.isStationary = function () {
	  if (this.vel.mag() < 0.07) {
	    return true;
	  }
	  return false;
	};
	
	MovingObject.prototype.handleCollision = function (otherObj) {
	  var connVec = new Vector(this.pos[0] - otherObj.pos[0],
	                           this.pos[1] - otherObj.pos[1]);
	  var resultRotation = connVec.findTheta();
	
	  var mass1 = 50;
	  var mass2 = 50;
	
	
	  var thisVel = this.vel.rotate(resultRotation);
	  var otherVel = otherObj.vel.rotate(resultRotation);
	
	
	  var angle1 = thisVel.findTheta();
	  var angle2 = otherVel.findTheta();
	
	  // var collAngle = angle1 === angle2 ? 0 : Math.PI;
	  var collAngle = Math.PI;
	
	  // debugger
	
	  this.vel[0] = thisVel.mag() *
	                _trunc(Math.cos(angle1-collAngle)) *
	                (mass1 - mass2);
	
	  this.vel[0] += 2 * mass2 * otherVel.mag() *
	                 _trunc(Math.cos(angle2-collAngle));
	
	  this.vel[1] = thisVel.mag() *
	                _trunc(Math.cos(angle1-collAngle)) *
	                (mass1 - mass2);
	
	  this.vel[1] += 2 * mass2 * otherVel.mag() *
	                 _trunc(Math.cos(angle2-collAngle));
	
	  this.vel[0] = _trunc(this.vel[0] / (mass1 + mass2)) * _trunc(Math.cos(collAngle));
	  this.vel[0] += thisVel.mag() *
	                 _trunc(Math.sin(angle1 - collAngle)) *
	                 _trunc(Math.cos(collAngle + (Math.PI / 2)));
	
	  this.vel[1] = _trunc(this.vel[1] / (mass1 + mass2)) * _trunc(Math.sin(collAngle));
	  this.vel[1] += thisVel.mag() *
	                 _trunc(Math.sin(angle1 - collAngle)) *
	                 _trunc(Math.sin(collAngle + (Math.PI / 2)));
	
	  otherObj.vel[0] = otherVel.mag() *
	                _trunc(Math.cos(angle2-collAngle)) *
	                (mass1 - mass2);
	
	  otherObj.vel[0] += 2 * mass2 * thisVel.mag() *
	                 _trunc(Math.cos(angle1-collAngle));
	
	  otherObj.vel[1] = otherVel.mag() *
	                _trunc(Math.cos(angle2-collAngle)) *
	                (mass1 - mass2);
	
	  otherObj.vel[1] += 2 * mass2 * thisVel.mag() *
	                 _trunc(Math.cos(angle1-collAngle));
	
	  otherObj.vel[0] = _trunc(otherObj.vel[0] / (mass1 + mass2)) * _trunc(Math.cos(collAngle));
	  otherObj.vel[0] += otherVel.mag() *
	                     _trunc(Math.sin(angle2 - collAngle)) *
	                     _trunc(Math.cos(collAngle + (Math.PI / 2)));
	
	  otherObj.vel[1] = _trunc(otherObj.vel[1] / (mass1 + mass2)) * _trunc(Math.sin(collAngle));
	  otherObj.vel[1] += otherVel.mag() *
	                     _trunc(Math.sin(angle2 - collAngle)) *
	                     _trunc(Math.sin(collAngle + (Math.PI / 2)));
	
	  otherObj.vel[1] = -otherObj.vel[1];
	  this.vel[1] = -this.vel[1];
	
	  this.vel = this.vel.rotate(-resultRotation);
	  otherObj.vel = otherObj.vel.rotate(-resultRotation);
	
	  // debugger
	
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
	    else if (this[1] === 0) {
	      return 0;
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
	  if (vec.norm() === 0 || this.norm() === 0) {
	    return null;
	  }
	  var denom = (Math.sqrt(this.norm()) * Math.sqrt(vec.norm()));
	  var innerVal = this.scalarProd(vec) / denom;
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
	  var newY = this[0] * Math.sin(angle) + this[1] * Math.cos(angle);
	  // var newY = this[0] * Math.sin(angle) - this[1] * Math.cos(angle);
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
	var Vector = __webpack_require__(3);
	
	var _holesPos = [[10, 10], [390, 10], [10, 740], [390, 740]];
	
	var Game = function () {
	  this.makingMove = false;
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
	  // this.drawStick(200, 20, Math.PI / 4, ctx);
	};
	
	Game.prototype.drawStick = function (pointX, pointY, angle, ctx) {
	  var stickCorners = [];
	  var recAngle = angle - (Math.PI / 2);
	
	
	  ctx.fillStyle = "#ad8508";
	  ctx.moveTo(pointX, pointY);
	  pointX += 2.5 * Math.cos(recAngle);
	  pointY -= 2.5 * Math.sin(recAngle);
	  stickCorners.push([pointX, pointY]);
	  ctx.lineTo(pointX, pointY);
	  pointX += 300 * Math.cos(angle);
	  pointY -= 300 * Math.sin(angle);
	  stickCorners.push([pointX, pointY]);
	  ctx.lineTo(pointX, pointY);
	  pointX += 5 * Math.cos(recAngle + Math.PI);
	  pointY -= 5 * Math.sin(recAngle + Math.PI);
	  stickCorners.push([pointX, pointY]);
	  ctx.lineTo(pointX, pointY);
	  pointX += 300 * Math.cos(angle + Math.PI);
	  pointY -= 300 * Math.sin(angle + Math.PI);
	  stickCorners.push([pointX, pointY]);
	  ctx.lineTo(pointX, pointY);
	  pointX += 2.5 * Math.cos(recAngle);
	  pointY -= 2.5 * Math.sin(recAngle);
	  stickCorners.push([pointX, pointY]);
	  ctx.lineTo(pointX, pointY);
	  ctx.fill();
	};
	
	Game.prototype.moveObjects = function () {
	  document.getElementsByClassName("game-status")[0].innerHTML = "";
	  // var t1 = Date.now();
	  this.balls.forEach(function (ball) {
	    ball.move(0.02, this.DIM_X, this.DIM_Y);
	  }.bind(this));
	  // console.log(Date.now() - t1);
	};
	
	Game.prototype.handleCollisions = function () {
	  var unchecked = this.balls.slice();
	  for(var i = 0; i < this.balls.length; i++) {
	    unchecked.shift();
	    for(var j = 0; j < unchecked.length; j++) {
	      if (unchecked.length === 0) continue;
	      if (this.balls[i].isCollidedWith(unchecked[j])) {
	        this.balls[i].handleCollision(unchecked[j]);
	      }
	    }
	  }
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
	
	Game.prototype.getCueBall = function () {
	  for(var i = 0; i < this.balls.length; i++) {
	    if (this.balls[i].color === "#FFFFFF") return this.balls[i];
	  }
	  return false;
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
	
	
	Game.prototype.playerMove = function (callback, ctx) {
	  if (!this.isStationary()) return;
	
	  var canvas = document.getElementsByTagName("canvas")[0];
	
	  var holdDown = function (ctx, e) {
	    var newOrigin = [canvas.getBoundingClientRect().left, canvas.getBoundingClientRect().top];
	    // if (this.makingMove || !this.isStationary()) {
	    if (!this.isStationary()) {
	      canvas.removeEventListener("mousedown", holdDown);
	      return;
	    }
	
	    var cueBall = this.getCueBall();
	    var bounds = cueBall ? this.getCueBallBounds() : [[0,0],[0,0]];
	    var clickCoords = [e.clientX - newOrigin[0], e.clientY - newOrigin[1]];
	    if (clickCoords[0] <= bounds[0][1] &&
	        clickCoords[0] >= bounds[0][0] &&
	        clickCoords[1] >= bounds[1][1] &&
	        clickCoords[1] <= bounds[1][0]) {
	
	
	      var moveStick = function (ctx, e3) {
	        ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
	        ctx.fillStyle = "#0B610B";
	        ctx.fillRect(0, 0, 400, 750);
	        this.draw(ctx);
	        var x = e3.clientX - newOrigin[0];
	        var y = e3.clientY - newOrigin[1];
	        var stickAxis = new Vector(x - cueBall.pos[0], y - cueBall.pos[1]);
	        this.drawStick(x, y, stickAxis.findTheta(), ctx);
	      }.bind(this, ctx);
	
	
	      var letGo = function (e2) {
	        var cueBall = this.getCueBall();
	        this.makingMove = true;
	        cueBall.vel[0] = (cueBall.pos[0] - e2.clientX + newOrigin[0]) / 10;
	        cueBall.vel[1] = (cueBall.pos[1] - e2.clientY + newOrigin[1]) / 10;
	        canvas.removeEventListener("mousemove", moveStick);
	        canvas.removeEventListener("mouseup", letGo);
	        callback();
	      }.bind(this);
	
	      canvas.addEventListener("mousemove", moveStick);
	
	      canvas.addEventListener("mouseup", letGo);
	      canvas.removeEventListener("mousedown", holdDown);
	    }
	  }.bind(this, ctx);
	
	
	  canvas.addEventListener("mousedown", holdDown);
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
	
	GameView.prototype.startView = function () {
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
	
	GameView.prototype.play = function () {
	  if (!this.game.getCueBall()) {
	    document.getElementsByClassName("game-status")[0].innerHTML = "YOU LOST";
	    return;
	  }
	  if (this.game.isStationary() && !this.game.victory()) {
	    this.playerTurn(this.startView.bind(this));
	  }
	  else {
	    var status = document.getElementsByClassName("game-status")[0];
	    status.innerHTML = "CONGRATULATIONS! YOU WON!";
	  }
	};
	
	
	
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map