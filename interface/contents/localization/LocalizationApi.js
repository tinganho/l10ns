module.exports = function(app) {
  var file = require('../../../libraries/file')
    , _ = require('underscore');

  app.get('/api/:locale/l/:id', function(request, response) {
    file.readLocalizations()
      .then(function(localizations) {
        localizations = file.localizationMapToArray(localizations)[request.param('locale')];
        var localization = _.findWhere(localizations, { id : request.param('id') });
        response.json(localization);
      })
      .fail(function(error) {
        response.send(500);
      });
  });

  app.put('/api/:locale/l/:id', function(request, response) {
    var id = request.param('id')
      , locale = request.param('locale');

    file.readLocalizations()
      .then(function(localizations) {
        localizations = file.localizationMapToArray(localizations);
        localizations[locale] = localizations[locale].map(function(localization) {
          if(localization.id === id) {
            return request.body;
          }
          else {
            return localization;
          }
        });

        file.writeLocalization(localizations, locale)
          .then(function() {
            response.json(request.body);
          })
          .fail(function(error) {
            console.log(error.stack);
            response.send(500);
          });
      })
      .fail(function(error) {
        console.log(error.stack);
        response.send(500);
      });
  });
};
