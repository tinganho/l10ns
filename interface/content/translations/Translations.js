
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}
if(inServer) {
  var file = require('../../../lib/file');
}

define(function(require) {
  var Collection = inServer ? require('../../lib/Collection') : require('Collection')
    , Translation = inServer ? require('./Translation') : require('content/translations/Translation')
    , _ = require('underscore')

  if(inClient) {
    var request = require('request');
  }

  return Collection.extend({

    /**
     * Initializer
     *
     * @api public
     */

    initialize : function() {
      this.metas = _.defaults(this.metas, {
        l10n_keys : 'Keys',
        l10n_values : 'Values',
        revealed : true
      });

      // Parse bootstrapped data
      if(inClient) {
        var $json = $('.js-json-translations');
        this.add(JSON.parse($json.html()));
        this.bootstrapped = true;
        $json.remove();
      }
    },

    /**
     * Model
     *
     * @type {Translation}
     */

    model : Translation,

    /**
     * We overried default Model sync
     *
     * @overried sync
     */

    sync : function(method, collection, opts, req) {
      if(method === 'read') {
        if(inServer) {
          translations = file.readTranslations(cf.DEFAULT_LOCALE, { returnType : 'array' }).slice(0, cf.TRANSLATION_ITEMS_PER_PAGE);
          collection.add(translations);

          if(/^\/t/.test(req.url)) {
            this.put('revealed', false);
          }
          else {
            this.put('revealed', true);
          }
          opts.success(collection.toJSON());
        }
        else {
          request
            .get('/translations')
            .end(function(err, data) {
            })
        }

      }
    }
  });
});
