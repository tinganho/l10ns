
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('View')
    , _ = require('underscore');

  return View.extend({

    /**
     * Initializer
     *
     * @return {void}
     * @api public
     */

    initialize : function(model) {
      this._model = model;
      this._setElements();
      this._bindMethods();
      this._addDesktopListeners();
    },

    /**
     * Set element
     *
     * @return {void}
     * @api private
     */

    _setElements : function() {
      this.setElement('.edit-input[data-row=' + this._model.get('row') + ']');
    },

    /**
     * Bind methods
     *
     * @return {void}
     * @api public
     */

    _bindMethods : function() {
      _.bindAll(this, '_setValue');
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
      this._model.set('value', this.$el.val());
    }
  });
});
