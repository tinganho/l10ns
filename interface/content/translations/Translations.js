
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}
if(inServer) {
  var file = require('../../../libraries/file');
}

define(function(require) {
  var Collection = inServer ? require('../../libraries/Collection') : require('Collection')
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
          collection.reset();
          var translations = file.readTranslations(pcf.DEFAULT_LOCALE_CODE, { returnType : 'array' }).slice(0, cf.TRANSLATION_ITEMS_PER_PAGE);
          collection.add(translations, { merge: true });

          if(/^\/t/.test(req.url)) {
            this.setMeta('revealed', false);
          }
          else {
            this.setMeta('revealed', true);
          }
          opts.success(collection.toJSON());
        }
        else {
          var $json = $('.js-json-translations');
          if($json.length) {
            this.add(JSON.parse($json.html()));
            $json.remove();
            opts.success();
            return;
          }
          request
            .get('/translations')
            .end(function(err, data) {
            })
        }
      }
    },

    /**
     * On history push to `/`. We want to change the `revealed` property
     * to true.
     *
     * @delegate
     */

    onHistoryChange : function(path) {
      if(/^[a-z]{2}\-[A-Z]{2}\/translations$/.test(path)) {
        this.setMeta('revealed', true);
        this.setPageTitle('Translations')
        this.setPageDescription('Latest translations');
      }
      else {
        this.setMeta('revealed', false);
      }
    }
  });
});
