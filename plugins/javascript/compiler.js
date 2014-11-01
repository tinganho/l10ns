
/**
 * Module dependencies
 */

var fs = require('fs')
  , path = require('path')
  , syntax = require('./syntax')
  , template = require('./templates/build/templates')
  , file = require('../../libraries/file')
  , log = require('../../libraries/_log')
  , mkdirp = require('mkdirp')
  , MessageFormat = require('../../libraries/MessageFormat')
  , digits = require('./digits')
  , defer = require('q').defer
  , LDML = { AST: require('../../libraries/LDML/AST') };

/**
 * Add terminal colors
 */

require('terminal-colors');

/**
 * Compiler
 *
 * @constructor Compiler
 */

var Compiler = function() {
  // default namespace
  this.namespace = 'it';
  // new line
  this.linefeed = '\n';
  // quote
  this.quote = '\'';
  // dot
  this.dot = '.';
  // comma
  this.comma = ',';
  // add
  this.add = ' + ';
  // space
  this.space = ' ';
  // and
  this.and = ' && ';
  // append string
  this.appendString = 'string += ';
};

/**
 * Compile task
 *
 * @return {void}
 * @api public
 */

Compiler.prototype.run = function() {
  var _this = this;
  this._getLocalizationMap()
    .then(function(localizationsMap) {
      var localesCount = 0;
      var localesLength = Object.keys(localizationsMap).length
      var allLocalizations = '';

      if(project.outputFile) {
        throw new TypeError('`outputFile` is no longer in use, please use just `output`.');
      }

      if(!project.output) {
        throw new TypeError('You must define an output in your l10ns.json file.');
      }


      for(var locale in localizationsMap) {
        var stringMap = template['LocalizationsMap']({
          localizations: _this._indentSpaces(2, localizationsMap[locale])
        });

        var content = template['JavascriptWrapper']({
          roundUpFunction: _this._indentSpaces(2, template['RoundToFunction']()),
          formatNumberFunction: _this._indentSpaces(2, template['FormatNumberFunction']()),
          functionName: language.GET_LOCALIZATION_STRING_FUNCTION_NAME,
          localizationMap: _this._indentSpaces(2, stringMap),
          functionBlock: _this._indentSpaces(2, template['LocalizationGetter']({
            locale: locale
          })),
          moduleExportBlock: _this._indentSpaces(2, template['ModuleExportBlock']({
            variableName: 'l'
          }))
        });

        var filePath = path.join(project.root, project.output) + '/' + locale + '.js';
        mkdirp.sync(path.dirname(filePath));
        fs.writeFileSync(filePath, content);

        allLocalizations += localizationsMap[locale];

        if(localesCount !== localesLength - 1) {
          allLocalizations += _this.comma;
          allLocalizations += _this.linefeed;
        }

        localesCount++;
      }

      var stringMap = template['LocalizationsMap']({
        localizations: _this._indentSpaces(2, allLocalizations)
      });

      var content = template['JavascriptWrapper']({
        roundUpFunction: _this._indentSpaces(2, template['RoundToFunction']()),
        formatNumberFunction: _this._indentSpaces(2, template['FormatNumberFunction']()),
        functionName: language.GET_LOCALIZATION_STRING_FUNCTION_NAME,
        localizationMap: _this._indentSpaces(2, stringMap),
        functionBlock: _this._indentSpaces(2, template['RequireLocalizations']()),
        moduleExportBlock: _this._indentSpaces(2, template['ModuleExportBlock']({
          variableName: 'requireLocalizations'
        }))
      });

      var filePath = path.join(project.root, project.output) + '/all.js';
      mkdirp.sync(path.dirname(filePath));
      fs.writeFileSync(filePath, content);
    })
    .fail(function(error) {
      if(commands.stack && error && error.stack) {
        console.log(error.stack);
      }

      if(error && error.message) {
        console.log(error.message);
      }
    });
};

/**
 * Indent spaces
 *
 * @param {Number} spaces
 * @param {String} string
 * @return {String}
 * @api public
 */

Compiler.prototype._indentSpaces = function(spaces, string) {
  for(var i = 0; i<spaces; i++) {
    string = string.replace(/\n/g, '\n ');
  }
  if(/^[^\s]$/.test(string.charAt(0))) {
    for(var i = 0; i<spaces; i++) {
      string = ' ' + string;
    }
  }

  string = string.replace(/\n\s+\n/g, '\n\n');

  return string;
};

/**
 * Get localization map string.
 *
 * @param {String} locale
 * @return {Promise}
 * @resolves {String} String representing a localization map
 * @api private
 */

Compiler.prototype._getLocalizationMap = function() {
  var _this = this, deferred = defer();
  file.readLocalizations()
    .then(function(localizations) {
      var localizationsMap = {}
        , localesLength = Object.keys(localizations).length
        , localesCount = 0;

      for(var locale in localizations) {
        var localizationMap = ''
          , localizationsLength = Object.keys(localizations[locale]).length
          , localizationsCount = 0
          , messageFormat = new MessageFormat(locale);

        localizationMap += template['LocalizationKeyValue']({
          key: '__getPluralKeyword',
          value: _this._getPluralGetterFunctionString(messageFormat) + _this.linefeed
        });

        localizationMap += template['LocalizationKeyValue']({
          key: '__getOrdinalKeyword',
          value: _this._getOrdinalGetterFunctionString(messageFormat) + _this.linefeed
        });

        localizationMap += template['LocalizationKeyValue']({
          key: '__numberSymbols',
          value: JSON.stringify(messageFormat.numberSymbols, null, 2).replace(/"/g, '\'') + _this.comma + _this.linefeed
        });

        localizationMap += template['LocalizationKeyValue']({
          key: '__currencies',
          value: JSON.stringify(messageFormat.currencies, null, 2).replace(/"/g, '\'') + _this.comma + _this.linefeed
        });

        localizationMap += template['LocalizationKeyValue']({
          key: '__currencyUnitPattern',
          value: JSON.stringify(messageFormat.currencyUnitPattern, null, 2).replace(/"/g, '\'') + _this.comma + _this.linefeed
        });

        var localizationsCount = 0;
        for(var key in localizations[locale]) {
          messageFormat.parse(localizations[locale][key].value);
          var _function = template['Function']({
            functionBody: _this._indentSpaces(
              2,
              _this._getFunctionBody(messageFormat.messageAST, locale)
            )
          });

          localizationMap += template['LocalizationKeyValue']({
            key: key,
            value: _function
          });

          if(localizationsCount !== localizationsLength - 1) {
            localizationMap += _this.comma;
            localizationMap += _this.linefeed;
          }

          localizationsCount++;
        }

        localizationsMap[locale] = template['LocalizationMap']({
          locale: locale,
          map: _this._indentSpaces(2, localizationMap)
        });
      }

      deferred.resolve(localizationsMap);
    })
    .fail(function(error) {
      deferred.reject(error);
    });

  return deferred.promise;
};

/**
 * Get function body
 *
 * @param {Array} messageAST
 * @return {String} A string representing a function body
 * @api private
 */

Compiler.prototype._getFunctionBody = function(messageAST, locale) {
  var result = '';

  for(var index = 0; index < messageAST.length; index++) {
    if(messageAST[index] instanceof MessageFormat.AST.Sentence) {
      result += template['Sentence']({ sentence: messageAST[index].string });
    }
    else if(messageAST[index] instanceof MessageFormat.AST.Variable) {
      result += template['Variable']({ variableName: messageAST[index].name });
    }
    else if(messageAST[index] instanceof MessageFormat.AST.Remaining) {
      result += this._compileRemaining(messageAST[index], locale);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.NumberFormat) {
      result += this._compileNumberFormat(messageAST[index]);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.date.DateFormat) {
      result += this._compileDateFormat(messageAST[index]);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.CurrencyFormat) {
      result += this._compileCurrencyFormat(messageAST[index]);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.PluralFormat) {
      result += this._compilePluralFormat(messageAST[index], locale);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.SelectFormat) {
      result += this._compileSelectFormat(messageAST[index]);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.SelectordinalFormat) {
      result += this._compileSelectordinalFormat(messageAST[index], locale);
    }

    if(index !== messageAST.length - 1) {
      result += this.linefeed;
    }
  }

  return result;
};

/**
 * Compile remaining
 *
 * @param {AST.Remaining} remaining
 * @param {String} locale
 * @return {String}
 * @api private
 */

Compiler.prototype._compileRemaining = function(remaining, locale) {
  var pattern = remaining.pattern
    , minimumIntegerDigits = 0
    , maximumIntegerDigits = 0
    , minimumFractionDigits = 0
    , maximumFractionDigits = 0
    , minimumSignificantDigits = 0
    , maximumSignificantDigits = 0
    , type = 'floating';

  if(pattern instanceof MessageFormat.AST.NumberFormatPattern._SignificantNumberFormat) {
    type = 'significant';
  }

  if(type === 'floating') {
    if(pattern.fraction &&
       typeof pattern.fraction.nonAbsentNumbers === 'number' &&
       typeof pattern.fraction.rightAbsentNumbers === 'number') {
      minimumFractionDigits = pattern.fraction.nonAbsentNumbers;
      maximumFractionDigits = minimumFractionDigits + pattern.fraction.rightAbsentNumbers;
    }
    if(pattern.integer &&
       typeof pattern.integer.nonAbsentNumbers === 'number' &&
       typeof pattern.integer.leftAbsentNumbers === 'number') {
      minimumIntegerDigits = pattern.integer.nonAbsentNumbers;
      maximumIntegerDigits = pattern.integer.nonAbsentNumbers + pattern.integer.leftAbsentNumbers;
    }
  }
  else if(type === 'significant') {
    minimumSignificantDigits = pattern.nonAbsentNumbers;
    maximumSignificantDigits = minimumSignificantDigits + pattern.rightAbsentNumbers;
  }

  result = template['Remaining']({
    variableName: remaining.variable.name,
    type: type,
    offset: remaining.offset,
    prefix: pattern.prefix,
    suffix: pattern.suffix,
    roundTo: pattern.rounding,
    percentage: pattern.percentage,
    permille: pattern.permille,
    currency: false,
    minimumIntegerDigits: minimumIntegerDigits,
    maximumIntegerDigits: maximumIntegerDigits,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
    minimumSignificantDigits: minimumSignificantDigits,
    maximumSignificantDigits: maximumSignificantDigits,
    groupSize: pattern.groupSize,
    locale: locale,
    numberSystem: remaining.numberSystem,
    exponent: !pattern.exponent ? null : {
      digits: pattern.exponent.nonAbsentNumbers,
      plusSign: pattern.exponent.plusSign
    },
    patternLength: pattern.patternLength,
    paddingCharacter: pattern.paddingCharacter
  });

  if(remaining.numberSystem !== 'latn') {
    result += this.linefeed + template['ReplaceDigitBlock']({
      variableName: 'string',
      digits: digits[remaining.numberSystem]
    })
  }

  return result;
};

/**
 * Compile number format
 *
 * @param {AST.NumberFormat} numberFormat
 * @return {String}
 * @api private
 */

Compiler.prototype._compileNumberFormat = function(numberFormat) {
  var _this = this
    , result = ''
    , signs = ['positive', 'negative']
    , _case = {};

  signs.forEach(function(sign) {
    var pattern = numberFormat.pattern[sign];
    if(sign === 'negative' && pattern === null) {
      pattern = Object.create(numberFormat.pattern['positive']);
      pattern.prefix = pattern.prefix + '-';
    }

    var minimumIntegerDigits = 0
      , maximumIntegerDigits = 0
      , minimumFractionDigits = 0
      , maximumFractionDigits = 0
      , minimumSignificantDigits = 0
      , maximumSignificantDigits = 0
      , type = 'floating';

    if(pattern instanceof MessageFormat.AST.NumberFormatPattern._SignificantNumberFormat) {
      type = 'significant';
    }

    if(type === 'floating') {
      if(pattern.fraction &&
         typeof pattern.fraction.nonAbsentNumbers === 'number' &&
         typeof pattern.fraction.rightAbsentNumbers === 'number') {
        minimumFractionDigits = pattern.fraction.nonAbsentNumbers;
        maximumFractionDigits = minimumFractionDigits + pattern.fraction.rightAbsentNumbers;
      }
      if(pattern.integer &&
         typeof pattern.integer.nonAbsentNumbers === 'number' &&
         typeof pattern.integer.leftAbsentNumbers === 'number') {
        minimumIntegerDigits = pattern.integer.nonAbsentNumbers;
        maximumIntegerDigits = pattern.integer.nonAbsentNumbers + pattern.integer.leftAbsentNumbers;
      }
    }
    else if(type === 'significant') {
      minimumSignificantDigits = pattern.nonAbsentNumbers;
      maximumSignificantDigits = pattern.nonAbsentNumbers + pattern.rightAbsentNumbers;
    }

    _case[sign] = _this.appendString + template['FormatNumber']({
      variableName: numberFormat.variable.name,
      type: type,
      prefix: pattern.prefix,
      suffix: pattern.suffix,
      roundTo: pattern.rounding,
      percentage: pattern.percentage,
      permille: pattern.permille,
      currency: pattern.currency,
      minimumIntegerDigits: minimumIntegerDigits,
      maximumIntegerDigits: maximumIntegerDigits,
      minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: maximumFractionDigits,
      minimumSignificantDigits: minimumSignificantDigits,
      maximumSignificantDigits: maximumSignificantDigits,
      groupSize: pattern.groupSize,
      locale: numberFormat.locale,
      numberSystem: numberFormat.numberSystem,
      exponent: !pattern.exponent ? null : {
        digits: pattern.exponent.nonAbsentNumbers,
        plusSign: pattern.exponent.showPositiveCharacter
      },
      patternLength: pattern.patternLength,
      paddingCharacter: pattern.paddingCharacter
    });
  });

  if(numberFormat.pattern['positive'].currency) {
    result += template['SetCurrencyUnitBlock']({
      variableName: numberFormat.variable.name,
      locale: numberFormat.locale,
      currency: {
        type: numberFormat.pattern['positive'].currency.type,
        context: numberFormat.pattern['positive'].currency.context
      }
    }) + this.linefeed;

    result += template['FormatCurrencyCondition']({
      variableName: numberFormat.variable.name,
      positive: this._indentSpaces(2, _case['positive']),
      negative: this._indentSpaces(2, _case['negative'])
    });
  }
  else {
    result += template['FormatNumberCondition']({
      variableName: numberFormat.variable.name,
      positive: this._indentSpaces(2, _case['positive']),
      negative: this._indentSpaces(2, _case['negative'])
    });
  }

  if(numberFormat.numberSystem !== 'latn') {
    result += this.linefeed + template['ReplaceDigitBlock']({
      variableName: 'string',
      digits: digits[numberFormat.numberSystem]
    });
  }

  return result;
};

/**
 * Compile date format
 *
 * @param {AST.DateFormat} dateFormat
 * @return {void}
 * @api private
 */

Compiler.prototype._compileDateFormat = function(dateFormat) {
  var _this = this;

  var result = template['SetDateBlock']({
    variableName: dateFormat.variable.name
  });

  result += this.linefeed;

  dateFormat.AST.forEach(function(component) {
    if(component instanceof MessageFormat.AST.date.Era) {
      var eraFormat;
      switch(component.format) {
        case MessageFormat.AST.date.Era.Formats.ABBREVIATED:
          eraFormat = 'abbreviated';
          break;
        case MessageFormat.AST.date.Era.Formats.FULL:
          eraFormat = 'full';
          break;
        case MessageFormat.AST.date.Era.Formats.NARROW:
          eraFormat = 'narrow';
          break;
      }
      result += template['DateEra']({
        AD: dateFormat.CLDR.era[eraFormat].AD,
        BC: dateFormat.CLDR.era[eraFormat].BC
      });
    }
    else if(component instanceof MessageFormat.AST.date.Year) {
      switch(component.type) {
        case MessageFormat.AST.date.Year.Types.CALENDAR:
          result += template['SetYear']() + _this.linefeed;
          if(dateFormat.numberSystem !== 'latn') {
            result += template['FormatYear']({
              length: component.length,
              numeralReplace: template['NumeralReplace']({
                variableName: 'yearString',
                digits: digits[dateFormat.numberSystem]
              })
            });
          }
          else {
            result += template['FormatYear']({
              length: component.length
            });
          }
          break;
        case MessageFormat.AST.date.Year.Types.WEEK_BASED:
          result += template['DateWeekBasedYear']() + _this.linefeed;
          if(dateFormat.numberSystem !== 'latn') {
            result += template['FormatYear']({
              length: component.length,
              numeralReplace: template['NumeralReplace']({
                variableName: 'yearString',
                digits: digits[dateFormat.numberSystem]
              })
            });
          }
          else {
            result += template['FormatYear']({
              length: component.length
            });
          }
          break;
      }
    }
    else if(component instanceof MessageFormat.AST.date.Quarter) {
      var quarterContext;
      var quarterFormat;
      var quarterStrings;

      switch(component.context) {
        case MessageFormat.AST.date.Quarter.Contexts.FORMATED:
          quarterContext = 'formated';
          break;
        case MessageFormat.AST.date.Quarter.Contexts.STAND_ALONE:
          quarterContext = 'standalone';
          break;
      }
      switch(component.format) {
        case MessageFormat.AST.date.Quarter.Formats.NUMERIC:
          quarterStrings = {
            Q1: '1',
            Q2: '2',
            Q3: '3',
            Q4: '4'
          };
          break;
        case MessageFormat.AST.date.Quarter.Formats.NUMERIC_WITH_PADDING:
          quarterStrings = {
            Q1: '01',
            Q2: '02',
            Q3: '03',
            Q4: '04'
          };
          break;
        case MessageFormat.AST.date.Quarter.Formats.ABBREVIATED:
          quarterStrings = dateFormat.CLDR.quarter[quarterContext]['abbreviated'];
          break;
        case MessageFormat.AST.date.Quarter.Formats.WIDE:
          quarterStrings = dateFormat.CLDR.quarter[quarterContext]['wide'];
          break;
      }

      if(component.format === MessageFormat.AST.date.Quarter.Formats.NUMERIC ||
         component.format === MessageFormat.AST.date.Quarter.Formats.NUMERIC_WITH_PADDING) {
        if(dateFormat.numberSystem !== 'latn') {
          for(var quarter in quarterStrings) {
            quarterStrings[quarter] = quarterStrings[quarter]
              .replace(/1/g, digits[dateFormat.numberSystem]['1'])
              .replace(/2/g, digits[dateFormat.numberSystem]['2'])
              .replace(/3/g, digits[dateFormat.numberSystem]['3'])
              .replace(/4/g, digits[dateFormat.numberSystem]['4'])
              .replace(/5/g, digits[dateFormat.numberSystem]['5'])
              .replace(/6/g, digits[dateFormat.numberSystem]['6'])
              .replace(/7/g, digits[dateFormat.numberSystem]['7'])
              .replace(/8/g, digits[dateFormat.numberSystem]['8'])
              .replace(/9/g, digits[dateFormat.numberSystem]['9'])
              .replace(/0/g, digits[dateFormat.numberSystem]['0']);
          }
        }
      }

      result += template['DateQuarter'](quarterStrings);
    }
    else if(component instanceof MessageFormat.AST.date.Month) {
      var monthContext;
      var monthFormat;
      var monthStrings;

      switch(component.context) {
        case MessageFormat.AST.date.Month.Contexts.FORMATED:
          monthContext = 'formated';
          break;
        case MessageFormat.AST.date.Month.Contexts.STAND_ALONE:
          monthContext = 'standalone';
          break;
      }

      switch(component.format) {
        case MessageFormat.AST.date.Month.Formats.NUMERIC:
          monthStrings = {
            '1': '1',
            '2': '2',
            '3': '3',
            '4': '4',
            '5': '5',
            '6': '6',
            '7': '7',
            '8': '8',
            '9': '9',
            '10': '10',
            '11': '11',
            '12': '12'
          };
          break;
        case MessageFormat.AST.date.Month.Formats.NUMERIC_WITH_PADDING:
          monthStrings = {
            '1': '01',
            '2': '02',
            '3': '03',
            '4': '04',
            '5': '05',
            '6': '06',
            '7': '07',
            '8': '08',
            '9': '09',
            '10': '10',
            '11': '11',
            '12': '12'
          };
          break;
        case MessageFormat.AST.date.Month.Formats.SHORT:
          monthStrings = dateFormat.CLDR.month[monthContext]['abbreviated'];
          break;
        case MessageFormat.AST.date.Month.Formats.WIDE:
          monthStrings = dateFormat.CLDR.month[monthContext]['wide'];
          break;
        case MessageFormat.AST.date.Month.Formats.NARROW:
          monthStrings = dateFormat.CLDR.month[monthContext]['narrow'];
          break;
      }

      if(component.format === MessageFormat.AST.date.Month.Formats.NUMERIC ||
         component.format === MessageFormat.AST.date.Month.Formats.NUMERIC_WITH_PADDING) {
        if(dateFormat.numberSystem !== 'latn') {
          for(var quarter in quarterStrings) {
            monthStrings[quarter] = monthStrings[quarter]
              .replace(/1/g, digits[dateFormat.numberSystem]['1'])
              .replace(/2/g, digits[dateFormat.numberSystem]['2'])
              .replace(/3/g, digits[dateFormat.numberSystem]['3'])
              .replace(/4/g, digits[dateFormat.numberSystem]['4'])
              .replace(/5/g, digits[dateFormat.numberSystem]['5'])
              .replace(/6/g, digits[dateFormat.numberSystem]['6'])
              .replace(/7/g, digits[dateFormat.numberSystem]['7'])
              .replace(/8/g, digits[dateFormat.numberSystem]['8'])
              .replace(/9/g, digits[dateFormat.numberSystem]['9'])
              .replace(/0/g, digits[dateFormat.numberSystem]['0']);
          }
        }
      }

      result += template['DateMonth']({ monthStrings: monthStrings });
    }
    else if(component instanceof MessageFormat.AST.date.Week) {
      if(component.type === MessageFormat.AST.date.Week.Types.WEEK_OF_YEAR) {
        if(component.format === MessageFormat.AST.date.Week.Formats.NUMERIC) {
          if(dateFormat.numberSystem !== 'latn') {
            result += template['DateWeekOfYear']({
              padding: false,
              numeralReplace: template['NumeralReplace']({
                variableName: 'week',
                digits: digits[dateFormat.numberSystem]
              })
            });
          }
          else {
            result += template['DateWeekOfYear']({
              padding: false
            });
          }
        }
        else {
          if(dateFormat.numberSystem !== 'latn') {
            result += template['DateWeekOfYear']({
              padding: true,
              numeralReplace: template['NumeralReplace']({
                variableName: 'week',
                digits: digits[dateFormat.numberSystem]
              })
            });
          }
          else {
            result += template['DateWeekOfYear']({
              padding: true
            });
          }
        }
      }
      else {
        if(dateFormat.numberSystem !== 'latn') {
          result += template['DateWeekOfMonth']({
            numeralReplace: template['NumeralReplace']({
              variableName: 'week',
              digits: digits[dateFormat.numberSystem]
            })
          });
        }
        else {
          result += template['DateWeekOfMonth']({});
        }
      }
    }
    else if(component instanceof MessageFormat.AST.date.day.DayOfMonth) {
      var dateDigits;
      if(dateFormat.numberSystem !== 'latn') {
        dateDigits = template['NumeralReplace']({
          variableName: 'dateString',
          digits: digits[dateFormat.numberSystem]
        });
      }
      if(component.format === MessageFormat.AST.date.day.DayOfMonth.Formats.NUMERIC) {
        result += template['DateDate']({
          numeralReplace: dateDigits
        });
      }
      else {
        result += template['DateDate']({
          padding: true,
          numeralReplace: dateDigits
        });
      }
    }
    else if(component instanceof MessageFormat.AST.date.day.DayOfYear) {
      var dayOfYearDigits;
      var dayOfYearLength;
      var dayOfYearPadding;
      var dayOfYearNumeralReplace;

      if(dateFormat.numberSystem !== 'latn') {
        dayOfYearDigits = template['NumeralReplace']({
          variableName: 'dateString',
          digits: digits[dateFormat.numberSystem]
        });
      }

      if(component.length > 1) {
        dayOfYearPadding = template['DatePadding']({
          minimum: component.length,
          variableName: 'day'
        });
      }

      if(dateFormat.numberSystem !== 'latn') {
        dayOfYearNumeralReplace = template['NumeralReplace']({
          variableName: 'day',
          digits: digits[dateFormat.numberSystem]
        });
      }

      result += template['DateDayOfYear']({
        padding: dayOfYearPadding,
        numeralReplace: dayOfYearNumeralReplace
      });
    }
    else if(component instanceof MessageFormat.AST.date.day.DayOfWeekInMonth) {
      var dayofWeekInMonthNumeralReplace;

      if(dateFormat.numberSystem !== 'latn') {
        dayofWeekInMonthNumeralReplace = template['NumeralReplace']({
          variableName: 'count',
          digits: digits[dateFormat.numberSystem]
        });
      }

      result += template['DateDayOfWeekInMonth']({
        numeralReplace: dayofWeekInMonthNumeralReplace
      });
    }
    else if(component instanceof MessageFormat.AST.date.weekDay.DayOfWeek) {
      var dayOfWeekStrings;

      switch(component.format) {
        case MessageFormat.AST.date.weekDay.DayOfWeek.Formats.ABBREVIATED:
          dayOfWeekStrings = dateFormat.CLDR.day['formated']['abbreviated'];
          break;
        case MessageFormat.AST.date.weekDay.DayOfWeek.Formats.WIDE:
          dayOfWeekStrings = dateFormat.CLDR.day['formated']['wide'];
          break;
        case MessageFormat.AST.date.weekDay.DayOfWeek.Formats.NARROW:
          dayOfWeekStrings = dateFormat.CLDR.day['formated']['narrow'];
          break;
        default:
          dayOfWeekStrings = dateFormat.CLDR.day['formated']['short'];
          break;
      }

      result += template['DateDayOfWeek']({
        days: dayOfWeekStrings
      });
    }
    else if(component instanceof MessageFormat.AST.date.weekDay.LocalDayOfWeek) {
      var localDayOfWeekStrings;
      var localDayOfWeekContext;
      var localDayOfWeekPadding;

      if(component.context === MessageFormat.AST.date.weekDay.LocalDayOfWeek.Contexts.FORMATED) {
        localDayOfWeekContext = 'formated';
      }
      else {
        localDayOfWeekContext = 'standalone';
      }

      switch(component.format) {
        case MessageFormat.AST.date.weekDay.LocalDayOfWeek.Formats.NUMERIC_WITH_PADDING:
          localDayOfWeekPadding = true;
        case MessageFormat.AST.date.weekDay.LocalDayOfWeek.Formats.NUMERIC:
          return result += template['DateLocalDayOfWeekDigit']({
            padding: localDayOfWeekPadding
          });
        case MessageFormat.AST.date.weekDay.LocalDayOfWeek.Formats.ABBREVIATED:
          localDayOfWeekStrings = dateFormat.CLDR.day[localDayOfWeekContext]['abbreviated'];
          break;
        case MessageFormat.AST.date.weekDay.LocalDayOfWeek.Formats.WIDE:
          localDayOfWeekStrings = dateFormat.CLDR.day[localDayOfWeekContext]['wide'];
          break;
        case MessageFormat.AST.date.weekDay.LocalDayOfWeek.Formats.NARROW:
          localDayOfWeekStrings = dateFormat.CLDR.day[localDayOfWeekContext]['narrow'];
          break;
        default:
          localDayOfWeekStrings = dateFormat.CLDR.day[localDayOfWeekContext]['short'];
          break;
      }

      result += template['DateDayOfWeek']({
        days: localDayOfWeekStrings
      });
    }
  });

  return result;
};

/**
 * Compile currency format
 *
 * @param {AST.CurrencyFormat} currencyFormat
 * @return {void}
 * @api private
 */

Compiler.prototype._compileCurrencyFormat = function(currencyFormat) {
  var result = ''
    , signs = ['positive', 'negative']
    , _case = {};

  signs.forEach(function(sign) {
    var pattern = currencyFormat.pattern[sign];
    if(sign === 'negative' && (pattern === null || currencyFormat.type === 'text')) {
      pattern = Object.create(currencyFormat.pattern['positive']);
      pattern.prefix = pattern.prefix + '-';
      pattern.patternLength++;
    }

    var minimumIntegerDigits = 0
      , maximumIntegerDigits = 0
      , minimumFractionDigits = 0
      , maximumFractionDigits = 0
      , minimumSignificantDigits = 0
      , maximumSignificantDigits = 0
      , type = 'floating';

    if(pattern instanceof MessageFormat.AST.NumberFormatPattern._SignificantNumberFormat) {
      type = 'significant';
    }

    if(type === 'floating') {
      if(pattern.fraction &&
         typeof pattern.fraction.nonAbsentNumbers === 'number' &&
         typeof pattern.fraction.rightAbsentNumbers === 'number') {
        minimumFractionDigits = pattern.fraction.nonAbsentNumbers;
        maximumFractionDigits = minimumFractionDigits + pattern.fraction.rightAbsentNumbers;
      }
      if(pattern.integer &&
         typeof pattern.integer.nonAbsentNumbers === 'number' &&
         typeof pattern.integer.leftAbsentNumbers === 'number') {
        minimumIntegerDigits = pattern.integer.nonAbsentNumbers;
        maximumIntegerDigits = pattern.integer.nonAbsentNumbers + pattern.integer.leftAbsentNumbers;
      }
    }
    else if(type === 'significant') {
      minimumSignificantDigits = pattern.nonAbsentNumbers;
      maximumSignificantDigits = pattern.nonAbsentNumbers + pattern.rightAbsentNumbers;
    }

    if(currencyFormat.type === 'text') {
      pattern.prefix = pattern.prefix.replace(/¤/g, '');
      pattern.suffix = pattern.suffix.replace(/¤/g, '');
    }

    _case[sign] = template['FormatCurrency']({
      variableName: currencyFormat.variable.name,
      type: type,
      prefix: pattern.prefix,
      suffix: pattern.suffix,
      roundTo: pattern.rounding,
      percentage: pattern.percentage,
      permille: pattern.permille,
      currency: currencyFormat.type,
      minimumIntegerDigits: minimumIntegerDigits,
      maximumIntegerDigits: maximumIntegerDigits,
      minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: maximumFractionDigits,
      minimumSignificantDigits: minimumSignificantDigits,
      maximumSignificantDigits: maximumSignificantDigits,
      groupSize: pattern.groupSize,
      locale: currencyFormat.locale,
      numberSystem: currencyFormat.numberSystem,
      exponent: !pattern.exponent ? null : {
        digits: pattern.exponent.nonAbsentNumbers,
        plusSign: pattern.exponent.showPositiveCharacter
      },
      patternLength: pattern.patternLength,
      paddingCharacter: pattern.paddingCharacter
    });
  });

  result += template['SetCurrencyUnitBlock']({
    variableName: currencyFormat.variable.name,
    locale: currencyFormat.locale,
    currency: {
      type: currencyFormat.type,
      context: currencyFormat.context
    }
  }) + this.linefeed;

  if(currencyFormat.type === 'symbol') {
    result += template['FormatCurrencyCondition']({
      variableName: currencyFormat.variable.name,
      positive: this._indentSpaces(2, this.appendString + _case['positive']),
      negative: this._indentSpaces(2, this.appendString + _case['negative'])
    });
  }
  else {
    result += template['FormatCurrencyTextCondition']({
      variableName: currencyFormat.variable.name,
      positive: this._indentSpaces(4, _case['positive']),
      negative: this._indentSpaces(4, _case['negative']),
      locale: currencyFormat.locale,
      currency: {
        type: currencyFormat.type,
        context: currencyFormat.context
      }
    });
  }

  if(currencyFormat.numberSystem !== 'latn') {
    result += this.linefeed + template['ReplaceDigitBlock']({
      variableName: 'string',
      digits: digits[currencyFormat.numberSystem]
    })
  }

  return result;
};

/**
 * Compile select format
 *
 * @param {AST.PluralFormat} pluralFormat
 * @return {String}
 * @api private
 */

Compiler.prototype._compileSelectFormat = function(selectFormat) {
  var switchBody = '';

  for(var _case in selectFormat.values) {
    var caseBody = this._getFunctionBody(selectFormat.values[_case]);
    if(_case !== 'other') {
      switchBody += template['Case']({
        case: _case,
        caseBody: this._indentSpaces(2, caseBody)
      });
    }
    else {
      switchBody += template['OtherCase']({
        caseBody: this._indentSpaces(2, caseBody)
      });
    }

    switchBody += this.linefeed;
  }

  switchBody = this._indentSpaces(2, switchBody.substring(0, switchBody.length - 1));

  return template['SelectSwitchStatement']({
    variableName: selectFormat.variable.name,
    switchBody: switchBody
  });
};

/**
 * Compile plural format
 *
 * @param {AST.PluralFormat} pluralFormat
 * @return {String}
 * @api private
 */

Compiler.prototype._compilePluralFormat = function(pluralFormat, locale) {
  var switchBody = ''
    , setCaseStatement = ''
    , exactCases = []
    , conditionOrder = 'if';

  for(var _case in pluralFormat.values) {
    var caseBody = this._getFunctionBody(pluralFormat.values[_case], locale);
    if(_case !== 'other') {
      switchBody += template['Case']({
        case: _case,
        caseBody: this._indentSpaces(2, caseBody)
      });
    }
    else {
      switchBody += template['OtherCase']({
        caseBody: this._indentSpaces(2, caseBody)
      });
    }

    switchBody += this.linefeed;
    if(/^=\d+$/.test(_case)) {
      exactCases.push(_case);
    }
  }

  if(exactCases.length > 0) {
    for(var exactCaseIndex = 0; exactCaseIndex < exactCases.length; exactCaseIndex++) {
      if(exactCaseIndex !== 0) {
        conditionOrder = 'else if';
      }
      setCaseStatement += template['SetPluralConditionCase']({
        statementType: conditionOrder,
        variableName: pluralFormat.variable.name,
        value: exactCases[exactCaseIndex].replace('=', '')
      });
    }
    setCaseStatement += this.linefeed;
    setCaseStatement += template['SetPluralElseCase']({
      locale: pluralFormat.locale,
      variableName: pluralFormat.variable.name
    });
  }
  else {
    setCaseStatement += template['SetPluralCase']({
      locale: pluralFormat.locale,
      variableName: pluralFormat.variable.name
    });
  }

  switchBody = this._indentSpaces(2, switchBody.substring(0, switchBody.length - 1));

  return template['PluralSwitchStatement']({
    setCaseStatement: setCaseStatement,
    variableName: pluralFormat.variable.name,
    switchBody: switchBody
  });
};

/**
 * Compile selectordinal format
 *
 * @param {AST.Selectordinal} selectordinalFormat
 * @return {String}
 * @api private
 */

Compiler.prototype._compileSelectordinalFormat = function(selectordinalFormat, locale) {
  var switchBody = ''
    , setCaseStatement = ''
    , exactCases = []
    , conditionOrder = 'if';

  for(var _case in selectordinalFormat.values) {
    var caseBody = this._getFunctionBody(selectordinalFormat.values[_case], locale);
    if(_case !== 'other') {
      switchBody += template['Case']({
        case: _case,
        caseBody: this._indentSpaces(2, caseBody)
      });
    }
    else {
      switchBody += template['OtherCase']({
        caseBody: this._indentSpaces(2, caseBody)
      });
    }

    switchBody += this.linefeed;
    if(/^=\d+$/.test(_case)) {
      exactCases.push(_case);
    }
  }

  if(exactCases.length > 0) {
    for(var exactCaseIndex = 0; exactCaseIndex < exactCases.length; exactCaseIndex++) {
      if(exactCaseIndex !== 0) {
        conditionOrder = 'else if';
      }
      setCaseStatement += template['SetOrdinalConditionCase']({
        statementType: conditionOrder,
        variableName: selectordinalFormat.variable.name,
        value: exactCases[exactCaseIndex].replace('=', '')
      });
    }
    setCaseStatement += this.linefeed;
    setCaseStatement += template['SetOrdinalElseCase']({
      locale: selectordinalFormat.locale,
      variableName: selectordinalFormat.variable.name
    });
  }
  else {
    setCaseStatement += template['SetOrdinalCase']({
      locale: selectordinalFormat.locale,
      variableName: selectordinalFormat.variable.name
    });
  }

  switchBody = this._indentSpaces(2, switchBody.substring(0, switchBody.length - 1));

  return template['OrdinalSwitchStatement']({
    setCaseStatement: setCaseStatement,
    switchBody: switchBody
  });
};

/**
 * Get plural getter function string
 *
 * @return {void}
 * @api private
 */

Compiler.prototype._getPluralGetterFunctionString = function(messageFormat) {
  var result = this.linefeed, index = 0, conditionOrder = 'if';

  for(var _case in messageFormat.pluralRules) {
    if(_case === 'other') {
      continue;
    }

    if(index > 0) {
      conditionOrder = 'else if';
    }

    result += this._indentSpaces(2, template['ConditionStatement']({
      order: conditionOrder,
      condition: this._getPluralComparisonString(messageFormat.pluralRules[_case]),
      body: this._indentSpaces(2, 'return \'' + _case + '\';')
    }));

    result += this.linefeed;

    index++;
  }

  if(index === 0) {
    result = result.substring(1);
  }
  result += this._indentSpaces(2, template['ReturnOtherStringStatement']());

  return template['GetPluralKeyword']({
    functionBody: result
  });
};

/**
 * Get ordinal getter function string
 *
 * @return {void}
 * @api private
 */

Compiler.prototype._getOrdinalGetterFunctionString = function(messageFormat) {
  var result = this.linefeed, index = 0, conditionOrder = 'if';

  for(var _case in messageFormat.ordinalRules) {
    if(_case === 'other') {
      continue;
    }

    if(index > 0) {
      conditionOrder = 'else if';
    }

    result += this._indentSpaces(2, template['ConditionStatement']({
      order: conditionOrder,
      condition: this._getPluralComparisonString(messageFormat.ordinalRules[_case]),
      body: this._indentSpaces(2, 'return \'' + _case + '\';')
    }));

    result += this.linefeed;

    index++;
  }

  if(index === 0) {
    result = result.substring(1);
  }
  result += this._indentSpaces(2, template['ReturnOtherStringStatement']());

  return template['GetPluralKeyword']({
    functionBody: result
  });
};

/**
 * Get javascript number comparison group type
 *
 * @param {String} type (and|or)
 * @return {String} (&&|||)
 * @api private
 */

Compiler.prototype._getNumberComparisonGroupType = function(type) {
  if(type === 'and') {
    return '&&';
  }

  return '||';
};

/**
 * Get plural comparison string
 *
 * @param {String} _case
 * @param {LMDLPlural.AST.NumberComparisonGroup|LMDLPlural.AST.NumberComparison} comparison
 * @return {String}
 * @api private
 */

Compiler.prototype._getPluralComparisonString = function(comparison) {
  if(comparison instanceof LDML.AST.NumberComparisonGroup) {
    var LHSString = this._getPluralComparisonString(comparison.LHS)
      , RHSString = this._getPluralComparisonString(comparison.RHS);

    return LHSString + this.space + this._getNumberComparisonGroupType(comparison.type) + this.space + RHSString;
  }
  else if(comparison instanceof LDML.AST.NumberComparison) {
    var result = ''
      , values = comparison.RHS.values;

    for(var index = 0; index < values.length; index++) {
      if(index !== 0) {
        result += this.and;
      }
      if(values[index] instanceof LDML.AST.Value) {
        result += template['NumberComparison']({
          variableName: comparison.LHS.variable,
          modulus: comparison.LHS.modulus,
          comparator: comparison.comparator === '=' ? '===' : '!==',
          value: values[index].value
        });
      }
      else if(values[index] instanceof LDML.AST.Range) {
        result += template['RangeNumberComparison']({
          variableName: comparison.LHS.variable,
          from: values[index].from,
          to: values[index].to
        });
      }
    }

    return result;
  }
};

/**
 * Export instance
 */

module.exports = new Compiler;

/**
 * Export constructor
 */

module.exports.Constructor = Compiler;
