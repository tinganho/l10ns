
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
        if(!this._model.bootstrapped) {
          this.setElement(document.querySelector('[data-content=edit]'));
          this._bind();
        }
      }
    },

    /**
     * Bind view
     *
     * @return {void}
     * @api private
     */

    _bind : function() {
      this._setElements();
      this._bindElements();
      if(!has.touch) {
        this._addDesktopListeners();
      }
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _bindElements : function() {
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

    template : template.edit,
  });
});
