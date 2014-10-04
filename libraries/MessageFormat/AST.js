
/**
 * Dependenices
 */

var _ = require('underscore');

/**
 * Namespace AST
 */

var AST = {};

AST.date = require('./AST.date')

/**
 * Cache used for lazy loading
 *
 * @type {Object}
 */

AST.cache = {
  plural: null
};

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
 * AST class representing an ICU NumberFormat
 *
 * @param {String} variable
 * @param {String} argument
 * @constructor
 */

AST.NumberFormat = function(locale, variable, argument, numberSymbols, currencies, decimalPattern, percentagePattern) {
  this.locale = locale;
  this.language = /^([a-z]+)\-/.exec(this.locale)[1];
  this.region = /\-([A-Z]+)$/.exec(this.locale)[1];
  this.variable = variable;
  this.argument = argument;
  this.numberSymbols = numberSymbols;
  this.currencies = currencies;
  this.pattern = AST.NumberFormatPattern.parse(
    argument,
    decimalPattern,
    percentagePattern
  );
};

/**
 * AST class representing a CurrencyFormat
 *
 * @param {String} variable
 * @param {String} argument
 * @constructor
 */

AST.CurrencyFormat = function(locale, variable, context, type, currencies, currencyPattern) {
  this.locale = locale;
  this.language = /^([a-z]+)\-/.exec(this.locale)[1];
  this.region = /\-([A-Z]+)$/.exec(this.locale)[1];
  this.variable = variable;
  this.context = context;
  this.type = type;
  this.currencies = currencies;
  this.pattern = currencyPattern;
};

/**
 * Namespace numnerformat pattern
 *
 * @namespace NumberFormatPattern
 */

AST.NumberFormatPattern = {};

/**
 * NumberFormat syntaxes
 *
 * @type {Enum}
 * @api private
 */

AST.NumberFormatPattern.Syntaxes = {
  NUMBER_SIMPLE_ARGUMENTS: /^(integer|percent)$/,
  EXPONENT_CHARACTER: 'E',
  NUMBER_CHARACTER: /[#0-9\.E@\,\+\-;]/,
  ROUNDING_CHARACTER: /[1-9]/,
  SIGNIFICANT_PATTERN: /^(#*)(@+)(#*)(E0+)?$/,
  EXPONENT_PATTERN: /^E(\+?)(0+)$/,
  FRACTION_PATTERN: /^([0-9]*)(#*)$/,
  INTEGER_PATTERN: /^(#*)([0-9]+)$/,
  GROUP_SIZE_PATTERN: /(\,[0-9#@]+)?\,([0-9#@]+)(\.[0-9#@]+)?$/
};

/**
 * Create format object representing a NumberFormat. A base class for
 * FloatingnumberFormat and SignificantNumberFormat.
 *
 * @class FloatingNumberFormat
 * @constructor
 * @api private
 */

AST.NumberFormatPattern._NumberFormat = function(attributes) {
  this.prefix = attributes.prefix;
  this.suffix = attributes.suffix;
  this.paddingCharacter = typeof attributes.paddingCharacter !== 'undefined' ? attributes.paddingCharacter : null;
  this.groupSize = typeof attributes.groupSize !== 'undefined' ? attributes.groupSize : null;
  this.percentage = typeof attributes.percentage !== 'undefined' ? attributes.percentage : null;
  this.permille = typeof attributes.permille !== 'undefined' ? attributes.permille : null;
  this.currency = typeof attributes.currency !== 'undefined' ? attributes.currency : null;
  this.rounding = attributes.rounding;
  this.patternLength = attributes.patternLength;
};

/**
 * Create format object representing a FloatingNumberFormat.
 *
 * @class FloatingNumberFormat
 * @constructor
 * @api private
 */

AST.NumberFormatPattern._FloatingNumberFormat = function(attributes) {
  AST.NumberFormatPattern._NumberFormat.apply(this, arguments);

  this.fraction = typeof attributes.fraction !== 'undefined' ? attributes.fraction : null;
  this.integer = attributes.integer;
  this.exponent = typeof attributes.exponent !== 'undefined' ? attributes.exponent : null;
};

AST.NumberFormatPattern._FloatingNumberFormat.prototype = Object.create(AST.NumberFormatPattern._NumberFormat.prototype);

/**
 * Create format object representing a SignificantFormat.
 *
 * @class SignificantNumberFormat
 * @constructor
 * @api private
 */

AST.NumberFormatPattern._SignificantNumberFormat = function(attributes) {
  AST.NumberFormatPattern._NumberFormat.apply(this, arguments);

  this.leftAbsentNumbers = attributes.leftAbsentNumbers;
  this.nonAbsentNumbers = attributes.nonAbsentNumbers;
  this.rightAbsentNumbers = attributes.rightAbsentNumbers;
  this.exponent = typeof attributes.exponent !== 'undefined' ? attributes.exponent : null;
};

AST.NumberFormatPattern._SignificantNumberFormat.prototype = Object.create(AST.NumberFormatPattern._NumberFormat.prototype);

/**
 * Parse argument and sets format
 *
 * @param {String} argument pattern
 * @return{void}
 * @api private
 */

AST.NumberFormatPattern.parse = function(argument, decimalPattern, percentagePattern) {
  var _this = this
    , numberPatterns = argument
    , format = { positive: null, negative: null };

  if(AST.NumberFormatPattern.Syntaxes.NUMBER_SIMPLE_ARGUMENTS.test(numberPatterns)) {
    switch(numberPatterns) {
      case 'integer':
        decimalPattern.fraction = null;
        return decimalPattern;
      case 'percent':
        return percentagePattern;
    }
  }
  var positive = true;
  numberPatterns.split(';').forEach(function(numberPattern) {
    var attributes = {};

    numberPattern = _this._setPrefixesAndSuffixAttributes(numberPattern, attributes);
    var result = _this._getNumberFormat(numberPattern, attributes);
    if(positive) {
      format.positive = result;
    }
    else {
      format.negative = result;
    }
    positive = false;
  });

  return format;
};

/**
 * Get number format
 *
 * @param {String} numberPattern String that represents a number pattern
 * excluding prefix and suffix
 * @param {Object} attributes Object used during initialization of a
 * NumberFormat.NumberFormat
 * @return {void}
 * @throws TypeError
 * @api private
 */

AST.NumberFormatPattern._getNumberFormat = function(numberPattern, attributes) {
  // All group size is already set so we can remove all commas
  // to ease our parsing
  numberPattern = numberPattern.replace(/,/g, '');
  if(AST.NumberFormatPattern.Syntaxes.SIGNIFICANT_PATTERN.test(numberPattern)) {
    return this._getSignificantNumberFormat(numberPattern, attributes);
  }

  var floatAndExponentPattern = numberPattern.split('E');
  if(floatAndExponentPattern.length <= 2) {
    return this._getFloatingNumberFormat(floatAndExponentPattern, attributes);
  }
  else {
    throw new TypeError('Expected only one \'E\' in your exponent pattern in your NumberFormat argument, got ' + (floatAndExponentPattern.length - 1)+ ' \'E\':s in ' + _this.currentNumberPattern);
  }
};

/**
 * Get floating number format
 *
 * @param {Array} floatAndExponentPattern An array representing float and
 * exponent pattern that is splitted using the string `E`
 * @param {Object} attributes Object used during initialization of a
 * NumberFormat.NumberFormat
 * @return {AST.NumberFormat._FloatingNumberFormat}
 * @throws TypeError
 * @api private
 */

AST.NumberFormatPattern._getFloatingNumberFormat = function(floatAndExponentPattern, attributes) {
  if(floatAndExponentPattern.length === 2) {
    attributes.exponent = this._getExponentAttributes('E' + floatAndExponentPattern[1]);
  }

  var integerAndFractionPattern = floatAndExponentPattern[0].split('.');
  if(integerAndFractionPattern.length <= 2) {
    if(integerAndFractionPattern.length === 2) {
      attributes.fraction = this._getFractionAttributes(integerAndFractionPattern[1]);
    }

    attributes.integer = this._getIntegerAttributes(integerAndFractionPattern[0]);

    return new AST.NumberFormatPattern._FloatingNumberFormat(attributes);
  }
  else {
    throw new TypeError('Expected only one \'.\' in your number pattern in your NumberFormat argument, got ' + (integerAndFractionPattern.length - 1) + ' \'.\':s in ' + this.currentNumberPattern);
  }
};

/**
 * Get integer attributes from an integerAndFractionPattern
 *
 * @param {String} integerAndFractionPattern
 * @return {Object}
 *
 *   {
 *     leftAbsentNumbers: Number,
 *     nonAbsentNumbers: Number
 *   }
 *
 * @throws TypeError
 * @api private
 */

AST.NumberFormatPattern._getIntegerAttributes = function(integerAndFractionPattern) {
  if(!AST.NumberFormatPattern.Syntaxes.INTEGER_PATTERN.test(integerAndFractionPattern)) {
    throw new TypeError('Expected a valid integer pattern (/^#*0+$/) in your NumberFormat argument, got (' + integerAndFractionPattern + ') in '  + this.currentNumberPattern);
  }

  var pattern = AST.NumberFormatPattern.Syntaxes.INTEGER_PATTERN.exec(integerAndFractionPattern);
  return {
    leftAbsentNumbers: pattern[1].length,
    nonAbsentNumbers: pattern[2].length
  };
};

/**
 * Get fraction attributes from an integerAndFractionPattern
 *
 * @param {String} integerAndFractionPattern
 * @return {Object}
 *
 *   {
 *     nonAbsentNumbers: Number,
 *     rightAbsentNumbers: Number
 *   }
 *
 * @throws TypeError
 * @api private
 */

AST.NumberFormatPattern._getFractionAttributes = function(integerAndFractionPattern) {
  if(!AST.NumberFormatPattern.Syntaxes.FRACTION_PATTERN.test(integerAndFractionPattern)) {
    throw new TypeError('Expected a valid fraction pattern (/^0*#*$/) in your NumberFormat argument, got (' + integerAndFractionPattern + ') in ' + this.currentNumberPattern);
  }

  var pattern = AST.NumberFormatPattern.Syntaxes.FRACTION_PATTERN.exec(integerAndFractionPattern);
  return {
    nonAbsentNumbers: pattern[1].length,
    rightAbsentNumbers: pattern[2].length
  };
};

/**
 * Get exponent attributes from a exponent pattern string
 *
 * @param {String} exponentPattern
 * @return {Object}
 *
 *   {
 *     nonAbsentNumbers: Number,
 *     showPositiveCharacter: Boolean
 *   }
 *
 * @throws TypeError
 * @api private
 */

AST.NumberFormatPattern._getExponentAttributes = function(exponentPattern) {
  if(!AST.NumberFormatPattern.Syntaxes.EXPONENT_PATTERN.test(exponentPattern)) {
    throw new TypeError('Expected a valid exponent pattern (/^E\\+?[0-9]+$/) in your NumberFormat argument, got (' + exponentPattern + ') in ' + this.currentNumberPattern);
  }

  var pattern = AST.NumberFormatPattern.Syntaxes.EXPONENT_PATTERN.exec(exponentPattern);
  return {
    nonAbsentNumbers: pattern[2].length,
    showPositiveCharacter: !!pattern[1].length
  };
};

/**
 * Get signifcant number format on NumberFormat's property format.positive
 * or format.negative depending on if it is positive or not.
 *
 * @param {String} numberPattern
 * @param {Object} attributes Object used during initialization of a
 * NumberFormat.NumberFormat
 * @return {AST.NumberFormat._SignificantNumberFormat}
 * @api private
 */

AST.NumberFormatPattern._getSignificantNumberFormat = function(numberPattern, attributes) {
  var pattern = AST.NumberFormatPattern.Syntaxes.SIGNIFICANT_PATTERN.exec(numberPattern);
  attributes.leftAbsentNumbers = pattern[1].length;
  attributes.nonAbsentNumbers = pattern[2].length;
  attributes.rightAbsentNumbers = pattern[3].length;

  if(pattern[4]) {
    attributes.exponent = this._getExponentAttributes(pattern[4]);
  }

  return new AST.NumberFormatPattern._SignificantNumberFormat(attributes);
};

/**
 * Set prefixes and suffix attributes
 *
 * @info http://icu-project.org/apiref/icu4c/classicu_1_1DecimalFormat.html
 * @param {String} numberPattern
 * @param {Object} attributes (passed by reference)
 * @return {String} the number string excluding prefix and suffix
 * @api private
 */

AST.NumberFormatPattern._setPrefixesAndSuffixAttributes = function(numberPattern, attributes) {
  var result = ''
    , prefix = ''
    , suffix = ''
    , hasEncounterNumberCharacters = false
    , hasEncounterSuffix = false
    , hasEncounterExponent = false
    , currencyCharacterCounter = 0
    , index = 0
    , fractions = ''
    , inQuote = false
    , patternLength = 0
    , setPaddingCharacter = false
    , rounding = ''

  this.currentNumberPattern = numberPattern;

  for(var index = 0; index < numberPattern.length; index++) {
    // Check quote for escaping special characters
    if(numberPattern[index] === '\'') {
      if(inQuote) {
        inQuote = false;
        continue;
      }
      var hasEndingQuote =
        typeof numberPattern[index + 2] !== 'undefined' &&
        numberPattern[index + 2] === '\'';

      if(!inQuote && !hasEndingQuote) {
        throw new TypeError('Expected ending quote (\') in ' + numberPattern);
      }
      inQuote = true;
      continue;
    }

    // Padding character deferred setting
    if(setPaddingCharacter) {
      attributes.paddingCharacter = numberPattern[index];
      setPaddingCharacter = false;
      if(hasEncounterNumberCharacters) {
        suffix += numberPattern[index];
      }
      else {
        prefix += numberPattern[index];
      }
      continue;
    }

    switch(numberPattern[index]) {
      case '*':
        if(attributes.paddingCharacter) {
          throw new TypeError('Can not set double padding character(*x*x) in ' + numberPattern);
        }
        if(hasEncounterNumberCharacters) {
          suffix += '*';
        }
        else {
          prefix += '*';
        }
        // Defer padding character set
        setPaddingCharacter = true;
        continue;
      case '%':
        attributes.percentage = this._getPercentage(attributes);
        if(hasEncounterNumberCharacters) {
          suffix += '%';
        }
        else {
          prefix += '%';
        }
        patternLength++;
        continue;
      case '‰':
        attributes.permille = this._getPermille(attributes);
        if(hasEncounterNumberCharacters) {
          suffix += '‰';
        }
        else {
          prefix += '‰';
        }
        patternLength++;
        continue;
      case '¤':
        currencyCharacterCounter++;
        attributes.currency = this._getCurrency(
          attributes,
          currencyCharacterCounter);
        if(hasEncounterNumberCharacters) {
          suffix += '¤';
        }
        else {
          prefix += '¤';
        }
        patternLength++;
        continue;
    }

    patternLength++;

    if(AST.NumberFormatPattern.Syntaxes.NUMBER_CHARACTER.test(numberPattern[index])) {
      if(hasEncounterSuffix) {
        throw new TypeError('A number pattern can not exist after suffix pattern in ' + numberPattern);
      }
      if(!hasEncounterExponent) {
        if(AST.NumberFormatPattern.Syntaxes.ROUNDING_CHARACTER.test(numberPattern[index])) {
          rounding += numberPattern[index];
        }
        if(numberPattern[index] === '.') {
          rounding += '.';
        }
        if(rounding.length > 0 && /[0]/.test(numberPattern[index])) {
          rounding += '0';
        }
      }

      if(numberPattern[index] === AST.NumberFormatPattern.Syntaxes.EXPONENT_CHARACTER) {
        hasEncounterExponent = true;
      }

      hasEncounterNumberCharacters = true;
      result += numberPattern[index];
      continue;
    }

    if(!hasEncounterNumberCharacters) {
      prefix += numberPattern[index];
      continue;
    }
    else {
      hasEncounterSuffix = true;
      suffix += numberPattern[index];
    }
  }

  if(rounding.length === 0) {
    attributes.rounding = 1;
  }
  else {
    if(/^[0\.]+$/.test(rounding)) {
      attributes.rounding = parseFloat(rounding.substring(0, rounding.length - 1) + '1');
    }
    else {
      attributes.rounding = parseFloat(rounding);
    }
  }

  // Set prefix and suffix
  attributes.prefix = prefix;
  attributes.suffix = suffix;

  // Calculate group size
  if(AST.NumberFormatPattern.Syntaxes.GROUP_SIZE_PATTERN.test(result)) {
    attributes.groupSize = this._getGroupSizeAttributes(result);
  }

  // Format length
  attributes.patternLength = patternLength;

  return result;
};

/**
 * Get group size attributes to be used in NumberFormat.NumberFormat
 *
 * @param {String} numberPattern
 * @return {Object}
 *
 *   {
 *     primary: Number,
 *     secondary: Number
 *   }
 * @api private
 */

AST.NumberFormatPattern._getGroupSizeAttributes = function(numberPattern) {
  var pattern = AST.NumberFormatPattern.Syntaxes.GROUP_SIZE_PATTERN.exec(numberPattern);
  return {
    primary: pattern[2].length,
    // We subtract by one to remove one length unit caused by comma
    secondary:
      typeof pattern[1] !== 'undefined' ?
      pattern[1].length - 1 :
      pattern[2].length
  };
};

/**
 * Get percentage attributes to be used in NumberFormat.NumberFormat
 *
 * @param {Object} attributes Object used during initialization of a
 * NumberFormat.NumberFormat
 * @return {Boolean}
 * @throws TypeError
 * @api private
 */

AST.NumberFormatPattern._getPercentage = function(attributes) {
  if(attributes.percentage) {
    throw new TypeError('Can not set double percentage character(%%) in ' + this.currentNumberPattern);
  }
  if(attributes.permille || attributes.currency) {
    throw new TypeError('Can not set percentage whenever permille or currency are set in ' + this.currentNumberPattern);
  }

  return true;
};

/**
 * Get permille attributes to be used in NumberFormat.NumberFormat
 *
 * @param {Object} attributes Object used during initialization of a
 * NumberFormat.NumberFormat
 * @param {Boolean} hasEncounterdNumberCharacters
 * @return {Object}
 *
 *   {
 *     position: ('prefix'|'suffix')
 *   }
 *
 * @throws TypeError
 * @api private
 */

AST.NumberFormatPattern._getPermille = function(attributes, hasEncounterdNumberCharacters) {
  if(attributes.permille) {
    throw new TypeError('Can not set double permille character(‰‰) in ' + this.currentNumberPattern);
  }
  if(attributes.percentage || attributes.currency) {
    throw new TypeError('Can not set permille whenever percentage or currency are set in ' + this.currentNumberPattern);
  }

  return true;
};

/**
 * Get currency attributes to be used in NumberFormat.NumberFormat
 *
 * @param {Object} attributes Object used during initialization of a
 * NumberFormat.NumberFormat
 * @param {Number} currencyCharacterCounter
 * @param {Boolean} hasEncounterdNumberCharacters
 * @return {Object}
 *
 *   {
 *     position: ('prefix'|'suffix'),
 *     characterLength: Number
 *   }
 *
 * @throws TypeError
 * @api private
 */

AST.NumberFormatPattern._getCurrency = function(attributes, currencyCharacterCounter, hasEncounterdNumberCharacters) {
  if(attributes.percentage || attributes.permille) {
    throw new TypeError('Can not set currency whenever percentage or permille are set in ' + this.currentNumberPattern);
  }
  if(hasEncounterdNumberCharacters) {
    if(typeof attributes.currency !== 'undefined' &&
       typeof attributes.currency.position === 'prefix') {
      throw new TypeError('Can not set both a currency prefix and suffix in ' + this.currentNumberPattern);
    }
  }

  return true;
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

AST.PluralFormat = function(locale, variable, values, offset) {
  this.locale = locale;
  this.variable = variable;
  this.values = values;
  this.offset = offset;
};

/**
 * AST class representing an ICU PluralFormat
 *
 * @param {String} variable
 * @constructor
 */

AST.SelectordinalFormat = function(locale, variable, values, offset) {
  this.locale = locale;
  this.variable = variable;
  this.values = values;
  this.offset = offset;
};

/**
 * AST class representing an ICU PluralFormat remaining '#'
 *
 * @param {String} variable
 * @param {Number} offset
 * @param {Object} pattern A numner pattern object
 * @constructor
 */

AST.Remaining = function(variable, offset, pattern) {
  this.variable = variable;
  this.offset = offset;
  this.pattern = pattern;
};

module.exports = AST;
