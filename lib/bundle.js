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
	  // ctx.moveTo(this.pos[0], this.pos[1]);
	  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
	  // ctx.closePath();
	  ctx.fill();
	  console.log("Color: " + this.color);
	  console.log("Vel: " + this.vel);
	  console.log("Rad: " + this.radius);
	  console.log("Pos: " + this.pos);
	};
	
	MovingObject.prototype.move = function () {
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
	};
	
	MovingObject.prototype.bounce = function (bounceX, bounceY) {
	  this.vel[0] = bounceX ? -this.vel[0] : this.vel[0];
	  this.vel[1] = bounceY ? -this.vel[1] : this.vel[1];
	};
	
	MovingObject.getCollisionAngle = function (otherObj) {
	  return this.vel.getRelativeAngle(otherObj.vel);
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
	    return Math.atan(this[1] / this[0]);
	  };
	
	  Vector.prototype.scalarProd = function (vec) {
	    return (this[0] * vec[0]) + (this[1] * vec[1]);
	  };
	
	  Vector.prototype.norm = function () {
	    return Math.pow(this[0], 2) + Math.pow(this[1], 2);
	  };
	
	  Vector.prototype.getRelativeAngle = function (vec) {
	    return this.scalarProd(vec) / (this.norm * vec.norm);
	  };


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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map