
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
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
      if(inClient) {
        this._bindMethods();
      }
    },

    /**
     * Bind view, adds listeners for DOM events and model changes
     *
     * @return {void}
     * @api public
     */

    bindDOM: function() {
      this._setElements();
      this._addMouseInteractions();
    },

    /**
     * Set elements
     *
     * @return {void}
     * @api private
     */

    bindModel: function() {
      this.model.on('change:value', this._onValueChange);
    },

    /**
     * On value change
     *
     * @delegate
     */

    _onValueChange: function() {
      this.$('.checked').removeClass('checked');
      if(this.model.get('vars').indexOf(this.model.get('value')) !== -1) {
        var selector = '.condition-variable-operand[data-value="' + this.model.get('value') + '"]';
        this.el.querySelector(selector).classList.add('checked');
        this.$customVarInput.val('');
      }
      else {
        this.$customVarInput.parent().addClass('checked');
      }

      this.$value.html(this.model.get('value'));
    },

    /**
     * Set elements
     *
     * @return {void}
     * @api private
     */

    _setElements: function() {
      this.$customVarInput = this.$('.js-condition-custom-operand-input');
      this.$value = this.$('.condition-value');
    },

    /**
     * Bind methods
     *
     * @return {void}
     * @api private
     */

    _bindMethods: function() {
      _.bindAll(this,
        'render',
        '_showDropDown',
        '_hideDropDown',
        '_setCustomVar',
        '_selectAllText',
        '_addSelectAllTextHandler',
        '_setOperand',
        '_onValueChange'
      );
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addMouseInteractions: function() {
      this.$el.on('mousedown', this._showDropDown);
      this.$customVarInput.on('keydown', this._setCustomVar);
      this.$customVarInput.on('blur', this._addSelectAllTextHandler);
    },

    /**
     * Set variable as operand
     *
     * @delegate
     */

    _setOperand: function(event) {
      this.model.set('value', event.currentTarget.getAttribute('data-value'));
      this._hideDropDown();
    },

    /**
     * Adds select all text handler. The select all text handler is always
     * removed after one have clicked the input. On blur we want add
     * `_selectAllText` handler again.
     *
     * @delegate
     */

    _addSelectAllTextHandler: function() {
      this.$customVarInput.on('mouseup', this._selectAllText);
    },

    /**
     * Show dropdown
     *
     * @delegate
     */

    _showDropDown: function(event) {
      var _this = this;

      this.el.classList.add('active');
      if(!has.touch) {
        _.defer(function() {
          _this.$el.off('mousedown', _this._showDropDown);
          _this.$el.on('mousedown', '.condition-variable-operand', _this._setOperand);
          _this.$customVarInput.on('mouseup', _this._selectAllText);
          app.$document.on('mousedown', _this._hideDropDown);
        });
      }
    },

    /**
     * Show dropdown
     *
     * @delegate
     */

    _hideDropDown: function(event) {
      if(typeof event !== 'undefined') {
        var $parent = $(event.target).parents('.condition-operand');
        if($parent.length > 0 && $parent[0] === this.$el[0]) {
          return;
        }
      }

      var _this = this;

      this.el.classList.remove('active');
      if(!has.touch) {
        _.defer(function() {
          _this.$el.on('mousedown', _this._showDropDown);
          _this.$el.off('mousedown', '.condition-variable-operand', _this._setOperand);
          app.$document.off('mousedown', _this._hideDropDown);
        });
      }
    },

    /**
     * Set custom var
     *
     * @delegate
     */

    _setCustomVar: function(event) {
      if(event.keyCode === 13) {
        this.model.set('value', this.$customVarInput.val());
        this._hideDropDown();
        event.preventDefault();
      }
    },

    /**
     * Select all text
     *
     * @delegate
     */

    _selectAllText: function(event) {
      var _this = this;

      this.$customVarInput.select();
      event.preventDefault();
      _.defer(function() {
        _this.$customVarInput.off('mouseup', _this._selectAllText);
      });
    },

    /**
     * Render
     *
     * @return {void}
     * @api public
     */

    toHTML: function() {
      return template['ConditionOperand'](this.model.toJSON());
    }
  });
});
