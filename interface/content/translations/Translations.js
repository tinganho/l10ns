


if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Collection = inServer ? require('../../lib/Collection') : require('/lib/Collection')
    , Translation = inServer ? require('./Translation') : require('/lib/Translation')
    , _ = require('underscore');

  if(inServer) {
    var file = require('../../../lib/file');
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
        }
        opts.success(collection.toJSON());
      }
    }
  });
});
