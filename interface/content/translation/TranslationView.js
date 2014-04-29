
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('View')
    , ConditionView = require('./ConditionView')
    , InputView = require('./InputView')
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
      this._conditionViews = [];
      this._inputViews = [];
      if(inClient) {
        this._bindMethods();
      }
    },

    /**
     * Bind model
     *
     * @return {void}
     * @api public
     */

    bindModel : function() {
      var _this = this;
      this.model.on('add:conditions', function(model, collection) {
        var view = new ConditionView(model)
          , insertingRow = model.get('row');
        // We need a defer block because firstOperand and lastOperans relation
        // are not set yet.
        _.defer(function() {
          // We need to increase the row property on other conditions
          // and inputs. Otherwise some DOM bindings/event handling
          // will be wrong.
          _this.model.get('conditions').forEach(function(condition) {
            var currentRow = condition.get('row');
            if(currentRow >= insertingRow && model.cid !== condition.cid) {
              condition.set('row', currentRow + 1);
            }
          });
          _this.model.get('inputs').forEach(function(input) {
            var currentRow = input.get('row');
            if(currentRow >= insertingRow) {
              input.set('row', currentRow + 1);
            }
          });

          this.$('[data-row="' + (insertingRow - 1) + '"]').after(view.render());
          var conditionSelector = '.condition[data-row="' + insertingRow + '"]';
          view.setElement(conditionSelector);
          view.bindDOM();
          view.firstOperandView.setElement(conditionSelector + ' .condition-first-operand');
          view.firstOperandView.bindDOM();
          view.lastOperandView.setElement(conditionSelector + ' .condition-last-operand');
          view.lastOperandView.bindDOM();
        });
      });
    },

    /**
     * Bind view
     *
     * @return {void}
     * @api private
     */

    bindDOM : function() {
      if(!has.touch) {
        this._addMouseInteractions();
      }
      // We loop through each relation view and try to bind
      // them with our object
      this._conditionViews.forEach(function(conditionView) {
        var conditionSelector = '.condition[data-row="' + conditionView.model.get('row') + '"]';
        conditionView.setElement(conditionSelector);
        conditionView.bindDOM();
        conditionView.firstOperandView.setElement(conditionSelector + ' .condition-first-operand');
        conditionView.firstOperandView.bindDOM();
        conditionView.lastOperandView.setElement(conditionSelector + ' .condition-last-operand');
        conditionView.lastOperandView.bindDOM();
      });
      this._inputViews.forEach(function(inputView) {
        var conditionSelector = '.input[data-row="' + inputView.model.get('row') + '"]';
        inputView.setElement(conditionSelector);
        inputView.bindDOM();
      });

      this._setElements();

      this.boundDOM = true;
    },

    /**
     * Bind methods
     *
     * @return {void}
     * @api private
     */

    _bindMethods : function() {
      _.bindAll(
        this,
        '_addCondition',
        '_save'
      );
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addMouseInteractions : function() {
      this.$('[disabled]').removeAttr('disabled');
      this.$el.on('click', '.js-edit-actions-add-condition', this._addCondition);
      this.$el.on('click', '.js-edit-actions-save', this._save);
    },

    /**
     * Set elements
     *
     * @return {void}
     * @api private
     */

    _setElements : function() {
      this.$region = $('[data-region=translation]');
    },

    /**
     * Add condition
     *
     * @delegate
     */

    _addCondition : function(event) {
      event.preventDefault();
    },

    /**
     * Save
     *
     * @delegate
     */

    _save : function(event) {
      event.preventDefault();
    },

    /**
     * Render view
     *
     * @return {void}
     * @api public
     */

    render : function() {
      var _this = this
        , html = '', values = []
        , json = this.model.toJSON()
        , conditions = this.model.get('conditions')
        , inputs = this.model.get('inputs');

      // We loop through each relation object to get the HTML
      conditions.forEach(function(condition) {
        var view = new ConditionView(condition);
        _this._conditionViews.push(view);
        values[condition.get('row')] = view.render();
      });
      inputs.forEach(function(input, index) {
        var view = new InputView(input);
        _this._inputViews.push(view);
        var html = '';
        if(index === inputs.length - 1 && index !== 0) {
          html += template['ConditionElse']();
        }
        values[input.get('row')] = html + view.render();
      });

      json.values = values.join('');

      html += template['Translation'](json);

      return html;
    },

    /**
     * Remove
     *
     * @delegate
     */

    remove : function() {
      View.prototype.remove.call(this);
      this.$region[0].classList.add('hidden');
    }
  });
});
