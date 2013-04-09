var Translations = require('lib/translations');

module.exports = function(server) {

  server.post('/translation', function(req, res) {
    res.send('hej');
  });

  server.put('/translation', function(req, res) {

    var translation = new Translations();
    translation.update(req.body.key, req.body.value.value, function() {
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
