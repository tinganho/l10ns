
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Backbone;

  if(inClient) {
    Backbone = require('backbone');
  }
  else if(inServer) {
    Backbone = require('backbone-relational');
    Backbone.Relational.store.checkId = function(model, id) {};
  }

  /**
   * We alias the `Backbone.Collection` to just `Collection`. Because
   * we wan't to generalize the constructor name.
   *
   * @constructor Collection
   */

  var Constructor = Backbone.Collection.extend({

    /**
     * Set meta property.
     *
     * @param {String} prop
     * @param {*} value
     * @return {this}
     * @api public
     */

    setMeta : function(prop, value) {
      var eventName = '';
      if(typeof this.metas[prop] === 'undefined') {
        eventName = 'metaadd';
      }
      else {
        eventName = 'metachange';
      }
      this.metas[prop] = value;
      this.trigger(eventName);

      return this;
    },

    /**
     * Get meta property.
     *
     * @param {String} prop
     * @return {*}
     * @api public
     */

    getMeta : function(prop) {
      return this.metas[prop];
    },

    /**
     * Set page title
     *
     * @param {String} title
     * @return {this}
     * @api public
     */

    setPageTitle : function(title) {
      if(inServer) {
        this.page.title = title;
      }
      else {
        app.document.set('title', title);
      }

      return this;
    },

    /**
     * Set page description
     *
     * @param {String} description
     * @return {this}
     * @api public
     */

    setPageDescription : function(description) {
      if(inServer) {
        this.page.description = description;
      }
      else {
        app.document.set('description', description);
      }
    },

    /**
     * In order to provide the views with the meta data. We need to set it
     * on toJSON method.
     *
     * @override toJSON
     */

    toJSON : function() {
      var json = Backbone.Collection.prototype.toJSON.call(this);
      json.metas = this.metas;
      return json;
    },

    /**
     * CompositeRouter is always executing this callback if it doesn't
     * render the view for this model.
     *
     * @param {String} path
     * @return {void}
     * @api public
     */

    onHistoryChange : function(path) {}
  });

  /**
   * Meta properties
   *
   * @type {Object}
   * @api private
   */

  Constructor.prototype.metas = {};

  /**
   * Page properties
   *
   * @type {Object}
   * @api private
   */

  Constructor.prototype.page = {};

  /**
   * Check if model have bootstrapped data from the document
   *
   * @type {Boolean}
   * @api public
   */

  Constructor.prototype.bootstrapped = false;

  /**
   * Export constructor
   */

  return Constructor;
});
