
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
      this._model = model;
      if(inClient) {
        this._bindMethods();
      }
    },

    /**
     * Set elements
     *
     * @return {void}
     * @api public
     */

    _setElements : function() {
      this.$region = $('[data-region=body]');
    },

    /**
     * Bind elements.
     *
     * @return {void}
     * @api private
     */

    _bindMethods : function() {
      _.bindAll(this,
        '_showTranslation',
        '_updateMeta'
      );
    },

    /**
     * Bind DOM
     *
     * @return {void}
     * @api public
     */

    bindDOM : function() {
      this._setElements();
      this._addMouseInteractions();
      this.boundDOM = true;
    },

    /**
     * Add desktop listeners.
     *
     * @return {this}
     * @api private
     */

    _addMouseInteractions: function() {
      this.$el.on('click', '.translation', this._showTranslation);
      this._model.on('metachange', this._updateMeta, this);
    },

    /**
     * Update meta.
     *
     * @return {void}
     * @api private
     */

    _updateMeta : function() {
      if(this._model.getMeta('revealed')) {
        this.$region.removeClass('hidden');
      }
      else {
        this.$region.addClass('hidden');
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
     * Render view
     *
     * @return {void}
     * @api public
     */

    render : function() {
      return this.template(this._model.toJSON());
    },

    /**
     * Template.
     *
     * @type {Function}
     */

    template : template['Translations']
  });
});
