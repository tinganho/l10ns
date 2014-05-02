
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('View')
    , ConditionView = require('./ConditionView')
    , InputView = require('./InputView')
    , ElseView = require('./ElseView')
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
      this._bindConditionsAddition();
      this._bindConditionRemoval();
      this._bindInputAddition();
      this._bindElseAddition();
    },

    /**
     * Bind else addition
     *
     * @return {void}
     * @api private
     */

    _bindElseAddition : function() {
      var _this = this;
      this.model.on('change:else', function(_else) {
        this._elseView = new ElseView(_else.get('else'));
        _this.$('[data-row="0"]').after(this._elseView.render());
        this._elseView.setElement('[data-row="1"]');
        this._elseView.bindDOM();
      });
    },

    /**
     * Bind condition addition
     *
     * @return {void}
     * @api private
     */

    _bindConditionsAddition : function() {
      var _this = this;
      this.model.on('add:conditions', function(condition) {
        var view = new ConditionView(condition)
          , insertingRow = condition.get('row')
          , $condition;

        // We need a defer block because firstOperand and lastOperans relation
        // are not set yet.
        _.defer(function() {
          // If we insert a condition by choosing `and` or `or` in the `then` dropdown
          // We need to increase the row property on other conditions
          // and inputs. Otherwise some DOM bindings/event handling
          // will be wrong. We check that this is condition insertion from the `then`
          // dropdown by checking if inserting row is equals the `else` row minus 2
          if(insertingRow !== _this.model.get('else').get('row')) {
            _this.model.get('conditions').forEach(function(_condition) {
              var currentRow = _condition.get('row');
              if(currentRow >= insertingRow && condition.cid !== _condition.cid) {
                _condition.set('row', currentRow + 1);
              }
            });
            _this.model.get('inputs').forEach(function(input) {
              var currentRow = input.get('row');
              if(currentRow >= insertingRow) {
                input.set('row', currentRow + 1);
              }
            });
            var _else = _this.model.get('else');
            _else.set('row', _else.get('row') + 1);
            $condition = $(view.render());
          }
          else {
            if(insertingRow === 0) {
              _this.model.get('inputs').forEach(function(input) {
                var currentRow = input.get('row');
                if(currentRow >= insertingRow) {
                  input.set('row', currentRow + 1);
                }
              });
            }
            $condition = $(view.render()).addClass('invisible');
          }

          // bind conditions' DOM
          if(insertingRow > 0) {
            this.$('[data-row="' + (insertingRow - 1) + '"]').after($condition);
          }
          else {
            this.$('[data-row="1"]').before($condition);
          }

          var conditionSelector = '.condition[data-row="' + insertingRow + '"]';
          view.setElement(conditionSelector);
          view.bindDOM();
          view.firstOperandView.setElement(conditionSelector + ' .condition-first-operand');
          view.firstOperandView.bindDOM();
          view.lastOperandView.setElement(conditionSelector + ' .condition-last-operand');
          view.lastOperandView.bindDOM();
          _this._conditionViews.push(view);
        });
      });
    },

    /**
     * Bind condition removal
     *
     * @return {void}
     * @api private
     */

    _bindConditionRemoval : function() {
      var _this = this;
      this.model.on('remove:conditions', function(condition) {
        var row = condition.get('row');
        if(row === 0) {
          _this._removeConditionAndInputs(condition);
          return;
        }
        _this.model.get('conditions').some(function(_condition) {
          if(_condition.get('row') === row - 1) {
            _this._removeSingleCondition(condition);
            return true;
          }
          return false;
        });
        _this.model.get('inputs').some(function(input) {
          if(input.get('row') === row - 1) {
            _this._removeConditionAndInputs(condition);
          }
          return false;
        });
      });
    },

    /**
     * Remove condition only. This method only removes the `condition` from
     * the DOM by calling `Backbone.View.prototype.remove`.
     *
     * @return {void}
     * @api private
     */

    _removeSingleCondition : function(condition) {
      var _this = this, removalIndex, removalRow;
      this._conditionViews.forEach(function(conditionView, index) {
        if(conditionView.model === condition) {
          conditionView.remove();
          // We remove the view pointer from TranslatioView`
          removalRow = conditionView.model.get('row');
          removalIndex = index;
        }

        // We must decrease the row index on all subsequent conditions
        if(removalIndex && index > removalIndex) {
          conditionView.model.set('row', conditionView.model.get('row') - 1);
        }
      });

      if(removalRow) {
        this._inputViews.forEach(function(inputView) {
          var row = inputView.model.get('row');
          if(row > removalRow) {
            inputView.model.set('row', row - 1);
          }
        });

        if(this._elseView) {
          this._elseView.model.set('row', this._elseView.model.get('row') - 1);
        }

        _this._conditionViews.splice(removalIndex, 1);
      }
    },

    /**
     * Remove condition only. This method only removes the `condition` from
     * the DOM by calling `Backbone.View.prototype.remove`.
     *
     * @return {void}
     * @api private
     */

    _removeConditionElseAndInputs : function() {
      this.model.else.destroy();

    },

    /**
     * Bind condition removal
     *
     * @return {void}
     * @api private
     */

    _bindInputAddition : function() {
      var _this = this;
      this.model.on('add:inputs', function(input) {
        var row = input.get('row')
          , view = new InputView(input);

        _this.$('[data-row="' + (row - 1) + '"]').after(view.render());
        view.setElement('[data-row="' + row + '"]');
        view.bindDOM();

        _this._inputViews.push(view);
      });
    },

    /**
     * Bind condition removal
     *
     * @return {void}
     * @api private
     */

    _bindInputRemoval : function() {
      var _this = this;
      this.model.on('remove:inputs', function(input) {

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
      if(typeof this._elseView !== 'undefined') {
        this._elseView.setElement('.condition-else');
        this._elseView.bindModel();
      }

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
      this.$el.on('click', '.add-condition', this._addCondition);
      this.$el.on('click', '.save', this._save);
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
      var _this = this;

      event.preventDefault();

      var _else = this.model.get('else'), row = 0, elseRow, inputRow;

      if(_else) {
        row = _else.get('row');
      }

      // We increase the row by two. So it becomes behind the input,
      // which has a row that is one bigger than inserting row.
      elseRow = row + 2;
      inputRow = elseRow + 1;

      var $inputs =
      $('[data-row="' + row + '"]')
        .add('[data-row="' + (row + 1) + '"]')
        .add('[data-row="' + (row + 2) + '"]')
        .addClass('invisible');

      var data = {
        statement : row === 0 ? 'if' : 'else if',
        firstOperand : 'value1',
        operator : '==',
        lastOperand : 'value2',
        vars : this.model.get('vars'),
        operators : cf.OPERATORS,
        additionalCompairOperators : cf.ADDITIONAL_COMPAIR_OPERATORS,
        row : row,
        translation : this.model
      };

      new this.model.Condition(data);

      if(_else) {
        _.defer(function() {
          _else.set('row', elseRow);
          new _this.model.Input({ value : '', row : inputRow, translation : _this.model});
        });
      }
      else {
        new this.model.Else({ row : 2, parent : this.model });
        var input = new this.model.Input({ value : '', row : 3, translation : this.model});
      }

      _.defer(function() {
        $('[data-row="' + row + '"]')
          .add('[data-row="' + (row + 1) + '"]')
          .add('[data-row="' + (row + 2) + '"]')
          .removeClass('invisible');
      });
    },

    /**
     * Save
     *
     * @delegate
     */

    _save : function(event) {
      event.preventDefault();
      this.model.save();
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

      // We loop through each relation object to get the HTML. We use `row`
      // to determine the order of the HTML
      conditions.forEach(function(condition) {
        var view = new ConditionView(condition);
        _this._conditionViews.push(view);
        values[condition.get('row')] = view.render();
      });
      inputs.forEach(function(input, index) {
        var view = new InputView(input);
        _this._inputViews.push(view);
        values[input.get('row')] = view.render();
      });

      // `else` might be null if there is no conditions on translations
      var _else = this.model.get('else');
      if(_else) {
        this._elseView = new ElseView(_else);
        values[_else.get('row')] = this._elseView.render();
      }

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
