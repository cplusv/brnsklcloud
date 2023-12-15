document.addEventListener('DOMContentLoaded', function () {
    var snowflakes = [];
    var browserWidth;
    var browserHeight;
    var numberOfSnowflakes = 50;

    function random(min, max) {
        return min + Math.random() * (max - min + 1);
    }
    function Snowflake(element, speed, xPos, yPos) {
        this.element = element;
        this.speed = speed;
        this.xPos = xPos;
        this.yPos = yPos;
        this.scale = 1;

        this.counter = 0;
        this.sign = Math.random() < 0.5 ? 1 : -1;

        this.element.style.opacity = (0.1 + Math.random()) / 3;
    }

    Snowflake.prototype.update = function () {
        this.counter += this.speed / 5000;
        this.xPos += this.sign * this.speed * Math.cos(this.counter) / 40;
        this.yPos += Math.sin(this.counter) / 40 + this.speed / 30;
        if (this.yPos > browserHeight) {
            this.yPos = -50;
        }

        this.element.style.transform = `translate3d(${this.xPos}px, ${this.yPos}px, 0) scale(${this.scale})`;
    };
    function generateSnowflakes() {
        var originalSnowflakeElement = document.createElement('div');
        originalSnowflakeElement.className = 'snowflake';
        originalSnowflakeElement.innerHTML = '.';

        browserWidth = document.body.clientWidth;
        browserHeight = document.body.clientHeight;

        for (var i = 0; i < numberOfSnowflakes; i++) {
            var snowflakeClone = originalSnowflakeElement.cloneNode(true);
            document.body.appendChild(snowflakeClone);

            var initialXPos = random(0, browserWidth);
            var initialYPos = -450
            var speed = random(5, 40);

            var snowflakeObject = new Snowflake(
                snowflakeClone,
                speed,
                initialXPos,
                initialYPos
            );
            snowflakes.push(snowflakeObject);
        }

        moveSnowflakes();
    }

    function moveSnowflakes() {
        for (var i = 0; i < snowflakes.length; i++) {
            var snowflake = snowflakes[i];
            snowflake.update();
        }
        requestAnimationFrame(moveSnowflakes);
    }

    window.addEventListener('resize', function () {
        browserWidth = document.body.clientWidth;
        browserHeight = document.body.clientHeight;
        snowflakes.forEach(function (snowflake) {
            snowflake.xPos = random(0, browserWidth);
            snowflake.yPos = random(-browserHeight, 0);
        });
    });

    generateSnowflakes();
});