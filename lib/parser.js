
/**
 * Parser
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
 */

Parser.prototype.getKey = function(fn) {
  return /gt\((['|"])(.*?)\1/.exec(fn)[2];
};

/**
 * Get var from function call string
 *
 * @param {String} fn
 * @return {Array}
 */

Parser.prototype.getVars = function(fn) {
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

/**
 * Expose `Parser`
 */

module.exports = new Parser;
