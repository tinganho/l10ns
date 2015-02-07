
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

    initialize: function(model) {
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
      this.$loadMore = $('.localization-load');
      this.$htmlEscape = $('.__htmlEscape__');
    },

    /**
     * Bind elements.
     *
     * @return {void}
     * @api private
     */

    _bindMethods: function() {
      _.bindAll(this,
        '_showLocalization',
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

      this.model.on('change', function(localization) {
        _this.$('.localization[data-id="' + localization.id + '"] .localization-value').html(_this.$htmlEscape.text(localization.get('value')).html());
      });

      this.model.on('add', function(localization) {
        _this.$loadMore.before(template['LocalizationItem'](localization.toJSON()));
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
      this._addDesktopInteractions();
      this.boundDOM = true;
    },

    /**
     * Add desktop listeners.
     *
     * @return {this}
     * @api private
     */

    _addDesktopInteractions: function() {
      this.$el.on('click', '.localization', this._showLocalization);
      this.$el.on('click', '.localization-load-anchor', this._nextPage);
    },

    /**
     * Add desktop listeners.
     *
     * @return {void}
     * @api private
     */

    _showLocalization: function(event) {
      var _this = this;
      var id = event.currentTarget.getAttribute('data-id')
        , key = encodeURI(event.currentTarget.getAttribute('data-key').replace(/\s/g, '-'));

      this.$region.removeClass('is-revealed').addClass('is-hidden');
      setTimeout(function() {
        _this.$region.hide();
        app.navigate('/' + app.locale + '/l/' + id + '/' + key);
      }, 400);
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
      return template['Localizations'](this.model.toJSON());
    },

    /**
     * Determine whether to render or not
     *
     * @return {String}
     * @api public
     * @autocalled
     */

    should: function(path) {
      if(path === ':locale/localizations') {
        return 'keep';
      }
      else {
        return 'remove'
      }
    },

    /**
     * Hide the view
     *
     * @return {void}
     * @api public
     * @autocalled
     */

    hide: function() {
      var _this = this;

      this.$region.removeClass('is-revealed').addClass('is-hidden');
      setTimeout(function() {
        _this.$region.hide();
      }, 400);
    },


    /**
     * Show the view
     *
     * @return {void}
     * @api public
     * @autocalled
     */

    show: function() {
      var _this = this;

      this.model.setPageTitle(app.locale + ' | ' + this.model.getMeta('l10n_pageTitle'));
      this.$region.show();

      setTimeout(function() {
        _this.$region.removeClass('is-hidden').addClass('is-revealed');
      }, 100);
    }
  });
});
