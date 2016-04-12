var MovingObject = require('./movingObject.js');
var Util = require('./util.js');

var DEFAULTS = {
  RADIUS: 25
};

var Ball = function (options)  {
  options.radius = DEFAULTS.RADIUS;
  MovingObject.call(this, options);
};

Util.inherits(Ball, MovingObject);
