
var file = require('../../../libraries/file');

module.exports = function(app) {
  app.get('/translations', function(request, response) {
    var page = request.param('page');
    var translations = file.readTranslations(request.param('locale'), { returnType: 'array' })
      .slice(page * cf.TRANSLATION_ITEMS_PER_PAGE, (parseInt(page, 10) + 1) * cf.TRANSLATION_ITEMS_PER_PAGE);

    response.json(translations);
  });
};
