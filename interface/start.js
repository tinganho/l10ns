
require('../binaries/l10ns');

var open = require('open');

/**
 * Set inServer and inClient globals
 */

global.inServer = true;
global.inClient = false;

/**
 * Sets global vars pcf and cf
 */

if(typeof fromBinary === 'undefined') {
  require('../binaries/gt');
}

global.ENV = 'development';

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
  , autoRoutes = require('./configurations/autoroutes')
  , globallyInstalled = /^\/usr\/local\/lib/.test(__dirname);


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

global.content_appTemplates = requirejs('./public/templates/contents/templates');

/**
 * Read document and layout templates
 */

readTemplates();

/**
 * Write client config file
 */
if(!globallyInstalled) {
  configuration.writeClientConfigurations();
}

/**
 * Set client configurations mapping
 */

configuration.setClientConfigurationMappings();

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

require('./pages/index')(page);
require('./pages/localizations')(page);

/**
 * Server start.
 */

if(!globallyInstalled) {
  createCompositeRouter();
}

http.createServer(app).listen(project.interface.port, function() {
  var url = 'http://localhost:' + project.interface.port;
  console.log('Translation interface is now available in ' + url.green + '.');
  console.log('Close the interface using CTRL + C.');
  if(project.interface.autoOpen) {
    console.log('Opening web browser...');
    setTimeout(function() {
      open(url);
    }, 1000);
  }
});

/**
 * Set process title
 */

process.title = program.NAME;

/**
 * Export app.
 */

