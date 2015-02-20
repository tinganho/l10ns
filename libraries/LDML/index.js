
var Lexer = require('../Lexer')
  , AST = require('./AST');

/**
 * LDML class
 *
 * @class
 * @constructor
 */

function LDML() {}

/**
 * Binary operation precedence
 *
 * @type {Enum}
 */

LDML.Characters = {
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
  VISIBLE_FRACTIONAL_DIGIT_WITHOUT_TRAILING_ZEROS: 't',
  DOT: '.',
  EOF: -1
};

/**
 * Binary operation precedence
 *
 * @type {Object}
 */

LDML.NumberComparisonGroupTypePrecedence = {
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

LDML.prototype.parse = function(string) {
  this.integerExample = null;
  this.decimalExample = null;
  this.ruleAST = {};
  this.lexer = new Lexer(string);
  this.currentToken = this.lexer.getNextToken();
  this._swallowWhiteSpace();
  while(this.currentToken !== '@' &&
        this.currentToken !== LDML.Characters.EOF) {
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

LDML.prototype._parsePrimary = function() {
  switch(this.currentToken) {
    case LDML.Characters.ABSOLUTE_VALUE:
    case LDML.Characters.INTEGER_DIGIT:
    case LDML.Characters.NUMBER_OF_VISIBLE_FRACTION_DIGITS_WITH_TRAILING_ZEROS:
    case LDML.Characters.NUMBER_OF_VISIBLE_FRACTION_DIGITS_WITHOUT_TRAILING_ZEROS:
    case LDML.Characters.VISIBLE_FRACTIONAL_DIGIT_WITH_TRAILING_ZEROS:
    case LDML.Characters.VISIBLE_FRACTIONAL_DIGIT_WITHOUT_TRAILING_ZEROS:
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

LDML.prototype._isNumber = function(string) {
  return /^\d+$/.test(string);
};

/**
 * Parse number comparison
 *
 * @param {String} string
 * @return {Boolean}
 * @api private
 */

LDML.prototype._parseNumberComparison = function(stop) {
  // Swallow variable
  var variable = new AST.Variable(this.currentToken);
  this.currentToken = this.lexer.getNextToken();

  // Go to operator
  this._swallowWhiteSpace();

  if(!/^[!=%]$/.test(this.currentToken)) {
    throw new TypeError('Expected operator (!,=,%), instead got (' + this.currentToken + ') in ' + this.lexer.getLatestTokensLog());
  }

  if(this.currentToken === LDML.Characters.MODULUS) {
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
  if(this.currentToken === LDML.Characters.FIRST_CHARACTER_OF_IS_NOT) {
    // Swallow '='
    this.lexer.getNextToken();
    this.currentToken = this.lexer.getNextToken();
    comparator = LDML.Characters.IS_NOT;
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

LDML.prototype._parseRHSNumberComparisonGroup = function(previousPrecedence, LHS) {
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

LDML.prototype._getNumberComparisonGroupTypePrecedence = function() {
  if(this.currentToken === LDML.Characters.FIRST_CHARACTER_OF_AND) {
    return LDML.NumberComparisonGroupTypePrecedence[
      LDML.Characters.AND
    ];
  }
  else if(this.currentToken === LDML.Characters.FIRST_CHARACTER_OF_OR) {
    return LDML.NumberComparisonGroupTypePrecedence[
      LDML.Characters.OR
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

LDML.prototype._getNumberComparisonGroupType = function() {
  if(this.currentToken === LDML.Characters.FIRST_CHARACTER_OF_AND) {
    // Swallow 'nd'
    this.lexer.getNextToken();
    this.lexer.getNextToken();

    this.currentToken = this.lexer.getNextToken();
    this._swallowWhiteSpace();

    return LDML.Characters.AND;
  }
  else if(this.currentToken === LDML.Characters.FIRST_CHARACTER_OF_OR) {
    // Swallow 'or'
    this.lexer.getNextToken();

    this.currentToken = this.lexer.getNextToken();
    this._swallowWhiteSpace();
    return LDML.Characters.OR;
  }
};

/**
 * Expect digit
 *
 * @return {void}
 * @api private
 */

LDML.prototype._expectNumber = function() {
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

LDML.prototype._parseRangeList = function() {
  var rangeList = new AST.RangeList;
  while(this._isNumber(this.currentToken)) {
    var startValue = '';
    while(this._isNumber(this.currentToken)) {
      startValue += this.currentToken;
      this.currentToken = this.lexer.getNextToken();
    }
    startValue = parseInt(startValue, 10);
    if(this.currentToken === LDML.Characters.DOT) {
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
    if(this.currentToken === LDML.Characters.COMMA) {
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

LDML.prototype._isWhiteSpace = function(character) {
  return ' ' === character || '\n' === character || '\t' === character;
};


/**
 * Check if a character is alpha lowercase
 *
 * @param {String} character
 * @return {Boolean}
 * @api private
 */

LDML.prototype._isAlphaLowerCase = function(character) {
  return /^[a-z]$/.test(character);
};

/**
 * Swallow spaces
 *
 * @return {void}
 * @api private
 */

LDML.prototype._swallowWhiteSpace = function() {
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

LDML.prototype._parseExample = function() {
  while(this.currentToken !== LDML.Characters.EOF) {
    // Swallow `@`
    this.currentToken = this.lexer.getNextToken();
    if(this.currentToken === LDML.Characters.FIRST_CHARACTER_OF_INTEGER_EXAMPLE) {
      this._parseIntegerExample();
    }
    else if(this.currentToken === LDML.Characters.FIRST_CHARACTER_OF_DECIMAL_EXAMPLE) {
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

LDML.prototype._parseIntegerExample = function() {
  var integerExample = '';
  while(this._isAlphaLowerCase(this.currentToken)) {
    this.currentToken = this.lexer.getNextToken();
  }

  // Go to first example
  this._swallowWhiteSpace();


  while(this.currentToken !== LDML.Characters.EOF &&
        this.currentToken !== LDML.Characters.AT) {
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

LDML.prototype._parseDecimalExample = function() {
  var decimalExample = '';
  while(this._isAlphaLowerCase(this.currentToken)) {
    this.currentToken = this.lexer.getNextToken();
  }

  // Go to first example
  this._swallowWhiteSpace();

  while(this.currentToken !== LDML.Characters.EOF &&
        this.currentToken !== LDML.Characters.AT) {
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

LDML.prototype.AST = AST;

module.exports = new LDML;
