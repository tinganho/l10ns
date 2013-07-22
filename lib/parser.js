
/**
 * Expose `Parser`
 */

module.exports = Parser;

/**
 * Parser
 */

function Parser() {}

/**
 * Get the key from a function call string
 *
 * @param {String} fn
 * @return {String}
 */

Parser.prototype.getTranslationKeyFromFunctionCallString = function(fn) {
  return /gt\(['|"](.*?)['|"]\)/.exec(fn)[1];
};

/**
 * Get var from function call string
 *
 * @param {String} fn
 * @return {Array}
 */

Parser.prototype.getVarsFromFunctionCallString = function(fn) {
  var obj = /(\{\s*?\w*?\s*?\:.*?\s*?\})/g.exec(fn);
  if(obj === null) {
    return [];
  }
  obj = obj[1].match(/\s*(\w+)\s*\:/g);
  for(var i = 0; i < obj.length; i++) {
    obj[i] = obj[i].replace(/\s+|:/g, '');
  }
  return obj;
};
