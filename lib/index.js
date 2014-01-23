
/**
 * Module dependencies.
 */

var Log = require('./log').Log
  , edit = require('./edit')
  , Search = require('./search')
  , update = require('./update')
  , Compiler = require('../plugins/' + cf.programmingLanguage + '/compiler');

/**
 * Initialize a new `GetTranslation`
 *
 * @constructor
 */

var GetTranslation = function() {};

/**
 * Methods of `GetTranslation`
 */

GetTranslation.prototype = {
  edit    : edit
};

/**
 * Update source keys
 *
 * @return {void}
 * @api public
 */

GetTranslation.prototype.update = function() {
  update.update();
};

/**
 * Get new Search object
 *
 * @return {void}
 * @api public
 */

GetTranslation.prototype.log = function(locale) {
  var log = new Log();
  return log.outputLog(locale);
};

/**
 * Get new Search object
 *
 * @return {void}
 * @api public
 */

GetTranslation.prototype.search = function(q) {
  var search = new Search();
  search.readTranslations();
  search.query(q);
};

/**
 * Open translation interface
 *
 * @return {void}
 * @api public
 */

GetTranslation.prototype.interface = function() {
  require('../app/server').server();
};

/**
 * Compile language
 *
 * @return {void}
 * @api public
 */

GetTranslation.prototype.compile = function() {
  if(!this.compiler) {
    this.compiler = new Compiler();
  }
  this.compiler.compile();
};

/**
 * Export gt instance
 */

module.exports = new GetTranslation;
