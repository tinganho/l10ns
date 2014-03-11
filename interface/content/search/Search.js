
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../lib/Model') : require('lib/Model');

  return Model.extend({

    /**
     * Default values
     *
     * @type {Object}
     */

    defaults : {
      value : null,

      i18n_placeholder : 'Search'
    }
  });
});
