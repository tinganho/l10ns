if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View');
  var template = inServer ? content_appTemplates : require('contentTemplates');
  var _ = require('underscore');
  if(inClient) {
    var request = require('request')
    var NProgress = require('NProgress');
  }


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
      _.bindAll(this, '_navigateHome');
    },

    /**
     * To HTML
     *
     * @return {String}
     * @autocalled Composer
     * @api public
     */

    toHTML: function() {
      return template['LeftMenu']({ homeTitle: 'Home', compileTitle: 'Compile' });
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
      this.$home = $('.left-menu-anchor-home');
      this.$compile = $('.left-menu-anchor-compile');
      this.$localizationRegion = $('[data-region="localization"]');
    },

    /**
     * Add mouse interactions
     *
     * @return {void}
     * @api private
     */

    _addMouseInteractions: function() {
      this.$home.on('click', this._navigateHome);
      this.$compile.on('click', this._compile);
    },

    /**
     * Compile localizations
     *
     * @handler
     * @api private
     */

    _compile: function() {
      NProgress.start();
      request
        .get('/api/compile')
        .send({})
        .end(function(error, response) {
          NProgress.done();
        });
    },

    /**
     * Navigate home
     *
     * @return {void}
     * @api private
     */

    _navigateHome: function() {
      this.$localizationRegion.addClass('is-hidden').removeClass('is-revealed');
      setTimeout(function() {
        app.navigate('/' + app.language + '/localizations');
      }, 300);
    }
  });
});
