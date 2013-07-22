
/**
 * Module dependencies.
 */

var log     = require('./log')
  , edit    = require('./edit')
  , compile = require('./compile')
  , Search  = require('./Search')
  , update  = require('./update');

/**
 * Expose gt function.
 */

exports = module.exports = gt;

/**
 * Expose `Search`.
 */

exports.Search = Search;

/**
 * Initialize a new `GetTranslation`
 */

var GetTranslation = function() {};

/**
 * Methods of `GetTranslation`
 */

GetTranslation.prototype = {
  update  : update,
  compile : compile,
  log     : log,
  edit    : edit
};

/**
 * Get new Search object
 */

GetTranslation.prototype.search = function() {
  return new Search(this);
};

/**
 * Open translation interface
 */

GetTranslation.prototype.interface = function(){
  require('../app/server').server();
};

/**
 * Return a new gt instance
 */

function gt() {
  return new GetTranslation();
}

