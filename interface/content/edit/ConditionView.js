
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
      this._setElements()
      this._bind();
    },

    /**
     * Set elements
     *
     * @return {this}
     * @api private
     */

    _setElements : function() {
      this.$operators = this.$('.condition-operators');
      this.$operator = this.$('.condition-operators-value');
      this.$then = this.$('.condition-then');
    },

    /**
     * Bind view
     *
     * @return {this}
     * @api private
     */

    _bind : function() {
      this._bindMethods()
      this._addDesktopListeners()
      this._bindModel();
    },

    /**
     * Bind model
     *
     * @return {this}
     * @api private
     */

    _bindModel : function() {
      this._model.on('change:operator', this._onOperatorChange);
      return this;
    },

    /**
     * On operator change
     *
     * @delegate
     */

    _onOperatorChange : function() {
      this.$operator.html(this._model.get('operator'));
    },

    /**
     * Bind methods
     *
     * @return {void}
     * @api private
     */

    _bindMethods : function() {
      _.bindAll(this,
        '_showOperatorsDropDown',
        '_hideOperatorsDropDown',
        '_showThenDropDown',
        '_hideThenDropDown',
        '_setOperator',
        '_onOperatorChange'
      );
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addDesktopListeners : function() {
      this.$el.on('click', '.condition-operators', this._showOperatorsDropDown);
      this.$el.on('click', '.condition-operator', this._setOperator);
      this.$el.on('click', '.condition-then', this._showThenDropDown);
    },

    /**
     * Show operators dropdown
     *
     * @delegate
     */

    _showOperatorsDropDown : function() {
      var _this = this;

      this.$operators[0].classList.add('active');
      _.defer(function() {
        _this.$el.off('click', '.condition-operators');
        app.$document.on('mousedown', _this._hideOperatorsDropDown);
      });
    },

    /**
     * Hide operators dropdown
     *
     * @delegate
     */

    _hideOperatorsDropDown : function(event) {
      if(typeof event !== 'undefined'
      && $(event.target).parents('.condition-operators').length > 0) {
        return;
      }

      var _this = this;

      this.$operators[0].classList.remove('active');
      _.defer(function() {
        _this.$el.on('click', '.condition-operators', _this._showOperatorsDropDown);
        app.$document.off('mousedown', _this._hideOperatorsDropDown);
      });
    },

    /**
     * Set operator
     *
     * @delegate
     */

    _setOperator : function(event) {
      this._model.set('operator', event.currentTarget.dataset['value']);
      this._hideOperatorsDropDown();
    },

    /**
     * Show then dropdown
     *
     * @delegate
     */

    _showThenDropDown : function() {
      var _this = this;

      this.$then[0].classList.add('active');
      _.defer(function() {
        _this.$el.off('click', '.condition-then');
        app.$document.on('mousedown', _this._hideThenDropDown);
      });
    },

    /**
     * Hide operators dropdown
     *
     * @delegate
     */

    _hideThenDropDown : function(event) {
      if(typeof event !== 'undefined'
      && $(event.target).parents('.condition-then').length > 0) {
        return;
      }

      var _this = this;

      this.$then[0].classList.remove('active');
      _.defer(function() {
        _this.$el.on('click', '.condition-then', _this._showThenDropDown);
        app.$document.off('mousedown', _this._hideThenDropDown);
      });
    }
  });
});
