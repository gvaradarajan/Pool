var Vector = require('./vector.js');

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
