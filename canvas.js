// Setup

const Ball_Friction = 0.12;
const Ball_Gravity = 1;
const Balls_On_Screen = 21;

//#region -- Canvas Setup
//----------------

var canvas = document.querySelector("canvas");
var canvasWidth = (canvas.width = window.innerWidth);
var canvasHeight = (canvas.height = window.innerHeight);
var c = canvas.getContext("2d");

//#endregion

//#region -- Objects

function Ball(x, y, xVel, yVel, maxR, minR) {
  this.friction = Ball_Friction;
  this.gravMulti = Ball_Gravity;
  this.x = x;
  this.y = y;
  this.r = minR;
  this.maxR = maxR;
  this.minR = minR;
  this.xVel = xVel;
  this.yVel = yVel;
  this.color = randomColor();
  this.grabbed = false;

  this.draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  };

  this.update = () => {
    this.checkMouse();
    this.grow();
    if (!this.grabbed) {
      this.processVelocity();
    } else {
      this.reactWithMouse();
    }
  };

  this.processVelocity = () => {
    this.x += this.xVel;
    this.y += this.yVel;

    if (
      this.x + this.xVel < this.r ||
      this.x + this.xVel > canvasWidth - this.r
    ) {
      this.xVel = -this.xVel * (1 - this.friction);
    }
    if (
      this.y + this.yVel < this.r ||
      this.y + this.yVel > canvasHeight - this.r
    ) {
      this.yVel = -this.yVel * (1 - this.friction);
      this.xVel = this.xVel * (1 - this.friction);
    } else {
      this.yVel += this.gravMulti;
    }
  };

  this.checkMouse = () => {
    if (
      Math.abs(Mouse.x - this.x) < 70 &&
      Math.abs(Mouse.y - this.y) < 70 &&
      windowClicked
    ) {
      this.grabbed = true;
      this.xVel = Mouse.xVel + (Math.random() - 0.5) * 6;
      this.yVel = Mouse.yVel + (Math.random() - 0.5) * 6;
    }

    if (this.grabbed && !windowClicked) {
      this.grabbed = false;
    }
  };

  this.reactWithMouse = () => {
    this.x = clamp(Mouse.x, this.r, canvasWidth - this.r);
    this.y = clamp(Mouse.y, this.r, canvasHeight - this.r);
  };

  this.grow = () => {
    if (this.grabbed) {
      this.r = maxR;
    } else {
      this.r = minR;
    }
  };
}

function BallCollection() {
  this.balls = [];
  this.createBalls = (d) => {
    for (let i = 0; i < d; i++) {
      this.createNewBall();
    }
  };

  this.clearBalls = () => {
    this.balls = [];
  };

  this.createNewBall = () => {
    let maxR = 40;
    let minR = 10;
    let randXPos = Math.random() * (canvasWidth - maxR * 2) + maxR;
    let randYPos = Math.random() * (canvasHeight - maxR * 2) + maxR;
    let randXVel = (Math.random() - 0.5) * 8;
    let randYVel = (Math.random() - 0.5) * 8;

    let ball = new Ball(randXPos, randYPos, randXVel, randYVel, maxR, minR);

    this.balls.push(ball);
  };

  this.updateAllBalls = () => {
    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].draw();
      this.balls[i].update();
    }
  };
}

var Mouse = {
  x: undefined,
  y: undefined,

  lastXPos: undefined,
  lastYPos: undefined,

  xVel: undefined,
  yVel: undefined,
};

var colorArray = ["#1E0DE7", "#E70DE4", "#D61E08", "#089C05"];

//#endregion

//#region -- Utility Functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor() {
  return colorArray[Math.floor(Math.random() * colorArray.length)];
}

function clamp(value, min, max) {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  } else {
    return value;
  }
}

//#endregion

//#region -- Initialization and Events

ballCollection = new BallCollection();
ballCollection.createBalls(Balls_On_Screen);

window.addEventListener("mousemove", (event) => {
  Mouse.x = event.x;
  Mouse.y = event.y;
});

let windowClicked = false;
window.addEventListener("mousedown", () => {
  windowClicked = true;
});

window.addEventListener("mouseup", () => {
  windowClicked = false;
});

//#endregion

// Update

function update() {
  requestAnimationFrame(update);
  c.clearRect(0, 0, canvasWidth, window.innerHeight);

  ballCollection.updateAllBalls();
  if (windowClicked) {
    c.beginPath();
    c.arc(Mouse.x, Mouse.y, 40, 0, Math.PI * 2, false);
    c.stroke();
    Mouse.xVel = Mouse.x - Mouse.lastXPos;
    Mouse.yVel = Mouse.y - Mouse.lastYPos;
    Mouse.lastXPos = Mouse.x;
    Mouse.lastYPos = Mouse.y;
  }
}

update();
