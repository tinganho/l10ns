
/**
 * Set inServer and inClient globals
 */

global.inServer = true;
global.inClient = false;

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

if(typeof fromBin === 'undefined') {
  require('../binaries/gt');
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
global.requirejs = require('requirejs');

/**
 * RequireJS config.
 */

requirejs.config({
  baseUrl: __dirname,
  nodeRequire: require
});

var fs = require('fs')
  , http = require('http')
  , path = require('path')
  , cluster = require('cluster')
  /*jshint unused:false */
  , helmet = require('helmet')
  , autoRoute = require('autoroute')
  , configuration = require('./core/configuration')
  , configure = require('./configurations/app')
  , autoRoutes = require('./configurations/autoRoutes');


/**
 * Globals.
 */

global.cf = require('./configurations/server');

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

var page = require('./core/page')
  , readTemplates = page.readTemplates
  , createCompositeRouter = page.createCompositeRouter;

/**
 * Content templates
 */

global.content_appTemplates = requirejs('./public/templates/content/app');



/**
 * Read document and layout templates
 */

readTemplates();

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

configuration.writeClientConfigurations();

/**
 * App namespace.
 */

global.app = require('./core/app');

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

autoRoute(autoRoutes, app);

/**
 * Server start.
 */

require('./pages/index')(page);
require('./pages/translation')(page);
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

