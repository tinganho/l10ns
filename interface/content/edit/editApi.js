module.exports = function(app) {
  var file = require('../../../lib/file')
    , _ = require('underscore');

  app.get('/translations/:id', function(req, res) {
    var id = req.param('id');
    var locale = req.param('l');
    var translations = file.readTranslations(locale, { returnType : 'array' });
    var translation = _.findWhere(translations, { id : id });
    res.json(translation);
  });
};
