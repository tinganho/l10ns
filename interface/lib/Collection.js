
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Backbone = require('backbone');

  /**
   * We alias the `Backbone.Collection` to just `Collection`. Because
   * we wan't to generalize the constructor name.
   *
   * @constructor Collection
   */

  var Constructor = Backbone.Collection.extend({

    /**
     * Get property
     *
     * @param {String} prop
     * @param {*} value
     * @return {void}
     * @api public
     */

    put : function(prop, value) {
      this.metas[prop] = value;
    },

    /**
     * Get property
     *
     * @param {String} prop
     * @return {*}
     * @api public
     */

    get : function(prop) {
      return this.metas[prop];
    },

    /**
     * Set page title
     *
     * @param {String} title
     * @return {void}
     * @api public
     */

    setPageTitle : function(title) {
      this.page.title = title;
    },

    /**
     * Set page description
     *
     * @param {String} description
     * @return {void}
     * @api public
     */

    setPageDescription : function(description) {
      this.page.description = description;
    },

    toJSON : function() {
      var json = Backbone.Collection.prototype.toJSON.call(this);
      json.metas = this.metas;
      return json;
    }
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
   */

  Constructor.prototype.page = {};

  return Constructor;
});
