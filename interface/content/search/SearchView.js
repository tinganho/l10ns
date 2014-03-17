
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('View')
    , template = inServer ? content_appTmpls : require('contentTmpls')
    , _ = require('underscore');

  return View.extend({

    /**
     * Initializer
     *
     * @return {void}
     * @api public
     */

    initialize : function() {
      if(inClient) {
        this._bindElements();
        this._setElements();
        this._addDesktopListeners();
      }
    },

    /**
     * Bind elements
     *
     * @return {void}
     * @api private
     */

    _bindElements : function() {
      _.bindAll(this, '_search');
    },

    /**
     * Set elements
     *
     * @return {void}
     * @api private
     */

    _setElements : function() {
      this.$input = this.$('.js-search-input');
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addDesktopListeners : function() {
      this.$input.on('keyup', this._search);
    },

    /**
     * Search
     *
     * @return {void}
     * @api private
     */

    _search : function() {
      console.log(this.$input.val());
    },

    /**
     * Template
     *
     * @type {Function}
     */

    template : template.search,

    /**
     * Root element
     */

    el : '.js-search'
  });
});
