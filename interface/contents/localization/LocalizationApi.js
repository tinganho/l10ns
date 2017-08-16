module.exports = function(app) {
  var file = require('../../../libraries/file')
  var _ = require('underscore')
  var MessageFormat = require('../../../libraries/MessageFormat')
  var defaultMessage = 'Use <a href="http://l10ns.org/docs.html#messageformat" target="_blank">message format</a> to localize your string above. Click on the help buttons on the toolbar to get help on different formats.';

  app.get('/api/:locale/l/:id', function(request, response) {
    file.readLocalizations()
      .then(function(localizations) {
        var locale = request.param('locale');
        var localizationsWithRequestedLocale = file.localizationMapToArray(localizations)[locale];
        var localizationWithRequestedLocale = _.findWhere(localizationsWithRequestedLocale, { id : request.param('id') });
        var localizationLocal = localizations[locale]
        var before = null;
        var after = null
        var stop = false

        for (value in localizationLocal) {
          after = localizationLocal[value];
          if (stop)
            break;
          if (localizationLocal[value]['id'] === localizationWithRequestedLocale['id']) {
            stop = true;
            continue;
          }
          before = localizationLocal[value];
        }

        before = before === localizationWithRequestedLocale ? null : before;
        after = after === localizationWithRequestedLocale ? null : after;

        var messageFormat = new MessageFormat(locale);
        localizationWithRequestedLocale.pluralRules = messageFormat.pluralRules;
        localizationWithRequestedLocale.ordinalRules = messageFormat.ordinalRules;
        if(locale !== project.defaultLanguage) {
          var localizationsWithDefaultLocale = file.localizationMapToArray(localizations)[project.defaultLanguage];
          var localizationWithDefaultLocale = _.findWhere(localizationsWithDefaultLocale, { id : request.param('id') });
          localizationWithRequestedLocale.message = 'In ' + project.defaultLanguage + ': ' + localizationWithDefaultLocale.value;
        }
        else {
          localizationWithRequestedLocale.message = defaultMessage;
        }
        localizationWithRequestedLocale.before = before;
        localizationWithRequestedLocale.after = after;
        response.json(localizationWithRequestedLocale);
      })
      .fail(function(error) {
        response.send(500);
      });
  });

  app.put('/api/:locale/l/:id', function(request, response) {
    var id = request.param('id');
    var locale = request.param('locale');

    try {
      var messageFormat = new MessageFormat(request.param('locale'));
      messageFormat.setVariables(request.body.variables);
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
