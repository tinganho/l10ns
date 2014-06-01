
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = require('View')
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
      this._bind();
    },

    /**
     * Bind view
     *
     * @return {void}
     * @api private
     */

    _bind : function() {
      this
        ._setElements()
        ._addListeners();
    },

    /**
     * Add listeners
     *
     * @return {this}
     * @api private
     */

    _addListeners : function() {
      this._model
        .on('change:title', this.updateTitle, this)
        .on('change:description', this.updateDescription, this)
        .on('change:noScroll', this.updateScroll, this);

      return this;
    },

    /**
     * Set elements
     *
     * @return {this}
     * @api private
     */

    _setElements : function() {
      this.$title = document.querySelector('title');
      this.$description = document.querySelector('[name=description]');

      return this;
    },

    /**
     * Update title
     *
     * @delegate
     */

    updateTitle : function() {
      this.$title.innerHTML = this._model.get('title');

      return this;
    },

    /**
     * Update description
     *
     * @delegate
     */

    updateDescription : function() {
      this.$description.setAttribute('content', this._model.get('description'));
    }
  });
});
