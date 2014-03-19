
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('View')
    , template = inServer ? content_appTmpls : require('contentTmpls')
    , _ = require('underscore');

  return View.extend({

    /**
     * Initializer.
     *
     * @return {void}
     * @api public
     */

    initialize : function(model) {
      if(inClient) {
        this._model = model;
        this
          ._bindElements()
          ._addDesktopListeners();
      }
    },

    /**
     * Bind elements.
     *
     * @return {this}
     * @api private
     */

    _bindElements : function() {
      _.bindAll(this, '_showTranslation');

      return this;
    },

    /**
     * Add desktop listeners.
     *
     * @return {this}
     * @api private
     */

    _addDesktopListeners : function() {
      this.$el.on('click', '.translation', this._showTranslation);
      this._model.on('metachange', this._updateMeta, this);

      return this;
    },

    /**
     * Update meta.
     *
     * @return {void}
     * @api private
     */

    _updateMeta : function() {
      if(this._model.getMeta('revealed')) {
        this.$el.removeClass('invisible');
      }
      else {
        this.$el.addClass('invisible');
      }
    },

    /**
     * Add desktop listeners.
     *
     * @return {void}
     * @api private
     */

    _showTranslation : function(event) {
      var id = event.currentTarget.getAttribute('data-id');
      app.navigate('/t/' + id);
    },

    /**
     * Template.
     *
     * @type {Function}
     */

    template : template.translations,

    /**
     * Translations.
     */

    el : '.translations'
  });
});
