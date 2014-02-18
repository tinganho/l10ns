
define([

  'backbone'

], function(

  Backbone

) {

  /**
   * View
   *
   * @constructor
   */

  return Backbone.View.extend({

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
