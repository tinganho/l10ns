
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Backbone = require('backbone');

  /**
   * We alias the `Backbone.Model` to just `Model`. Because
   * we wan't to generalize the constructor name.
   *
   * @constructor Model
   */

  var Constructor = Backbone.Model.extend({

    /**
     * Set page title
     *
     * @param {String} title
     * @api public
     */

    setPageTitle : function(title) {
      this.page.title = title;
    },

    /**
     * Set page description
     *
     * @param {String} description
     * @api public
     */

    setPageDescription : function(description) {
      this.page.description = description;
    }
  });

  /**
   * Page properties
   *
   * @type {Object}
   */

  Constructor.prototype.page = {};

  /**
   * Check if model have bootstrapped data from the document
   *
   * @type {Boolean}
   */

  Constructor.prototype.bootstrapped = false;

  /**
   * Export constructor
   */

  return Constructor;
});
