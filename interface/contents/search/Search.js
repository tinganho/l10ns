
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../libraries/Model') : require('Model');

  if(inClient) {
    var request = require('superagent');
  }

  return Model.extend({

    /**
     * Default values
     *
     * @type {Object}
     */

    defaults : {
      resultIndex: 0,
      value: null,

      i18n_placeholder: 'Search'
    },

    /**
     * Search
     *
     * @param {String} query
     * @return {$.Deferred}
     * @api public
     */

    search: function(query) {
      var _this = this, deferred = $.Deferred();

      request
        .get('/search')
        .query({ query: query })
        .end(function(response) {
          if(response.status >= 200 && response.status < 300 || response.status === 304) {
            var translations = response.body;
            _this.set('results', translations);
            _this.set('resultIndex', 0);
            deferred.resolve(translations);
          }
          else {
            deferred.reject(response.body);
          }
        });

      return deferred;
    }
  });
});
