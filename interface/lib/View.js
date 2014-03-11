
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Backbone = require('backbone');

  /**
   * View
   *
   * @constructor
   */

  return Backbone.View.extend({

    /**
     * We create a noop of this element if on server. Because it requires the DOM
     * to be run.
     *
     * @overrides _ensureElement
     */

    _ensureElement : function() {
      if(!inServer) {
        Backbone.View.prototype._ensureElement.call(this, arguments);
      }
    },

    /**
     * fingerIsOutOfRangeRange checks if a finger is out of range for firing a release event.
     * For usage, when touch events and finger is released too far away from the button.
     * Pls. set global constants for how far the finger can be in TOUCH_OUT_OF_RANGE
     *
     * @param {HammerJSEvent=}
     *
     * @return {Boolean}
     */

    fingerIsOutOfButtonRange : function(event) {
      var isOutOfRange = false;

      if(typeof event !== 'undefined'
      && typeof event.gesture !== 'undefined') {
        if(typeof event.gesture.deltaX === 'number'
        && Math.abs(event.gesture.deltaX) > cf.TOUCH_OUT_OF_RANGE) {
          isOutOfRange = true;
        }
        if(typeof event.gesture.deltaX === 'number'
        && Math.abs(event.gesture.deltaY) > cf.TOUCH_OUT_OF_RANGE) {
          isOutOfRange = true;
        }
      }

      return isOutOfRange;
    }
  });

});
