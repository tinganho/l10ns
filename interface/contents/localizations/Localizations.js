
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}
if(inServer) {
  var file = require('../../../libraries/file');
}

define(function(require) {
  var Collection = inServer ? require('../../libraries/Collection') : require('Collection')
    , Localization = require('./Localization')
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
        pageLength: cf.ITEMS_PER_PAGE,
        revealed: true,
        empty: false
      });
    },

    /**
     * Model
     *
     * @type {Translation}
     */

    model: Localization,

    /**
     * We overried default Model sync
     *
     * @overried sync
     */

    sync: function(method, collection, options, request) {
      var _this = this;

      if(method === 'read') {
        if(inServer) {
          collection.reset();
          file.readLocalizations()
            .then(function(localizations) {
              localizations = file.localizationMapToArray(localizations)[request.param('locale')]
                .slice(0, cf.ITEMS_PER_PAGE);

              collection.add(localizations, { merge: true });

              if(/^\/t/.test(request.url)) {
                _this.setMeta('revealed', false);
              }
              else {
                _this.setMeta('revealed', true);
              }
              options.success(collection.toJSON());
            })
            .fail(function(error) {
              console.log(error.stack)
            });

        }
        else {
          var $json = $('.js-json-localizations');
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
      if(/^[a-z]{2}\-[A-Z]{2}\/localizations$/.test(path)) {
        this.setMeta('revealed', true);
        this.setPageTitle('Localizations')
        this.setPageDescription('Latest localizations');
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
        .get('/localizations')
        .query({ page: nextPage, locale: app.locale })
        .end(function(response) {
          try {
            response.body.forEach(function(localization) {
              _this.add(localization);
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
