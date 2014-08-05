
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
      return template['Home']({ title: 'Home' });
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
      this.setElement('.home');
    },

    /**
     * Add mouse interactions
     *
     * @return {void}
     * @api private
     */

    _addMouseInteractions: function() {
      this.$el.on('click', this._navigateHome);
    },

    /**
     * Navigate home
     *
     * @return {void}
     * @api private
     */

    _navigateHome: function() {
      app.navigate('/' + app.locale + '/localizations');
    }
  });
});
