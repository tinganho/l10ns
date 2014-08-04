
/**
 * Get different data from snippets of source strings using
 * Parser constructor.
 *
 * @constructor Parser
 */

function Parser() {}

/**
 * Get the key from a function call string
 *
 * @param {String} fn
 * @return {String}
 *
 * Example:
 *   gt('SOME_KEY');
 *
 * @api public
 */

Parser.prototype.getKey = function(fn) {
  return language.LOCALIZATION_KEY_SYNTAX.exec(fn)[2];
};

/**
 * Get var from function call string
 *
 * @param {String} fn
 * @return {Array}
 * @api public
 */

Parser.prototype.getVars = function(fn) {
  language.LOCALIZATION_VARIABLES_SYNTAX.lastIndex = 0;
  var obj = language.LOCALIZATION_VARIABLES_SYNTAX.exec(fn);

  if(obj === null) {
    return [];
  }
  obj = obj[1].match(language.LOCALIZATION_VARIABLE_SYNTAX);
  for(var i = 0; i < obj.length; i++) {
    obj[i] = '${' + obj[i].replace(/\s+|:|'|"/g, '') + '}';
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

