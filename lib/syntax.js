

/**
 * We need to properly check for the syntax in some translations.
 *
 * @constructor Syntax
 */

function Syntax() {}

/**
 * Developer sometime defines same key in two files. But they use two
 * different sets of variables. It should throw an error when that happens.
 * This method helps checking if there is any error duplicate in the source
 * files by providing newTranslations.
 *
 * @param {Object} newTranslations
 * @param {String} key
 * @param {Array} vars
 * @return {Boolean}
 */

Syntax.prototype.hasErrorDuplicate = function(newTranslations, key, vars) {
  if(typeof newTranslations[key] === 'undefined') {
    return false;
  }
  if(vars.length !== newTranslations[key].vars.length) {
    return true;
  }
  for(var i in vars) {
    if(newTranslations[key].vars[i] !== vars[i]) {
      return true;
    }
  }
  return false;
};

/**
 * Export instance
 */

module.exports = new Syntax;
