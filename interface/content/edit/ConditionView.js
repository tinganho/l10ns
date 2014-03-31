
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
      this._model = model;
      this.setElement(document.querySelector('.condition[data-row="' + this._model.get('row') + '"]'));
      this
        ._setElements()
        ._bind();
    },

    /**
     * Set elements
     *
     * @return {this}
     * @api private
     */

    _setElements : function() {

      return this;
    },

    /**
     * Bind methods
     *
     * @return {this}
     * @api private
     */

    _bindMethods : function() {

      return this;
    },

    /**
     * Bind view
     *
     * @return {this}
     * @api private
     */

    _bind : function() {
      this._bindMethods();
      this._addDesktopListeners();

      return this;
    },

    /**
     * Add desktop listeners
     *
     * @return {this}
     * @api private
     */

    _addDesktopListeners : function() {

      return this;
    }
  });
});
