
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('View')
    , template = inServer ? content_appTmpls : require('contentTmpls');

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
        this._bindElements();
        this._addDesktopListeners();
      }
    },

    /**
     * Bind elements
     *
     * @return {void}
     * @api private
     */

    _bindElements : function() {
      _.bindAll(this, '_showTranslation');
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addDesktopListeners : function() {
      this.$el.on('click', '.translation', this._showTranslation);
      this._model.on('metachange', function() {
        if(this._model.get('revealed')) {
          this.$el.addClass('revaled');
          this.$el.removeClass('hidden');
        }
        else {
          this.$el.addClass('hidden');
          this.$el.removeClass('revealed');
        }
      }, this);
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _showTranslation : function(event) {
      var id = event.currentTarget.getAttribute('data-id');
      app.document.on('renderstart', function() {
        app.models.translations.put('revealed', false);
      });
      app.navigate('/t/' + id);

    },

    /**
     * Template
     *
     * @type {Function}
     */

    template : template.translations,

    /**
     * Translations
     */

    el : '.translations'
  });
});
