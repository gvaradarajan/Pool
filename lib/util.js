(function(root){

var Pool = root.Pool = root.Pool || {};

var Util = root.Pool.Util = root.Pool.Util || {};

var Vector = root.Pool.Vector = root.Pool.Vector || {};

Pool.Util.WIDTH = 750;
Pool.Util.HEIGHT = 750;

Pool.Util.inherits = function (ChildClass, ParentClass) {
  var surrogate = function () {};
  surrogate.prototype = ParentClass.prototype;
  ChildClass.prototype = new surrogate();
  ChildClass.prototype.constructror = ChildClass;
};

Pool.Util.randomVec = function (length) {
  var dir = Math.random() * 2 * Math.PI;
  return new Vector(length * Math.cos(dir), length * Math.sin(dir));
};



}) (this);
