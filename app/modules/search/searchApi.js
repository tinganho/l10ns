
var Search = require('../../../src/modules/search');
var search = new Search;
search._index();
module.exports = function(app) {
  app.get('/search', function(req, res) {
    var q = req.param('q');
    res.send(search.query(q));
  });
};
