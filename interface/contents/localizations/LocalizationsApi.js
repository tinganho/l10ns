
var file = require('../../../libraries/file');

module.exports = function(app) {
  app.get('/localizations', function(request, response) {
    var page = request.param('page');
    file.readLocalizations()
      .then(function(localizations) {
        localizations = file.localizationMapToArray(localizations)[request.param('locale')]
          .slice(page * cf.ITEMS_PER_PAGE, (parseInt(page, 10) + 1) * cf.ITEMS_PER_PAGE);

        response.json(localizations);
      })
      .fail(function(error) {
        response.error();
      });
  });
};
