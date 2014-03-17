
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('View');
  var template = inServer ? content_appTmpls : require('contentTmpls');

  return View.extend({

    /**
     * Initializer
     *
     * @api public
     */

    initialize : function() {
      if(inClient) {
        this.$input = this.$('.js-search-input');
      }
    },

    template : template.search,

    /**
     * Root element
     */

    el : '.js-search'
  });
});
