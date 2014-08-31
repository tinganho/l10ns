
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
  , LDMLPlural = { AST: require('../../libraries/LDMLPlural/AST') };

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
          , localizationsCount = 0;

        for(var key in localizations[locale]) {
          var messageFormat = new MessageFormat(locale);
          messageFormat.parse(localizations[locale][key].value);
          var _function = template['Function']({
            functionBody: _this._indentSpaces(
              2,
              _this._getFunctionBody(messageFormat.messageAST
            ))
          });

          localizationMap += template['LocalizationKeyValue']({
            key: key,
            function: _function
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
    else if(messageAST[index] instanceof MessageFormat.AST.ChoiceFormat) {
      result += this._compileChoiceFormat(messageAST[index]);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.PluralFormat) {
      result += this._compilePluralFormat(messageAST[index]);
    }
    else if(messageAST[index] instanceof MessageFormat.AST.SelectFormat) {
      result += this._compileSelectFormat(messageAST[index]);
    }

    if(index !== messageAST.length - 1) {
      result += this.linefeed;
    }
  }

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
          type: choiceFormat.values[index].limits.lower.type.replace('>=', '<').replace('>', '<='),
          body: this._indentSpaces(2, this._getFunctionBody(choiceFormat.values[index].messageAST))
        });
        result += this.linefeed;
      }
      result += template['RangeCondition']({
        variableName: choiceFormat.variable.name,
        limits: choiceFormat.values[index].limits,
        body: this._indentSpaces(2, this._getFunctionBody(choiceFormat.values[index].messageAST))
      });
      if(index !== valuesLength - 1) {
        result += this.linefeed;
      }
    }

    valuesCount++;
  }

  return result;
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
    setCaseStatement += template['SetPluralElseCase']({ variableName: pluralFormat.variable.name });
  }
  else {
    setCaseStatement += template['SetPluralCase']({
      variableName:pluralFormat.variable.name
    });
  }

  switchBody = this._indentSpaces(2, switchBody.substring(0, switchBody.length - 1));

  return template['SwitchStatement']({
    setCaseStatement: setCaseStatement,
    variableName: pluralFormat.variable.name,
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
      body: 'string +=' + _case
    }));
  }

  result += this.linefeed;
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
  if(comparison instanceof LDMLPlural.AST.NumberComparisonGroup) {
    var LHSString = this._getPluralComparisonString(comparison.LHS)
      , RHSString = this._getPluralComparisonString(comparison.RHS);

    return LHSString + this.space + this._getNumberComparisonGroupType(comparison.type) + this.space + RHSString;
  }
  else if(comparison instanceof LDMLPlural.AST.NumberComparison) {
    var result = ''
      , values = comparison.RHS.values;

    for(var index = 0; index < values.length; index++) {
      if(index !== 0) {
        result += this.and;
      }
      if(values[index] instanceof LDMLPlural.AST.Value) {
        result += template['NumberComparison']({
          variableName: comparison.LHS.variable,
          modulus: comparison.LHS.modulus,
          value: values[index].value
        });
      }
      else if(values[index] instanceof LDMLPlural.AST.Range) {
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
 * Get formated localized text
 *
 * @param {String} text
 * @return {String} formated text
 * @api private
 */

Compiler.prototype._getFormatedLocalizedText = function(text, variables) {
  var _this = this;

  return text.replace(program.SYNTAX_VARIABLE_MARKUP, function(match) {
    if(variables.indexOf(match) === -1) {
      throw new TypeError('You have used an undefined variable ' + match.red
      + '.\nPlease add the variable or remove the operand from your source.');
    }

    match = match.substring(2, match.length - 1);

    return String.prototype.concat(
      _this.quote,
      _this.add,
      _this.namespace,
      _this.dot,
      match,
      _this.add,
      _this.quote
    );
  });
};

/**
 * Export instance
 */

module.exports = new Compiler;

/**
 * Export constructor
 */

module.exports.Constructor = Compiler;
