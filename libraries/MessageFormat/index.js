
/**
 * Requires
 */
var Lexer = require('../Lexer');
var AST = require('./AST');
var fs = require('fs');
var path = require('path');
var LDML = require('../LDML');
var _ = require('underscore');
var currencySymbols = require('./currencySymbols');
var cache = {};
var bcp47 = require('bcp47');
var CLDR = require('cldrjs');
var mostLikelyLanguageTagMapping = require('../../configurations/mostLikelyLanguageTagMapping');
var defaultLanguageTag = require('cldr-data/defaultContent.json').defaultContent;

/**
 * MessageFormat class
 *
 * @constructor
 */
function MessageFormat(languageTag) {
  this.languageTag = this.getMostLikelyLanguageTag_(languageTag || program.defaultLanguageTag);
  var languageTag = bcp47.parse(this.languageTag);
  if(!languageTag) {
    throw new TypeError('Your language tag (' + this.languageTag + ') is not bcp47 compliant. For more info https://tools.ietf.org/html/bcp47.');
  }
  this.script = languageTag.langtag.script;
  this.language = languageTag.langtag.language.language;
  this.region = languageTag.langtag.region;
  if (!this.languageTag) {
    this.languageTag = this.language;
    if (this.script) {
      this.languageTag += '-' + this.script;
    }
    if (this.region) {
      this.languageTag += '-' + this.region;
    }
  }

  CLDR.load(
    require('cldr-data/supplemental/likelySubtags'),
    require('cldr-data/supplemental/plurals'),
    require('cldr-data/supplemental/ordinals'),
    require('cldr-data/supplemental/metaZones'),
    require('cldr-data/main/' + this.languageTag + '/numbers'),
    require('cldr-data/main/' + this.languageTag + '/currencies'),
    require('cldr-data/main/' + this.languageTag + '/ca-gregorian'),
    require('cldr-data/main/' + this.languageTag + '/timeZoneNames')
  );

  this.CLDR = new CLDR(this.languageTag);

  this.variables = null;
  this.pluralRules = {};
  this.ordinalRules = {};
  this.lexer = null;
  this.messageAST = [];
  this.currentToken = null;
  this.lastChoiceCase = null;
  this.numberSymbols = {};
  this.decimalPatterns = {};
  this.percentagePatterns = {};
  this.currencyPatterns = {};
  this.shortFormats = {};
  this.longFormats = {};
  this.shortFormatDecimalPatterns = {};
  this.longFormatDecimalPatterns = {};
  this.currencies = {};
  this.date = {};
  this.languageTagDocument = null;
  this.languageDocument = null;
  this.rootDocument = null;
  this._currentNumberSystem = 'latn';
  this.currencyUnitPattern = {};

  if(typeof cache[this.languageTag] === 'undefined') {
    cache[this.languageTag] = {};
  }

  this._readPluralRules();
  this._readOrdinalRules();
  this._readNumberFormatsData();
  this._readDateData();
  if(project.timezones) {
    this._readTimezone();
  }
};


/**
 * Characters
 *
 * @enum {String}
 * @api private
 */
MessageFormat.Characters = {
  STARTING_BRACKET: '{',
  ENDING_BRACKET: '}',
  ESCAPE_CHARACTER: '\'',
  REMAINING: '#',
  DIAGRAPH: '|',
  EMPTY: '',
  COMMA: ',',
  EOF: -1,
  NUMBER_SYSTEM_SEPARATOR: ':'
};


/**
 * Numbering systems
 *
 * @enum {Number}
 * @api public
 */
MessageFormat.NumberSystems = {
  ARAB: 'arab',
  ARABEXT: 'arabext',
  BALI: 'bali',
  BENG: 'beng',
  DEVA: 'deva',
  GUJR: 'gujr',
  GURU: 'guru',
  HANIDEC: 'hanidec',
  KHMR: 'khmr',
  KNDA: 'knda',
  LAOO: 'laoo',
  LATN: 'latn',
  LIMB: 'limb',
  MLYM: 'mlym',
  MONG: 'mong',
  MYMR: 'mymr',
  ORYA: 'orya',
  TAMLDEC: 'tamldec',
  TELU: 'telu',
  THAI: 'thai',
  TIBT: 'tibt'
};


/**
 * Default number system.
 *
 * @type {String}
 * @api public
 */
MessageFormat.DEFAULT_NUMBER_SYSTEM = 'latn';


/**
 * If locale string misses the language modifier you can call
 * this function to return the most likely.
 *
 * @param {String} locale
 * @return {String} locale
 * @api private
 */
MessageFormat.prototype.getMostLikelyLanguageTag_ = function(language) {
  if(language in mostLikelyLanguageTagMapping) {
    return mostLikelyLanguageTagMapping[language];
  }
  else if(defaultLanguageTag.indexOf(language) !== -1) {
    return language.split('-')[0];
  }
  else {
    return null;
  }
};


/**
 * Define what kind of variables is allowed on the parse string.
 * If no variables are defined, all variables will be accepted.
 * If variables is defined, the only those can appear in the a
 * message formated string. Please call this function before you
 * call MessageFormat.parse(string).
 *
 * @param {Array.<String>} variables
 * @return {void}
 * @api public
 */
MessageFormat.prototype.setVariables = function(variables) {
  this.variables = variables;
};


/**
 * Unset variables. Call this method if you have set any variables
 * you do not want to use anymore.
 *
 * @return {void}
 * @api public
 */
MessageFormat.prototype.unsetVariables = function() {
  this.variables = null;
};


/**
 * Parse a message formated string
 *
 * @param {String} message A message formated string
 * @return {void}
 */
MessageFormat.prototype.parse = function(message) {
  this.messageAST = [];
  this.lexer = new Lexer(message);
  this.currentToken = this.lexer.getNextToken();
  while(this.currentToken !== MessageFormat.Characters.EOF) {
    this.messageAST.push(this._parsePrimary());
  }
};


/**
 * Handle top level expresion
 *
 * @return {AST}
 * @api private
 */
MessageFormat.prototype._parsePrimary = function(options) {
  options = _.defaults(options || {}, {
    parseRemaining: false,
    escapeCharacter: null,
    shouldEscapeDiagraph: true,
    currentNumberSystem: this._currentNumberSystem
  });

  this.shouldParseRemaining = options.parseRemaining;
  this.shouldEscapeDiagraph = options.shouldEscapeDiagraph;
  this.escapeCharacter = options.escapeCharacter;

  if(options.parseRemaining && this.currentToken === MessageFormat.Characters.REMAINING) {
    var integerPattern = AST.NumberFormatPattern.parse(this.decimalPatterns[options.currentNumberSystem]).positive;
    return this._parseRemaining(
      options.variable,
      options.offset,
      integerPattern,
      options.currentNumberSystem
    );
  }

  switch(this.currentToken) {
    case MessageFormat.Characters.STARTING_BRACKET:
      return this._parseBracketStatement();
    default:
      return this._parseSentence();
  }
};


/**
 * Parse plural remaining
 *
 * @param {AST.Variable} variable
 * @param {Number} offset
 * @param {Object} pattern
 * @return {AST.PluralRemaining}
 * @api private
 */
MessageFormat.prototype._parseRemaining = function(variable, offset, pattern, numberSystem) {
  // Swallow '#'
  this.currentToken = this.lexer.getNextToken();

  return new AST.Remaining(variable, offset, pattern, numberSystem);
};


/**
 * Parse sentence
 *
 * @return {AST.Sentence}
 * @api private
 */
MessageFormat.prototype._parseSentence = function() {
  var sentence = '';
  while(this.currentToken !== MessageFormat.Characters.EOF &&
        this.currentToken !== MessageFormat.Characters.STARTING_BRACKET &&
        this.currentToken !== MessageFormat.Characters.ENDING_BRACKET &&
      !(this.currentToken === MessageFormat.Characters.REMAINING && this.shouldParseRemaining)) {
    if(this.currentToken === MessageFormat.Characters.DIAGRAPH && !this.shouldEscapeDiagraph) {
      break;
    }
    if(this.currentToken === MessageFormat.Characters.ESCAPE_CHARACTER) {
      var nextToken = this.lexer.nextToken();
      if(nextToken === MessageFormat.Characters.STARTING_BRACKET ||
         nextToken === MessageFormat.Characters.ENDING_BRACKET ||
         nextToken === this.escapeCharacter) {
        // Swallow '
        this.currentToken = this.lexer.getNextToken();
        while(this.currentToken !== MessageFormat.Characters.ESCAPE_CHARACTER) {
          sentence += this.currentToken;
          this.currentToken = this.lexer.getNextToken();
          if(this.currentToken === MessageFormat.Characters.EOF) {
            throw new TypeError('Escape message doesn\'t have an ending quote(\') in ' + this.lexer.getLatestTokensLog());
          }
        }
      }
      else {
        sentence += this.currentToken;
      }
    }
    else {
      sentence += this.currentToken;
    }
    this.currentToken = this.lexer.getNextToken();
  }

  return new AST.Sentence(sentence);
};


/**
 * Parse bracket statements (variable|select|plural)
 *
 * @param {Strin}
 * @return {void}
 * @api private
 */
MessageFormat.prototype._parseBracketStatement = function() {
  // Swallow '{'
  this.currentToken = this.lexer.getNextToken();

  var variable = this._parseVariable();

  if(this.currentToken === MessageFormat.Characters.COMMA) {
    return this._parseSwitchStatement(variable);
  }
  else if(this.currentToken === MessageFormat.Characters.ENDING_BRACKET ||
          this.currentToken === MessageFormat.Characters.EOF) {
    this.currentToken = this.lexer.getNextToken();
    return variable;
  }
  else {
    throw new TypeError('Expected \'{\' or \',\', instead got \''
      + this.currentToken + '\' in \'' +  this.lexer.getLatestTokensLog());
  }
};


/**
 * Parse variable
 *
 * @return {AST.Sentence}
 * @api private
 */
MessageFormat.prototype._parseVariable = function() {
  var name = '';

  this._swallowWhiteSpace();

  while(this.currentToken !== MessageFormat.Characters.EOF &&
        this.currentToken !== MessageFormat.Characters.STARTING_BRACKET &&
        this.currentToken !== MessageFormat.Characters.ENDING_BRACKET &&
        this.currentToken !== MessageFormat.Characters.COMMA) {
    if(!this._isAlphaNumeric(this.currentToken) &&
        (this.currentToken !== ' ' && this.currentToken !== '\t') ) {
      throw new TypeError('Variable names must be alpha numeric, got a \'' + this.currentToken + '\' in ' + this.lexer.getLatestTokensLog());
    }
    name += this.currentToken;
    this.currentToken = this.lexer.getNextToken();
  }

  name = name.trim();

  if(this.variables !== null &&
     this.variables.indexOf(name) === -1) {
    throw new TypeError('Variable \'' + name + '\' is not defined in \'' + this.lexer.getLatestTokensLog() + '\'. Please tell your developer to add the variable to his source code and update translations.');
  }

  if(name.length === 0) {
    throw new TypeError('Could not parse variable in ' + this.lexer.getLatestTokensLog());
  }

  if(!this._isAlphaNumeric(name)) {
    throw new TypeError('You can not have spaces or tabs in ' + this.lexer.getLatestTokensLog());
  }

  return new AST.Variable(name);
};


/**
 * Parse switch statement
 *
 * @param {String} variable
 * @return {AST}
 * @api private
 * @throw TypeError
 */
MessageFormat.prototype._parseSwitchStatement = function(variable) {
  var type = '';
  var numberSystem = '';
  var switchStatement = null;
  // Swallow comma
  this.currentToken = this.lexer.getNextToken();

  this._swallowWhiteSpace();

  while(this._isAlphaNumeric(this.currentToken)){
    type += this.currentToken;
    this.currentToken = this.lexer.getNextToken();
  }
  if(this.currentToken === MessageFormat.Characters.NUMBER_SYSTEM_SEPARATOR) {
    this.currentToken = this.lexer.getNextToken();
    while(this._isAlphaNumeric(this.currentToken)) {
      numberSystem += this.currentToken;
      this.currentToken = this.lexer.getNextToken();
    }

    if(!MessageFormat.NumberSystems.hasOwnProperty(numberSystem.toUpperCase())) {
      throw new TypeError('No defined number system in l10ns called \'' + numberSystem + '\'');
    }
  }
  else {
    numberSystem = this.defaultNumberSystem;
  }
  this._currentNumberSystem = numberSystem;

  this._swallowWhiteSpace();

  if(this.currentToken !== MessageFormat.Characters.COMMA) {
    throw new TypeError('Missing comma in: ' + this.lexer.getLatestTokensLog());
  }

  switch(type) {
    case 'date':
    case 'number':
      switchStatement = this._parseSimpleFormat(type, variable);
      break;
    case 'currency':
      switchStatement = this._parseCurrencyFormat(variable);
      break;
    case 'select':
      switchStatement = this._parseSelectFormat(variable);
      break;
    case 'plural':
      switchStatement = this._parsePluralFormat(variable);
      break;
    case 'selectordinal':
      switchStatement = this._parseSelectordinalFormat(variable);
      break;
    default:
      throw new TypeError('Wrong type of ICU format: ' + type);
  }

  return switchStatement;
};


/**
 * Parse simple format
 *
 * @param {String} type (number|date|time|spellout|ordinal|duration)
 * @param {AST.Variable} variable
 * @return {AST.SimpleFormat}
 * @api private
 */
MessageFormat.prototype._parseSimpleFormat = function(type, variable) {
  var argument = '';
  // Swallow comma
  this.currentToken = this.lexer.getNextToken();
  this._swallowWhiteSpace();
  while(this.currentToken !== MessageFormat.Characters.ENDING_BRACKET &&
        this.currentToken !== MessageFormat.Characters.EOF) {
    argument += this.currentToken;
    this.currentToken = this.lexer.getNextToken();
  }

  this._swallowWhiteSpace();

  if(this.currentToken !== MessageFormat.Characters.ENDING_BRACKET) {
    throw new TypeError('You must have a closing bracket in your simple format in ' + this.lexer.getLatestTokensLog());
  }

  if(!/^(number|date|time)$/.test(type)) {
    throw new TypeError('SimpleFormat has invalid type (number|date|time) in ' + this.lexer.getNextToken());
  }

  this.currentToken = this.lexer.getNextToken();

  switch(type) {
    case 'date':
      return new AST.date.DateFormat(this.languageTag, variable, argument, this.date, this._currentNumberSystem);
    case 'number':
      if(!this.decimalPatterns.hasOwnProperty(this._currentNumberSystem)) {
        throw new TypeError('Locale `' + this.languageTag + '` does not have `'  + this._currentNumberSystem + '` number system.');
      }
      return new AST.NumberFormat(
        this.languageTag,
        this.language,
        this.region,
        variable,
        argument,
        this.numberSymbols[this._currentNumberSystem],
        this.currencies,
        AST.NumberFormatPattern.parse(this.decimalPatterns[this._currentNumberSystem]),
        AST.NumberFormatPattern.parse(this.percentagePatterns[this._currentNumberSystem]),
        this.shortFormats[this._currentNumberSystem],
        this.longFormats[this._currentNumberSystem],
        this._currentNumberSystem
      );
  }
};


/**
 * Parse currency format
 *
 * @param {AST.Variable} variable
 * @return {AST.CurrencyFormat}
 * @api private
 */
MessageFormat.prototype._parseCurrencyFormat = function(variable) {
  var context = ''
    , numberSystem = ''
    , type = '';

  // Swallow comma
  this.currentToken = this.lexer.getNextToken();
  this._swallowWhiteSpace();
  while(this._isAlphaNumeric(this.currentToken)) {
    context += this.currentToken
    this.currentToken = this.lexer.getNextToken();
  }

  if(this.currentToken !== MessageFormat.Characters.COMMA) {
    throw new TypeError('Missing comma in currency format in ' + this.lexer.getLatestTokensLog());
  }
  // Swallow comma
  this.currentToken = this.lexer.getNextToken();
  this._swallowWhiteSpace();
  while(this._isAlphaNumeric(this.currentToken)) {
    type += this.currentToken
    this.currentToken = this.lexer.getNextToken();
  }
  this._swallowWhiteSpace();

  if(this.currentToken !== MessageFormat.Characters.ENDING_BRACKET) {
    throw new TypeError('You must have a closing bracket in your currency format in ' + this.lexer.getLatestTokensLog());
  }

  // Swallow ending bracket
  this.currentToken = this.lexer.getNextToken();

  if(['local', 'global', 'reverseglobal'].indexOf(context) === -1) {
    throw new TypeError('Third argument, context argument, must be either local, global or reverseglobal in ' + this.lexer.getLatestTokensLog());
  }
  if(['symbol', 'text'].indexOf(type) === -1) {
    throw new TypeError('Fourth argument, type argument, must be either symbol or text in ' + this.lexer.getLatestTokensLog());
  }
  if(type !== 'symbol' && context === 'reverseglobal') {
    throw new TypeError('Third argument, context argument, can only be reverseglobal if type is symbol in ' + this.lexer.getLatestTokensLog())
  }
  if(context === 'reverseglobal') {
    context = 'reverseGlobal';
  }

  return new AST.CurrencyFormat(
    this.languageTag,
    this.language,
    this.region,
    variable,
    context,
    type,
    this.currencies,
    AST.NumberFormatPattern.parse(this.currencyPatterns[this._currentNumberSystem]),
    this._currentNumberSystem
  );
};


/**
 * Get limit string from case string
 *
 * @param {String} _case
 * @return {Array} first index is the limit value, second index is
 * the type of the limit
 * @api private
 */
MessageFormat.prototype._getLimitFromCase = function(_case) {
  var limit = /(\-?\d+\.?\d*|\-?∞)([<#])/.exec(_case);
  if(/^∞$/.test(limit[1])) {
    limit[1] = Infinity;
  }
  else if(/^\-∞$/.test(limit[1])) {
    limit[1] = -Infinity;
  }
  else {
    limit[1] = parseFloat(limit[1]);
  }

  limit[2] = limit[2].replace('#', '>=').replace('<', '>')

  return limit;
};


/**
 * Parse SelectFormat
 *
 * @param {String} variable
 * @return {AST.SelectFormat}
 * @api private
 */
MessageFormat.prototype._parseSelectFormat = function(variable) {
  var values = {};

  // Swallow comma
  this.currentToken = this.lexer.getNextToken();
  var _case = this._getSelectCase();
  while(true) {
    if(this.currentToken === MessageFormat.Characters.ENDING_BRACKET) {
      throw new TypeError('Missing \'other\' case in ' + this.lexer.getLatestTokensLog());
    }
    if(this.currentToken !== MessageFormat.Characters.STARTING_BRACKET) {
      throw new TypeError('Expected bracket \'{\' instead got \'' + this.currentToken + '\' in ' + this.lexer.getLatestTokensLog());
    }
    var messageAST = [];
    this.currentToken = this.lexer.getNextToken();
    while(this.currentToken !== MessageFormat.Characters.ENDING_BRACKET) {
      messageAST.push(this._parsePrimary());
    }
    values[_case] = messageAST;
    this.currentToken = this.lexer.getNextToken();
    if(_case !== 'other') {
      _case = this._getSelectCase();
    }
    else {
      this._swallowWhiteSpace();
      if(this.currentToken === MessageFormat.Characters.EOF) {
        throw new TypeError('Expected closing bracket \'}\' in instead got EOF in ' + this.lexer.getLatestTokensLog());
      }
      if(this.currentToken !== MessageFormat.Characters.ENDING_BRACKET) {
        throw new TypeError('Expected closing bracket \'}\' in instead got \'' + this.currentToken + '\' in ' + this.lexer.getLatestTokensLog());
      }
      // Swallow ending bracket of PluralFormat
      this.currentToken = this.lexer.getNextToken();
      return new AST.SelectFormat(variable, values);
    }
  }
};


/**
 * Parse PluralFormat
 *
 * @param {String} variable
 * @return {AST.PluralFormat}
 * @api private
 */
MessageFormat.prototype._parsePluralFormat = function(variable) {
  var offset = 0;
  var values = {};
  var offsetSyntax = /^offset:(\d)$/;
  var exactlySyntax = /^=\-?(\d+(\.\d+)|Infinity|infinity)?/;
  var pluralKeywords = Object.keys(this.pluralRules);

  // Swallow comma
  this.currentToken = this.lexer.getNextToken();
  var _case = this._getPluralCase();
  while(true) {
    if(offsetSyntax.test(_case)) {
      offset = parseInt(offsetSyntax.exec(_case)[1], 10);
      offsetSyntax.lastIndex = 0;
      _case = this._getPluralCase();
    }
    else if(exactlySyntax.test(_case) || pluralKeywords.indexOf(_case) !== -1) {
      if(this.currentToken !== MessageFormat.Characters.STARTING_BRACKET) {
        throw new TypeError('Expected bracket \'{\' instead got \'' + this.currentToken + '\' in ' + this.lexer.getLatestTokensLog());
      }
      var messageAST = [];
      this.currentToken = this.lexer.getNextToken();
      var currentNumberSystem = this._currentNumberSystem;
      while(this.currentToken !== MessageFormat.Characters.ENDING_BRACKET) {
        messageAST.push(this._parsePrimary({
          escapeCharacter: '#',
          parseRemaining: true,
          offset: offset,
          variable: variable,
          numberSystem: currentNumberSystem
        }));
      }
      values[_case] = messageAST;
      exactlySyntax.lastIndex = 0;
      // Swallow ending bracket of sub-message
      this.currentToken = this.lexer.getNextToken();
      if(_case !== 'other') {
        _case = this._getPluralCase();
      }
      else {
        this._swallowWhiteSpace();
        // Swallow ending bracket of PluralFormat
        if(this.currentToken === MessageFormat.Characters.EOF) {
          throw new TypeError('Expected closing bracket \'}\' in instead got EOF in ' + this.lexer.getLatestTokensLog());
        }
        if(this.currentToken !== MessageFormat.Characters.ENDING_BRACKET) {
          throw new TypeError('Expected closing bracket \'}\' in instead got \'' + this.currentToken + '\' in ' + this.lexer.getLatestTokensLog());
        }
        this.currentToken = this.lexer.getNextToken();
        return new AST.PluralFormat(this.languageTag, variable, values, offset);
      }
    }
    else {
      // Case are empty if an other case is missing
      if(_case === '' ) {
        throw new TypeError('There must exist one other case in ' + this.lexer.getLatestTokensLog());
      }
      else {
        throw new TypeError('Expected a keyword (' + pluralKeywords.join(', ')+ ') or an exact case (=n). Instead got \'' + _case + '\' in ' + this.lexer.getLatestTokensLog());
      }
    }
  }
};


/**
 * Parse select ordinal format
 *
 * @return {AST.SelectordinalFormat}
 * @api private
 */
MessageFormat.prototype._parseSelectordinalFormat = function(variable) {
  var offset = 0;
  var values = {};
  var exactlySyntax = /^=\d+$/;
  var ordinalKeywords = Object.keys(this.ordinalRules);

  // Swallow comma
  this.currentToken = this.lexer.getNextToken();
  var _case = this._getPluralCase();
  while(true) {
    if(exactlySyntax.test(_case) || ordinalKeywords.indexOf(_case) !== -1) {
      if(this.currentToken !== MessageFormat.Characters.STARTING_BRACKET) {
        throw new TypeError('Expected bracket \'{\' instead got \'' + this.currentToken + '\' in ' + this.lexer.getLatestTokensLog());
      }
      var messageAST = [];
      this.currentToken = this.lexer.getNextToken();
      var currentNumberSystem = this._currentNumberSystem;
      while(this.currentToken !== MessageFormat.Characters.ENDING_BRACKET) {
        messageAST.push(this._parsePrimary({
          escapeCharacter: '#',
          parseRemaining: true,
          offset: offset,
          variable: variable,
          numberSystem: currentNumberSystem
        }));
      }
      values[_case] = messageAST;
      exactlySyntax.lastIndex = 0;
      // Swallow ending bracket of sub-message
      this.currentToken = this.lexer.getNextToken();
      if(_case !== 'other') {
        _case = this._getPluralCase();
      }
      else {
        this._swallowWhiteSpace();
        // Swallow ending bracket of PluralFormat
        if(this.currentToken === MessageFormat.Characters.EOF) {
          throw new TypeError('Expected closing bracket \'}\' in instead got EOF in ' + this.lexer.getLatestTokensLog());
        }
        if(this.currentToken !== MessageFormat.Characters.ENDING_BRACKET) {
          throw new TypeError('Expected closing bracket \'}\' in instead got \'' + this.currentToken + '\' in ' + this.lexer.getLatestTokensLog());
        }
        this.currentToken = this.lexer.getNextToken();
        return new AST.SelectordinalFormat(this.languageTag, variable, values, offset);
      }
    }
    else {
      // Case are empty if an other case is missing
      if(_case === '' ) {
        throw new TypeError('There must exist one other case in ' + this.lexer.getLatestTokensLog());
      }
      else {
        throw new TypeError('Expected a keyword (' + ordinalKeywords.join(', ')+ ') or an exact case (=n). Instead got \'' + _case + '\' in ' + this.lexer.getLatestTokensLog());
      }
    }
  }
};


/**
 * Get plural case
 *
 * @return {String}
 * @api private
 */
MessageFormat.prototype._getSelectCase = function() {
  var _case = '';

  this._swallowWhiteSpace();

  while(this._isAlphaNumeric(this.currentToken)) {
    _case += this.currentToken;
    this.currentToken = this.lexer.getNextToken();
  }

  this._swallowWhiteSpace();

  return _case;
};


/**
 * Get plural case
 *
 * @return {String}
 * @api private
 */
MessageFormat.prototype._getPluralCase = function() {
  var _case = '';

  this._swallowWhiteSpace();

  while(this._isAlphaNumeric(this.currentToken) ||
        this.currentToken === '=' ||
        this.currentToken === '-' ||
        this.currentToken === '.' ||
        this.currentToken === ':') {
    _case += this.currentToken;
    this.currentToken = this.lexer.getNextToken();
  }

  this._swallowWhiteSpace();

  return _case;
};


/**
 * Check if a string is alpha numeric
 *
 * @param {String} string
 * @return {Boolean}
 * @api private
 */
MessageFormat.prototype._isAlphaNumeric = function(character) {
  return /^[a-zA-Z0-9_]+$/.test(character);
};


/**
 * Check if a string is alpha lower case
 *
 * @param {String} string
 * @return {Boolean}
 * @api private
 */
MessageFormat.prototype._isAlphaLowerCase = function(character) {
  return /^[a-z]$/.test(character);
};


/**
 * Check if a string is space
 *
 * @param {String} string
 * @return {Boolean}
 * @api private
 */
MessageFormat.prototype._isWhiteSpace = function(character) {
  return /^\s$/.test(character);
};


/**
 * Swallow spaces
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._swallowWhiteSpace = function() {
  while(this._isWhiteSpace(this.currentToken)) {
    this.currentToken = this.lexer.getNextToken();
  }
};


/**
 * Read pluralization rules
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readPluralRules = function() {
  if(cache[this.languageTag].pluralRules) {
    this.pluralRules = cache[this.languageTag].pluralRules;
    return;
  }

  var _this = this;

  var pluralRules = this.CLDR.get('supplemental/plurals-type-cardinal/' + this.language);
  if(!pluralRules) {
    throw new TypeError('No plural rules exist for ' + this.languageTag + ' in CLDR.');
  }

  for(var count in pluralRules) {
    var pluralRule = pluralRules[count];
    var case_ = count.replace('pluralRule-count-', '');
    this.pluralRules[case_] = LDML.parse(pluralRule);
    this.pluralRules[case_].example = LDML.integerExample || LDML.decimalExample;
  }

  cache[this.languageTag].pluralRules = this.pluralRules;
};


/**
 * Read ordinal rules
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readOrdinalRules = function() {
  if(cache[this.languageTag].ordinalRules) {
    this.ordinalRules = cache[this.languageTag].ordinalRules;
    return;
  }

  var ordinalRules = this.CLDR.get('supplemental/plurals-type-ordinal/' + this.language);
  if(!ordinalRules) {
    throw new TypeError('No ordinal rules exist for ' + this.languageTag + ' in CLDR.');
  }

  for(var count in ordinalRules) {
    var ordinalRule = ordinalRules[count];
    var case_ = count.replace('pluralRule-count-', '');
    this.ordinalRules[case_] = LDML.parse(ordinalRule);
    this.ordinalRules[case_].example = LDML.integerExample;
  }

  cache[this.languageTag].ordinalRules = this.ordinalRules;
};


/**
 * Read time zone supplemental data
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readTimezone = function() {
  if(cache[this.languageTag].timezones) {
    this.timezones = cache[this.languageTag].timezones;
    return;
  }

  var timezones = {};
  if(project.timezones) {
    for(var index in project.timezones) {
      var timezone = project.timezones[index];
      timezones[timezone] = {
        name: { long: {}, short: {} }
      };
      var mapZone = this.CLDR.get('supplemental/metaZones/metazoneInfo/timezone/' + timezone)
      if(!mapZone) {
        throw new TypeError('Time zone: ' + timezone + ' does not exists');
      }
      var mapZoneID = mapZone[0].usesMetazone._mzone;
      timezones[timezone].name.long.standard = this.CLDR.main('dates/timeZoneNames/metazone/' + mapZoneID + '/long/standard') || null;
      timezones[timezone].name.long.daylight = this.CLDR.main('dates/timeZoneNames/metazone/' + mapZoneID + '/long/daylight') || null;
      timezones[timezone].name.long.generic = this.CLDR.main('dates/timeZoneNames/metazone/' + mapZoneID + '/long/generic') || null;
      timezones[timezone].name.short.standard = this.CLDR.main('dates/timeZoneNames/metazone/' + mapZoneID + '/short/standard') || null;
      timezones[timezone].name.short.daylight = this.CLDR.main('dates/timeZoneNames/metazone/' + mapZoneID + '/short/daylight') || null;
      timezones[timezone].name.short.generic = this.CLDR.main('dates/timeZoneNames/metazone/' + mapZoneID + '/short/generic') || null;

      var city = this.CLDR.main('dates/timeZoneNames/zone/' + timezone + '/exemplarCity');
      if(city) {
        timezones[timezone].hasCity = true;
        timezones[timezone].city = city;
      }
      else {
        timezones[timezone].hasCity = false;
        timezones[timezone].city = this.CLDR.main('dates/timeZoneNames/zone/Etc/Unknown/exemplarCity');
      }
      timezones[timezone].regionFormat = this.CLDR.main('dates/timeZoneNames/regionFormat');
      timezones[timezone].GMTFormat = this.CLDR.main('dates/timeZoneNames/gmtFormat');
    }
  }

  this.timezones = cache[this.languageTag].timezones = timezones;
};


/**
 * Read number format data such as currency, number symbols and different
 * number patterns.
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readNumberFormatsData = function() {
  this._readNumberFormatPatterns();
  this._readNumberSymbols();
  this._readCurrencyData();
};


/**
 * Read number format patterns
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readNumberFormatPatterns = function() {
  if(cache[this.languageTag].defaultNumberSystem) {
    this.defaultNumberSystem = cache[this.languageTag].defaultNumberSystem;
    this.nativeNumberSystem = cache[this.languageTag].nativeNumberSystem;
    this.decimalPatterns = cache[this.languageTag].decimalPatterns;
    this.percentagePatterns = cache[this.languageTag].percentagePatterns;
    this.currencyPatterns = cache[this.languageTag].currencyPatterns;
    this.shortFormats = cache[this.languageTag].shortFormats;
    this.longFormats = cache[this.languageTag].longFormats;
    this.shortFormatDecimalPatterns = cache[this.languageTag].shortFormatDecimalPatterns;
    this.longFormatDecimalPatterns = cache[this.languageTag].longFormatDecimalPatterns;
    return;
  }

  var pattern;

  this.defaultNumberSystem = this.CLDR.main('numbers/defaultNumberingSystem');
  this.nativeNumberSystem = this.CLDR.main('numbers/otherNumberingSystems/native');
  for(var property in MessageFormat.NumberSystems) {
    if(MessageFormat.NumberSystems.hasOwnProperty(property)) {
      var numberSystem = MessageFormat.NumberSystems[property];
      if(numberSystem !== this.nativeNumberSystem &&
         numberSystem !== this.defaultNumberSystem &&
         numberSystem !== MessageFormat.DEFAULT_NUMBER_SYSTEM) {
        continue;
      }
      this.decimalPatterns[numberSystem] =
        this.CLDR.main('numbers/decimalFormats-numberSystem-'
          + numberSystem + '/standard');

      var shortFormats =
        this.CLDR.main('numbers/decimalFormats-numberSystem-'
          + numberSystem + '/short/decimalFormat');

      this.shortFormats[numberSystem] = [];
      this.shortFormatDecimalPatterns[numberSystem] = {};
      var shortFormatThresholds = [];
      var shortFormatThresholdIndex = -1;
      for (var meta in shortFormats) {
        var splittedMeta = meta.split('-');
        var decimalPattern = /(0+)/.exec(shortFormats[meta])[1];
        if (!decimalPattern) {
          throw new Error('No short format decimal pattern in \'' + this.language + '-' + this.script + '-' + this.region)
        }
        if (!(decimalPattern in this.shortFormatDecimalPatterns[numberSystem])) {
          this.shortFormatDecimalPatterns[numberSystem][decimalPattern] = AST.NumberFormatPattern.parse(decimalPattern).positive;
        }
        var threshold = parseFloat(splittedMeta[0]);
        if (shortFormatThresholds.indexOf(threshold) === -1) {
          this.shortFormats[numberSystem].push({
            threshold: threshold,
            formats: [{
              pluralForm: splittedMeta[2],
              format: shortFormats[meta].replace(decimalPattern, '{0}'),
              decimalPattern: decimalPattern
            }],
          });
          shortFormatThresholds.push(threshold);
          shortFormatThresholdIndex++;
        }
        else {
          this.shortFormats[numberSystem][shortFormatThresholdIndex].formats.push({
            pluralForm: splittedMeta[2],
            format: shortFormats[meta].replace(decimalPattern, '{0}'),
            decimalPattern: decimalPattern
          });
        }
      }

      var longFormats =
        this.CLDR.main('numbers/decimalFormats-numberSystem-'
          + numberSystem + '/long/decimalFormat');

      this.longFormats[numberSystem] = [];
      this.longFormatDecimalPatterns[numberSystem] = {};
      var longFormatThresholds = [];
      var longFormatThresholdIndex = -1;
      for (var meta in longFormats) {
        var splittedMeta = meta.split('-');
        var decimalPattern = /(0+)/.exec(longFormats[meta])[1];
        if (!decimalPattern) {
          throw new Error('No long format decimal pattern in \'' + this.language + '-' + this.script + '-' + this.region)
        }
        if (!(decimalPattern in this.longFormatDecimalPatterns[numberSystem])) {
          this.longFormatDecimalPatterns[numberSystem][decimalPattern] = AST.NumberFormatPattern.parse(decimalPattern).positive;
        }
        var threshold = parseFloat(splittedMeta[0]);
        if (longFormatThresholds.indexOf(threshold) === -1) {
          this.longFormats[numberSystem].push({
            threshold: threshold,
            formats: [{
              pluralForm: splittedMeta[2],
              format: longFormats[meta].replace(decimalPattern, '{0}'),
              decimalPattern: decimalPattern
            }],
          });
          longFormatThresholds.push(threshold);
          longFormatThresholdIndex++;
        }
        else {
          this.longFormats[numberSystem][longFormatThresholdIndex].formats.push({
            pluralForm: splittedMeta[2],
            format: longFormats[meta].replace(decimalPattern, '{0}'),
            decimalPattern: decimalPattern
          });
        }
      }
    }
  }

  for(var property in MessageFormat.NumberSystems) {
    if(MessageFormat.NumberSystems.hasOwnProperty(property)) {
      var numberSystem = MessageFormat.NumberSystems[property];
      if(numberSystem !== this.nativeNumberSystem &&
         numberSystem !== this.defaultNumberSystem &&
         numberSystem !== MessageFormat.DEFAULT_NUMBER_SYSTEM) {
        continue;
      }
      this.percentagePatterns[numberSystem] =
        this.CLDR.main('numbers/percentFormats-numberSystem-'
          + numberSystem + '/standard');
    }
  }

  for(var property in MessageFormat.NumberSystems) {
    if(MessageFormat.NumberSystems.hasOwnProperty(property)) {
      var numberSystem = MessageFormat.NumberSystems[property];
      if(numberSystem !== this.nativeNumberSystem &&
         numberSystem !== this.defaultNumberSystem &&
         numberSystem !== MessageFormat.DEFAULT_NUMBER_SYSTEM) {
        continue;
      }
      var currencyFormats = this.CLDR.main('numbers/currencyFormats-numberSystem-'
        + numberSystem);
      if(currencyFormats.accounting) {
        this.currencyPatterns[numberSystem] = currencyFormats.accounting;
      }
      else {
        this.currencyPatterns[numberSystem] = currencyFormats.standard;
      }
    }
  }

  cache[this.languageTag].defaultNumberSystem = this.defaultNumberSystem;
  cache[this.languageTag].nativeNumberSystem = this.nativeNumberSystem;
  cache[this.languageTag].decimalPatterns = this.decimalPatterns;
  cache[this.languageTag].percentagePatterns = this.percentagePatterns;
  cache[this.languageTag].currencyPatterns = this.currencyPatterns;
  cache[this.languageTag].shortFormats = this.shortFormats;
  cache[this.languageTag].longFormats = this.longFormats;
  cache[this.languageTag].shortFormatDecimalPatterns = this.shortFormatDecimalPatterns;
  cache[this.languageTag].longFormatDecimalPatterns = this.longFormatDecimalPatterns;
};


/**
 * Read number symbols
 *
 * @param {XMLDocument} languageDocument Language specific main CLDR XML document
 * @param {XMLDocument} localeDocument Locale specific main CLDR XML document
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readNumberSymbols = function() {
  if(cache[this.languageTag].numberSymbols) {
    this.numberSymbols = cache[this.languageTag].numberSymbols;
    return;
  }

  var _this = this;
  var symbols;
  for(var property in MessageFormat.NumberSystems) {
    if(MessageFormat.NumberSystems.hasOwnProperty(property)) {
      var numberSystem = MessageFormat.NumberSystems[property];
      if(numberSystem !== this.nativeNumberSystem &&
         numberSystem !== this.defaultNumberSystem &&
         numberSystem !== MessageFormat.DEFAULT_NUMBER_SYSTEM) {
        continue;
      }
      symbols = this.CLDR.main('numbers/symbols-numberSystem-' + numberSystem);
      this.numberSymbols[numberSystem] = {};
      for(var i in symbols) {
        _this.numberSymbols[numberSystem][i] = symbols[i];
      }
    }
  }

  cache[this.languageTag].numberSymbols = this.numberSymbols;
};


/**
 * Read currency data
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readCurrencyData = function() {
  if(cache[this.languageTag].currencies) {
    this.currencyUnitPattern = cache[this.languageTag].currencyUnitPattern;
    this.currencies = cache[this.languageTag].currencies;
    return;
  }

  var _this = this;
  var currencyUnitPatterns = this.CLDR.main('numbers/currencyFormats-numberSystem-' + this.defaultNumberSystem);
  if(!currencyUnitPatterns) {
    throw new TypeError('No currency unit pattern exist for ' + this.languageTag + ' in CLDR.');
  }
  for(var key in currencyUnitPatterns) {
    if(/^unitPattern\-count/.test(key)) {
      var pattern = currencyUnitPatterns[key];
      var count = key.replace('unitPattern-count-', '');
      this.currencyUnitPattern[count] = pattern;
    }
  };

  if(typeof project.currencies !== 'undefined' &&
    Object.prototype.toString.call(project.currencies) === '[object Array]') {
    project.currencies.forEach(function(currency) {
      var currencyNames = _this.CLDR.main('numbers/currencies/' + currency);
      if(!currencyNames) {
        throw new TypeError('Currency: ' + currency + ' does not exists in CLDR.');
      }

      var localText = null;
      if(currencySymbols[currency].text[_this.language] &&
         currencySymbols[currency].text[_this.language].local) {
        localText = currencySymbols[currency].text[_this.language].local;
      }
      _this.currencies[currency] = {
        name: null,
        text: {
          local: localText,
          global: {}
        },
        symbol: currencySymbols[currency].symbols
      };
      for(var key in currencyNames) {
        var text = currencyNames[key];
        if(/^displayName$/.test(key)) {
          _this.currencies[currency].name = text;
        }
        else if(/^displayName\-count/.test(key)) {
          var count = key.replace('displayName-count-', '');
          _this.currencies[currency].text.global[count] = text;
        }
      }
    });
  }

  cache[this.languageTag].currencyUnitPattern = this.currencyUnitPattern;
  cache[this.languageTag].currencies = this.currencies;
};


/**
 * Read date data
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readDateData = function() {
  if(cache[this.languageTag].date) {
    this.date = cache[this.languageTag].date;
    return;
  }
  // Era
  var eraFull = this.CLDR.main('dates/calendars/gregorian/eras/eraNames');
  var eraAbbreviated = this.CLDR.main('dates/calendars/gregorian/eras/eraAbbr');
  var eraNarrow = this.CLDR.main('dates/calendars/gregorian/eras/eraNarrow');

  this.date['era'] = {
    full: {
      BC: eraFull['0'],
      AD: eraFull['1']
    },
    abbreviated: {
      BC: eraAbbreviated['0'],
      AD: eraAbbreviated['1']
    },
    narrow: {
      BC: eraNarrow['0'],
      AD: eraNarrow['1']
    }
  };

  var abbreviatedFormatedQuarter = this.CLDR.main('dates/calendars/gregorian/quarters/format/abbreviated');
  var wideFormatedQuarter = this.CLDR.main('dates/calendars/gregorian/quarters/format/wide');
  var abbreviatedStandaloneQuarter = this.CLDR.main('dates/calendars/gregorian/quarters/stand-alone/abbreviated');
  var wideStandaloneQuarter = this.CLDR.main('dates/calendars/gregorian/quarters/stand-alone/wide');

  this.date['quarter'] = {
    formated: {
      abbreviated: {
        'Q1' : abbreviatedFormatedQuarter['1'],
        'Q2' : abbreviatedFormatedQuarter['2'],
        'Q3' : abbreviatedFormatedQuarter['3'],
        'Q4' : abbreviatedFormatedQuarter['4']
      },
      wide: {
        'Q1' : wideFormatedQuarter['1'],
        'Q2' : wideFormatedQuarter['2'],
        'Q3' : wideFormatedQuarter['3'],
        'Q4' : wideFormatedQuarter['4']
      }
    },
    standalone: {
      abbreviated: {
        'Q1' : abbreviatedStandaloneQuarter['1'],
        'Q2' : abbreviatedStandaloneQuarter['2'],
        'Q3' : abbreviatedStandaloneQuarter['3'],
        'Q4' : abbreviatedStandaloneQuarter['4']
      },
      wide: {
        'Q1' : wideStandaloneQuarter['1'],
        'Q2' : wideStandaloneQuarter['2'],
        'Q3' : wideStandaloneQuarter['3'],
        'Q4' : wideStandaloneQuarter['4']
      }
    }
  };

  this.date['month'] = {
    formated: {
      abbreviated: this.CLDR.main('dates/calendars/gregorian/months/format/abbreviated'),
      wide: this.CLDR.main('dates/calendars/gregorian/months/format/wide'),
      narrow: this.CLDR.main('dates/calendars/gregorian/months/format/narrow')
    },
    standalone: {
      abbreviated: this.CLDR.main('dates/calendars/gregorian/months/stand-alone/abbreviated'),
      wide: this.CLDR.main('dates/calendars/gregorian/months/stand-alone/wide'),
      narrow: this.CLDR.main('dates/calendars/gregorian/months/stand-alone/narrow')
    }
  };

  this.date['day'] = {
    formated: {
      short: this.CLDR.main('dates/calendars/gregorian/days/format/short'),
      wide: this.CLDR.main('dates/calendars/gregorian/days/format/wide'),
      abbreviated: this.CLDR.main('dates/calendars/gregorian/days/format/abbreviated'),
      narrow: this.CLDR.main('dates/calendars/gregorian/days/format/narrow')
    },
    standalone: {
      short: this.CLDR.main('dates/calendars/gregorian/days/stand-alone/short'),
      wide: this.CLDR.main('dates/calendars/gregorian/days/stand-alone/wide'),
      abbreviated: this.CLDR.main('dates/calendars/gregorian/days/stand-alone/abbreviated'),
      narrow: this.CLDR.main('dates/calendars/gregorian/days/stand-alone/narrow')
    }
  };

  this.date['period'] = {
    abbreviated: this.CLDR.main('dates/calendars/gregorian/dayPeriods/format/abbreviated'),
    narrow: this.CLDR.main('dates/calendars/gregorian/dayPeriods/format/narrow'),
    wide: this.CLDR.main('dates/calendars/gregorian/dayPeriods/format/wide')
  };

  cache[this.languageTag].date = this.date;
};

/**
 * Namespace Constructors
 *
 * @namespace Constrcutors
 */

MessageFormat.AST = AST;

module.exports = MessageFormat;
