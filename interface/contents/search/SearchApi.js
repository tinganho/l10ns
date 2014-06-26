
var Search = new require('../../../libraries/search');

module.exports = function(app) {
  app.get('/search', function(request, response) {
    var search = new Search();
    search.readTranslations();
    response.json(search.query(request.param('query')).slice(0, 8).map(function(translation) {
      translation.value = pcf.defaultLocale + ': ' + translation.value;
      return translation;
    }));
  });
};
