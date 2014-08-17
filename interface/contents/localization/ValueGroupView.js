
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
      this.conditionViews = [];
      this.inputViews = null;
      this.elseView = null;
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
        '_renderGrip',
        '_renderElse',
        '_renderConditionAddition',
        '_renderConditionRemoval',
        '_renderMoving',
        '_letShadowFollowMouse',
        '_setNewValueGroupOrder');
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
      this.listenTo(this.model, 'change:movable', this._renderGrip);
      this.listenTo(this.model, 'change:else', this._renderElse);
      this.listenTo(this.model, 'add:conditions', this._renderConditionAddition);
      this.listenTo(this.model, 'remove:conditions', this._renderConditionRemoval);
      this.conditionViews.forEach(function(conditionView) {
        conditionView.bindModel();
      });
      this.inputView.bindModel();
      if(this.elseView) {
        this.elseView.bindModel();
      }
    },

    /**
     * Render grip
     *
     * @return {void}
     * @handler
     */

    _renderGrip: function() {
      if(this.model.get('movable')) {
        this.$el.addClass('is-movable');
      }
      else {
        this.$el.removeClass('is-movable');
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

      this.conditionViews.splice(condition.get('row'), 0, conditionView);
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
        this.elseView = new ElseView(_else);
        this.$el.prepend(this.elseView.toHTML());
        this.elseView.setElement(this.$el.find('.condition-else'));
        this.elseView.bindDOM();
        this.elseView.bindModel();
      }
      else {
        this.elseView.remove();
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
        , conditionView = this.conditionViews.splice(removalRow, 1)[0];

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
        , conditionView = this.conditionViews.splice(removingCondition.get('row'), 1)[0];

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

      this._setElements();

      this.conditionViews.forEach(function(conditionView) {
        var conditionSelector = '.condition[data-row="' + conditionView.model.get('row') + '"]';
        conditionView.setElement(_this.$el.find(conditionSelector));
        conditionView.bindDOM();
        conditionView.firstOperandView.setElement(_this.$el.find(conditionSelector + ' .condition-first-operand'));
        conditionView.firstOperandView.bindDOM();
        conditionView.lastOperandView.setElement(_this.$el.find(conditionSelector + ' .condition-last-operand'));
        conditionView.lastOperandView.bindDOM();
      });

      var inputSelector = '.input[data-row="' + this.inputView.model.get('row') + '"]';
      this.inputView.setElement(this.$el.find(inputSelector));
      this.inputView.bindDOM();

      if(this.elseView) {
        this.elseView.setElement(this.$el.find('.condition-else'));
      }

      this._addMouseInteractions();
    },

    /**
     * Render value group is moving
     *
     * @return {void}
     * @api private
     * @handler
     */

    _renderMoving: function(event) {
      this.$grip.addClass('is-grabbed');

      var valueGroupOffset = this.$el.offset()
        , width = this.$el.width()
        , height = this.$el.height()
        , scrollTop = this.$window.scrollTop()

      this.$el.before(template['ValueGroupShadow']({
        width: width,
        height: height
      }));
      this.$shadow = this.localizationView.$('.value-group.shadow');

      this.$el
        .css('position', 'fixed')
        .css('top', valueGroupOffset.top - scrollTop)
        .css('left', valueGroupOffset.left)
        .css('z-index', 100)
        .css('width', width)
        .addClass('is-moving')

      var gripOffset = this.$grip.offset();
      this.gripsMousePosition = {
        left: event.pageX - gripOffset.left,
        top: event.pageY - gripOffset.top
      };
      this.valueGroupDimensions = {
        height: height + this._getComputedStyle(this.$el, 'padding-top') + this._getComputedStyle(this.$el, 'padding-bottom'),
        width: width + this._getComputedStyle(this.$el, 'padding-left') + this._getComputedStyle(this.$el, 'padding-right')
      };

      this.$document.on('mousemove', this._letShadowFollowMouse);
      this.$document.on('mouseup', this._setNewValueGroupOrder);
    },

    /**
     * Set new value group order
     *
     * @return {void}
     * @api private
     * @handler
     */

    _setNewValueGroupOrder: function() {
      var _this = this;

      this.$el.attr('style', '').removeClass('is-moving');
      this.$grip.removeClass('is-grabbed');
      this.$shadow.before(_this.$el);
      this.$shadow.remove();
      _.defer(function() {
        _this.$document.off('mousemove', this._letShadowFollowMouse);
        _this.$document.off('mouseup', this._setNewValueGroupOrder);
      });
    },

    /**
     * Let value group follow mouse position
     *
     * @return {void}
     * @api private
     */

    _letShadowFollowMouse: function(event) {
      var left = event.clientX - this.valueGroupDimensions.width - this.gripsMousePosition.left
        , top = event.clientY - this.gripsMousePosition.top;

      this.$el
        .css('left', left)
        .css('top', top)

      this._renderShadowMove(left, top,
        left + this.valueGroupDimensions.width,
        top + this.valueGroupDimensions.height);
    },

    /**
     * Returns the absolute number instead of string for a style property
     *
     * @param {jQuery} $element
     * @param {String} style
     * @return {Number}
     * @api private
     */

    _getComputedStyle: function($element, style) {
      return parseInt($element.css(style).replace('px'), 10);
    },

    /**
     * Render shadow
     *
     * @param {Number} left
     * @param {Number} top
     * @return {void}
     * @api private
     */

    _renderShadowMove: function(left, top, right, bottom) {
      var _this = this
        , elseIndex = this.localizationView.valueGroupViews.length - 1
        , shadowIndex = this.model.get('index')
        , scrollLeft = this.$window.scrollLeft()
        , scrollTop = this.$window.scrollTop()

      this.localizationView.valueGroupViews.some(function(valueGroupView, index) {
        if(index === shadowIndex) {
          return false;
        }

        if(index !== elseIndex) {
          var valueGroupOffset = valueGroupView.$el.offset()
            , fixedLeft = valueGroupOffset.left - scrollLeft
            , fixedTop = valueGroupOffset.top - scrollTop
            , fixedBottom = fixedTop + valueGroupView.$el.height() +
              _this._getComputedStyle(valueGroupView.$el, 'padding-top') +
              _this._getComputedStyle(valueGroupView.$el, 'padding-bottom') +
              _this._getComputedStyle(valueGroupView.$el, 'margin-bottom')
            , inUpperHalf = top >= fixedTop && top <= (fixedTop + fixedBottom) / 2
            , inLowerHalf = top <= fixedBottom && top >= (fixedTop + fixedBottom) / 2
            , firstAndBiggerThanTop = index === 0 && top <= fixedTop
            , lastAndSmallerThanBottom = index === elseIndex - 1 && top >= fixedBottom;

          if(index < shadowIndex
          && (inUpperHalf || firstAndBiggerThanTop)) {
            _this.localizationView.$('.value-group[data-index="' + index + '"]').before(_this.$shadow);
            _this.model.get('localization').get('valueGroups').sort().at(index).set('index', index + 1);
            _this.model.set('index', index);
            var replacingValueGroupView = _this.localizationView.valueGroupViews[index];
            _this.localizationView.valueGroupViews[index] = _this.localizationView.valueGroupViews[shadowIndex];
            _this.localizationView.valueGroupViews[shadowIndex] = replacingValueGroupView;
            return true;
          }
          else if(index > shadowIndex
          && (inLowerHalf || lastAndSmallerThanBottom)) {
            _this.localizationView.$('.value-group[data-index="' + index + '"]').after(_this.$shadow);
            _this.model.get('localization').get('valueGroups').sort().at(index).set('index', index - 1);
            _this.model.set('index', index);
            var replacingValueGroupView = _this.localizationView.valueGroupViews[index];
            _this.localizationView.valueGroupViews[index] = _this.localizationView.valueGroupViews[shadowIndex];
            _this.localizationView.valueGroupViews[shadowIndex] = replacingValueGroupView;
            return true;
          }
        }

        return false;
      });
    },

    /**
     * Add mouse interactions
     *
     * @return {void}
     * @api private
     */

    _addMouseInteractions: function() {
      this.$grip.on('mousedown', this._renderMoving);
    },

    /**
     * Set elements
     *
     * @return {void}
     * @api private
     */

    _setElements: function() {
      this.$grip = this.$('.value-group-grip');
      this.$window = $(window);
      this.$document = $(document);
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

      this.inputView = new InputView(input);
      html[input.get('row')] = this.inputView.toHTML();

      this.model.get('conditions').forEach(function(condition) {
        var conditionView = new ConditionView(condition);
        html[condition.get('row')] = conditionView.toHTML();
        _this.conditionViews.push(conditionView);
      });

      var _else = this.model.get('else');
      if(_else) {
        this.elseView = new ElseView(_else);
        html[0] = this.elseView.toHTML();
      }

      return template['ValueGroup']({
        index: this.model.get('index'),
        values: html.join(''),
        movable: this.model.get('movable')
      });
    }
  });
});
