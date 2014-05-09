
/**
 * Module dependencies
 */

var configuration = require('../core/configuration')
  , path = require('path')
  , glob = require('glob')
  , corePath = require('../core/path');

/**
 * Core server configs for your app. Use DEV__, STAG__, PROD__ prefixes
 * to set specific environmental configurations. When you set specific
 * environmental configurations. Please set it for all three DEV__,
 * STAG__, PROD__ environments and not leave any environments without
 * a configuration. Otherwise your app may have an undefined configuration
 * variable.
 *
 *   Example:
 *
 *     DEV__X_REQUESTED_BY : '1',
 *     STAG__X_REQUESTED_BY : '1',
 *     PROD__X_REQUESTED_BY : '1',
 */

var configurations = {

  /**
   * Default user agent string in all outgoing requests
   *
   * @type {String}
   */

  USER_AGENT : 'mantis-server',

  /**
   * Default port for express server
   *
   * @type {Number}
   */

  DEFAULT_PORT : 3000,

  /**
   * Long time cache life time. Convenient configuration for
   * e.g. configuring resource cache lifetime
   *
   * @type {Number}
   */

  LONG_TIME_CACHE_LIFE_TIME  : 6*30*24*3600,

  /**
   * Short time cache life time. Convenient configuration for
   * e.g. configuring resource cache lifetime
   *
   * @type {Number}
   */

  SHORT_TIME_CACHE_LIFE_TIME : 24*3600,

  /**
   * Default content type for all request
   *
   * @type {String}
   */

  DEFAULT_CONTENT_TYPE : 'application/json',

  /**
   * Root folder. Is just a convenient constant. It should not be
   * configured, so please don't touch it. You should use it through
   * out the project whenever a absolute path needs to be set.
   *
   * @type {String}
   */

  ROOT_FOLDER : path.join(__dirname, '../'),

  /**
   * Temporary folder
   *
   * @type {String}
   */

  TMP_FOLDER : 'public/tmp',

  /**
   * All uploads will be stored on this folder
   *
   * @type {String}
   */

  UPLOAD_FOLDER : 'public/uploads',

  /**
   * We write all client configuration files written in nodejs to client
   * javascript. Please specify glob file pattern to your client
   * configuration files.
   *
   * @type {String}
   */

  CLIENT_CONFIGURATIONS_GLOB : 'configurations/client/*.js',

  /**
   * We write all client configuration files written in nodejs to client
   * javascript. Please specify glob file pattern to your client
   * configuration files.
   *
   * @type {String}
   */

  CLIENT_CONFIGURATIONS_BUILD : '/public/scripts/configurations',

  /**
   * Path to the default favicon for your website
   *
   * @type {String}
   */

  FAVICON : 'public/images/favicon.ico',

  /**
   * Locales for your website. You could define it any format you want
   * but we suggest using standard locale names.
   *
   * Standard locale name definition:
   *
   * A locale name, either a language specification of the form ll or a
   * combined language and country specification of the form ll_CC.
   * Examples: it, de_AT, es, pt_BR. The language part is always in
   * lower case and the country part in upper case. The separator is an
   * underscore.
   *
   * @type {Array.<String>}
   */

  LOCALES : ['en-US'],

  /**
   * The default locale used for the website. Recommend use locale name.
   * See locale name definition above.
   *
   * @type {Array.<String>}
   */

  DEFAULT_LOCALE : 'en-US',

  /**
   * Maximum number of sockets.
   *
   * @type {Number}
   */

  MAX_SOCKETS : 1024,

  /**
   * We want to prevent people from JSON hijacking. Other site can include
   * script tags and override Object and Array constructor to read any kind
   * of JSON content we provide. We can prevent this if we have a script that
   * crashes the web page.
   *
   * More info: http://stackoverflow.com/questions/2669690/why-does-google-prepend-while1-to-their-json-responses
   *
   * @type {String}
   */

  JSON_HIJACKING_PREFIX : 'while(1);',

  /**
   * X-Request-By header for protecting against CSRF attacks.
   *
   * More info: http://www.adambarth.com/papers/2008/barth-jackson-mitchell-b.pdf
   *
   * @type {String}
   */

  X_REQUESTED_BY : '1',

  /**
   * Document built templates path
   *
   * @type {String}
   */

  DOCUMENT_TEMPLATES : 'public/templates/documents/templates',

  /**
   * Layout built templates path
   *
   * @type {String}
   */

  LAYOUT_TEMPLATES : 'public/templates/layouts/templates',

  /**
   * Layout built templates path
   *
   * @type {String}
   */

  CORE_TEMPLATES : 'public/templates/core/templates',

  /**
   * Requirejs path
   *
   * @type {String}
   */

  REQUIREJS : corePath.requirejs(),

  /**
   * Modernizr path
   *
   * @type {String}
   */

  MODERNIZR : corePath.modernizr(),

  /**
   * Default main path
   *
   * @type {String}
   */

  DEFAULT_MAIN : 'mains/default',

  /**
   * Translation items per page. Used for pagination.
   *
   * @type {Number}
   */

  TRANSLATION_ITEMS_PER_PAGE : 20,

  /**
   * We want to prevent people from JSON hijacking. Other site can include
   * script tags and override Object and Array constructor to read any kind
   * of JSON content we provide. We can prevent this if we have a script that
   * crashes the web page.
   *
   * More info: http://stackoverflow.com/questions/2669690/why-does-google-prepend-while1-to-their-json-responses
   *
   * @type {String}
   */

  JSON_HIJACK_PREFIX : 'while(1);',

  /**
   * Path of composite router
   *
   * @type {String}
   */

  COMPOSER_BUILD_PATH : 'public/scripts/routers/composer.js',

  /**
   * Operators used for comparing operands in translation interface.
   *
   * @type {Object}
   */

  OPERATORS : {
    'Equals' : '==',
    'Smaller than' : '<',
    'Bigger than' : '>',
    'Smaller and equal' : '<=',
    'Bigger and equal' : '>='
  },

  /**
   * Additional compair operators.
   *
   * @type {Array}
   */

  ADDITIONAL_COMPAIR_OPERATORS : {
    'and' : '&&',
    'or' : '||'
  },

  /**
   * Client configuration map. name to alias mapping.
   *
   * @type {Map}
   */

  CLIENT_CONFIGURATIONS_MAP : {}

};

/**
 * Remove environmental prefixes
 */

configurations = configuration.formatConfigurations(configurations);

/**
 * Merge external configs
 */

configurations = configuration.mergeExternalConfigurations(configurations, process.env.EXTERNAL_CORE_CONFIGURATIONS);

/**
 * Export configs
 */

module.exports = configurations;
