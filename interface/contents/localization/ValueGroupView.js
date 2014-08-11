
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
    , ConditionView = require('./ConditionView')
    , InputView = require('./InputView')
    , template = inServer ? content_appTemplates : require('contentTemplates')
    , _ = require('underscore')
    , ElseView = require('./ElseView')
    , ConditionView = require('./ConditionView');

  return View.extend({

    /**
     * Constructor
     *
     * @param {Model} model
     */

    constructor: function(model) {
      this.model = model;
      this._conditionViews = [];
      this._inputViews = null;
      this._elseView = null;
      this._bindMethods();
    },

    /**
     * Bind methods
     *
     * @return {void}
     * @api private
     */

    _bindMethods: function() {
      _.bindAll(this,
        '_reOrder',
        '_renderElse',
        '_renderConditionAddition',
        '_renderConditionRemoval');
    },

    /**
     * Bind model
     *
     * @return {void}
     * @api public
     * @handler
     */

    bindModel: function() {
      this.listenTo(this.model, 'change:index', this._reOrder);
      this.listenTo(this.model, 'change:else', this._renderElse);
      this.listenTo(this.model, 'add:conditions', this._renderConditionAddition);
      this.listenTo(this.model, 'remove:conditions', this._renderConditionRemoval);
      this._conditionViews.forEach(function(conditionView) {
        conditionView.bindModel();
      });
      this._inputView.bindModel();
      if(this._elseView) {
        this._elseView.bindModel();
      }
    },

    /**
     * Render condition addition
     *
     * @param {Condition} condition
     * @return {void}
     * @handler
     */

    _renderConditionAddition: function(condition) {
      var _this = this
        , conditionView = new ConditionView(condition)
        , insertingRow = condition.get('row')
        , $condition;

      _this.model.get('conditions').forEach(function(_condition) {
        var currentRow = _condition.get('row');
        if(currentRow >= insertingRow && condition.cid !== _condition.cid) {
          _condition.set('row', currentRow + 1);
        }
      });

      var input = _this.model.get('input');
      input.set('row', input.get('row') + 1);

      $condition = $(conditionView.toHTML());
      if(insertingRow > 0) {
        _this.$el.find('[data-row="' + (insertingRow - 1) + '"]').after($condition);
      }
      else {
        _this.$el.prepend($condition);
      }
      var conditionSelector = '.condition[data-row="' + insertingRow + '"]:not(.condition-else)';
      conditionView.setElement(_this.$el.find(conditionSelector));
      conditionView.bindDOM();
      conditionView.bindModel();
      conditionView.firstOperandView.setElement(_this.$el.find(conditionSelector + ' .condition-first-operand'));
      conditionView.firstOperandView.bindDOM();
      conditionView.lastOperandView.setElement(_this.$el.find(conditionSelector + ' .condition-last-operand'));
      conditionView.lastOperandView.bindDOM();

      this._conditionViews.splice(condition.get('row'), 0, conditionView);
    },

    /**
     * Render condition removal
     *
     * @return {void}
     * @api private
     * @handler
     */

    _renderConditionRemoval: function(condition) {
      var _this = this
        , row = condition.get('row')
        , conditions = this.model.get('conditions').sort()
        , hasSubsequentCondition = false;

      if(conditions.length === 0) {
        if(this.model.get('localization').get('valueGroups').length === 2) {
          this._removeConditions();
          return;
        }

        this._removeConditionAndInput(condition);
      }

      conditions.some(function(iterationCondition) {
        var iterationRow = iterationCondition.get('row');
        if(iterationRow === row - 1) {
          _this._removeCondition(condition);
          return true;
        }

        if(iterationRow === row + 1) {
          _this._removeConditionWithSubsequentCondition(condition);
          return true;
        }

        return false;
      });
    },
    /**
     * Render else view
     *
     * @return {void}
     * @api private
     */

    _renderElse: function() {
      var _else = this.model.get('else');
      if(_else) {
        this._elseView = new ElseView(_else);
        this.$el.prepend(this._elseView.toHTML());
        this._elseView.setElement(this.$el.find('.condition-else'));
        this._elseView.bindDOM();
        this._elseView.bindModel();
      }
      else {
        this._elseView.remove();
      }
    },

    /**
     * Reorder ValueGroup's view ot the correct order.
     *
     * @return {void}
     * @api private
     * @handler
     */

    _reOrder: function() {
      var index = this.model.get('index');
      this.$el.attr('data-index', index);
      var conditions = this.model.get('conditions').where({ row: 0 });
      if(conditions.length > 0) {
        if(this.model.get('index') === 0) {
          conditions[0].set('statement', 'if');
        }
        else {
          conditions[0].set('statement', 'else if');
        }
      }
    },

    /**
     * Remove condition when an input is before and one condition after.
     *
     * @return {void}
     * @api private
     */

    _removeConditionWithSubsequentCondition: function(removingCondition) {
      var _this = this
        , removalRow = removingCondition.get('row')
        , conditionView = this._conditionViews.splice(removalRow, 1)[0];

      conditionView.remove();

      this.model.get('conditions').forEach(function(iterationCondition) {
        var iterationRow = iterationCondition.get('row');
        if(iterationRow > removalRow) {
          iterationCondition.set('row', iterationRow - 1);
          if(iterationRow === removalRow + 1) {
            if(_this.model.get('index') === 0) {
              iterationCondition.set('statement', 'if');
            }
            else {
              iterationCondition.set('statement', 'else if');
            }
          }
        }
      });
    },

    /**
     * Remove the first condition. When removing the first condition some other logic
     * need to be applied. First condition and the input after it should be removed
     * from DOM. Then depending on the length of valueGroups is two or not `else` will be removed
     * or one `else if` statement will be converted to just an if statement.
     *
     * @return {void}
     * @api private
     */

    _removeConditions: function() {
      var lastValueGroup = this.model.get('localization').get('valueGroups').where({ index: 1 })[0];
      lastValueGroup.get('input').set('row', 0);
      lastValueGroup.unset('else');
      this.model.get('localization').get('valueGroups').where({ index: 0 })[0].destroy();
      lastValueGroup.set('index', 0);
    },

    /**
     * Remove condition. Call this method only when you want to remove a single condition
     * from a value group.
     *
     * @param {Condition} condition
     * @return {void}
     * @api private
     */

    _removeCondition: function(removingCondition) {
      var removingRow = removingCondition.get('row')
        , conditionView = this._conditionViews.splice(removingCondition.get('row'), 1)[0];

      conditionView.remove();
      this.model.get('conditions').forEach(function(condition) {
        if(condition.get('row') > removingRow) {
          condition.set('row', condition.get('row') - 1);
        }
      });
    },

    /**
     * Remove condition and input. This method should be called when a
     * condition have one input after and one input before it. This method
     * will remove the condition and also remove the input after it.
     *
     * @return {void}
     * @api private
     */

    _removeConditionAndInput: function(removingCondition) {
      this.model.destroy();
    },

    /**
     * Bind DOM
     *
     * @return {void}
     * @api public
     */

    bindDOM: function() {
      var _this = this;

      this._conditionViews.forEach(function(conditionView) {
        var conditionSelector = '.condition[data-row="' + conditionView.model.get('row') + '"]';
        conditionView.setElement(_this.$el.find(conditionSelector));
        conditionView.bindDOM();
        conditionView.firstOperandView.setElement(_this.$el.find(conditionSelector + ' .condition-first-operand'));
        conditionView.firstOperandView.bindDOM();
        conditionView.lastOperandView.setElement(_this.$el.find(conditionSelector + ' .condition-last-operand'));
        conditionView.lastOperandView.bindDOM();
      });

      var inputSelector = '.input[data-row="' + this._inputView.model.get('row') + '"]';
      this._inputView.setElement(this.$el.find(inputSelector));
      this._inputView.bindDOM();

      if(this._elseView) {
        this._elseView.setElement(this.$el.find('.condition-else'));
      }
    },

    /**
     * Override toHTML
     *
     * @override toHTML
     */

    toHTML: function() {
      var _this = this
        , html = []
        , input = this.model.get('input');

      this._inputView = new InputView(input);
      html[input.get('row')] = this._inputView.toHTML();

      this.model.get('conditions').forEach(function(condition) {
        var conditionView = new ConditionView(condition);
        html[condition.get('row')] = conditionView.toHTML();
        _this._conditionViews.push(conditionView);
      });

      var _else = this.model.get('else');
      if(_else) {
        this._elseView = new ElseView(_else);
        html[0] = this._elseView.toHTML();
      }

      return template['ValueGroup']({
        index: this.model.get('index'),
        values: html.join('')
      });
    }
  });
});
