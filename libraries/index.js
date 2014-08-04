
/**
 * Module dependencies.
 */

var Log = require('./log').Log
  , init = require('./init')
  , edit = require('./edit')
  , Search = require('./search')
  , update = require('./update')
  , Compiler = require('../plugins/' + project.programmingLanguage + '/compiler');

/**
 * Initialize a new `GetTranslation`
 *
 * @constructor
 */

var L10ns = function() {};

/**
 * Initialize project
 *
 * @return {void}
 * @api public
 */

L10ns.prototype.init = function() {
  init.init();
};

/**
 * Edit current translations
 *
 * @param {String} key
 * @param {String} value
 * @param {String} locale
 * @return {void}
 * @api public
 */

L10ns.prototype.edit = function(key, value, locale) {
  edit.edit(key, value, locale);
};

/**
 * Update source keys
 *
 * @return {void}
 * @api public
 */

L10ns.prototype.update = function() {
  update.update();
};

/**
 * Get new Search object
 *
 * @return {void}
 * @api public
 */

L10ns.prototype.log = function(locale, type) {
  var log = new Log();
  return log.outputLog(locale, type);
};

/**
 * Get new Search object
 *
 * @return {void}
 * @api public
 */

L10ns.prototype.search = function(q) {
  var search = new Search();
  search.readTranslations();
  search.queryOutput(q);
};

/**
 * Open translation interface
 *
 * @return {void}
 * @api public
 */

L10ns.prototype.interface = function() {
  require('../app/server').server();
};

/**
 * Compile language
 *
 * @return {void}
 * @api public
 */

L10ns.prototype.compile = function() {
  if(!this.compiler) {
    this.compiler = new Compiler();
  }
  this.compiler.compile();
};

/**
 * Export gt instance
 */

module.exports = new L10ns;
