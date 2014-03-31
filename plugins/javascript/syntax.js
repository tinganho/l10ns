
/**
 * Syntax
 *
 * @constructor
 */

function Syntax() {
  this.OPERATORS = pcf.OPERATORS;
}

/**
 * Checks if operands and operators has the correct syntax
 *
 * @param String operand1
 * @param String operator
 * @param String operand2
 * @return Boolean true
 * @api public
 */

Syntax.prototype.stringIsCondition = function(operand1, operator, operand2) {
  // Check operands
  if(typeof operand1 !== 'string' || typeof operand2 !== 'string') {
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
