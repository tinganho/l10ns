
var readline = require('readline')
  , Q = require('q');

/**
 * Project initializer
 *
 * @constructor Init
 */

function Init() {
  this.json = null;
  this.intro = cf.INTRO;
}

/**
 * Initialize
 *
 * @return {void}
 * @api public
 */

Init.prototype.init = function() {
  this._outputIntroduction();
};

/**
 * Create readline interface
 *
 * @return {void}
 * @api private
 */

Init.prototype._createReadlineInterface = function() {
  this.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal : false
  });
};

/**
 * Output introduction to get-translation
 *
 * @return {void}
 * @api private
 */

Init.prototype._outputIntroduction = function() {
  process.stdout.write(this.intro);
};

/**
 * Get locales
 *
 * @return {void}
 * @api public
 */

Init.prototype.getLocales = function() {
  var deferred = Q.defer();
  var _this = this;

  var question = '';

  this.rl.question(question, function() {

  });

  return deferred.promise;
};

Init.prototype.getDefaultProgrammingLanguage = function() {
  this.rl.question(question, function() {

  });
};

Init.prototype.getDefaultLocale = function() {
  this.rl.question(question, function() {

  });
};

Init.prototype.validateProject = function() {

};

Init.prototype.generate = function() {

};

/**
 * Export instance
 */

module.exports = new Init;

/**
 * Exports constructor
 */

module.exports.Init = Init;
