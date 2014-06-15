
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
    , template = inServer ? content_appTemplates : require('contentTemplates')
    , _ = require('underscore');

  return View.extend({

    /**
     * Initializer
     *
     * @return {void}
     * @api public
     */

    initialize : function(model) {
      this.model = model;
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
      _.bindAll(this, 'render', '_search');
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
     * To HTML
     *
     * @return {void}
     * @api public
     */

    toHTML: function() {
      return this.template(this.model.toJSON());
    },

    /**
     * Template
     *
     * @type {Function}
     */

    template : template['Search']
  });
});
