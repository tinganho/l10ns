
module.exports = function(app) {
  app.get('/translations', function(req, res) {
    res.json({ hej : 'hej'})
  });
};
