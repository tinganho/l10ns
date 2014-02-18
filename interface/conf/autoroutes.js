
/**
 * @fileoverview specify file glob pattern to autoroute. All Express
 * routes will be instantiated automatically if they are wrapped in
 * `module.exports = function(app)`
 *
 * Example file content:
 *
 *   module.exports = function(app) {
 *     app.post('/login', function(req, res) {
 *       res.send('hello')
 *     })
 *   };
 *
 * More info: https://github.com/tinganho/express-autoroute
 */

module.exports = [
  './**/*Api.js',
  './pages/**/*Pages.js'
];
