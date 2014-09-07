module.exports = function(app) {
  var file = require('../../../libraries/file')
    , _ = require('underscore')
    , MessageFormat = require('../../../libraries/MessageFormat');

  app.get('/api/:locale/l/:id', function(request, response) {
    file.readLocalizations()
      .then(function(localizations) {
        var locale = request.param('locale');
        localizations = file.localizationMapToArray(localizations)[locale];
        var localization = _.findWhere(localizations, { id : request.param('id') });
        var messageFormat = new MessageFormat(locale);
        localization.pluralRules = messageFormat.pluralRules;
        localization.ordinalRules = messageFormat.ordinalRules;
        response.json(localization);
      })
      .fail(function(error) {
        response.send(500);
      });
  });

  app.put('/api/:locale/l/:id', function(request, response) {
    var id = request.param('id')
      , locale = request.param('locale');

    try {
      var messageFormat = new MessageFormat(request.param('locale'));
      messageFormat.parse(request.body.value);
    }
    catch(error) {
      response.send(400, error.message);
      return;
    }

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
