
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
  return language.LOCALIZATION_KEY_SYNTAX.exec(fn)[3];
};

/**
 * Get var from function call string
 *
 * @param {String} fn
 * @return {Array}
 * @api public
 */

Parser.prototype.getVariables = function(fn) {
  language.LOCALIZATION_VARIABLES_SYNTAX.lastIndex = 0;
  fn = fn.replace(/:\s*?\{(\s*?.*?\s*?)+?\}/g, ':');

  // Strip all string literals since they can have 'https://' and that would result in a new variable
  fn = fn.replace(/\:\s*('|")(.*?)\1/g, ':\'\'');

  var obj = language.LOCALIZATION_VARIABLES_SYNTAX.exec(fn);

  if(obj === null) {
    return [];
  }
  obj = obj[1].match(language.LOCALIZATION_VARIABLE_SYNTAX);
  for(var i = 0; i < obj.length; i++) {
    language.LOCALIZATION_VARIABLE_NAME_SYNTAX.lastIndex = 0;
    obj[i] = language.LOCALIZATION_VARIABLE_NAME_SYNTAX.exec(obj[i])[1];
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

