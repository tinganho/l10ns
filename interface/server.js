
var express    = require('express'),
    fs         = require('fs'),
    http       = require('http'),
    path       = require('path'),
    requirejs  = require('requirejs'),
    modRewrite = require('connect-modrewrite'),

requirejs.config({
  baseUrl: __dirname,
  nodeRequire: require
});

GLOBAL.icf  = require('./conf/interfaceConfig');
GLOBAL.opt  = opt;
GLOBAL.tmpl = requirejs('public/templates/tmpl');

var GruntTranslate = {};
GruntTranslate.server = function() {

  var server = express();

  server.configure(function() {

    server.set('port', opt.interface.port || 3333);
    server.set('views', __dirname);

    server.use(express.favicon());
    server.use(express.logger('dev'));
    server.use(express.bodyParser());
    server.use(modRewrite([
    ], [
      /\/public\//,
      /\/vendor\//,
      /\/modules\//,
      /\/main\.js$/,
      /\/App\.js$/
    ]));

    server.use(server.router);
    server.use(express.methodOverride());
    server.use('/public', express.static(__dirname + '/public'));
    server.use('/vendor', express.static(__dirname + '/vendor'));
    server.use(express.static(__dirname + '/'));
    server.use(express.favicon(__dirname + '/gt.ico', { maxAge: 2592000000 }));

  });

  server.configure('development', function() {
    server.use(express.errorHandler());
  });

  // Pages
  require('./pages/translations/translationsPage')(server);


  // APIs
  require('./modules/translations/TranslationApi')(server);
  require('./modules/search/searchApi')(server);


  http.createServer(server).listen(server.get('port'), function() {
    console.log('Express server listening on port ' + server.get('port'));
  });

  return server;

};

module.exports = GruntTranslate;
