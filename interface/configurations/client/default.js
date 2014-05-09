
/**
 * @fileoverview Client configs file. This file will be compiled
 * as an requirejs module. All unrelated environment configs
 * will be stripped off.
 */

/**
 * Module dependencies
 */

var configuration = require('../../core/configuration');

/**
 * Core client configs for your app. Use DEV__, STAG__, PROD__ prefixes
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
   * We will have a compiler the compiles this object and namespace the file
   * to window.[NAMESPACE]. It will be a global configuration for your client
   * to use.
   *
   * @type {String}
   */

  NAME_SPACE : 'cf',

  /**
   * Minimum page load time for a client request. If the developer don't want
   * any form submission to submit to fast. They can use this configuration
   * value through out the project.
   *
   * @type {Number}
   */

  MIN_PAGE_LOAD_TIME : 500,

  /**
   * Convinient configuration for mobile width.
   *
   * @type {Number}
   */

  MOBILE_WIDTH : 500,

  /**
   * The range from touch start and release of finger in pixels.
   *
   * @type {Number}
   */

  TOUCH_OUT_OF_RANGE : 10,

  /**
   * Default AJAX timeout for every request measured in ms.
   *
   * @type {Number}
   */

  AJAX_TIMEOUT : 10000,

  /**
   * @import cf.JSON_HIJACK_PREFIX
   */

  JSON_HIJACK_PREFIX : cf.JSON_HIJACK_PREFIX,

  /**
   * X-Request-By header for protecting against CSRF attacks.
   *
   * More info: http://www.adambarth.com/papers/2008/barth-jackson-mitchell-b.pdf
   *
   * @type {String}
   */

  X_REQUESTED_BY : '1',

  /**
   * You can log client errors by prvoiding a path to the POST request
   * See `error.part` in `/html/document/custom-header-scripts/error.part`
   *
   * @type {String}
   */

  CLIENT_ERROR_PATH : '/log/error',

  /**
   * @import cf.OPERATORS
   */

  OPERATORS : cf.OPERATORS,

  /**
   * @import cf.ADDITIONAL_COMPAIR_OPERATORS
   */

  ADDITIONAL_COMPAIR_OPERATORS : cf.ADDITIONAL_COMPAIR_OPERATORS
};

/**
 * Remove environmental prefixes
 */

configurations = configuration.formatConfigurations(configurations);

/**
 * Merge external configs
 */

configurations = configuration.mergeExternalConfigurations(configurations, process.env.EXTERNAL_CLIENT_CORE_CONFIGURATIONS);

/**
 * Export config
 */

module.exports = configurations;
