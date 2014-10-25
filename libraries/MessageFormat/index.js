
/**
 * Requires
 */

var Lexer = require('../Lexer')
  , AST = require('./AST')
  , xml = require('libxmljs')
  , fs = require('fs')
  , path = require('path')
  , LDML = require('../LDML')
  , _ = require('underscore')
  , currencySymbols = require('./currencySymbols');

/**
 * MessageFormat class
 *
 * @constructor
 */

function MessageFormat(locale) {
  this.locale = locale || program.defaultLocale;
  this.language = /^([a-z]+)\-/.exec(this.locale)[1];
  this.region = /\-([A-Z]+)$/.exec(this.locale)[1];
  this.variables = null;
  this.pluralRules = {};
  this.ordinalRules = {};
  this.lexer = null;
  this.messageAST = [];
  this.currentToken = null;
  this.lastChoiceCase = null;
  this.pluralKeywords = ['zero', 'one', 'two', 'few', 'many', 'other'];
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
  this._readPluralizationRules();
  this._readOrdinalRules();
  this._readDocuments();
  this._readNumberFormatsData();
  this._readDateData();
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
 * @return {AST}
 * @api private
 * @throw TypeError
 */

MessageFormat.prototype._parseSwitchStatement = function(variable) {
  var type = ''
    , numberSystem = ''
    , switchStatement = null;
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
 * @param {String} case
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
 * @return {AST.PluralFormat}
 * @api private
 */

MessageFormat.prototype._parsePluralFormat = function(variable) {
  var offset = 0
    , values = {}
    , offsetSyntax = /^offset:(\d)$/
    , exactlySyntax = /^=\d+$/
    , pluralKeywords = Object.keys(this.pluralRules);

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
  var offset = 0
    , values = {}
    , exactlySyntax = /^=\d+$/
    , ordinalKeywords = Object.keys(this.ordinalRules);

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
  var _this = this;

  var data = fs.readFileSync(path.join(
    __dirname, '../../CLDR/common/supplemental/plurals.xml'), 'utf-8');

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
};

/**
 * Read ordinal rules
 *
 * @return {void}
 * @api private
 */

MessageFormat.prototype._readOrdinalRules = function() {
  var _this = this
    , data = fs.readFileSync(path.join(
        __dirname, '../../CLDR/common/supplemental/ordinals.xml'), 'utf-8');

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
};

/**
 * Read LDML documents
 *
 * @return {void}
 * @api private
 */

MessageFormat.prototype._readDocuments = function() {
  var _this = this
    , rootDocumentPath = path.join(__dirname, '../../CLDR/common/main/root.xml')
    , localeDocumentPath = path.join(__dirname, '../../CLDR/common/main/' + this.language + '_' + this.region + '.xml')
    , languageDocumentPath = path.join(__dirname, '../../CLDR/common/main/' + this.language + '.xml');

  this.rootDocument = xml.parseXmlString(fs.readFileSync(rootDocumentPath, 'utf-8'), { noblanks: true })
  if(fs.existsSync(localeDocumentPath)) {
    this.localeDocument = xml.parseXmlString(fs.readFileSync(localeDocumentPath, 'utf-8'), { noblanks: true })
  }

  if(fs.existsSync(languageDocumentPath)) {
    this.languageDocument = xml.parseXmlString(fs.readFileSync(languageDocumentPath, 'utf-8'), { noblanks: true })
  }
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
 * @return {null|String}
 */

MessageFormat.prototype._getXMLNode = function(path) {
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

  while(node && typeof node.child === 'function' && node.child(0).name() === 'alias') {
    var relativePath = node.child(0).attr('path').value();
    node = node.get(relativePath);
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
};

/**
 * Read number symbols
 *
 * @param {XMLDocument} languageDocument Language specific main CLDR XML document
 * @param {XMLDocument} localeDocument Locale specific main CLDR XML document
 * @return {void}
 * @api private
 */

MessageFormat.prototype._readNumberSymbols = function(rootDocument, languageDocument, localeDocument) {
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
};

/**
 * Read currency data
 *
 * @return {void}
 * @api private
 */

MessageFormat.prototype._readCurrencyData = function() {
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
};

/**
 * Read date data
 *
 * @return {void}
 * @api private
 */

MessageFormat.prototype._readDateData = function() {
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

  var abbreviatedFormatedQuarter = this._getXMLNode('//calendar[@type="gregorian"]/quarters/quarterContext[@type="format"]/quarterWidth[@type="abbreviated"]');
  var wideFormatedQuarter = this._getXMLNode('//calendar[@type="gregorian"]/quarters/quarterContext[@type="format"]/quarterWidth[@type="wide"]');
  var abbreviatedStandaloneQuarter = this._getXMLNode('//calendar[@type="gregorian"]/quarters/quarterContext[@type="stand-alone"]/quarterWidth[@type="abbreviated"]');
  var wideStandaloneQuarter = this._getXMLNode('//calendar[@type="gregorian"]/quarters/quarterContext[@type="stand-alone"]/quarterWidth[@type="wide"]');

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
};

/**
 * Namespace Constructors
 *
 * @namespace Constrcutors
 */

MessageFormat.AST = AST;

module.exports = MessageFormat;
