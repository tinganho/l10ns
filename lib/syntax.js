
function Syntax() {}

/**
 * Check for translation duplicate
 *
 * @param {Object} translations
 * @param {String} key
 * @param {Array} vars
 *
 * @return {Boolean}
 */

Syntax.prototype.hasErrorDuplicate = function(translations, key, vars) {
  if(typeof translations[key] === 'undefined') {
    return false;
  }
  if(vars.length !== translations[key].vars.length) {
    return true;
  }
  for(var i in vars) {
    if(translations[key].vars[i] !== vars[i]) {
      return true;
    }
  }
  return false;
};

module.exports = new Syntax;
