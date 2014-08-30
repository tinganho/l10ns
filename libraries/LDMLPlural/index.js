
var Lexer = require('../Lexer')
  , AST = require('./AST');

/**
 * LDMLPlural class
 *
 * @class
 * @constructor
 */

function LDMLPlural() {}

/**
 * Binary operation precedence
 *
 * @type {Enum}
 */

LDMLPlural.Characters = {
  AT: '@',
  MODULUS: '%',
  IS_NOT: '!=',
  AND: 'and',
  OR: 'or',
  COMMA: ',',
  FIRST_CHARACTER_OF_IS_NOT: '!',
  FIRST_CHARACTER_OF_AND: 'a',
  FIRST_CHARACTER_OF_OR: 'o',
  FIRST_CHARACTER_OF_INTEGER_EXAMPLE: 'i',
  FIRST_CHARACTER_OF_DECIMAL_EXAMPLE: 'd',
  ABSOLUTE_VALUE: 'n',
  INTEGER_DIGIT: 'i',
  NUMBER_OF_VISIBLE_FRACTION_DIGITS_WITH_TRAILING_ZEROS: 'v',
  NUMBER_OF_VISIBLE_FRACTION_DIGITS_WITHOUT_TRAILING_ZEROS: 'w',
  VISIBLE_FRACTIONAL_DIGIT_WITH_TRAILING_ZEROS: 'f',
  VISIBLE_FRACTIONAL_DIGIT_WITHOUT_TRAILING_ZEROS: 'f',
  DOT: '.',
  EOF: -1
};

/**
 * Binary operation precedence
 *
 * @type {Object}
 */

LDMLPlural.NumberComparisonGroupTypePrecedence = {
  'or': 10,
  'and': 20
};

/**
 * Parse string
 *
 * @param {String} string representing LDML Plural
 * @return {void}
 * @api public
 */

LDMLPlural.prototype.parse = function(string) {
  this.ruleAST = {};
  this.lexer = new Lexer(string);
  this.currentToken = this.lexer.getNextToken();
  this._swallowWhiteSpace();
  while(this.currentToken !== '@' &&
        this.currentToken !== LDMLPlural.Characters.EOF) {
    this.ruleAST = this._parsePrimary();
  }

  this._parseExample();

  return this.ruleAST;
};

/**
 * Parse primary language objects
 *
 * @return {void}
 * @api public
 */

LDMLPlural.prototype._parsePrimary = function() {
  switch(this.currentToken) {
    case LDMLPlural.Characters.ABSOLUTE_VALUE:
    case LDMLPlural.Characters.INTEGER_DIGIT:
    case LDMLPlural.Characters.NUMBER_OF_VISIBLE_FRACTION_DIGITS_WITH_TRAILING_ZEROS:
    case LDMLPlural.Characters.NUMBER_OF_VISIBLE_FRACTION_DIGITS_WITHOUT_TRAILING_ZEROS:
    case LDMLPlural.Characters.VISIBLE_FRACTIONAL_DIGIT_WITH_TRAILING_ZEROS:
    case LDMLPlural.Characters.VISIBLE_FRACTIONAL_DIGIT_WITHOUT_TRAILING_ZEROS:
      return this._parseNumberComparison();
    default:
      throw new TypeError('Unrecognized token, got (' + this.currentToken + ') in ' + this.lexer.getLatestTokensLog());
  }
};

/**
 * Check if number
 *
 * @param {String} string
 * @return {Boolean}
 * @api private
 */

LDMLPlural.prototype._isNumber = function(string) {
  return /^\d+$/.test(string);
};

/**
 * Parse number comparison
 *
 * @param {String} string
 * @return {Boolean}
 * @api private
 */

LDMLPlural.prototype._parseNumberComparison = function(stop) {
  // Swallow variable
  var variable = new AST.Variable(this.currentToken);
  this.currentToken = this.lexer.getNextToken();

  // Go to operator
  this._swallowWhiteSpace();

  if(!/^[!=%]$/.test(this.currentToken)) {
    throw new TypeError('Expected operator (!,=,%), instead got (' + this.currentToken + ') in ' + this.lexer.getLatestTokensLog());
  }

  if(this.currentToken === LDMLPlural.Characters.MODULUS) {
    // Swallow modulus
    this.currentToken = this.lexer.getNextToken();
    // Go to number
    this._swallowWhiteSpace();
    this._expectNumber();
    var number = '';
    while(this._isNumber(this.currentToken)) {
      number += this.currentToken;
      this.currentToken = this.lexer.getNextToken();
    }
    variable.setModulus(parseInt(number, 10));
    // Go to comparator
    this.currentToken = this.lexer.getNextToken();
    this._swallowWhiteSpace();
  }


  var comparator;
  if(this.currentToken === LDMLPlural.Characters.FIRST_CHARACTER_OF_IS_NOT) {
    // Swallow '='
    this.lexer.getNextToken();
    this.currentToken = this.lexer.getNextToken();
    comparator = LDMLPlural.Characters.IS_NOT;
  }
  else {
    comparator = this.currentToken;
    this.currentToken = this.lexer.getNextToken();
  }

  // Go to range list
  this._swallowWhiteSpace();
  this._expectNumber();

  var rangeList = this._parseRangeList()
    , LHS = new AST.NumberComparison(variable, comparator, rangeList);

  if(stop) {
    return LHS;
  }

  return this._parseRHSNumberComparisonGroup(0, LHS);
};

/**
 * Parse RHS number comparison group
 *
 * @param {Number} previousPrecedence
 * @param {AST.NumberComparison|AST.NumberComparisonGroup}
 * @return {void}
 * @api private
 */

LDMLPlural.prototype._parseRHSNumberComparisonGroup = function(previousPrecedence, LHS) {
  while(true) {
    var thisPrecedence = this._getNumberComparisonGroupTypePrecedence();
    if(thisPrecedence < previousPrecedence) {
      return LHS;
    }

    var thisNumberComparisonGroupType = this._getNumberComparisonGroupType();

    var RHS = this._parseNumberComparison(true);

    var nextPrecedence = this._getNumberComparisonGroupTypePrecedence();
    if(thisPrecedence < nextPrecedence) {
      RHS = this._parseRHSNumberComparisonGroup(thisPrecedence + 1, RHS);
    }

    LHS = new AST.NumberComparisonGroup(LHS, thisNumberComparisonGroupType, RHS);
  }
};

/**
 * Get number comparison group type precedence
 *
 * @return {Number}
 * @api private
 */

LDMLPlural.prototype._getNumberComparisonGroupTypePrecedence = function() {
  if(this.currentToken === LDMLPlural.Characters.FIRST_CHARACTER_OF_AND) {
    return LDMLPlural.NumberComparisonGroupTypePrecedence[
      LDMLPlural.Characters.AND
    ];
  }
  else if(this.currentToken === LDMLPlural.Characters.FIRST_CHARACTER_OF_OR) {
    return LDMLPlural.NumberComparisonGroupTypePrecedence[
      LDMLPlural.Characters.OR
    ];
  }
  else {
    return -1;
  }
};

/**
 * Get number comparison group type
 *
 * @return {String} representing comparison group type
 * @api private
 */

LDMLPlural.prototype._getNumberComparisonGroupType = function() {
  if(this.currentToken === LDMLPlural.Characters.FIRST_CHARACTER_OF_AND) {
    // Swallow 'nd'
    this.lexer.getNextToken();
    this.lexer.getNextToken();

    this.currentToken = this.lexer.getNextToken();
    this._swallowWhiteSpace();

    return LDMLPlural.Characters.AND;
  }
  else if(this.currentToken === LDMLPlural.Characters.FIRST_CHARACTER_OF_OR) {
    // Swallow 'or'
    this.lexer.getNextToken();

    this.currentToken = this.lexer.getNextToken();
    this._swallowWhiteSpace();
    return LDMLPlural.Characters.OR;
  }
};

/**
 * Expect digit
 *
 * @return {void}
 * @api private
 */

LDMLPlural.prototype._expectNumber = function() {
  if(!this._isNumber(this.currentToken)) {
    throw new TypeError('Expected a number, instead got (' + this.currentToken + ') in ' + this.lexer.getLatestTokensLog());
  }
};

/**
 * Parse range list
 *
 * @return {AST.RangeList}
 * @api private
 */

LDMLPlural.prototype._parseRangeList = function() {
  var rangeList = new AST.RangeList;
  while(this._isNumber(this.currentToken)) {
    var startValue = '';
    while(this._isNumber(this.currentToken)) {
      startValue += this.currentToken;
      this.currentToken = this.lexer.getNextToken();
    }
    startValue = parseInt(startValue, 10);
    if(this.currentToken === LDMLPlural.Characters.DOT) {
      // Swallow ..
      this.lexer.getNextToken();
      this.currentToken = this.lexer.getNextToken();
      this._expectNumber();

      var endValue = '';
      while(this._isNumber(this.currentToken)) {
        endValue += this.currentToken;
        this.currentToken = this.lexer.getNextToken();
      }
      endValue = parseInt(endValue, 10);

      rangeList.push(new AST.Range(startValue, endValue));
    }
    else {
      this._swallowWhiteSpace();
      rangeList.push(new AST.Value(startValue));
    }
    // Go to next non-whitespace token
    this._swallowWhiteSpace();
    if(this.currentToken === LDMLPlural.Characters.COMMA) {
      this.currentToken = this.lexer.getNextToken();
      // Go to next non-whitespace token
      this._swallowWhiteSpace();
      this._expectNumber();
    }
  }

  return rangeList;
};

/**
 * Check if a string is space
 *
 * @param {String} string
 * @return {Boolean}
 * @api private
 */

LDMLPlural.prototype._isWhiteSpace = function(character) {
  return ' ' === character || '\n' === character || '\t' === character;
};


/**
 * Check if a character is alpha lowercase
 *
 * @param {String} character
 * @return {Boolean}
 * @api private
 */

LDMLPlural.prototype._isAlphaLowerCase = function(character) {
  return /^[a-z]$/.test(character);
};

/**
 * Swallow spaces
 *
 * @return {void}
 * @api private
 */

LDMLPlural.prototype._swallowWhiteSpace = function() {
  while(this._isWhiteSpace(this.currentToken)) {
    this.currentToken = this.lexer.getNextToken();
  }
};

/**
 * Parse example
 *
 * @return {void}
 * @api private
 */

LDMLPlural.prototype._parseExample = function() {
  while(this.currentToken !== LDMLPlural.Characters.EOF) {
    // Swallow `@`
    this.currentToken = this.lexer.getNextToken();
    if(this.currentToken === LDMLPlural.Characters.FIRST_CHARACTER_OF_INTEGER_EXAMPLE) {
      this._parseIntegerExample();
    }
    else if(this.currentToken === LDMLPlural.Characters.FIRST_CHARACTER_OF_DECIMAL_EXAMPLE) {
      this._parseDecimalExample();
    }
    else {
      throw new TypeError('Expected `@` in ' + this.lexer.getLatestTokensLog());
    }
  }
};

/**
 * Parse integer example
 *
 * @return {void}
 * @api private
 */

LDMLPlural.prototype._parseIntegerExample = function() {
  var integerExample = '';
  while(this._isAlphaLowerCase(this.currentToken)) {
    this.currentToken = this.lexer.getNextToken();
  }

  // Go to first example
  this._swallowWhiteSpace();


  while(this.currentToken !== LDMLPlural.Characters.EOF &&
        this.currentToken !== LDMLPlural.Characters.AT) {
    integerExample += this.currentToken;
    this.currentToken = this.lexer.getNextToken();
  }

  this.integerExample = integerExample.trim().split(', ');
};

/**
 * Parse decimal example
 *
 * @return {void}
 * @api private
 */

LDMLPlural.prototype._parseDecimalExample = function() {
  var decimalExample = '';
  while(this._isAlphaLowerCase(this.currentToken)) {
    this.currentToken = this.lexer.getNextToken();
  }

  // Go to first example
  this._swallowWhiteSpace();

  while(this.currentToken !== LDMLPlural.Characters.EOF &&
        this.currentToken !== LDMLPlural.Characters.AT) {
    decimalExample += this.currentToken;
    this.currentToken = this.lexer.getNextToken();
  }

  this.decimalExample = decimalExample.trim().split(', ');
};

/**
 * namespace AST
 *
 * @namespace AST
 */

LDMLPlural.prototype.AST = AST;

module.exports = new LDMLPlural;
