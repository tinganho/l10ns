
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
    , ConditionView = require('./ConditionView')
    , InputView = require('./InputView')
    , ElseView = require('./ElseView')
    , template = inServer ? content_appTemplates : require('contentTemplates')
    , _ = require('underscore');

  return View.extend({

    /**
     * Initializer
     *
     * @return {void}
     * @api public
     */

    initialize: function(model) {
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

    bindModel: function() {
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

    _bindElseAddition: function() {
      var _this = this;
      this.model.on('change:else', function(_else) {
        if(_this.model.get('else')) {
          _this._elseView = new ElseView(_else.get('else'));
          _this.$('[data-row="1"]').after(_this._elseView.render());
          _this._elseView.bindModel();
          _this._elseView.setElement('[data-row="2"]');
          _this._elseView.bindDOM();
        }
      });
    },

    /**
     * Bind condition addition
     *
     * @return {void}
     * @api private
     */

    _bindConditionsAddition: function() {
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
          if(_this.model.get('else') && insertingRow !== _this.model.get('else').get('row')) {
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

          var conditionSelector = '.condition[data-row="' + insertingRow + '"]:not(.condition-else)';
          view.setElement(conditionSelector);
          view.bindDOM();
          view.firstOperandView.setElement(conditionSelector + ' .condition-first-operand');
          view.firstOperandView.bindDOM();
          view.lastOperandView.setElement(conditionSelector + ' .condition-last-operand');
          view.lastOperandView.bindDOM();

          // We must insert the view in the right index in `_conditionViews`
          var appended = false;
          _this._conditionViews.some(function(conditionView, index) {
            if(conditionView.model.get('row') === insertingRow - 1) {
              _this._conditionViews.splice(index + 1, 0, view);
              appended = true;
              return true;
            }
            return false;
          });
          if(!appended) {
            _this._conditionViews.push(view);
          }
        });
      });
    },

    /**
     * Bind condition removal
     *
     * @return {void}
     * @api private
     */

    _bindConditionRemoval: function() {
      var _this = this;

      this.model.on('remove:conditions', function(condition) {
        var row = condition.get('row')
          , inputs = _this.model.get('inputs').sort()
          , conditions = _this.model.get('conditions').sort()
          , hasSubsequentCondition = false;

        if(row === 0) {
          _this._removeFirstCondition();
          return;
        }

        conditions.some(function(_condition) {
          if(_condition.get('row') === row - 1) {
            _this._removeSingleCondition(condition);
            return true;
          }
          if(_condition.get('row') === row + 1) {
            inputs.some(function(input) {
              if(input.get('row') === row - 1) {
                _this._removeConditionWithSubsequentCondition(condition);
                hasSubsequentCondition = true;
                return true;
              }
              return false;
            });
            return true;
          }
          return false;
        });
        if(!hasSubsequentCondition) {
          inputs.some(function(input, index) {
            if(input.get('row') === row - 1) {
              if(inputs.where({ row : row + 1}).length) {
                _this._removeConditionAndInput(condition);
                return true;
              }
            }
            return false;
          });
        }
      });
    },

    /**
     * Remove condition when an input is before and one condition after.
     *
     * @return {void}
     * @api private
     */

    _removeConditionWithSubsequentCondition: function(condition) {
      var _this = this, removalIndex, removalRow;
      this._conditionViews.forEach(function(conditionView, index) {
        if(conditionView.model === condition) {
          conditionView.remove();
          removalRow = conditionView.model.get('row');
          removalIndex = index;
        }

        // We must decrease the row index on all subsequent conditions
        if(removalIndex) {
          if(index === removalIndex + 1) {
            conditionView.model.set('statement', 'else if');
          }
          if(index > removalIndex) {
            conditionView.model.set('row', conditionView.model.get('row') - 1);
          }
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

        this._conditionViews.splice(removalIndex, 1);
      }
    },

    /**
     * Remove condition only. This method only removes the `condition` from
     * the DOM by calling `Backbone.View.prototype.remove`.
     *
     * @return {void}
     * @api private
     */

    _removeSingleCondition: function(condition) {
      var _this = this, removalIndex, removalRow;
      this._conditionViews.forEach(function(conditionView, index) {
        if(conditionView.model === condition) {
          conditionView.remove();
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

        this._conditionViews.splice(removalIndex, 1);
      }
    },

    /**
     * Remove the first condition. When removing the first condition some other logic
     * need to be applied. First condition and the input after it should be removed
     * from DOM. Then depending on if the `else` row is two or not else will be removed
     * or one `else if` statement will be converted to just an if statement.
     *
     * @return {void}
     * @api private
     */

    _removeFirstCondition: function() {
      var elseRow = this.model.get('else').get('row');
      this._conditionViews[0].remove();
      this._conditionViews.splice(0, 1);

      var inputs = this.model.get('inputs').sort()
        , conditions = this.model.get('conditions').sort()
        , removedElements = 1;

      if(!conditions.where({ row : 1 }).length) {
        this._inputViews[0].model.destroy();
        this._inputViews[0].remove();
        this._inputViews.splice(0, 1);
        removedElements++;
      }

      if(elseRow === 2) {
        this._elseView.model.destroy();
        this._elseView.remove();
        this._elseView = null;
        this._inputViews[0].model.set('row', 0);
      }
      else {
        var first = true;
        conditions.forEach(function(condition) {
          condition.set('row', condition.get('row') - removedElements);
          if(first) {
            condition.set('statement', 'if');
            first = false;
          }
        });
        inputs.sort().forEach(function(input) {
          input.set('row', input.get('row') - removedElements);
        });

        var _else = this.model.get('else');
        _else.set('row', _else.get('row') - removedElements);
      }
    },

    /**
     * Remove condition and input. This method should be called when a
     * condition have one input after and one input before it. This method
     * will remove the condition and also remove the input after it.
     *
     * @return {void}
     * @api private
     */

    _removeConditionAndInput: function(condition) {
      var _this = this, conditionRemovalIndex, removalRow;
      this._conditionViews.forEach(function(conditionView, index) {
        if(conditionView.model === condition) {
          conditionView.remove();
          // We remove the view pointer from TranslatioView`
          removalRow = conditionView.model.get('row');
          conditionRemovalIndex = index;
        }

        // We must decrease the row index on all subsequent conditions
        if(conditionRemovalIndex && index > conditionRemovalIndex) {
          conditionView.model.set('row', conditionView.model.get('row') - 2);
        }
      });

      var inputRemovalIndex;
      this._inputViews.forEach(function(inputView, index) {
        var row = inputView.model.get('row');
        if(row == removalRow + 1) {
          inputView.model.destroy();
          inputView.remove();
          inputRemovalIndex = index;
        }
        else if(row > inputRemovalIndex) {
          inputView.model.set('row', row - 2);
        }
      });

      if(this._elseView) {
        this._elseView.model.set('row', this._elseView.model.get('row') - 2);
      }

      this._inputViews.splice(inputRemovalIndex, 1);
      this._conditionViews.splice(conditionRemovalIndex, 1);
    },

    /**
     * Bind condition removal
     *
     * @return {void}
     * @api private
     */

    _bindInputAddition: function() {
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

    _bindInputRemoval: function() {
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

    bindDOM: function() {
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

    _bindMethods: function() {
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

    _addMouseInteractions: function() {
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

    _setElements: function() {
      this.$region = $('[data-region=translation]');
    },

    /**
     * Add condition
     *
     * @delegate
     */

    _addCondition: function(event) {
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
        _.defer(function() {
          new _this.model.Else({ row : 2, parent : _this.model });
          var input = new _this.model.Input({ value : '', row : 3, translation : _this.model});
        });
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

    _save: function(event) {
      event.preventDefault();
      this.model.save();
    },

    /**
     * To HTML
     *
     * @return {void}
     * @api public
     */

    toHTML: function() {
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

    hide: function() {
      this.$region.addClass('hidden');
      this.$region.empty();
    },

    /**
     * Remove
     *
     * @delegate
     */

    show: function() {
      this.$region.removeClass('hidden');
    },

    /**
     * Determine whether to render or not
     *
     * @return {String}
     * @api public
     * @autocalled
     */

    should: function(path) {
      return 'update';
    }
  });
});
