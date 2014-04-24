
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
      this._model = model;
      this._conditionViews = [];
      this._inputViews = [];
      if(inClient) {
        this.setElement(document.querySelector('[data-content=edit]'));
        this._setElements();
        this._bind();
      }
    },

    /**
     * Bind view
     *
     * @return {void}
     * @api private
     */

    _bind : function() {
      this._bindMethods();
      if(!has.touch) {
        this._addDesktopListeners();
      }
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

    _addDesktopListeners : function() {
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
      this.$region = $('[data-region=edit]');
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
        , json = this._model.toJSON()
        , conditions = this._model.get('conditions')
        , inputs = this._model.get('inputs');

      conditions.forEach(function(condition) {
        var view = new ConditionView(condition);
        _this._conditionViews.push(view);
        values[condition.get('row')] = view.render();
      });

      inputs.forEach(function(input, index) {
        var view = new InputView(input);
        _this._inputViews.push(view);
        var html = '';
        if(index === inputs.length - 1) {
          html += template['ConditionElse']();
        }
        values[input.get('row')] = html + view.render();
      });

      json.values = values.join('');

      html += template['Edit'](json);

      if(inClient) {
        this.$region[0].classList.remove('hidden');
        this.setElement(document.querySelector('[data-content=edit]'));
      }
      else {
        return html;
      }
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
