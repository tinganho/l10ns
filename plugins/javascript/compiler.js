
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
  , defer = require('q').defer
  , LDML = { AST: require('../../libraries/LDML/AST') };

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
    .then(function(localizationMap) {
      var content = template['JavascriptWrapper']({
        roundUpFunction: _this._indentSpaces(2, template['RoundToFunction']()),
        formatNumberFunction: _this._indentSpaces(2, template['FormatNumberFunction']()),
        functionName: language.GET_LOCALIZATION_STRING_FUNCTION_NAME,
        localizationMap: _this._indentSpaces(2, localizationMap),
        requireStatement: _this._indentSpaces(2, template['RequireStatement']())
      });

      mkdirp(path.dirname(project.outputFile), function(error) {
        if(error) {
          throw error;
        }
        fs.writeFileSync(project.outputFile, content);
      });
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
      var localizationsMap = ''
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

        for(var key in localizations[locale]) {
          messageFormat.parse(localizations[locale][key].value);
          var _function = template['Function']({
            functionBody: _this._indentSpaces(
              2,
              _this._getFunctionBody(messageFormat.messageAST
            ))
          });

          localizationMap += template['LocalizationKeyValue']({
            key: key,
            value: _function
          });

          if(localizationsCount !== localizationsLength - 1 &&
            localizationsLength > 1) {
            localizationMap += _this.comma;
            localizationMap += _this.linefeed;
          }
        }

        localizationsMap += template['LocalizationMap']({
          locale: locale,
          map: _this._indentSpaces(2, localizationMap)
        });

        if(localesCount !== localesLength - 1 &&
           localesLength > 1) {
          localizationsMap += _this.comma;
          localizationsMap += _this.linefeed;
        }

        localesCount++;
      }

      var result = template['LocalizationsMap']({
        localizations: _this._indentSpaces(2, localizationsMap)
      });

      deferred.resolve(result);
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

Compiler.prototype._getFunctionBody = function(messageAST) {
  var result = '';

  for(var index = 0; index < messageAST.length; index++) {
    if(messageAST[index] instanceof MessageFormat.AST.Sentence) {
      result += template['Sentence']({ sentence: messageAST[index].string });
    }
    else if(messageAST[index] instanceof MessageFormat.AST.Variable) {
      result += template['Variable']({ variableName: messageAST[index].name });
    }
    else if(messageAST[index] instanceof MessageFormat.AST.Remaining) {
      result += template['Remaining']({ variableName: messageAST[index].variable.name, offset: messageAST[index].offset });
    }
    else if(messageAST[index] instanceof MessageFormat.AST.NumberFormat) {
      result += this._compileNumberFormat(messageAST[index]);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.ChoiceFormat) {
      result += this._compileChoiceFormat(messageAST[index]);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.PluralFormat) {
      result += this._compilePluralFormat(messageAST[index]);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.SelectFormat) {
      result += this._compileSelectFormat(messageAST[index]);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.SelectordinalFormat) {
      result += this._compileSelectordinalFormat(messageAST[index]);
    }

    if(index !== messageAST.length - 1) {
      result += this.linefeed;
    }
  }

  return result;
};

Compiler.prototype._compileNumberFormat = function(numberFormat) {
  var result = ''
    , signs = ['positive', 'negative']
    , _case = {};

  signs.forEach(function(sign) {
    var format = numberFormat.format[sign];
    if(sign === 'negative' && format === null) {
      numberFormat.format['positive'].prefix = numberFormat.format['positive'].prefix + '-';
      format = numberFormat.format['positive'];
    }

    var minimumIntegerDigits = format.integer.nonAbsentNumbers
      , minimumFractionDigits = 0
      , maximumFractionDigits = 0;

    if(format.fraction &&
       typeof format.fraction.nonAbsentNumbers === 'number' &&
       typeof format.fraction.rightAbsentNumbers) {
      minimumFractionDigits = format.fraction.nonAbsentNumbers;
      maximumFractionDigits = minimumFractionDigits + format.fraction.rightAbsentNumbers;
    }

    _case[sign] = template['FormatNumber']({
      variableName: numberFormat.variable.name,
      prefix: format.prefix,
      suffix: format.suffix,
      roundTo: format.rounding,
      percentage: format.percentage,
      permille: format.permille,
      currency: format.currency,
      minimumIntegerDigits: minimumIntegerDigits,
      minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: maximumFractionDigits,
      groupSize: format.groupSize,
      locale: numberFormat.locale
    });
  });

  result += template['FormatNumberCondition']({
    variableName: numberFormat.variable.name,
    positive: this._indentSpaces(2, _case['positive']),
    negative: this._indentSpaces(2, _case['negative'])
  });

  return result;
};

/**
 * Compile choice format
 *
 * @param {AST.ChoiceFormat} choiceFormat
 * @return {String}
 * @api private
 */

Compiler.prototype._compileChoiceFormat = function(choiceFormat) {
  var valuesLength = Object.keys(choiceFormat.values).length
    , valuesCount = 0
    , result = '';

  for(var index = 0; index < choiceFormat.values.length; index++) {
    if(valuesLength === 1) {
      result += this._getFunctionBody(choiceFormat.values[index].messageAST);
    }
    else {
      if(index === 0) {
        result += template['FirstRangeCondition']({
          variableName: choiceFormat.variable.name,
          lowestLimit: choiceFormat.values[index].limits.lower.value,
          limits: choiceFormat.values[index].limits,
          type: choiceFormat.values[index].limits.lower.type.replace('>=', '<').replace('>', '<='),
          body: this._indentSpaces(2, this._getFunctionBody(choiceFormat.values[index].messageAST))
        });
        result += this.linefeed;
      }
      else {
        result += template['RangeCondition']({
          variableName: choiceFormat.variable.name,
          limits: choiceFormat.values[index].limits,
          body: this._indentSpaces(2, this._getFunctionBody(choiceFormat.values[index].messageAST))
        });
        if(index !== valuesLength - 1) {
          result += this.linefeed;
        }
      }
    }

    valuesCount++;
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

Compiler.prototype._compilePluralFormat = function(pluralFormat) {
  var switchBody = ''
    , setCaseStatement = ''
    , exactCases = []
    , conditionOrder = 'if';

  for(var _case in pluralFormat.values) {
    var caseBody = this._getFunctionBody(pluralFormat.values[_case]);
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

Compiler.prototype._compileSelectordinalFormat = function(selectordinalFormat) {
  var switchBody = ''
    , setCaseStatement = '';

  for(var _case in selectordinalFormat.values) {
    var caseBody = this._getFunctionBody(selectordinalFormat.values[_case]);
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

  setCaseStatement += template['SetOrdinalCase']({
    locale: selectordinalFormat.locale,
    variableName: selectordinalFormat.variable.name
  });

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
          variableName: values[index].vairable.name,
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
