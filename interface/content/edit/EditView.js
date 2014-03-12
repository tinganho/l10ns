
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('View')
    , template = inServer ? content_appTmpls : require('contentTmpls');

  return View.extend({

    /**
     * Initializer
     *
     * @return {void}
     * @api public
     */

    initialize : function() {
      if(!inServer) {
        this._setElement();
      }
    },

    /**
     * Set elements
     *
     * @return {void}
     * @api public
     */

    _setElement : function() {

    },

    template : template.edit,
  });
});
