
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
    , template = inServer ? content_appTemplates : require('contentTemplates')
    , _ = require('underscore');

  return View.extend({

    /**
     * Initializer.
     *
     * @return {void}
     * @api public
     */

    constructor: function(model) {
      this.model = model;
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

    _setElements: function() {
      this.$region = $('[data-region=body]');
      this.$loadMore = $('.translations-load');
    },

    /**
     * Bind elements.
     *
     * @return {void}
     * @api private
     */

    _bindMethods: function() {
      _.bindAll(this,
        '_showTranslation',
        '_updateMeta',
        '_nextPage'
      );
    },

    /**
     * Bind model
     *
     * @return {void}
     * @api public
     */

    bindModel: function() {
      var _this = this;

      this.model.on('change', function(translation) {
        _this.$('.translation[data-id="kz7LRLLMtax"] .translation-value').html(translation.get('text'));
      });

      this.model.on('add', function(translation) {
        _this.$loadMore.before(template['TranslationItem'](translation.toJSON()));
      });

      this.model.on('meta:change:empty', function() {
        _this.$loadMore.remove();
      });
    },

    /**
     * Bind DOM
     *
     * @return {void}
     * @api public
     */

    bindDOM: function() {
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
      this.$el.on('click', '.translation-load-anchor', this._nextPage);
      this.model.on('meta:change:revealed', this._updateMeta, this);
    },

    /**
     * Update meta.
     *
     * @return {void}
     * @api private
     */

    _updateMeta : function() {
      if(this.model.getMeta('revealed')) {
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

    _showTranslation: function(event) {
      var id = event.currentTarget.getAttribute('data-id')
        , key = encodeURI(event.currentTarget.getAttribute('data-key').replace(/\s/g, '-'));

      app.navigate('/' + app.locale + '/t/' + id + '/' + key);
    },

    /**
     * Show next page
     *
     * @return {void}
     * @api private
     */

    _nextPage: function() {
      this.model.fetchNextPage();
    },

    /**
     * Render view
     *
     * @return {void}
     * @api public
     */

    toHTML: function() {
      return this.template(this.model.toJSON());
    },

    /**
     * Template.
     *
     * @type {Function}
     */

    template : template['Translations']
  });
});
