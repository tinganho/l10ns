
var file = require('../../../libraries/file');

module.exports = function(app) {
  app.get('/localizations', function(request, response) {
    var page = request.param('page');
    file.readLocalizations()
      .then(function(localizations) {
        var locale = request.param('locale')
          , localizationsWithRequestedLocale = file.localizationMapToArray(localizations)[locale]
              .slice(page * cf.ITEMS_PER_PAGE, (parseInt(page, 10) + 1) * cf.ITEMS_PER_PAGE);

        if(locale !== project.defaultLanguage) {
          var localizationsWithDefaultLocale = file.localizationMapToArray(localizations)[project.defaultLanguage]
                .slice(page * cf.ITEMS_PER_PAGE, (parseInt(page, 10) + 1) * cf.ITEMS_PER_PAGE);

          for(var index = 0; index < localizationsWithRequestedLocale.length; index++) {
            localizationsWithRequestedLocale[index].keyText =
              localizationsWithRequestedLocale[index].key + ' | ' +  localizationsWithDefaultLocale[index].value;
          }
        }
        else {
          for(var index = 0; index < localizationsWithRequestedLocale.length; index++) {
            localizationsWithRequestedLocale[index].keyText = localizationsWithRequestedLocale[index].key;
          }
        }

        response.json(localizationsWithRequestedLocale);
      })
      .fail(function(error) {
        response.error();
      });
  });
};
