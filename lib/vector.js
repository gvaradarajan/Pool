(function (root) {
  var Pool = root.Pool = root.Pool || {};


  Pool.Vector = function (x, y) {
    this[0] = x;
    this[1] = y;
  };

  Pool.Vector.prototype.findTheta = function () {
    return Math.atan(this[1] / this[0]);
  };

  Pool.Vector.prototype.scalarProd = function (vec) {
    return (this[0] * vec[0]) + (this[1] * vec[1]);
  };



}) (this);
