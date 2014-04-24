
/**
 * Set inServer and inClient globals
 */

GLOBAL.inServer = true;
GLOBAL.inClient = false;

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
 * Sets global vars pcf and cf
 */

require('../bin/gt');

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
GLOBAL.requirejs = require('requirejs');

var fs = require('fs')
  , http = require('http')
  , path = require('path')
  , cluster = require('cluster')
  /*jshint unused:false */
  , helmet = require('helmet')
  , scf = require('./conf/core')
  , autoroute = require('autoroute')
  , config = require('./core/config')
  , configure = require('./conf/app')
  , autoroutes = require('./conf/autoroutes');

/**
 * We want to extend String object to provide a first letter
 * uppercase function. It is used be the composite router.
 *
 * @return {void}
 * @api public
 */

if(typeof String.prototype.toFirstLetterUpperCase === 'undefined') {
  String.prototype.toFirstLetterUpperCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
}

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

  var page = require('./core/page')
    , readTmpls = page.readTmpls
    , createCompositeRouter = page.createCompositeRouter;

  /**
   * Content templates
   */

  GLOBAL.content_appTmpls = requirejs('./public/templates/content/app');

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

  GLOBAL.app = require('./core/app');

  /**
   * Add default security
   */

  helmet.defaults(app, { xframe: false, csp: false });

  /**
   * Autoroute.
   */

  autoroute(autoroutes, app);

  /**
   * App configuration.
   */

  configure(app);

  /**
   * Server start.
   */

  require('./pages/home')(page);
  require('./pages/edit')(page);
  createCompositeRouter();

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
