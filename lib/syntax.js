
function Syntax() {}

/**
 * Get var from function call string
 *
 * @param {String} fn
 * @return {Array}
 */

Syntax.prototype.stringIsTranslationText = function(text, key) {
  if(typeof text === 'undefined') {
    throw {
      name: 'Undefined translation',
      message: 'You have an undefined translation in:\n' + key
    };
  }
};

/**
 * Check if string is operand
 *
 * @param {String} operand
 * @return {Boolean}
 */

Syntax.prototype.stringIsOperand = function(operand) {
  if(/^"?\$?\w+"?$/.test(operand)) {
    return true;
  }
  return false;
};

/**
 * Checks if operands and operators has the correct syntax
 *
 * @param String operand1
 * @param String operator
 * @param String operand2
 * @return Boolean true
 */

Syntax.prototype.stringIsCondition = function(operand1, operator, operand2) {
  // Check operands
  if(!this.stringIsOperand(operand1) || !this.stringIsOperand(operand2)) {
    return false
  }
  // Validate operator
  if(cf.OPERATORS.indexOf(operator) === -1) {
    return false;
  }
  return true;
};

/**
 * Check for translation duplicate
 *
 * @param {Object} translations
 * @param {String} key
 * @param {Array} vars
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
