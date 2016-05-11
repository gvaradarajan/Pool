#JuniorPool

A browser game version of Pool with realistic collisions and table friction made using JavaScript and HTML5 Canvas.

###Technical Details

This game uses the collision logic and calculations from [HadronJS](https://github.com/gvaradarajan/HadronJS).

For the player's move, there is a mousedown listener on the cueball whose callback in turn installs two other listeners. One of these is for dynamically drawing the stick as the user moves the mouse with the button still held down (`moveStick`):

```
var holdDown = function (ctx, e) {

  ...

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


    ...

    canvas.addEventListener("mousemove", moveStick);

    ...

    canvas.removeEventListener("mousedown", holdDown);
  }
}.bind(this, ctx);


canvas.addEventListener("mousedown", holdDown);
```

The other is for finding the position at which the user releases the mouse button in order to determine the resulting velocity to apply to the cueball():

```
var holdDown = function (ctx, e) {

  ...

  var cueBall = this.getCueBall();
  var bounds = cueBall ? this.getCueBallBounds() : [[0,0],[0,0]];
  var clickCoords = [e.clientX - newOrigin[0], e.clientY - newOrigin[1]];
  if (clickCoords[0] <= bounds[0][1] &&
      clickCoords[0] >= bounds[0][0] &&
      clickCoords[1] >= bounds[1][1] &&
      clickCoords[1] <= bounds[1][0]) {

    ...

    var letGo = function (e2) {
      var cueBall = this.getCueBall();
      this.makingMove = true;
      cueBall.vel[0] = (cueBall.pos[0] - e2.clientX + newOrigin[0]) / 10;
      cueBall.vel[1] = (cueBall.pos[1] - e2.clientY + newOrigin[1]) / 10;
      canvas.removeEventListener("mousemove", moveStick);
      canvas.removeEventListener("mouseup", letGo);
      // the argument to the playerMove function that calls the gameView's //startView function again to continue the loop
      callback();  
    }.bind(this);

    canvas.addEventListener("mousemove", moveStick);

    canvas.addEventListener("mouseup", letGo);
    canvas.removeEventListener("mousedown", holdDown);
  }
}.bind(this, ctx);


canvas.addEventListener("mousedown", holdDown);
```

###Coming Soon
* [ ] More balls!
