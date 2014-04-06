
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('View')
    , template = inServer ? content_appTmpls : require('contentTmpls')
    , Condition = require('./Condition')
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
     * @return {void}
     * @api private
     */

    _bindModel : function() {
      this._model.on('change:operator', this._onOperatorChange);
      this._model.on('change:row', this._onRowChange);
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
     * On operator change
     *
     * @delegate
     */

    _onRowChange : function() {
      this.el.dataset.row = this._model.get('row');
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
        '_onOperatorChange',
        '_onRowChange',
        '_addSubCondition'
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
      this.$el.on('click', '.condition-comparator', this._addSubCondition);
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
      this._model.set('operator', event.currentTarget.dataset.value);
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
    },

    /**
     * Add sub condition
     *
     * @delegate
     */

    _addSubCondition : function(event) {
      var statement = event.currentTarget.dataset.value
        , row = this._model.get('row') + 1
        , data = {
          statement : statement,
          firstOperand : 'value1',
          operator : '==',
          lastOperand : 'value2',
          vars : this._model.get('vars'),
          operators : cf.OPERATORS,
          additionalCompairOperators : cf.ADDITIONAL_COMPAIR_OPERATORS,
          row : row
        };

      $('.condition[data-row]').each(function() {
        console.log(this.dataset)
        if(this.dataset.row >= row) {
          this.dataset.row = parseInt(this.dataset.row, 10) + 1;
        }
      });

      $('.condition[data-row="' + this._model.get('row') + '"]')
        .after(this.template(data));



      var condition = new Condition(data);

      app.models.edit.addValueObject(row, condition);

      this._hideThenDropDown()
    },

    /**
     * Template
     *
     * @type {String}
     */

    template : template.condition
  });
});
