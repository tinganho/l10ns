
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
    , template = inServer ? content_appTemplates : require('contentTemplates')
    , _ = require('underscore');

  return View.extend({

    /**
     * Constructor
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
     * Bind methods
     *
     * @return {void}
     * @api private
     */

    _bindMethods: function() {
      _.bindAll(this, '_showDropDown', '_hideDropDown');
    },

    /**
     * Render html
     *
     * @return {String}
     * @autocalled
     */

    toHTML: function() {
      return template['Locales']({ currentLocale: this.model.get('locale'), locales: cf.LOCALES });
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
    },

    /**
     * Set elements
     *
     * @return {void}
     * @api private
     */

    _setElements: function() {
      this.setElement('.locales');
      this.$dropdown = this.$('.locales-dropdown');
      this.$button = this.$('.locales-button');
    },

    /**
     * Add mouse interactions
     *
     * @return {void}
     * @api private
     */

    _addMouseInteractions: function() {
      this.$button.on('click', this._showDropDown);
      this.$el.on('click', '.locale', this._changeLocale);
    },

    /**
     * Show dropdown
     *
     * @return {void}
     * @api private
     */

    _showDropDown: function() {
      var _this = this;

      this.$el.addClass('is-active');
      this.$dropdown.css('height', 'auto');
      this.$button.off('click', this._showDropDown);

      _.defer(function() {
        $(document).on('click', _this._hideDropDown);
      });
    },

    /**
     * Hide dropdown
     *
     * @return {void}
     * @api private
     */

    _hideDropDown: function() {
      var _this = this;

      this.$el.removeClass('is-active');

      setTimeout(function() {
        _this.$dropdown.css('height', 'auto');
      }, 200);

      _.defer(function() {
        _this.$button.on('click', _this._showDropDown);
        $(document).off('click', _this._hideDropDown);
      });
    },

    /**
     * Change locale
     *
     * @return {void}
     * @api private
     */

    _changeLocale: function(event) {
      var locale = event.currentTarget.dataset['locale'];
      window.location.pathname = window.location.pathname.replace(/^\/.*?\/(.*)/, '/' + locale + '/$1');
    }
  });
});
