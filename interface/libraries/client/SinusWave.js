
;(function() {

  var requestAnimationFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();

  var cancelAnimationFrame = (function(callback) {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame ||
    function(id) {
      clearTimeout(id);
    };
  })();

  var Gaussian = function(mean, variance) {
    this.mean = mean;
    this.variance = variance;
    this.standardDeviation = Math.sqrt(variance);
  }

  Gaussian.prototype.pdf = function(x) {
    var m = this.standardDeviation * Math.sqrt(2 * Math.PI);
    var e = Math.exp(-Math.pow(x - this.mean, 2) / (2 * this.variance));
    return e / m;
  };

  /**
   * SinusWave class
   *
   * @param {object} options
   * @class SinusWave
   * @constructor
   * @public
   */

  function SinusWave(options) {
    this.startPoint = { x: null, y: null };
    this.offset = { x: 0, y: 0 };
    this.period = 150;
  }

  /**
   * Get y coordinate base on x
   *
   * @param {Number} x X-coordinate
   * @return {Number} Y-coordinate
   */

  SinusWave.prototype.getYCoordinate = function(x, line) {
    var xWithOffset = (x + this.offset.x)
      , y = 60 * Math.sin(2*Math.PI/this.period * xWithOffset)
      , normalizationRatio = this.guassian.pdf(x);

    return ((y * normalizationRatio * 40 * (line + 1) / 2.5) + this.offset.y);
  };

  /**
   * Set canvas element to render the sinus wave
   *
   * @param {HTMLCanvasElement} canvas
   * @return {void}
   * @public
   */

  SinusWave.prototype.setCanvas = function(canvas) {
    this.canvas = canvas;
    this.guassian = new Gaussian(this.canvas.width / 2, 3000);
    this.context = this.canvas.getContext('2d');
    this.context.lineWidth = 2;
    this.offset.y = this.canvas.height / 2;
    this.startPoint.x = 0;
    this.startPoint.y = this.getYCoordinate(0);
  };

  /**
   * Start animate the sinus wave
   *
   * @return {void}
   * @public
   */

  SinusWave.prototype.start = function() {
    var _this = this
      , lastAnimation = new Date().getTime()
      , gradient1 = this.context.createLinearGradient(0, 0, this.canvas.width, 0)
      , gradient2 = this.context.createLinearGradient(0, 0, this.canvas.width, 0)
      , gradient3 = this.context.createLinearGradient(0, 0, this.canvas.width, 0);

    gradient1.addColorStop(0, 'rgba(100, 100, 70, 0)');
    gradient1.addColorStop(0.2, 'rgba(70, 70, 70, 0.3)');
    gradient1.addColorStop(0.8, 'rgba(70, 70, 70, 0.3)');
    gradient1.addColorStop(1, 'rgba(70, 70, 70, 0)');

    gradient2.addColorStop(0, 'rgba(70, 70, 70, 0)');
    gradient2.addColorStop(0.2, 'rgba(70, 70, 70, 0.3)');
    gradient2.addColorStop(0.8, 'rgba(70, 70, 70, 0.3)');
    gradient2.addColorStop(1, 'rgba(70, 70, 70, 0)');

    gradient3.addColorStop(0, 'rgba(70, 70, 70, 0)');
    gradient3.addColorStop(0.2, 'rgba(70, 70, 70, 0.6)');
    gradient3.addColorStop(0.8, 'rgba(70, 70, 70, 0.6)');
    gradient3.addColorStop(1, 'rgba(70, 70, 70, 0)');

    function animate() {
      _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);

      _this.offset.x += 8 * (new Date().getTime() - lastAnimation) / 16;
      if(_this.offset.x >= _this.canvas.width) {
        _this.offset.x = _this.offset.x - 2*Math.PI/_this.period;
      }

      for(var line = 1; line <= 3; line++) {
        _this.context.beginPath();
        switch(line) {
          case 1:
            _this.context.strokeStyle = gradient1;
            break;
          case 2:
            _this.context.strokeStyle = gradient2;
            break;
          case 3:
            _this.context.strokeStyle = gradient3;
            break;
        }

        _this.context.moveTo(_this.startPoint.x, _this.startPoint.y);
        for(var index = 1; index <= _this.canvas.width; index++) {
          _this.context.lineTo(_this.startPoint.x + index, _this.getYCoordinate(_this.startPoint.x + index, line));
        }
        _this.context.stroke();
      }

      lastAnimation = new Date().getTime();

      _this.animation = requestAnimationFrame(animate);
    }
    this.animation = requestAnimationFrame(animate);
  };

  SinusWave.prototype.stop = function() {
    cancelAnimationFrame(this.animation);
  };

  if(typeof require === "function" && typeof exports === 'object' && typeof module === 'object') {
    module.exports = SinusWave;
  }
  else if (typeof define === "function" && define.amd) {
    define(function() {
      return SinusWave;
    });
  }
  else {
    window.SinusWave = SinusWave;
  }
})();
