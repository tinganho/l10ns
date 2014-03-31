
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('View')
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
      if(inClient) {
        this._model = model;
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
      this.$region[0].innerHTML = this.template(this._model.toJSON());

      this.$region[0].classList.remove('hidden');

      this.setElement(document.querySelector('[data-content=edit]'));
      this._bind();

      this._model.bindComponents();
    },

    /**
     * Remove
     *
     * @delegate
     */

    remove : function() {
      View.prototype.remove.call(this);
      this.$region[0].classList.add('hidden');
    },

    /**
     * Template
     *
     * @type {Function}
     */

    template : function(json) {
      if(json.values.length === 1) {
        json.valuesHtml = template.input({ value : json.values[0] });
        return template.edit.call(this, json);
      }
      else {
        var values = '';
        for(var i = 0; i<json.values.length; i++) {
          if(json.values[i].length > 2) {
            var y = 0, row = 0;
            while(typeof json.values[i][y] !== 'undefined') {
              var condition = {
                statement : json.values[i][y],
                firstOperand : json.values[i][y + 1],
                operator : json.values[i][y + 2],
                lastOperand : json.values[i][y + 3],
                vars : json.vars,
                operators : cf.OPERATORS,
                additionalCompairOperators : cf.ADDITIONAL_COMPAIR_OPERATORS,
                row : row
              };

              console.log(json.vars);
              row++;

              if(json.values[i][y + 4] === '&&'
              || json.values[i][y + 4] === '||') {
                y += 4;
                continue;
              }
              values += template.condition(condition);
              values += template.input({ value : json.values[i][y + 4] });
              y += 5;
            }
          }
          else {
            values += template.condition_else();
            values += template.input({ value : json.values[i][1] });
          }
        }

        // reset values to computed template
        json.valuesHtml = values;
        return template.edit.call(this, json);
      }
    }
  });
});
