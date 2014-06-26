
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View'): require('View')
    , template = inServer ? content_appTemplates: require('contentTemplates')
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
        this._bindElements();
        this._setElements();
        this._addDesktopInteractions();
        this._bindModel();
      }
    },

    /**
     * Bind elements
     *
     * @return {void}
     * @api private
     */

    _bindElements: function() {
      _.bindAll(this,
        'render',
        '_search',
        '_setActiveResult',
        '_setIndex',
        '_showTranslation',
        '_removeSearchResult',
        '_preventCursorMove');
    },

    /**
     * Set elements
     *
     * @return {void}
     * @api private
     */

    _setElements: function() {
      this.setElement('[data-content=search]')
      this.$input = this.$('.search');
      this.$document = $(document);
    },

    /**
     * Bind model
     *
     * @return {void}
     * @api private
     */

    _bindModel: function() {
      this.model.on('change:resultIndex', this._setActiveResult);
    },

    /**
     * Set active result
     *
     * @return {void}
     * @api private
     * @handler
     */

    _setActiveResult: function() {
      this.$('.search-result.active').removeClass('active');
      this.$('.search-result:eq(' + this.model.get('resultIndex') + ')').addClass('active');
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addDesktopInteractions: function() {
      this.$input.on('keydown', this._preventCursorMove);
      this.$input.on('keyup', this._search);
      this.$input.on('focus', this._search);
      this.$el.on('mouseover', '.search-result', this._setIndex);
      this.$el.on('click', '.search-result', this._showTranslation);
    },

    /**
     * Set resultIndex from mouseover
     *
     * @return {void}
     * @api private
     * @handler
     */

    _setIndex: function(event) {
      var index = event.currentTarget.getAttribute('data-index');
      this.model.set('resultIndex', index);
    },

    /**
     * Show translation
     *
     * @return {void}
     * @api private
     */

    _showTranslation: function() {
      var translation = this.model.get('results')[this.model.get('resultIndex')];

      this.$el.find('.search-results').remove();

      if(typeof app.models.translation !== 'undefined'
      && typeof app.models.translation.id !== 'undefined'
      && app.models.translation.id === translation.id) {
        return;
      }

      Backbone.Relational.store.reset();

      this.$input.blur();

      app.navigate('/' + app.locale + '/t/' + translation.id + '/' + translation.key);
    },

    /**
     * Prevent cursor movement
     *
     * @return {void}
     * @api private
     * @handler
     */

    _preventCursorMove: function() {
      switch(event.keyCode) {
        case 13:
          this._showTranslation();
          return;
        case 38:
          event.preventDefault();
          var resultIndex = this.model.get('resultIndex');
          if(resultIndex - 1 < 0) {
            this.model.set('resultIndex', this.model.get('results').length - 1);
          }
          else {
            this.model.set('resultIndex', resultIndex - 1);
          }
          return;
        case 40:
          event.preventDefault();
          var resultIndex = this.model.get('resultIndex');
          if(resultIndex + 1 > this.model.get('results').length  - 1) {
            this.model.set('resultIndex', 0);
          }
          else {
            this.model.set('resultIndex', resultIndex + 1);
          }
          return;
      }
    },

    /**
     * Search
     *
     * @return {void}
     * @api private
     * @handler
     */

    _search: function(event) {
      var _this = this;

      switch(event.keyCode) {
        case 13:
        case 38:
        case 40:
          event.preventDefault();
          return;
      }

      var query = this.$input.val();
      this.model.search(query)
        .then(function(result) {
          _this._renderSearchResult(result);
        })
        .fail(function(error) {

        });
    },

    /**
     * Render search result
     *
     * @param {Array.<Object>} result
     * @return {void}
     * @api private
     */

    _renderSearchResult: function(result) {
      var _this = this;

      this.$el.find('.search-results').remove();
      if(result.length > 0) {
        this.$el.append(template['SearchResults'](result));
        _.defer(function() {
          _this.$document.on('click', _this._removeSearchResult);
        });
      }
    },

    /**
     * Remove search result
     *
     * @return {void}
     * @api private
     */

    _removeSearchResult: function(event) {
      if($(event.target).parents('.search-results').length === 1
      || $(event.target).hasClass('search')) {
        return;
      }

      this.$el.find('.search-results').remove();
      this.$document.off('click', this._removeSearchResult);
    },

    /**
     * To HTML
     *
     * @return {void}
     * @api public
     */

    toHTML: function() {
      return template['Search'](this.model.toJSON());
    },

    /**
     * Determine whether to render or not
     *
     * @return {String}
     * @api public
     * @autocalled
     */

    should: function() {
      return 'keep';
    }
  });
});
