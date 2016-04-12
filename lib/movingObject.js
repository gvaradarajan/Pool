
var Vector = require('./vector.js');

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
