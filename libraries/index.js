
/**
 * Module dependencies.
 */

var Log = require('./log').Log
  , init = require('./init')
  , set = require('./set')
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
  init.run();
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

L10ns.prototype.set = function(key, value, locale) {
  set.run(key, value, locale);
};

/**
 * Update source keys
 *
 * @return {void}
 * @api public
 */

L10ns.prototype.update = function() {
  update.run();
};

/**
 * Get new Search object
 *
 * @return {void}
 * @api public
 */

L10ns.prototype.log = function(locale, type) {
  var log = new Log();
  return log.run(locale, type);
};

/**
 * Get new Search object
 *
 * @return {void}
 * @api public
 */

L10ns.prototype.search = function(q) {
  var search = new Search();
  search.readLocalizations()
    .then(function() {
      search.queryOutput(q);
    })
    .fail(function(error) {
      console.log(error.stack);
    });
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
  this.compiler.run();
};

/**
 * Export gt instance
 */

module.exports = new L10ns;
