
var cli = require('../../../libraries');

module.exports = function(app) {
  app.get('/api/compile', function(request, response) {
    cli.initialize()
      .then(function() {
        cli.compile();
        response.send('ok');
      })
      .fail(function(error) {
        response.send(500);
      });
  });
}
