
/**
 * Check if array
 *
 * @param {Object} o
 * @return {Boolean}
 * @api public
 */

(function() {
  function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  }

  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    module.exports = isArray;
  }
  else if (typeof define === "function" && define.amd) {
    define(function () {
      return isArray;
    });
  }
})();
