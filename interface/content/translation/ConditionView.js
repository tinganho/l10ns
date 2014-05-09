
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
    , template = inServer ? content_appTemplates : require('contentTemplates')
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
      this.model = model;
      if(inClient) {
        this._bindMethods();
        this._bindModel();
      }
    },

    /**
     * Set elements
     *
     * @return {this}
     * @api private
     */

    _setElements : function() {
      this.$statement = this.$('.condition-statement');
      this.$operators = this.$('.condition-operators');
      this.$operator = this.$('.condition-operators-value');
      this.$then = this.$('.condition-then');
    },

    /**
     * Bind model
     *
     * @return {void}
     * @api private
     */

    _bindModel : function() {
      this.model.on('change:operator', this._setOperatorText);
      this.model.on('change:row', this._updateRow);
      this.model.on('change:statement', this._updateStatement);
    },

    /**
     * Set operator text
     *
     * @return {void}
     * @api private
     */

    _setOperatorText : function() {
      this.$operator.html(this.model.get('operator'));
    },

    /**
     * Bind object with the DOM
     *
     * @return {this}
     * @api private
     */

    bindDOM : function() {
      this._setElements();
      this._addMouseInteractions();
    },

    /**
     * On operator change
     *
     * @delegate
     */

    _onOperatorChange : function() {
      this.$operator.html(this.model.get('operator'));
    },

    /**
     * On operator change
     *
     * @delegate
     */

    _updateRow : function() {
      this.el.dataset.row = this.model.get('row');
    },

    /**
     * On operator change
     *
     * @delegate
     */

    _updateStatement : function() {
      this.$statement.html(this.model.get('statement'));
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
        '_updateRow',
        '_updateStatement',
        '_addSubCondition',
        '_removeCondition',
        '_setOperatorText'
      );
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addMouseInteractions : function() {
      this.$el.on('mousedown', '.condition-operators', this._showOperatorsDropDown);
      this.$el.on('mousedown', '.condition-operator', this._setOperator);
      this.$el.on('mousedown', '.condition-then', this._showThenDropDown);
      this.$el.on('mousedown', '.condition-comparator', this._addSubCondition);
      this.$el.on('click', '.condition-exit', this._removeCondition);
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
      this.model.set('operator', event.currentTarget.dataset.value);
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
        , data = {
          statement : statement,
          firstOperand : 'value1',
          operator : '==',
          lastOperand : 'value2',
          vars : this.model.get('vars'),
          operators : cfg.OPERATORS,
          additionalCompairOperators : cf.ADDITIONAL_COMPAIR_OPERATORS,
          row : this.model.get('row') + 1,
          translation : app.models.translation
        };

      var condition = new app.models.translation.Condition(data);

      this._hideThenDropDown();
    },

    /**
     * Remove condition
     *
     * @delegate
     */

    _removeCondition : function() {
      this.model.destroy();
    },

    /**
     * Render
     *
     * @return {void}
     * @api public
     */

    render : function() {
      var json = this.model.toJSON();

      // We set this as object properties so we can access them outside.
      // We need sometime call conditionView.firstOperandView.bindDOM().
      // And without setting these views as properties it is impossible
      // to bind the DOM with the object.
      this.firstOperandView = new OperandView(this.model.get('firstOperand'));
      this.lastOperandView = new OperandView(this.model.get('lastOperand'));
      json.firstOperand = this.firstOperandView.render();
      json.lastOperand = this.lastOperandView.render();

      // We need to convert symbols from `&&` and `||` to `and` and `or`
      // so that non-programmers understand the meaning of `&&` and `||`
      if(json.statement === '&&') {
        json.statement = 'and';
      }
      else if(json.statement === '||') {
        json.statement = 'or';
      }

      return this.template(json);
    },

    /**
     * Template
     *
     * @type {String}
     */

    template : template['Condition']
  });
});
