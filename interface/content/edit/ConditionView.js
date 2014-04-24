
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('View')
    , template = inServer ? content_appTmpls : require('contentTmpls')
    , OperandView = require('./ConditionOperandView')
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
      if(inClient) {
        var element = document.querySelector('.condition[data-row="' + this._model.get('row') + '"]');
        if(element) {
          this.setElement(element);
        }
        else {
          this.render();
        }
        this._setElements()
        this._bind();
      }
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
        'render',
        '_showOperatorsDropDown',
        '_hideOperatorsDropDown',
        '_showThenDropDown',
        '_hideThenDropDown',
        '_setOperator',
        '_onOperatorChange',
        '_onRowChange',
        '_addSubCondition',
        '_remove'
      );
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addDesktopListeners : function() {
      this.$el.on('mousedown', '.condition-operators', this._showOperatorsDropDown);
      this.$el.on('mousedown', '.condition-operator', this._setOperator);
      this.$el.on('mousedown', '.condition-then', this._showThenDropDown);
      this.$el.on('mousedown', '.condition-comparator', this._addSubCondition);
      this.$el.on('click', '.condition-exit', this._remove);
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
        _this.$el.off('mousedown', '.condition-operators');
        app.$document.on('mousedown', _this._hideOperatorsDropDown);
      });
    },

    /**
     * Hide operators dropdown
     *
     * @delegate
     */

    _hideOperatorsDropDown : function(event) {
      if(typeof event !== 'undefined') {
        var $parent = $(event.target).parents('.condition-operators');
        if($parent.length > 0 && $parent[0] === this.$operators[0]) {
          return;
        }
      }

      var _this = this;

      this.$operators[0].classList.remove('active');
      _.defer(function() {
        _this.$el.on('mousedown', '.condition-operators', _this._showOperatorsDropDown);
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
        _this.$el.off('mousedown', '.condition-then');
        app.$document.on('mousedown', _this._hideThenDropDown);
      });
    },

    /**
     * Hide operators dropdown
     *
     * @delegate
     */

    _hideThenDropDown : function(event) {
      if(typeof event !== 'undefined') {
        var $parent = $(event.target).parents('.condition-then');
        if($parent.length > 0 && $parent[0] === this.$then[0]) {
          return;
        }
      }

      var _this = this;

      this.$then[0].classList.remove('active');
      _.defer(function() {
        _this.$el.on('mousedown', '.condition-then', _this._showThenDropDown);
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
          row : row,
          translation : this._model.translation
        };

      var condition = new Condition(data);

      this._hideThenDropDown();
    },

    /**
     * Remove
     *
     * @delegate
     */

    _remove : function() {
      var _this = this;
      this.$el.remove();
      app.models.edit.removeValueObject(_this._model.get('row'));
    },

    /**
     * Render
     *
     * @return {void}
     * @api public
     */

    render : function() {
      var json = this._model.toJSON();

      this.firstOperandView = new OperandView(this._model.get('firstOperand'));
      this.lastOperandView = new OperandView(this._model.get('lastOperand'));
      json.firstOperand = this.firstOperandView.render();
      json.lastOperand = this.lastOperandView.render();

      var html = this.template(json);

      if(inClient) {
        $('.condition[data-row="' + (this._model.get('row') - 1) + '"]')
          .after(html);

        this.setElement('.condition[data-row="' + this._model.get('row') + '"]');
      }
      else {
        return html;
      }
    },

    /**
     * Template
     *
     * @type {String}
     */

    template : template['Condition']
  });
});
