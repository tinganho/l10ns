
/**
 * Namespace
 */

var AST = {};

/**
 * Class representing a LDML number comparison
 *
 * @param {AST.Number} LHS
 * @param {String} comparator
 * @param {AST.Number} RHS
 * @class
 * @constructor
 */

AST.NumberComparison = function(LHS, comparator, RHS) {
  this.LHS = LHS;
  this.comparator = comparator;
  this.RHS = RHS;
};

/**
 * Class representing a LDML Plural number comparison group
 *
 * @param {AST.Condition} LHS
 * @param {String} comparator
 * @param {AST.Condition} RHS
 * @class
 * @constructor
 */

AST.NumberComparisonGroup = function(LHS, type, RHS) {
  this.LHS = LHS;
  this.type = type;
  this.RHS = RHS;
};

/**
 * Class representing a LDML Plural variable
 *
 * @param {String} variable
 * @param {?String} modulus
 * @class
 * @constructor
 */

AST.Variable = function(variable, modulus) {
  this.variable = variable;
  this.modulus = modulus || null;
};

/**
 * Set modulus
 *
 * @param {Number} modulus
 * @return {void}
 * @api public
 */

AST.Variable.prototype.setModulus = function(modulus) {
  this.modulus = modulus;
};

/**
 * Class representing a LDML Plural range list
 *
 * @param {Array} rangeAndValues
 * @class
 * @constructor
 */

AST.RangeList = function() {
  this.values = [];
};


/**
 * Push value or a range to values list
 *
 * @param {AST.Value|AST.Range} value
 * @return {void}
 * @api public
 */

AST.RangeList.prototype.push = function(value) {
  this.values.push(value);
};

/**
 * Class representing a LDML Plural range list
 *
 * @param {AST.Condition} LHS
 * @param {String} comparator
 * @param {AST.Condition} RHS
 * @class
 * @constructor
 */

AST.Range = function(from, to) {
  this.from = from;
  this.to = to;
};

/**
 * Class representing a LDML Plural value
 *
 * @param {Number} value
 * @class
 * @constructor
 */

AST.Value = function(value) {
  this.value = value;
};

module.exports = AST;
