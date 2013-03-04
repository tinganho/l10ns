
var express   = require('express'),
    fs        = require('fs'),
    http      = require('http'),
    path      = require('path'),
    requirejs = require('requirejs');

requirejs.config({

  baseUrl: __dirname,
  nodeRequire: require

});

var GruntTranslate = {};

GruntTranslate.server = function() {
  var server = express();

  server.configure( function() {

    server.set( 'port', process.env.PORT || 3000 );
    server.set( 'views', __dirname );

    server.use( express.favicon() );
    server.use( express.logger( 'dev' ) );
    server.use( express.bodyParser() );

    server.use( express.methodOverride() );
    server.use( server.router );
    server.use( '/public', express.static(__dirname + '/public'));

  });

  server.configure( 'development', function() {
    server.use( express.errorHandler() );
  });


  require('./routes/translations/translationsRegions')(server);

  http.createServer(server).listen( server.get( 'port' ), function() {
    console.log( 'Express server listening on port ' + server.get('port') );
  });

  return server;

};

module.exports = GruntTranslate;
