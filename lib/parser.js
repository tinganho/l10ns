
/**
 * Parser
 */

function Parser() {
  this.translationKeyRegex = lcf.TRANSLATION_KEY;
  this.translationVarsRegex = lcf.TRANSLATION_VARS;
  this.translationVarRegex = lcf.TRANSLATION_VAR;
}

/**
 * Get the key from a function call string
 *
 * @param {String} fn
 *
 * @return {String}
 *
 * Example:
 *   gt('SOME_KEY');
 *
 * @public
 */

Parser.prototype.getKey = function(fn) {
  return this.translationKeyRegex.exec(fn)[2];
};

/**
 * Get var from function call string
 *
 * @param {String} fn
 *
 * @return {Array}
 * @public
 */

Parser.prototype.getVars = function(fn) {
  var obj = this.translationVarsRegex.exec(fn);

  this.translationVarsRegex.exec(fn);

  if(obj === null) {
    return [];
  }
  obj = obj[1].match(this.translationVarRegex);
  for(var i = 0; i < obj.length; i++) {
    obj[i] = obj[i].replace(/\s+|:|'|"/g, '');
  }
  return obj;
};

/**
 * Export instance
 */

module.exports = new Parser;

/**
 * Export constructor
 */

module.exports.Parser = Parser;

