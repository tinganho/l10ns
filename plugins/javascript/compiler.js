
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
      var content = template.javascriptWrapper({
        functionName: language.GET_LOCALIZATION_STRING_FUNCTION_NAME,
        localizationMap: localizationMap,
        functions: _this.indentSpaces(2, template.functions())
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

Compiler.prototype._getFunctionBody = function(messageAST, withLinefeed) {
  withLinefeed = typeof withLinefeed=== 'undefined' ? true : withLinefeed;

  var result = '';

  for(var index = 0; index < messageAST.length; index++) {
    if(messageAST[index] instanceof MessageFormat.AST.Sentence) {
      result += template['Sentence']({ sentence: messageAST[index].string });
    }
    else if(messageAST[index] instanceof MessageFormat.AST.PluralFormat) {
      var switchBody = ''
        , setCaseStatement = ''
        , exactCases = 0
        , setCaseStatementType = 'if';

      for(var _case in messageAST[index].values) {
        var caseBody = this._indentSpaces(2, this._getFunctionBody(messageAST[index].values[_case], false));
        switchBody += template['Case']({
          case: _case,
          caseBody: this._indentSpaces(2, caseBody)
        });
        switchBody += this.linefeed;
        if(/^=\d+$/.test(_case)) {
          if(exactCases !== 0) {
            setCaseStatementType = 'else if';
          }
          setCaseStatement += template['SetPluralCase']({
            statementType: setCaseStatementType,
            variableName: messageAST[index].variable.name,
            value: _case.replace('=', '')
          });
          exactCases++;
        }
      }
      if(exactCases === 0) {
        setCaseStatement += template['SetPluralElseCase']({ variableName: messageAST[index].variable.name });
      }
      else {
        setCaseStatement += this.linefeed;
        setCaseStatement += template['SetPluralElseCase']({ variableName: messageAST[index].variable.name });
      }
      switchBody = this._indentSpaces(2, switchBody.substring(0, switchBody.length - 1));
      result += template['SwitchStatement']({
        setCaseStatement: setCaseStatement,
        variableName: messageAST[index].variable.name,
        switchBody: switchBody
      });
    }
    else if(messageAST[index] instanceof MessageFormat.AST.ChoiceFormat) {

    }

    if(withLinefeed && index !== messageAST.length - 1) {
      result += this.linefeed;
    }
  }

  return result;
};
/**
 * Get plural getter function string
 *
 * @return {void}
 * @api private
 */

Compiler.prototype._getPluralGetterFunctionString = function(messageFormat) {
  var result = this.linefeed, index = 0, type = 'if';

  for(var _case in messageFormat.pluralRules) {
    if(_case === 'other') {
      continue;
    }

    if(index > 0) {
      type = 'else if';
    }

    result += this._indentSpaces(2, template['ConditionStatement']({
      type: type,
      condition: this._getPluralComparisonString(messageFormat.pluralRules[_case]),
      case: _case
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

    for(var index = 0; index<values.length; index++) {
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
