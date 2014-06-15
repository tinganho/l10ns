module.exports = function(app) {
  var file = require('../../../libraries/file')
    , _ = require('underscore');

  app.get('/api/:locale/t/:id', function(req, res) {
    var id = req.param('id')
      , locale = req.param('locale')
      , translations = file.readTranslations(locale, { returnType : 'array' })
      , translation = _.findWhere(translations, { id : id })

    res.json(translation);
  });

  app.put('/api/:locale/t/:id', function(req, res) {
    var id = req.param('id')
      , locale = req.param('locale')
      , translations = file.readTranslations(locale, { returnType : 'array' })
      , translation = req.body;

    translations = translations.map(function(_translation) {
      if(_translation.id === id) {
        return translation;
      }
      else {
        return _translation;
      }
    });

    file.writeSingleLocaleTranslations(translations, locale, function() {
      res.json(translation);
    });
  });
};
