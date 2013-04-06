
var express   = require('express'),
    fs        = require('fs'),
    http      = require('http'),
    path      = require('path'),
    requirejs = require('requirejs'),
    grunt     = require('grunt'),
    findup    = grunt.file.findup;


require(findup('Gruntfile.js'))(grunt, true);

var conf = grunt.config.get('translate'),
    opt  = conf.dist.options;

requirejs.config({
  baseUrl: __dirname,
  nodeRequire: require
});

var GruntTranslate = {};
GruntTranslate.server = function() {
  var server = express();

  server.configure( function() {
    server.set('port', process.env.PORT || opt.interface.port);
    server.set('views', __dirname);

    server.use(express.favicon());
    server.use(express.logger('dev'));
    server.use(express.bodyParser());

    server.use(express.methodOverride());
    server.use(server.router);
    server.use('/public', express.static(__dirname + '/public'));
    server.use('/vendor', express.static(__dirname + '/vendor'));
    server.use(express.static(__dirname + '/'));

  });

  server.configure('development', function() {
    server.use(express.errorHandler());
  });

  require('./routes/translations/translationsRegions')(server);
  require('./modules/translations/translationRoute')(server);

  http.createServer(server).listen(server.get('port'), function() {
    console.log('Express server listening on port ' + server.get('port'));
  });

  return server;

};

module.exports = GruntTranslate;
