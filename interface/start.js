
/**
 * Environmental vars dependencies
 */

if(!process.env.NODE_ENV) {
  console.log('[' + ':('.red + ']' + ' You forgot to set your environmental variable NODE_ENV?'.yellow);
  process.kill();
}
else if(!/development|staging|production/.test(process.env.NODE_ENV)) {
  console.log('[' + ':('.red + ']' + ' NODE_ENV must have the value development|staging|production'.yellow);
  process.kill();
}

/**
 * Set ENV
 */

var ENV;
switch(process.env.NODE_ENV) {
  case 'development':
    ENV = 'DEV';
    break;
  case 'staging':
    ENV = 'STAG';
    break;
  case 'production':
    ENV = 'PROD';
    break;
  default:
    ENV = 'DEV';
    break;
}
global.ENV = ENV;

/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , requirejs = require('requirejs')
  , http = require('http')
  , path = require('path')
  , cluster = require('cluster')
  /*jshint unused:false */
  , readTmpls = require('./page').readTmpls
  , helmet = require('helmet')
  , scf = require('./conf/core')
  , autoroute = require('autoroute')
  , config = require('./lib/config')
  , configure = require('./conf/app')
  , autoroutes = require('./conf/autoroutes');

/**
 * Define cluster
 */

var numCPUs = require('os').cpus().length;
http.globalAgent.maxSockets = scf.MAX_SOCKETS;

if(cluster.isMaster && process.env.NODE_ENV === 'production') {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
}
else {

  /**
   * RequireJS config.
   */

  requirejs.config({
    baseUrl: path.join(__dirname),
    nodeRequire: require
  });

  /**
   * Globals.
   */
  GLOBAL.requirejs = requirejs;
  GLOBAL.cf = scf;


  /**
   * Read document and layout templates
   */

  readTmpls();

  /**
   * Create necessary folders
   */

  var uploadFolderPath = cf.ROOT_FOLDER + cf.UPLOAD_FOLDER;
  if(!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath);
  }
  var tmpFolderPath = cf.ROOT_FOLDER + cf.TMP_FOLDER;
  if(!fs.existsSync(tmpFolderPath)) {
    fs.mkdirSync(tmpFolderPath);
  }

  /**
   * Write client config file
   */

  config.writeClientConfigs();

  /**
   * App namespace.
   */

  var app = express();

  /**
   * Add default security
   */

  helmet.defaults(app, { xframe: false, csp: false });

  /**
   * App configuration.
   */

  configure(app);

  /**
   * Autoroute.
   */

  autoroute(autoroutes, app);

  /**
   * Server start.
   */

  http.createServer(app).listen(app.get('port'), function() {
    console.log('[%s] Express app listening on port ' + app.get('port'), process.pid);
  });

  /**
   * Set process title
   */

  process.title = cf.PROCESS_TITLE;

  /**
   * Export app.
   */

  module.exports = app;

}

