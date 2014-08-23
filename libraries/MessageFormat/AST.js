
/**
 * Namespace AST
 */

var AST = {};

/**
 * AST class representing a sentence
 *
 * @param {String} sentence
 * @constructor
 */

AST.Sentence = function(string) {
  this.string = string;
};

/**
 * AST class representing a variable
 *
 * @param {String} variable
 * @constructor
 */

AST.Variable = function(name) {
  this.name = name;
};

/**
 * AST class representing an ICU SelectFormat
 *
 * @param {String} variable
 * @constructor
 */

AST.ChoiceFormat = function(variable, values) {
  this.variable = variable;
  this.values = values;
};

/**
 * AST class representing an ICU SelectFormat
 *
 * @param {String} variable
 * @constructor
 */

AST.SelectFormat = function(variable, values) {
  this.variable = variable;
  this.values = values;
};

/**
 * AST class representing an ICU PluralFormat
 *
 * @param {String} variable
 * @constructor
 */

AST.PluralFormat = function(variable, values, offset) {
  this.variable = variable;
  this.values = values;
  this.offset = offset;
};

/**
 * AST class representing an ICU PluralFormat count '#'
 *
 * @param {String} variable
 * @constructor
 */

AST.PluralRemaining = function() {};

module.exports = AST;
