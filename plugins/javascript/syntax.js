
/**
 * Syntax
 *
 * @constructor
 */

function Syntax() {
  this.OPERATORS = pcf.OPERATORS;
}

/**
 * Check if string is operand
 *
 * @param {String} operand
 * @return {Boolean}
 * @public
 */

Syntax.prototype.stringIsOperand = function(operand) {
  if(pcf.SYNTAX_OPERAND.test(operand)) {
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
 * @public
 */

Syntax.prototype.stringIsCondition = function(operand1, operator, operand2) {
  // Check operands
  if(!this.stringIsOperand(operand1) || !this.stringIsOperand(operand2)) {
    return false
  }
  // Validate operator
  if(this.OPERATORS.indexOf(operator) === -1) {
    return false;
  }
  return true;
};

/**
 * Export instance
 */

module.exports = new Syntax();
