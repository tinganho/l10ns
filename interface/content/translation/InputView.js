
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
      this.model = model;
      if(inClient) {
        this._bindMethods();
      }
    },

    /**
     * Bind DOM
     *
     * @return {void}
     * @api public
     */

    bindDOM : function() {
      this._addMouseInteractions();
    },

    /**
     * Bind methods
     *
     * @return {void}
     * @api public
     */

    _bindMethods : function() {
      _.bindAll(this,
        'render',
        '_setValue',
        '_addSelectAllTextHandler',
        '_selectAllText'
      );
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addMouseInteractions : function() {
      this._addSelectAllTextHandler();
      this.$el.on('blur', this._addSelectAllTextHandler);
      this.$el.on('keyup', this._setValue);
    },

    /**
     * Adds select all text handler. The select all text handler is always
     * removed after one have clicked the input. On blur we want add
     * `_selectAllText` handler again.
     *
     * @delegate
     */

    _addSelectAllTextHandler : function() {
      this.$el.on('mouseup', this._selectAllText);
    },

    /**
     * Select all text
     *
     * @delegate
     */

    _selectAllText : function(event) {
      var _this = this;

      this.$el.select();
      event.preventDefault();
      _.defer(function() {
        _this.$el.off('mouseup', _this._selectAllText);
      });
    },

    /**
     * Set value on model
     *
     * @delegate
     */

    _setValue : function() {
      this.model.set('value', this.$el.val());
    },

    /**
     * Render view
     *
     * @return {void}
     * @api public
     */

    render : function() {
      return this.template(this.model.toJSON());
    },

    /**
     * Template
     *
     * @type {String}
     */

    template : template['Input']
  });
});
