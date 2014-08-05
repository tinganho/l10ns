
var Search = new require('../../../libraries/search');

module.exports = function(app) {
  app.get('/search', function(request, response) {
    var search = new Search();
    search.readLocalizations()
      .then(function() {
        response.json(search.query(request.param('query')).slice(0, 8).map(function(localization) {
          localization.value = project.defaultLocale + ': ' + localization.value;
          return localization;
        }));
      })
      .fail(function(error) {
        console.log(error.stack);
        response.send(500);
      })

  });
};
