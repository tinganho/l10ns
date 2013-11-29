
/**
 * Module dependencies.
 */

var log      = require('./log')
  , edit     = require('./edit')
  , Search   = require('./Search')
  , update   = require('./update')
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
  update  : update,
  log     : log,
  edit    : edit
};

/**
 * Get new Search object
 *
 * @return void
 * @public
 */

GetTranslation.prototype.search = function() {
  return new Search(this);
};

/**
 * Open translation interface
 *
 * @return void
 * @public
 */

GetTranslation.prototype.interface = function() {
  require('../app/server').server();
};

/**
 * Compile language
 *
 * @return void
 * @public
 */

GetTranslation.prototype.compile = function() {
  if(!this.compiler) {
    this.compiler = new Compiler();
  }
  this.compiler.compile();
};

/**
 * Expose gt function.
 */

module.exports = new GetTranslation;
