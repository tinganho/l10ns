var root = '../../../';
var path = require('path');
var Translations = require(path.join(root, 'src/lib/translations'));
var translation = new Translations();
var config = require('../../../src/lib/config');



module.exports = function(server) {

  server.get('/translations', function(req, res) {
    var translations = config.getLatestTranslations(opt, +req.param('skip'), req.param('top'), req.param('locale'));
    res.send(JSON.stringify(translations));
  });

  server.post('/translation', function(req, res) {
    res.send('hej');
  });

  server.put('/translation', function(req, res) {
    translation.update(req.body.key, req.body.value.value, req.body.locale, function() {
      res.send(JSON.stringify({
        meta : {
          code: 200,
          success_message : 'Your new translation was successfully saved'
        }
      }));
    }, function() {
      res.statusCode = 500;
      res.send(JSON.stringify({
        meta : {
          code: 500,
          error_type : 'SaveException',
          error_message : 'There was an error with saving your data. Please chack back later'
        }
      }));
    });
  });
};
