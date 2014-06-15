
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
    , template = inServer ? content_appTemplates : require('contentTemplates');

  return View.extend({

    /**
     * Constructor
     *
     * @return {void}
     * @api public
     */

    constructor: function(model) {
      this.model = model;
    },

    /**
     * Render html
     *
     * @return {String}
     * @autocalled
     */

    toHTML: function() {
      return '';
    }
  });
});
