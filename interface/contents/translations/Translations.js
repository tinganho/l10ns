
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}
if(inServer) {
  var file = require('../../../libraries/file');
}

define(function(require) {
  var Collection = inServer ? require('../../libraries/Collection') : require('Collection')
    , Translation = require('./Translation')
    , _ = require('underscore');

  if(inClient) {
    var request = require('request');
  }

  return Collection.extend({

    /**
     * Initializer
     *
     * @api public
     */

    initialize: function() {
      this.metas = _.defaults(this.metas, {
        l10n_keys: 'Keys',
        l10n_values: 'Values',
        l10n_loadMore: 'Load more',

        page: 0,
        pageLength: cf.TRANSLATION_ITEMS_PER_PAGE,
        revealed: true,
        empty: false
      });
    },

    /**
     * Model
     *
     * @type {Translation}
     */

    model: Translation,

    /**
     * We overried default Model sync
     *
     * @overried sync
     */

    sync: function(method, collection, options, request) {
      if(method === 'read') {
        if(inServer) {
          collection.reset();
          var translations = file.readTranslations(request.param('locale'), { returnType : 'array' }).slice(0, cf.TRANSLATION_ITEMS_PER_PAGE);
          collection.add(translations, { merge: true });

          if(/^\/t/.test(request.url)) {
            this.setMeta('revealed', false);
          }
          else {
            this.setMeta('revealed', true);
          }
          options.success(collection.toJSON());
        }
        else {
          var $json = $('.js-json-translations');
          if($json.length) {
            $json.remove();
            options.success(JSON.parse($json.html()));
            return;
          }
        }
      }
    },

    /**
     * On history push to `/`. We want to change the `revealed` property
     * to true.
     *
     * @delegate
     */

    onHistoryChange: function(path) {
      if(/^[a-z]{2}\-[A-Z]{2}\/translations$/.test(path)) {
        this.setMeta('revealed', true);
        this.setPageTitle('Translations')
        this.setPageDescription('Latest translations');
      }
      else {
        this.setMeta('revealed', false);
      }
    },

    /**
     * Get the next page
     *
     * @return {void}
     * @api public
     */

    fetchNextPage: function() {
      var _this = this, nextPage = this.getMeta('page') + 1;

      request
        .get('/translations')
        .query({ page: nextPage, locale: app.locale })
        .end(function(response) {
          try {
            response.body.forEach(function(translation) {
              _this.add(translation);
            });

            if(response.body.length < 20) {
              _this.setMeta('empty', true);
            }

            _this.setMeta('page', nextPage);
          }
          catch(error) {

          }
        });
    }
  });
});
