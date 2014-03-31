
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
      this.rootSelector = '.js-' + this._model.get('order') + '-operand';
      this._bind();
    },

    /**
     * Bind view, adds listeners for DOM events and model changes
     *
     * @return {void}
     * @api private
     */

    _bind : function() {
      this._bindMethods();
      this._setElements();
      this._addDesktopListeners();
    },

    /**
     * Set elements
     *
     * @return {void}
     * @api private
     */

    _setElements : function() {
      this.setElement(this.rootSelector);
    },

    /**
     * Bind methods
     *
     * @return {void}
     * @api private
     */

    _bindMethods : function() {
      _.bindAll(this,
        '_showDropDown',
        '_hideDropDown'
      );
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addDesktopListeners : function() {
      this.$el.on('click', this._showDropDown);
    },

    /**
     * Show dropdown
     *
     * @delegate
     */

    _showDropDown : function(event) {
      var _this = this;

      this.el.classList.add('active');
      if(!has.touch) {
        _.defer(function() {
          _this.$el.off('click', _this._showDropDown);
          app.$document.on('click', _this._hideDropDown);
        });
      }
    },

    /**
     * Show dropdown
     *
     * @delegate
     */

    _hideDropDown : function(event) {
      var _this = this;

      if($(event.target).parents(this.rootSelector).length > 0) {
        return;
      }

      this.el.classList.remove('active');
      if(!has.touch) {
        _.defer(function() {
          _this.$el.on('click', _this._showDropDown);
          app.$document.off('click', _this._hideDropDown);
        });
      }
    }
  });
});
