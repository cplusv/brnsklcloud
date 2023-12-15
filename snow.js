var snowflakes = [];

var browserWidth;
var browserHeight;

var numberOfSnowflakes = 50;

var resetPosition = false;

var enableAnimations = false;
var reduceMotionQuery = matchMedia("(prefers-reduced-motion)");

function setAccessibilityState() {
  if (reduceMotionQuery.matches) {
    enableAnimations = false;
  } else { 
    enableAnimations = true;
  }
}
setAccessibilityState();

reduceMotionQuery.addListener(setAccessibilityState);

function setup() {
  if (enableAnimations) {
    window.addEventListener("DOMContentLoaded", generateSnowflakes, false);
    window.addEventListener("resize", setResetFlag, false);
  }
}

function Snowflake(element, speed, xPos, yPos) {
  this.element = element;
  this.speed = speed;
  this.xPos = xPos;
  this.yPos = yPos;
  this.scale = 1;

  this.counter = 0;
  this.sign = Math.random() < 0.5 ? 1 : -1;

  this.element.style.opacity = (.1 + Math.random()) / 3;
}

Snowflake.prototype.update = function () {
  this.counter += this.speed / 5000;
  this.xPos += this.sign * this.speed * Math.cos(this.counter) / 40;
  this.yPos += Math.cos(this.counter + this.sign) / 40 + this.speed / 30;
  if (this.yPos > browserHeight) {
    this.yPos = -50;
  }
  this.element.style.transform = `translate3d(${this.xPos}px, ${this.yPos}px, 0) scale(${this.scale})`;
};

function generateSnowflakes() {
  browserWidth = document.documentElement.clientWidth;
  browserHeight = document.documentElement.clientHeight;
  for (var i = 0; i < numberOfSnowflakes; i++) {
    var snowflakeElement = document.createElement('div');
    snowflakeElement.className = 'snowflake';
    snowflakeElement.innerHTML = '❅';
    document.body.appendChild(snowflakeElement);

    var initialXPos = getPosition(50, browserWidth);
    var initialYPos = getPosition(50, browserHeight);
    var speed = 5+Math.random()*40;

    var snowflakeObject = new Snowflake(snowflakeElement,
      speed,
      initialXPos,
      initialYPos);
    snowflakes.push(snowflakeObject);
  }
  moveSnowflakes();
}
function moveSnowflakes() {
  if (enableAnimations) {
    for (var i = 0; i < snowflakes.length; i++) {
      var snowflake = snowflakes[i];
      snowflake.update();
    }        
  }
  if (resetPosition) {
    browserWidth = document.documentElement.clientWidth;
    browserHeight = document.documentElement.clientHeight;

    for (var i = 0; i < snowflakes.length; i++) {
      var snowflake = snowflakes[i];

      snowflake.xPos = getPosition(50, browserWidth);
      snowflake.yPos = getPosition(50, browserHeight);
    }

    resetPosition = false;
  }

  requestAnimationFrame(moveSnowflakes);
}

function getPosition(offset, size) {
  return Math.round(-1*offset + Math.random() * (size+2*offset));
}
function setResetFlag(e) {
  resetPosition = true;
}
setup();