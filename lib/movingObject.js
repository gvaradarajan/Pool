
var Vector = require('./vector.js');

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
