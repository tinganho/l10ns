
/**
 * Dependenices
 */

var _ = require('underscore');

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
 * AST class representing an ICU NumberFormat
 *
 * @param {String} variable
 * @param {String} argument
 * @constructor
 */

AST.NumberFormat = function(variable, argument) {
  this.variable = variable;
  this.argument = argument;
  this.format = {
    positive: null,
    negative: null
  };
  this._parseArgument(argument);
};

/**
 * NumberFormat syntaxes
 *
 * @type {Enum}
 */

AST.NumberFormat.prototype.Syntaxes = {
  NUMBER_SIMPLE_ARGUMENTS: /^(integer|currency|percent)$/,
  NUMBER_CHARACTER: /[#0-9\.E@\,\+\-;]/,
  NUMBER_SUFFIX: /'([\u0000-\uFFFD])'$/,
  SIGNIFICANT_PATTERN: /^(#*)(@+)(#*)$/,
  EXPONENT_PATTERN: /^E(\+?)(0+)$/,
  FRACTION_PATTERN: /^(0*)(#*)$/,
  INTEGER_PATTERN: /^(#*)(0+)$/,
  GROUP_SIZE_PATTERN: /(\,[0#]+)?\,([0#]+)(\.[0#]+)?$/
};

/**
 * Create format object representing a NumberFormat. A base class for
 * FloatingnumberFormat and SignificantNumberFormat.
 *
 * @class FloatingNumberFormat
 * @constructor
 * @api private
 */

AST.NumberFormat._NumberFormat = function(attributes) {
  this.prefix = attributes.prefix;
  this.suffix = attributes.suffix;
  this.paddingCharacter = typeof attributes.paddingCharacter !== 'undefined' ? attributes.paddingCharacter : null;
  this.groupSize = typeof attributes.groupSize !== 'undefined' ? attributes.groupSize : null;
  this.percentage = typeof attributes.percentage !== 'undefined' ? attributes.percentage : null;
  this.permille = typeof attributes.permille !== 'undefined' ? attributes.permille : null;
  this.currency = typeof attributes.currency !== 'undefined' ? attributes.currency : null;
  this.formatLength = attributes.formatLength;
};

/**
 * Create format object representing a FloatingNumberFormat.
 *
 * @class FloatingNumberFormat
 * @constructor
 * @api private
 */

AST.NumberFormat._FloatingNumberFormat = function(attributes) {
  AST.NumberFormat._NumberFormat.apply(this, arguments);

  this.exponent = typeof attributes.exponent !== 'undefined' ? attributes.exponent : null;
  this.fraction = typeof attributes.fraction !== 'undefined' ? attributes.fraction : null;
  this.integer = attributes.integer;
};

AST.NumberFormat._FloatingNumberFormat.prototype = Object.create(AST.NumberFormat._NumberFormat.prototype);

/**
 * Create format object representing a SignificantFormat.
 *
 * @class SignificantNumberFormat
 * @constructor
 * @api private
 */

AST.NumberFormat._SignificantNumberFormat = function(attributes) {
  AST.NumberFormat._NumberFormat.apply(this, arguments);

  this.leftAbsentNumbers = attributes.leftAbsentNumbers;
  this.nonAbsentNumbers = attributes.nonAbsentNumbers;
  this.rightAbsentNumbers = attributes.rightAbsentNumbers;
};

AST.NumberFormat._SignificantNumberFormat.prototype = Object.create(AST.NumberFormat._NumberFormat.prototype);

/**
 * Parse argument and sets format
 *
 * @param {String} argument
 * @return{void}
 * @api private
 */

AST.NumberFormat.prototype._parseArgument = function(argument) {
  var _this = this
    , numberPatterns = argument;

  if(this.Syntaxes.NUMBER_SIMPLE_ARGUMENTS.test(numberPatterns)) {
    // Valid pattern
    return;
  }
  else {
    var positive = true;
    numberPatterns.split(';').forEach(function(numberPattern) {
      var attributes = {};

      numberPattern = _this._setPrefixesAndSuffixAttributes(numberPattern, attributes);

      if(_this.Syntaxes.SIGNIFICANT_PATTERN.test(numberPattern)) {
        _this._setSignificantNumberFormat(numberPattern, positive);
        positive = false;

        // Valid pattern
        return;
      }

      var floatAndExponentPattern = numberPattern.split('E');
      if(floatAndExponentPattern.length <= 2) {
        if(floatAndExponentPattern.length === 2) {
          attributes.exponent = _this._getExponentAttributes('E' + floatAndExponentPattern[1]);
        }

        var integerAndFractionPattern = floatAndExponentPattern[0].split('.');
        if(integerAndFractionPattern.length <= 2) {
          if(integerAndFractionPattern.length == 2) {
            attributes.fraction = _this._getFractionAttributes(integerAndFractionPattern[1]);
          }


          attributes.integer = _this._getIntegerAttributes(integerAndFractionPattern[0]);

          _this._setFloatingNumberFormat(attributes, positive);

          positive = false;

          // Valid pattern
          return;
        }
        else {
          throw new TypeError('Expected only one \'.\' in your number pattern in your NumberFormat argument, got ' + (integerAndFractionPattern.length - 1) + ' \'.\':s in ' + numberPattern);
        }
      }
      else {
        throw new TypeError('Expected only one \'E\' in your exponent pattern in your NumberFormat argument, got ' + (floatAndExponentPattern.length - 1)+ ' \'E\':s in ' + numberPattern);
      }
    });
  }
};

/**
 * Get integer attributes from an integerAndFractionPattern
 *
 * @param {String} integerAndFractionPattern
 * @return {void}
 * @api private
 */

AST.NumberFormat.prototype._getIntegerAttributes = function(integerAndFractionPattern) {
  if(!this.Syntaxes.INTEGER_PATTERN.test(integerAndFractionPattern)) {
    throw new TypeError('Expected a valid integer pattern (/^#*0+$/) in your NumberFormat argument, got (' + integerAndFractionPattern[0] + ') in '  + numberPattern);
  }

  var pattern = this.Syntaxes.INTEGER_PATTERN.exec(integerAndFractionPattern);
  return {
    leftAbsentNumbers: pattern[1].length,
    nonAbsentNumbers: pattern[2].length
  };
};

/**
 * Get fraction attributes from an integerAndFractionPattern
 *
 * @param {String} integerAndFractionPattern
 * @return {void}
 * @api private
 */

AST.NumberFormat.prototype._getFractionAttributes = function(integerAndFractionPattern) {
  if(!this.Syntaxes.FRACTION_PATTERN.test(integerAndFractionPattern)) {
    throw new TypeError('Expected a valid fraction pattern (/^0*#*$/) in your NumberFormat argument, got (' + integerAndFractionPattern[1] + ') in ' + numberPattern);
  }

  var pattern = this.Syntaxes.FRACTION_PATTERN.exec(integerAndFractionPattern);
  return {
    nonAbsentNumbers: pattern[1].length,
    rightAbsentNumbers: pattern[2].length
  };
};

/**
 * Get exponent attributes from a exponent pattern string
 *
 * @param {String} exponentPatter
 * @return {void}
 * @api private
 */

AST.NumberFormat.prototype._getExponentAttributes = function(exponentPattern) {
  if(!this.Syntaxes.EXPONENT_PATTERN.test(exponentPattern)) {
    throw new TypeError('Expected a valid exponent pattern (/^E\\+?[0-9]+$/) in your NumberFormat argument, got (' + floatAndExponentPattern[1] + ') in ' + numberPattern);
  }

  var pattern = this.Syntaxes.EXPONENT_PATTERN.exec(exponentPattern);
  return {
    nonAbsentNumbers: pattern[2].length,
    showPositiveCharacter: !!pattern[1].length
  };
};

/**
 * Set floating number format on NumberFormat's property format.positive
 * or format.negative depending on if it is positive or not.
 *
 * @param {String} attributes
 * @param {Boolean} positive
 * @return {void}
 * @api private
 */

AST.NumberFormat.prototype._setFloatingNumberFormat = function(attributes, positive) {
  var format = new AST.NumberFormat._FloatingNumberFormat(attributes);

  if(positive) {
    this.format.positive = format;
  }
  else {
    this.format.negative = format;
  }
};

/**
 * Set signifcant number format on NumberFormat's property format.positive
 * or format.negative depending on if it is positive or not.
 *
 * @param {String} numberPattern
 * @param {Boolean} positive
 * @return {void}
 * @api private
 */

AST.NumberFormat.prototype._setSignificantNumberFormat = function(numberPattern, positive) {
  var pattern = this.Syntaxes.SIGNIFICANT_PATTERN.exec(numberPattern);
  var format = new AST.NumberFormat._SignificantNumberFormat({
    leftAbsentNumbers: pattern[1].length,
    nonAbsentNumbers: pattern[2].length,
    rightAbsentNumbers: pattern[2].length
  });

  if(positive) {
    this.format.positive = format;
  }
  else {
    this.format.negative = format;
  }
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

AST.NumberFormat.prototype._setPrefixesAndSuffixAttributes = function(numberPattern, attributes) {
  var result = ''
    , prefix = ''
    , suffix = ''
    , hasEncounterdNumberCharacters = false
    , currencyCharacterCounter = 0
    , index = 0
    , inQuote = false
    , setPaddingCharacter = false;

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
      continue;
    }

    switch(numberPattern[index]) {
      case '*':
        // Defer padding character set
        setPaddingCharacter = true;
        continue;
      case '%':
        if(attributes.percentage) {
          throw new TypeError('Can not set double percentage character(%) in ' + numberPattern);
        }
        if(attributes.permille || attributes.currency) {
          throw new TypeError('Can not set percentage whenever permille or currency are set in ' + numberPattern);
        }
        if(!hasEncounterdNumberCharacters) {
          attributes.percentage = {
            position: 'prefix'
          };
        }
        else {
          attributes.percentage = {
            position: 'suffix'
          };
        }
        continue;
      case '‰':
        if(attributes.permille) {
          throw new TypeError('Can not set double permille character(‰) in ' + numberPattern);
        }
        if(attributes.percentage || attributes.currency) {
          throw new TypeError('Can not set permille whenever percentage or currency are set in ' + numberPattern);
        }
        if(!hasEncounterdNumberCharacters) {
          attributes.permille = {
            position: 'prefix'
          };
        }
        else {
          attributes.permille = {
            position: 'suffix'
          };
        }
        continue;
      case '¤':
        if(attributes.percentage || attributes.permille) {
          throw new TypeError('Can not set currency whenever percentage and permille are set in ' + numberPattern);
        }
        if(!hasEncounterdNumberCharacters) {
          currencyCharacterCounter++;
          attributes.currency = {
            position: 'prefix',
            characterLength: currencyCharacterCounter
          };
        }
        else {
          if(typeof attributes.currency !== 'undefined' &&
             typeof attributes.currency.position === 'prefix') {
            throw new TypeError('Can not set both a currency prefix and suffix in ' + numberPattern);
          }
          currencyCharacterCounter++;
          attributes.currency = {
            position: 'suffix',
            characterLength: currencyCharacterCounter
          };
        }
        continue;
    }

    if(this.Syntaxes.NUMBER_CHARACTER.test(numberPattern[index])) {
      hasEncounterdNumberCharacters = true;
      result += numberPattern[index];
      continue;
    }

    if(!hasEncounterdNumberCharacters) {
      prefix += numberPattern[index];
      continue;
    }
    else {
      suffix += numberPattern[index];
    }
  }

  // Set prefix and suffix
  attributes.prefix = prefix;
  attributes.suffix = suffix;

  // Calculate group size
  if(this.Syntaxes.GROUP_SIZE_PATTERN.test(result)) {
    var pattern = this.Syntaxes.GROUP_SIZE_PATTERN.exec(result);
    attributes.groupSize = {
      primary: pattern[1].length,
      // We subtract by one to remove one length unit caused by comma
      secondary: (pattern[0].length - 1) || pattern[1].length
    };
  }

  // Format length
  attributes.formatLength = prefix.length + result.length + suffix.length;

  return result;
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
