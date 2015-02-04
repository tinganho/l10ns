
/**
 * Requires
 */
var Lexer = require('../Lexer');
var AST = require('./AST');
var xml = require('libxmljs');
var fs = require('fs');
var path = require('path');
var LDML = require('../LDML');
var _ = require('underscore');
var currencySymbols = require('./currencySymbols');
var moment = require('moment');
var cache = {};
var languageModifier = /\-([a-zA-Z]+)\-/;

/**
 * MessageFormat class
 *
 * @constructor
 */
function MessageFormat(locale) {
  this.locale = this.getMostLikelyLocale_(locale || program.defaultLocale);
  languageModifier.index = 0;
  if(languageModifier.test(this.locale)) {
    this.languageModifier = /\-([a-zA-Z]+)\-/.exec(this.locale)[1];
  }
  else {
    this.languageModifier = null;
  }
  this.language = /^([a-z]+)\-/.exec(this.locale)[1];
  this.region = /\-([A-Z]+)$/.exec(this.locale)[1];
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
  this.currencies = {};
  this.date = {};
  this.localeDocument = null;
  this.languageDocument = null;
  this.rootDocument = null;
  this._currentNumberSystem = 'latn';
  this.currencyUnitPattern = {};

  if(typeof cache[this.locale] === 'undefined') {
    cache[this.locale] = {};
  }

  this._readDocuments();
  this._readPluralizationRules();
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
 * Most likely map of locales.
 *
 * @type {String}
 * @api public
 */
MessageFormat.MOST_LIKELY_LOCALE_MAP = {
  'zh-CN': 'zh-Hans-CN',
  'zh-HK': 'zh-Hant-HK'
};


/**
 * If locale string misses the language modifier you can call
 * this function to return the most likely.
 *
 * @param {String} locale
 * @return {String} locale
 * @api private
 */
MessageFormat.prototype.getMostLikelyLocale_ = function(locale) {
  if(locale in MessageFormat.MOST_LIKELY_LOCALE_MAP) {
    return MessageFormat.MOST_LIKELY_LOCALE_MAP[locale];
  }
  else {
    return locale;
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
      break;
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
      return new AST.date.DateFormat(this.locale, variable, argument, this.date, this._currentNumberSystem);
    case 'number':
      if(!this.decimalPatterns.hasOwnProperty(this._currentNumberSystem)) {
        throw new TypeError('Locale `' + this.locale + '` does not have `'  + this._currentNumberSystem + '` number system.');
      }
      return new AST.NumberFormat(
        this.locale,
        variable,
        argument,
        this.numberSymbols[this._currentNumberSystem],
        this.currencies,
        AST.NumberFormatPattern.parse(this.decimalPatterns[this._currentNumberSystem]),
        AST.NumberFormatPattern.parse(this.percentagePatterns[this._currentNumberSystem]),
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
    this.locale,
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
  var exactlySyntax = /^=\d+$/;
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
        return new AST.PluralFormat(this.locale, variable, values, offset);
      }
    }
    else {
      // Case are empty if an other case is missing
      if(_case === '' ) {
        throw new TypeError('There must exist one other case in ' + this.lexer.getLatestTokensLog());
      }
      else {
        throw new TypeError('Expected a keyword (' + pluralKeywords.join(', ')+ ') or an exact case (n=). Instead got \'' + _case + '\' in ' + this.lexer.getLatestTokensLog());
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
        return new AST.SelectordinalFormat(this.locale, variable, values, offset);
      }
    }
    else {
      // Case are empty if an other case is missing
      if(_case === '' ) {
        throw new TypeError('There must exist one other case in ' + this.lexer.getLatestTokensLog());
      }
      else {
        throw new TypeError('Expected a keyword (' + ordinalKeywords.join(', ')+ ') or an exact case (n=). Instead got \'' + _case + '\' in ' + this.lexer.getLatestTokensLog());
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
  return /^[a-zA-Z0-9]+$/.test(character);
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
MessageFormat.prototype._readPluralizationRules = function() {
  if(cache[this.locale].pluralRules) {
    this.pluralRules = cache[this.locale].pluralRules;
    return;
  }

  var _this = this;
  var data = fs.readFileSync(path.join(
    __dirname, '../../CLDR/common/supplemental/plurals.xml'),
    'utf-8'
  );
  var document = xml.parseXmlString(data, { noblanks: true });
  var pluralRules = document.get(
    '//supplementalData/plurals/pluralRules\
    [contains(concat(\' \', normalize-space(@locales), \' \'), \' ' + _this.language + '\')]');

  if(!pluralRules) {
    throw new TypeError('No plural rules exist for ' + this.locale + ' in CLDR.');
  }

  pluralRules.childNodes().forEach(function(pluralRule) {
    var _case = pluralRule.attr('count').value();
    _this.pluralRules[_case] = LDML.parse(pluralRule.text());
    _this.pluralRules[_case].example = LDML.integerExample;
  });

  cache[this.locale].pluralRules = this.pluralRules;
};


/**
 * Read ordinal rules
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readOrdinalRules = function() {
  if(cache[this.locale].ordinalRules) {
    this.ordinalRules = cache[this.locale].ordinalRules;
    return;
  }

  var _this = this
  var data = fs.readFileSync(
    path.join(__dirname, '../../CLDR/common/supplemental/ordinals.xml'),
    'utf-8'
  );

  var document = xml.parseXmlString(data, { noblanks: true });
  var ordinalRules = document.get(
    '//supplementalData/plurals/pluralRules\
    [contains(concat(\' \', normalize-space(@locales), \' \'), \' ' + _this.language + '\')]');

  if(!ordinalRules) {
    throw new TypeError('No ordinal rules exist for ' + this.locale + ' in CLDR.');
  }

  ordinalRules.childNodes().forEach(function(pluralRule) {
    var _case = pluralRule.attr('count').value();
    _this.ordinalRules[_case] = LDML.parse(pluralRule.text());
    _this.ordinalRules[_case].example = LDML.integerExample;
  });

  cache[this.locale].ordinalRules = this.ordinalRules;
};


/**
 * Read LDML documents
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readDocuments = function() {
  var _this = this;

  if(!cache.rootDocument) {
    var rootDocumentPath = path.join(__dirname, '../../CLDR/common/main/root.xml');
    cache.rootDocument = this.rootDocument = xml.parseXmlString(fs.readFileSync(rootDocumentPath, 'utf-8'), { noblanks: true });
  }
  else {
    this.rootDocument = cache.rootDocument;
  }

  if(!cache[this.locale].localeDocument) {
    var localeDocumentPath;
    if(this.languageModifier) {
      localeDocumentPath = path.join(__dirname, '../../CLDR/common/main/' + this.language + '_' + this.languageModifier + '_' + this.region + '.xml');
    }
    else {
      localeDocumentPath = path.join(__dirname, '../../CLDR/common/main/' + this.language + '_' + this.region + '.xml');
    }
    if(fs.existsSync(localeDocumentPath)) {
      cache[this.locale].localeDocument = this.localeDocument = xml.parseXmlString(fs.readFileSync(localeDocumentPath, 'utf-8'), { noblanks: true });
    }
  }
  else {
    this.localeDocument = cache[this.locale].localeDocument;
  }

  if(!cache[this.locale].languageModifierDocument) {
    var languageModifierDocumentPath = path.join(__dirname, '../../CLDR/common/main/' + this.language + '_' + this.languageModifier + '.xml');
    if(fs.existsSync(languageModifierDocumentPath)) {
      cache[this.locale].languageModifierDocument = this.languageModifierDocument = xml.parseXmlString(fs.readFileSync(languageModifierDocumentPath, 'utf-8'), { noblanks: true });
    }
  }

  if(!cache[this.locale].languageDocument) {
    var languageDocumentPath = path.join(__dirname, '../../CLDR/common/main/' + this.language + '.xml');
    if(fs.existsSync(languageDocumentPath)) {
      cache[this.locale].languageDocument = this.languageDocument = xml.parseXmlString(fs.readFileSync(languageDocumentPath, 'utf-8'), { noblanks: true });
    }
  }
  else {
    this.languageDocument = cache[this.locale].languageDocument;
  }
};


/**
 * Read time zone supplemental data
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readTimezone = function() {
  if(cache[this.locale].timezones) {
    this.timezones = cache[this.locale].timezones;
    return;
  }

  var timezonePath = path.join(__dirname, '../../CLDR/common/supplemental/metaZones.xml');
  var timezoneDocument = xml.parseXmlString(fs.readFileSync(timezonePath, 'utf-8'), { noblanks: true });
  var timezones = {};
  if(project.timezones) {
    for(var index in project.timezones) {
      var timezone = project.timezones[index];
      timezones[timezone] = {
        name: { long: {}, short: {} }
      };
      var mapZone = timezoneDocument.get('//timezone[@type=\'' + timezone + '\']/usesMetazone[last()]');
      if(!mapZone) {
        throw new TypeError('Time zone: ' + timezone + ' does not exists');
      }
      var mapZoneID = mapZone.attr('mzone').value();
      try {
        var standarLongTimezoneName = this._getXMLNode('//timeZoneNames/metazone[@type=\'' + mapZoneID + '\']/long/standard');
        if(standarLongTimezoneName) {
          timezones[timezone].name.long.standard = standarLongTimezoneName.text();
        }
      }
      catch(error) {
        timezones[timezone].name.long.standard = null;
      }
      try {
        var daylightLongTimezoneName = this._getXMLNode('//timeZoneNames/metazone[@type=\'' + mapZoneID + '\']/long/daylight');
        if(daylightLongTimezoneName) {
          timezones[timezone].name.long.daylight = daylightLongTimezoneName.text();
        }
      }
      catch(error) {
        timezones[timezone].name.long.daylight = null;
      }
      try {
        var genericLongTimezoneName = this._getXMLNode('//timeZoneNames/metazone[@type=\'' + mapZoneID + '\']/long/generic');
        if(genericLongTimezoneName) {
          timezones[timezone].name.long.generic = genericLongTimezoneName.text();
        }
      }
      catch(error) {
        timezones[timezone].name.long.generic = null;
      }
      try {
        var standarShortTimezoneName = this._getXMLNode('//timeZoneNames/metazone[@type=\'' + mapZoneID + '\']/short/standard');
        if(standarShortTimezoneName) {
          timezones[timezone].name.short.standard = standarShortTimezoneName.text();
        }
      }
      catch(error) {
        timezones[timezone].name.short.standard = null;
      }
      try {
        var daylightShortTimezoneName = this._getXMLNode('//timeZoneNames/metazone[@type=\'' + mapZoneID + '\']/short/daylight');
        if(daylightShortTimezoneName) {
          timezones[timezone].name.short.daylight = daylightShortTimezoneName.text();
        }
      }
      catch(error) {
        timezones[timezone].name.short.daylight = null;
      }
      try {
        var genericShortTimezoneName = this._getXMLNode('//timeZoneNames/metazone[@type=\'' + mapZoneID + '\']/short/generic');
        if(genericShortTimezoneName) {
          timezones[timezone].name.short.generic = genericShortTimezoneName.text();
        }
      }
      catch(error) {
        timezones[timezone].name.short.generic = null;
      }
      try {
        var city = this._getXMLNode('//timeZoneNames/zone[@type=\'' + mapZoneID + '\']/exemplarCity');
        if(city) {
          timezones[timezone].hasCity = true;
          timezones[timezone].city = city.text();
        }
        else {
          timezones[timezone].hasCity = false;
          timezones[timezone].city = this._getXMLNode('//timeZoneNames/zone[@type=\'Etc/Unknown\']/exemplarCity').text();
        }
      }
      catch(error) {
        timezones[timezone].hasCity = false;
        timezones[timezone].city = this._getXMLNode('//timeZoneNames/zone[@type=\'Etc/Unknown\']/exemplarCity').text();
      }
      timezones[timezone].regionFormat = this._getXMLNode('//timeZoneNames/regionFormat').text();
      timezones[timezone].GMTFormat = this._getXMLNode('//timeZoneNames/gmtFormat').text();
    }
  }

  this.timezones = cache[this.locale].timezones = timezones;
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
 * Read XML node from CLDR
 *
 * @param {String} path
 * @param {String} idAttribute
 * these nodes are valid
 * @return {null|String}
 */
MessageFormat.prototype._getXMLNode = function(path, idAttribute) {
  var languageNodes;
  var rootNodes;
  var localeNode;
  var languageNode;
  var relativePath;
  var resultNode;
  var attributeValue;
  var resultNodeFinding;
  var parentNodePath = path.split('/')
  var endNodePath = parentNodePath[parentNodePath.length - 1];
  parentNodePath = parentNodePath.slice(0, parentNodePath.length - 1).join('/');

  if(!idAttribute) {
    if(this.localeDocument) {
      localeNode = this.localeDocument.get(path);
      if(localeNode) {
        return localeNode;
      }
    }
    if(this.languageModifierDocument) {
      languageModifierNode = this.languageModifierDocument.get(path);
      if(languageModifierNode) {
        return languageModifierNode;
      }
    }
    if(this.languageDocument) {
      languageNode = this.languageDocument.get(path);
      if(languageNode) {
        return languageNode;
      }
    }
    if(this.rootDocument) {
      aliasNode = this.rootDocument.get(path + '/alias');
      if(aliasNode) {
        relativePath = aliasNode.attr('path').value();
        return this._getXMLNode(this._getAbsolutePath(path, relativePath));
      }
      node = this.rootDocument.get(parentNodePath);
      if(node && node.childNodes().length > 0) {
        rootNode = this.rootDocument.get(path);
        if(rootNode) {
          return rootNode;
        }
        else {
          throw new TypeError('Could not find data for ' + path);
        }
      }
      else {
        throw new TypeError('Could not find data for ' + path);
      }
    }
  }
  else {
    if(this.localeDocument) {
      resultNode = this.localeDocument.get(parentNodePath);
    }
    if(this.languageDocument) {
      node = this.languageDocument.get(parentNodePath);
      if(node && node.childNodes().length > 0) {
        languageNodes = node.childNodes();
        if(resultNode) {
          languageNodes.forEach(function(languageNode_) {
            attributeValue = languageNode_.attr(idAttribute).value();
            resultNodeFinding = resultNode.get('./' + endNodePath + '[@' + idAttribute + '="' + attributeValue + '"]');
            if(!resultNodeFinding) {
              resultNode.addChild(languageNode_);
            }
          });
        }
        else {
          resultNode = node;
        }
      }
    }
    if(this.languageModifierDocument) {
      node = this.languageModifierDocument.get(parentNodePath);
      if(node && node.childNodes().length > 0) {
        languageModifierNodes = node.childNodes();
        if(resultNode) {
          languageModifierNodes.forEach(function(languageModifierNode_) {
            attributeValue = languageModifierNode_.attr(idAttribute).value();
            resultNodeFinding = resultNode.get('./' + endNodePath + '[@' + idAttribute + '="' + attributeValue + '"]');
            if(!resultNodeFinding) {
              resultNode.addChild(languageModifierNode_);
            }
          });
        }
        else {
          resultNode = node;
        }
      }
    }
    if(this.rootDocument) {
      aliasNode = this.rootDocument.get(parentNodePath + '/alias');
      if(aliasNode) {
        relativePath = aliasNode.attr('path').value();
        node = this._getXMLNode(this._getAbsolutePath(parentNodePath, relativePath, endNodePath), idAttribute);
      }
      else {
        node = this.rootDocument.get(parentNodePath);
      }

      if(node && node.childNodes().length > 0) {
        rootNodes = node.childNodes();
        if(resultNode) {
          rootNodes.forEach(function(rootNode_) {
            attributeValue = rootNode_.attr(idAttribute).value();
            resultNodeFinding = resultNode.get('./' + endNodePath + '[@' + idAttribute + '="' + attributeValue + '"]');
            if(!resultNodeFinding) {
              resultNode.addChild(rootNode_);
            }
          });
        }
        else {
          resultNode = node;
        }
      }
      else {
        if(!resultNode) {
          throw new TypeError('Could not find data for ' + path);
        }
      }
    }
  }

  return resultNode;
};


/**
 * Get absolute path of a node from a relative path
 *
 * @param {String} absolutePath
 * @param {String} relativePath
 * @return {String}
 */
MessageFormat.prototype._getAbsolutePath = function(absolutePath, relativePath, endPath) {
  var ups = relativePath.match(/\.\.\//g).length;

  absolutePath = absolutePath.split('/');
  relativePath = relativePath.replace(/\.\.\//g, '');

  if(endPath) {
    return absolutePath.slice(0, absolutePath.length - ups).join('/') + '/' + relativePath + '/' + endPath;
  }
  return absolutePath.slice(0, absolutePath.length - ups).join('/') + '/' + relativePath;
};


/**
 * Read XML Period node from CLDR
 *
 * @param {String} path
 * @return {null|String}
 */
MessageFormat.prototype.getCLDRPeriodNode = function() {
  var node;
  if(this.localeDocument) {
    node = this.localeDocument.get(path);
  }
  if(!node) {
    node = this.languageDocument.get(path);
  }
  if(!node) {
    node = this.rootDocument.get(path);
  }

  if(node) {
    if(node.get('./dayPeriod[@type="am"]') && node.get('./dayPeriod[@type="pm"]')) {
      while(node && typeof node.child === 'function' && node.child(0).name() === 'alias') {
        var relativePath = node.child(0).attr('path').value();
        node = node.get(relativePath);
      }
    }
  }

  return node;
};


/**
 * Read number format patterns
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readNumberFormatPatterns = function() {
  if(cache[this.locale].defaultNumberSystem) {
    this.defaultNumberSystem = cache[this.locale].defaultNumberSystem;
    this.nativeNumberSystem = cache[this.locale].nativeNumberSystem;
    this.decimalPatterns = cache[this.locale].decimalPatterns;
    this.percentagePatterns = cache[this.locale].percentagePatterns;
    this.currencyPatterns = cache[this.locale].currencyPatterns;
    return;
  }

  var pattern;

  this.defaultNumberSystem = this._getXMLNode('//ldml/numbers/defaultNumberingSystem').text();
  this.nativeNumberSystem = this._getXMLNode('//ldml/numbers/otherNumberingSystems/native').text();
  for(var property in MessageFormat.NumberSystems) {
    if(MessageFormat.NumberSystems.hasOwnProperty(property)) {
      var numberSystem = MessageFormat.NumberSystems[property];
      if(numberSystem !== this.nativeNumberSystem &&
         numberSystem !== this.defaultNumberSystem &&
         numberSystem !== MessageFormat.DEFAULT_NUMBER_SYSTEM) {
        continue;
      }
      pattern = this._getXMLNode('//ldml/numbers/decimalFormats[@numberSystem=\'' + numberSystem + '\']');
      this.decimalPatterns[numberSystem] = pattern.get('decimalFormatLength/decimalFormat/pattern').text();
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
      pattern = this._getXMLNode('//ldml/numbers/percentFormats[@numberSystem=\'' + numberSystem + '\']');
      this.percentagePatterns[numberSystem] = pattern.get('percentFormatLength/percentFormat/pattern').text();
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
      pattern = this._getXMLNode('//ldml/numbers/currencyFormats[@numberSystem=\'' + numberSystem + '\']');
      var accountingNode = pattern.get('currencyFormatLength/currencyFormat[@type=\'accounting\']');
      if(!accountingNode) {
        accountingNode = pattern.get('currencyFormatLength/currencyFormat[@type=\'standard\']');
      }
      if(accountingNode.child(0).name() === 'alias') {
        var relativePath = accountingNode.child(0).attr('path').value();
        accountingNode = accountingNode.get(relativePath);
      }
      this.currencyPatterns[numberSystem] = accountingNode.get('pattern').text();
    }
  }

  cache[this.locale].defaultNumberSystem = this.defaultNumberSystem;
  cache[this.locale].nativeNumberSystem = this.nativeNumberSystem;
  cache[this.locale].decimalPatterns = this.decimalPatterns;
  cache[this.locale].percentagePatterns = this.percentagePatterns;
  cache[this.locale].currencyPatterns = this.currencyPatterns;
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
  if(cache[this.locale].numberSymbols) {
    this.numberSymbols = cache[this.locale].numberSymbols;
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
      symbols = this._getXMLNode('//ldml/numbers/symbols[@numberSystem=\'' + numberSystem + '\']');
      this.numberSymbols[numberSystem] = {};
      symbols.childNodes().forEach(function(symbol) {
        _this.numberSymbols[numberSystem][symbol.name()] = symbol.text();
      });
    }
  }

  cache[this.locale].numberSymbols = this.numberSymbols;
};


/**
 * Read currency data
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readCurrencyData = function() {
  if(cache[this.locale].currencies) {
    this.currencyUnitPattern = cache[this.locale].currencyUnitPattern;
    this.currencies = cache[this.locale].currencies;
    return;
  }

  var _this = this;
  var currencyUnitPatterns;
  if(this.localeDocument) {
    currencyUnitPatterns = this.localeDocument.get(
      '//ldml/numbers/currencyFormats[@numberSystem=\'latn\']');
  }
  if(!currencyUnitPatterns) {
    currencyUnitPatterns = this.languageDocument.get(
      '//ldml/numbers/currencyFormats[@numberSystem=\'latn\']');
  }
  if(!currencyUnitPatterns) {
    throw new TypeError('No currency unit pattern exist for ' + this.locale + ' in CLDR.');
  }
  currencyUnitPatterns.childNodes().forEach(function(pattern) {
    if(pattern.name() === 'unitPattern') {
      _this.currencyUnitPattern[pattern.attr('count').value()] = pattern.text();
    }
  });

  if(typeof project.currencies !== 'undefined' &&
    Object.prototype.toString.call(project.currencies) === '[object Array]') {
    project.currencies.forEach(function(currency) {
      var currencyNames;
      if(_this.localeDocument) {
        currencyNames = _this.localeDocument.get(
          '//ldml/numbers/currencies/currency[@type=\'' + currency + '\']');
      }
      if(!currencyNames) {
        currencyNames = _this.languageDocument.get(
          '//ldml/numbers/currencies/currency[@type=\'' + currency + '\']');
      }
      if(!currencyNames) {
        throw new TypeError('Currency: ' + currency + ' does not exists in CLDR.');
      }
      currencyNames.childNodes().forEach(function(currencyName) {
        if(currencyName.name() === 'displayName') {
          var count = currencyName.attr('count')
          if(count) {
            _this.currencies[currency].text.global[count.value()] = currencyName.text();
          }
          else {
            var localText = null;
            if(currencySymbols[currency].text[_this.language] &&
               currencySymbols[currency].text[_this.language].local) {
              localText = currencySymbols[currency].text[_this.language].local;
            }

            _this.currencies[currency] = {
              name: currencyName.text(),
              text: {
                local: localText,
                global: {}
              },
              symbol: currencySymbols[currency].symbols
            };
          }
        }
      });
    });
  }

  cache[this.locale].currencyUnitPattern = this.currencyUnitPattern;
  cache[this.locale].currencies = this.currencies;
};


/**
 * Read date data
 *
 * @return {void}
 * @api private
 */
MessageFormat.prototype._readDateData = function() {
  if(cache[this.locale].date) {
    this.date = cache[this.locale].date;
    return;
  }
  // Era
  var eraFullBC = this._getXMLNode('//calendar[@type="gregorian"]/eras/eraNames/era[@type=\'0\']').text();
  var eraFullAD = this._getXMLNode('//calendar[@type="gregorian"]/eras/eraNames/era[@type=\'1\']').text();
  var eraAbbreviatedBC = this._getXMLNode('//calendar[@type="gregorian"]/eras/eraAbbr/era[@type=\'0\']').text();
  var eraAbbreviatedAD = this._getXMLNode('//calendar[@type="gregorian"]/eras/eraAbbr/era[@type=\'1\']').text();
  var eraNarrowBC = this._getXMLNode('//eras/eraNarrow/era[@type="0"]').text(); // Problem selecting gregorian calendar
  var eraNarrowAD = this._getXMLNode('//eras/eraNarrow/era[@type="1"]').text(); // Problem selecting gregorian calendar

  this.date['era'] = {
    full: {
      BC: eraFullBC,
      AD: eraFullAD
    },
    abbreviated: {
      BC: eraAbbreviatedBC,
      AD: eraAbbreviatedAD
    },
    narrow: {
      BC: eraNarrowBC,
      AD: eraNarrowAD
    }
  };

  var abbreviatedFormatedQuarter = this._getXMLNode('//calendar[@type="gregorian"]/quarters/quarterContext[@type="format"]/quarterWidth[@type="abbreviated"]/quarter', 'type');
  var wideFormatedQuarter = this._getXMLNode('//calendar[@type="gregorian"]/quarters/quarterContext[@type="format"]/quarterWidth[@type="wide"]/quarter', 'type');
  var abbreviatedStandaloneQuarter = this._getXMLNode('//calendar[@type="gregorian"]/quarters/quarterContext[@type="stand-alone"]/quarterWidth[@type="abbreviated"]/quarter', 'type');
  var wideStandaloneQuarter = this._getXMLNode('//calendar[@type="gregorian"]/quarters/quarterContext[@type="stand-alone"]/quarterWidth[@type="wide"]/quarter', 'type');

  this.date['quarter'] = {
    formated: {
      abbreviated: {
        'Q1' : abbreviatedFormatedQuarter.get('./quarter[@type="1"]').text(),
        'Q2' : abbreviatedFormatedQuarter.get('./quarter[@type="2"]').text(),
        'Q3' : abbreviatedFormatedQuarter.get('./quarter[@type="3"]').text(),
        'Q4' : abbreviatedFormatedQuarter.get('./quarter[@type="4"]').text()
      },
      wide: {
        'Q1' : wideFormatedQuarter.get('./quarter[@type="1"]').text(),
        'Q2' : wideFormatedQuarter.get('./quarter[@type="2"]').text(),
        'Q3' : wideFormatedQuarter.get('./quarter[@type="3"]').text(),
        'Q4' : wideFormatedQuarter.get('./quarter[@type="4"]').text()
      }
    },
    standalone: {
      abbreviated: {
        'Q1' : abbreviatedStandaloneQuarter.get('./quarter[@type="1"]').text(),
        'Q2' : abbreviatedStandaloneQuarter.get('./quarter[@type="2"]').text(),
        'Q3' : abbreviatedStandaloneQuarter.get('./quarter[@type="3"]').text(),
        'Q4' : abbreviatedStandaloneQuarter.get('./quarter[@type="4"]').text()
      },
      wide: {
        'Q1' : wideStandaloneQuarter.get('./quarter[@type="1"]').text(),
        'Q2' : wideStandaloneQuarter.get('./quarter[@type="2"]').text(),
        'Q3' : wideStandaloneQuarter.get('./quarter[@type="3"]').text(),
        'Q4' : wideStandaloneQuarter.get('./quarter[@type="4"]').text()
      }
    }
  };

  var abbreviatedFormatedMonth = this._getXMLNode('//calendar[@type="gregorian"]/months/monthContext[@type="format"]/monthWidth[@type="abbreviated"]/month', 'type');
  var wideFormatedMonth = this._getXMLNode('//calendar[@type="gregorian"]/months/monthContext[@type="format"]/monthWidth[@type="wide"]/month', 'type');
  var narrowFormatedMonth = this._getXMLNode('//calendar[@type="gregorian"]/months/monthContext[@type="format"]/monthWidth[@type="narrow"]/month', 'type');
  var abbreviatedStandaloneMonth = this._getXMLNode('//calendar[@type="gregorian"]/months/monthContext[@type="stand-alone"]/monthWidth[@type="abbreviated"]/month', 'type');
  var wideStandaloneMonth = this._getXMLNode('//calendar[@type="gregorian"]/months/monthContext[@type="stand-alone"]/monthWidth[@type="wide"]/month', 'type');
  var narrowStandaloneMonth = this._getXMLNode('//calendar[@type="gregorian"]/months/monthContext[@type="stand-alone"]/monthWidth[@type="narrow"]/month', 'type');

  this.date['month'] = {
    formated: {
      abbreviated: {
        '1' : abbreviatedFormatedMonth.get('./month[@type="1"]').text(),
        '2' : abbreviatedFormatedMonth.get('./month[@type="2"]').text(),
        '3' : abbreviatedFormatedMonth.get('./month[@type="3"]').text(),
        '4' : abbreviatedFormatedMonth.get('./month[@type="4"]').text(),
        '5' : abbreviatedFormatedMonth.get('./month[@type="5"]').text(),
        '6' : abbreviatedFormatedMonth.get('./month[@type="6"]').text(),
        '7' : abbreviatedFormatedMonth.get('./month[@type="7"]').text(),
        '8' : abbreviatedFormatedMonth.get('./month[@type="8"]').text(),
        '9' : abbreviatedFormatedMonth.get('./month[@type="9"]').text(),
        '10' : abbreviatedFormatedMonth.get('./month[@type="10"]').text(),
        '11' : abbreviatedFormatedMonth.get('./month[@type="11"]').text(),
        '12' : abbreviatedFormatedMonth.get('./month[@type="12"]').text()
      },
      wide: {
        '1' : wideFormatedMonth.get('./month[@type="1"]').text(),
        '2' : wideFormatedMonth.get('./month[@type="2"]').text(),
        '3' : wideFormatedMonth.get('./month[@type="3"]').text(),
        '4' : wideFormatedMonth.get('./month[@type="4"]').text(),
        '5' : wideFormatedMonth.get('./month[@type="5"]').text(),
        '6' : wideFormatedMonth.get('./month[@type="6"]').text(),
        '7' : wideFormatedMonth.get('./month[@type="7"]').text(),
        '8' : wideFormatedMonth.get('./month[@type="8"]').text(),
        '9' : wideFormatedMonth.get('./month[@type="9"]').text(),
        '10' : wideFormatedMonth.get('./month[@type="10"]').text(),
        '11' : wideFormatedMonth.get('./month[@type="11"]').text(),
        '12' : wideFormatedMonth.get('./month[@type="12"]').text()
      },
      narrow: {
        '1' : narrowFormatedMonth.get('./month[@type="1"]').text(),
        '2' : narrowFormatedMonth.get('./month[@type="2"]').text(),
        '3' : narrowFormatedMonth.get('./month[@type="3"]').text(),
        '4' : narrowFormatedMonth.get('./month[@type="4"]').text(),
        '5' : narrowFormatedMonth.get('./month[@type="5"]').text(),
        '6' : narrowFormatedMonth.get('./month[@type="6"]').text(),
        '7' : narrowFormatedMonth.get('./month[@type="7"]').text(),
        '8' : narrowFormatedMonth.get('./month[@type="8"]').text(),
        '9' : narrowFormatedMonth.get('./month[@type="9"]').text(),
        '10' : narrowFormatedMonth.get('./month[@type="10"]').text(),
        '11' : narrowFormatedMonth.get('./month[@type="11"]').text(),
        '12' : narrowFormatedMonth.get('./month[@type="12"]').text()
      }
    },
    standalone: {
      abbreviated: {
        '1' : abbreviatedStandaloneMonth.get('./month[@type="1"]').text(),
        '2' : abbreviatedStandaloneMonth.get('./month[@type="2"]').text(),
        '3' : abbreviatedStandaloneMonth.get('./month[@type="3"]').text(),
        '4' : abbreviatedStandaloneMonth.get('./month[@type="4"]').text(),
        '5' : abbreviatedStandaloneMonth.get('./month[@type="5"]').text(),
        '6' : abbreviatedStandaloneMonth.get('./month[@type="6"]').text(),
        '7' : abbreviatedStandaloneMonth.get('./month[@type="7"]').text(),
        '8' : abbreviatedStandaloneMonth.get('./month[@type="8"]').text(),
        '9' : abbreviatedStandaloneMonth.get('./month[@type="9"]').text(),
        '10' : abbreviatedStandaloneMonth.get('./month[@type="10"]').text(),
        '11' : abbreviatedStandaloneMonth.get('./month[@type="11"]').text(),
        '12' : abbreviatedStandaloneMonth.get('./month[@type="12"]').text()
      },
      wide: {
        '1' : wideStandaloneMonth.get('./month[@type="1"]').text(),
        '2' : wideStandaloneMonth.get('./month[@type="2"]').text(),
        '3' : wideStandaloneMonth.get('./month[@type="3"]').text(),
        '4' : wideStandaloneMonth.get('./month[@type="4"]').text(),
        '5' : wideStandaloneMonth.get('./month[@type="5"]').text(),
        '6' : wideStandaloneMonth.get('./month[@type="6"]').text(),
        '7' : wideStandaloneMonth.get('./month[@type="7"]').text(),
        '8' : wideStandaloneMonth.get('./month[@type="8"]').text(),
        '9' : wideStandaloneMonth.get('./month[@type="9"]').text(),
        '10' : wideStandaloneMonth.get('./month[@type="10"]').text(),
        '11' : wideStandaloneMonth.get('./month[@type="11"]').text(),
        '12' : wideStandaloneMonth.get('./month[@type="12"]').text()
      },
      narrow: {
        '1' : narrowStandaloneMonth.get('./month[@type="1"]').text(),
        '2' : narrowStandaloneMonth.get('./month[@type="2"]').text(),
        '3' : narrowStandaloneMonth.get('./month[@type="3"]').text(),
        '4' : narrowStandaloneMonth.get('./month[@type="4"]').text(),
        '5' : narrowStandaloneMonth.get('./month[@type="5"]').text(),
        '6' : narrowStandaloneMonth.get('./month[@type="6"]').text(),
        '7' : narrowStandaloneMonth.get('./month[@type="7"]').text(),
        '8' : narrowStandaloneMonth.get('./month[@type="8"]').text(),
        '9' : narrowStandaloneMonth.get('./month[@type="9"]').text(),
        '10' : narrowStandaloneMonth.get('./month[@type="10"]').text(),
        '11' : narrowStandaloneMonth.get('./month[@type="11"]').text(),
        '12' : narrowStandaloneMonth.get('./month[@type="12"]').text()
      }
    }
  };

  var shortFormatedDay = this._getXMLNode('//calendar[@type="gregorian"]/days/dayContext[@type="format"]/dayWidth[@type="short"]/day', 'type');
  var wideFormatedDay = this._getXMLNode('//calendar[@type="gregorian"]/days/dayContext[@type="format"]/dayWidth[@type="wide"]/day', 'type');
  var abbreviatedFormatedDay = this._getXMLNode('//calendar[@type="gregorian"]/days/dayContext[@type="format"]/dayWidth[@type="abbreviated"]/day', 'type');
  var narrowFormatedDay = this._getXMLNode('//calendar[@type="gregorian"]/days/dayContext[@type="format"]/dayWidth[@type="narrow"]/day', 'type');
  var shortStandaloneDay = this._getXMLNode('//calendar[@type="gregorian"]/days/dayContext[@type="stand-alone"]/dayWidth[@type="short"]/day', 'type');
  var wideStandaloneDay = this._getXMLNode('//calendar[@type="gregorian"]/days/dayContext[@type="stand-alone"]/dayWidth[@type="wide"]/day', 'type');
  var abbreviatedStandaloneDay = this._getXMLNode('//calendar[@type="gregorian"]/days/dayContext[@type="stand-alone"]/dayWidth[@type="abbreviated"]/day', 'type');
  var narrowStandaloneDay = this._getXMLNode('//calendar[@type="gregorian"]/days/dayContext[@type="stand-alone"]/dayWidth[@type="narrow"]/day', 'type');

  this.date['day'] = {
    formated: {
      short: {
        'mon':  shortFormatedDay.get('./day[@type="mon"]').text(),
        'tue':  shortFormatedDay.get('./day[@type="tue"]').text(),
        'wed':  shortFormatedDay.get('./day[@type="wed"]').text(),
        'thu':  shortFormatedDay.get('./day[@type="thu"]').text(),
        'fri':  shortFormatedDay.get('./day[@type="fri"]').text(),
        'sat':  shortFormatedDay.get('./day[@type="sat"]').text(),
        'sun':  shortFormatedDay.get('./day[@type="sun"]').text()
      },
      wide: {
        'mon':  wideFormatedDay.get('./day[@type="mon"]').text(),
        'tue':  wideFormatedDay.get('./day[@type="tue"]').text(),
        'wed':  wideFormatedDay.get('./day[@type="wed"]').text(),
        'thu':  wideFormatedDay.get('./day[@type="thu"]').text(),
        'fri':  wideFormatedDay.get('./day[@type="fri"]').text(),
        'sat':  wideFormatedDay.get('./day[@type="sat"]').text(),
        'sun':  wideFormatedDay.get('./day[@type="sun"]').text()
      },
      abbreviated: {
        'mon':  abbreviatedFormatedDay.get('./day[@type="mon"]').text(),
        'tue':  abbreviatedFormatedDay.get('./day[@type="tue"]').text(),
        'wed':  abbreviatedFormatedDay.get('./day[@type="wed"]').text(),
        'thu':  abbreviatedFormatedDay.get('./day[@type="thu"]').text(),
        'fri':  abbreviatedFormatedDay.get('./day[@type="fri"]').text(),
        'sat':  abbreviatedFormatedDay.get('./day[@type="sat"]').text(),
        'sun':  abbreviatedFormatedDay.get('./day[@type="sun"]').text()
      },
      narrow: {
        'mon':  narrowFormatedDay.get('./day[@type="mon"]').text(),
        'tue':  narrowFormatedDay.get('./day[@type="tue"]').text(),
        'wed':  narrowFormatedDay.get('./day[@type="wed"]').text(),
        'thu':  narrowFormatedDay.get('./day[@type="thu"]').text(),
        'fri':  narrowFormatedDay.get('./day[@type="fri"]').text(),
        'sat':  narrowFormatedDay.get('./day[@type="sat"]').text(),
        'sun':  narrowFormatedDay.get('./day[@type="sun"]').text()
      }
    },
    standalone: {
      short: {
        'mon':  shortStandaloneDay.get('./day[@type="mon"]').text(),
        'tue':  shortStandaloneDay.get('./day[@type="tue"]').text(),
        'wed':  shortStandaloneDay.get('./day[@type="wed"]').text(),
        'thu':  shortStandaloneDay.get('./day[@type="thu"]').text(),
        'fri':  shortStandaloneDay.get('./day[@type="fri"]').text(),
        'sat':  shortStandaloneDay.get('./day[@type="sat"]').text(),
        'sun':  shortStandaloneDay.get('./day[@type="sun"]').text()
      },
      wide: {
        'mon':  wideStandaloneDay.get('./day[@type="mon"]').text(),
        'tue':  wideStandaloneDay.get('./day[@type="tue"]').text(),
        'wed':  wideStandaloneDay.get('./day[@type="wed"]').text(),
        'thu':  wideStandaloneDay.get('./day[@type="thu"]').text(),
        'fri':  wideStandaloneDay.get('./day[@type="fri"]').text(),
        'sat':  wideStandaloneDay.get('./day[@type="sat"]').text(),
        'sun':  wideStandaloneDay.get('./day[@type="sun"]').text()
      },
      abbreviated: {
        'mon':  abbreviatedStandaloneDay.get('./day[@type="mon"]').text(),
        'tue':  abbreviatedStandaloneDay.get('./day[@type="tue"]').text(),
        'wed':  abbreviatedStandaloneDay.get('./day[@type="wed"]').text(),
        'thu':  abbreviatedStandaloneDay.get('./day[@type="thu"]').text(),
        'fri':  abbreviatedStandaloneDay.get('./day[@type="fri"]').text(),
        'sat':  abbreviatedStandaloneDay.get('./day[@type="sat"]').text(),
        'sun':  abbreviatedStandaloneDay.get('./day[@type="sun"]').text()
      },
      narrow: {
        'mon':  narrowStandaloneDay.get('./day[@type="mon"]').text(),
        'tue':  narrowStandaloneDay.get('./day[@type="tue"]').text(),
        'wed':  narrowStandaloneDay.get('./day[@type="wed"]').text(),
        'thu':  narrowStandaloneDay.get('./day[@type="thu"]').text(),
        'fri':  narrowStandaloneDay.get('./day[@type="fri"]').text(),
        'sat':  narrowStandaloneDay.get('./day[@type="sat"]').text(),
        'sun':  narrowStandaloneDay.get('./day[@type="sun"]').text()
      }
    }
  };

  var abbreviatedFormatedPeriod = this._getXMLNode('//calendar[@type="gregorian"]/dayPeriods/dayPeriodContext[@type="format"]/dayPeriodWidth[@type="abbreviated"]/dayPeriod', 'type');
  var narrowFormatedPeriod = this._getXMLNode('//calendar[@type="gregorian"]/dayPeriods/dayPeriodContext[@type="format"]/dayPeriodWidth[@type="narrow"]/dayPeriod', 'type');
  var wideFormatedPeriod = this._getXMLNode('//calendar[@type="gregorian"]/dayPeriods/dayPeriodContext[@type="format"]/dayPeriodWidth[@type="wide"]/dayPeriod', 'type');

  this.date['period'] = {
    abbreviated: {
      am: abbreviatedFormatedPeriod.get('./dayPeriod[@type="am"]').text(),
      pm: abbreviatedFormatedPeriod.get('./dayPeriod[@type="pm"]').text()
    },
    narrow: {
      am: narrowFormatedPeriod.get('./dayPeriod[@type="am"]').text(),
      pm: narrowFormatedPeriod.get('./dayPeriod[@type="pm"]').text()
    },
    wide: {
      am: wideFormatedPeriod.get('./dayPeriod[@type="am"]').text(),
      pm: wideFormatedPeriod.get('./dayPeriod[@type="pm"]').text()
    }
  };

  cache[this.locale].date = this.date;
};

/**
 * Namespace Constructors
 *
 * @namespace Constrcutors
 */

MessageFormat.AST = AST;

module.exports = MessageFormat;
