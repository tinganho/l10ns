
var modrewrite = require('connect-modrewrite')
  , modrewrites = require('./modrewrites')
  , path = require('path')
  , helmet = require('helmet')
  , express = require('express')
  , path = require('path');

module.exports = function(app) {

  /**
   * Development configurations
   */

  app.configure('development', function() {
    app.use(express.static(path.join(__dirname, '../')));
  });

  /**
   * Development and staging configurations
   */

  app.configure('development', 'staging', function() {
    app.use(express.logger('dev'));
  });

  /**
   * Staging and production configurations
   */

  app.configure('staging', 'production', function() {
    app.use(function(req, res, next) {
      if(/^\/public/.test(req.url)) {
        res.setHeader('Cache-Control', 'public, max-age=' + cf.LONG_TIME_CACHE_LIFE_TIME/1000);
        res.setHeader('Expires', new Date(Date.now() + cf.LONG_TIME_CACHE_LIFE_TIME).toUTCString());
      }
      next();
    });
    app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: cf.LONG_TIME_CACHE_LIFE_TIME }));
    app.use('/vendor', express.static(path.join(__dirname, 'vendor'), { maxAge: cf.LONG_TIME_CACHE_LIFE_TIME }));
  });

  /**
   * Production configurations
   */

  app.configure('production', function() {});

   /**
   * General configurations
   */

  app.configure(function() {
    app.use(express.query());
    app.use(express.compress());
    app.set('port', process.env.PORT || cf.DEFAULT_PORT);
    app.set('dist', path.dirname(__dirname) === 'dist');
    app.use(helmet.xframe('SAMEORIGIN'));
    app.use(modrewrite(modrewrites));
    app.use(express.errorHandler());
    app.use(express.cookieParser());
    app.use(express.bodyParser({ uploadDir: __dirname + cf.UPLOAD_FOLDER }));
    app.use(app.router);
  });
};
