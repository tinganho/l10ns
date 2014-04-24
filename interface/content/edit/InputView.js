
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

    initialize : function(model) {
      this.model = model;
      if(inClient) {
        this._setElements();
        this._bindMethods();
        this._addDesktopListeners();
      }
    },

    /**
     * Set element
     *
     * @return {void}
     * @api private
     */

    _setElements : function() {
      this.setElement('.edit-input[data-row=' + this.model.get('row') + ']');
    },

    /**
     * Bind methods
     *
     * @return {void}
     * @api public
     */

    _bindMethods : function() {
      _.bindAll(this,
        'render',
        '_setValue'
      );
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addDesktopListeners : function() {
      this.$el.on('keyup', this._setValue);
    },

    /**
     * Set value on model
     *
     * @delegate
     */

    _setValue : function() {
      this.model.set('value', this.$el.val());
    },

    /**
     * Render view
     *
     * @return {void}
     * @api public
     */

    render : function() {
      return this.template(this.model.toJSON());
    },

    /**
     * Template
     *
     * @type {String}
     */

    template : template['Input']
  });
});
