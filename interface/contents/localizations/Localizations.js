
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
        l10n_pageTitle: 'Latest localizations',

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

    sync: function(method, collection, options, request) {
      var _this = this;

      if(method === 'read') {
        if(inServer) {
          collection.reset();
          file.readLocalizations()
            .then(function(localizations) {
              var locale = request.param('locale')
                , localizationsWithRequestedLocale = file.localizationMapToArray(localizations)[locale].slice(0, cf.ITEMS_PER_PAGE);

              if(locale !== project.defaultLocale) {
                _this.setMeta('l10n_keys', 'Keys | ' + project.defaultLocale);
                var localizationsWithDefaultLocale = file.localizationMapToArray(localizations)[project.defaultLocale];

                for(var index = 0; index < localizationsWithRequestedLocale.length; index++) {
                  localizationsWithRequestedLocale[index].keyText =
                    localizationsWithRequestedLocale[index].key + ' | ' +  localizationsWithDefaultLocale[index].value;
                }
              }
              else {
                _this.setMeta('l10n_keys', 'Keys');
                for(var index = 0; index < localizationsWithRequestedLocale.length; index++) {
                  localizationsWithRequestedLocale[index].keyText = localizationsWithRequestedLocale[index].key;
                }
              }
              collection.add(localizationsWithRequestedLocale, { merge: true });

              if(/^\/t/.test(request.url)) {
                _this.setMeta('revealed', false);
              }
              else {
                _this.setPageTitle(request.param('locale') + ' | ' + _this.getMeta('l10n_pageTitle'));
                _this.setPageDescription('Browse localizations for locale ' + request.param('locale'))
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
            options.success(JSON.parse(_.unescape($json.html())));
            return;
          }
        }
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
