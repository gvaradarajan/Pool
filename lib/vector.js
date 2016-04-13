
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
