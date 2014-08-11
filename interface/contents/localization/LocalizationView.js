
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
    , ConditionView = require('./ConditionView')
    , InputView = require('./InputView')
    , ElseView = require('./ElseView')
    , template = inServer ? content_appTemplates : require('contentTemplates')
    , _ = require('underscore')
    , ValueGroup = require('./ValueGroup')
    , ValueGroupView = require('./ValueGroupView')
    , Else = ValueGroup.prototype.Else
    , Input = ValueGroup.prototype.Input
    , Condition = ValueGroup.prototype.Condition;

  if(inClient) {
    var minTimer = require('minTimer');
  }

  return View.extend({

    /**
     * Initializer
     *
     * @return {void}
     * @api public
     */

    initialize: function(model) {
      this.model = model;
      this._valueGroupViews = [];
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
      this.listenTo(this.model, 'add:valueGroups', this._renderValueGroupAddition);
      this.listenTo(this.model, 'remove:valueGroups', this._renderValueGroupRemoval);
      this._valueGroupViews.forEach(function(valueGroupView) {
        valueGroupView.bindModel();
      });
    },

    /**
     * Bind view
     *
     * @return {void}
     * @api private
     */

    bindDOM: function() {
      this._valueGroupViews.forEach(function(valueGroupView) {
        valueGroupView.setElement('[data-index="' + valueGroupView.model.get('index') + '"]');
        valueGroupView.bindDOM();
      });

      this._setElements();
      this._addMouseInteractions();
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
        '_save',
        '_renderValueGroupAddition',
        '_renderValueGroupRemoval'
      );
    },

    /**
     * Render value group addition
     *
     * @param {ValueGroup} valueGroup
     * @return {void}
     * @api private
     */

    _renderValueGroupAddition: function(valueGroup) {
      var index = valueGroup.get('index')
        , valueGroupView = new ValueGroupView(valueGroup);

      this.$values.prepend(valueGroupView.toHTML());
      valueGroupView.setElement('.value-group[data-index="' + index + '"]');
      valueGroupView.bindDOM();
      valueGroupView.bindModel();
      this._valueGroupViews.unshift(valueGroupView);
    },

    /**
     * Render value group removal
     *
     * @param {ValueGroup} valueGroup
     * @return {void}
     * @api private
     */

    _renderValueGroupRemoval: function(valueGroup) {
      var index = valueGroup.get('index');
      var valueGroupView = this._valueGroupViews.splice(index, 1)[0];
      valueGroupView.remove();
      this.model.get('valueGroups').forEach(function(valueGroup) {
        if(valueGroup.get('index') > index) {
          valueGroup.set('index', valueGroup.get('index') - 1);
        }
      });
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
      this.$region = $('[data-region=localization]');
      this.$saveButton = $('.save');
      this.$saveSpinner = $('.save-spinner');
      this.$saveButtonContainer = $('.save-button-container');
      this.$values = this.$('.localization-values');
    },

    /**
     * Add condition
     *
     * @delegate
     */

    _addCondition: function(event) {
      var _this = this
        , index = this.model.get('valueGroups').length
        , firstValueGroup = this.model.get('valueGroups').where({ index: 0 })[0];

      this.model.get('valueGroups').forEach(function(valueGroup) {
        valueGroup.set('index', valueGroup.get('index') + 1);
      });

      event.preventDefault();

      var condition = new Condition({
        statement: 'if',
        firstOperand: 'value1',
        operator: '==',
        lastOperand: 'value2',
        vars: this.model.get('vars'),
        operators: cf.OPERATORS,
        additionalCompairOperators: cf.ADDITIONAL_COMPAIR_OPERATORS,
        row: 0
      });

      var input = new Input({ value: '', row: 1 });

      var newValueGroup = new ValueGroup({
        localization: this.model,
        index: 0,
        input: input
      });

      condition.set('valueGroup', newValueGroup);
      input.set('valueGroup', newValueGroup);

      if(index === 1) {
        new Else({ row: 0, valueGroup: firstValueGroup });
        firstValueGroup.get('input').set('row', 1);
      }
    },

    /**
     * Save
     *
     * @delegate
     */

    _save: function(event) {
      var _this = this;

      event.preventDefault();
      this.$saveSpinner.show();
      this.$saveButtonContainer.removeClass('is-waiting').addClass('is-loading');
      minTimer.start(1000);
      this.model.save(null, {
        success: function(model, response, options) {
          minTimer.end(function() {
            _this.$saveButtonContainer.removeClass('is-loading').addClass('is-waiting');
            setTimeout(function() {
              _this.$saveSpinner.hide();
            }, 300);
          });
        },
        error: function() {
          minTimer.end(function() {
            _this.$saveButtonContainer.removeClass('is-loading').addClass('is-waiting');
            setTimeout(function() {
              _this.$saveSpinner.hide();
              alert('Couldn\'t save your localization, please try again later.');
            }, 300);
          });
        }
      });
    },

    /**
     * To HTML
     *
     * @return {void}
     * @api public
     */

    toHTML: function() {
      var _this = this
        , html = '', values = ''
        , json = this.model.toJSON()
        , valueGroups = this.model.get('valueGroups');

      valueGroups.forEach(function(valueGroup) {
        var valueGroupView = new ValueGroupView(valueGroup);
        values += valueGroupView.toHTML();
        if(inClient) {
          _this._valueGroupViews.push(valueGroupView);
        }
      });

      json.values = values;

      html += template['Localization'](json);

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
