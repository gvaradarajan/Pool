
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
