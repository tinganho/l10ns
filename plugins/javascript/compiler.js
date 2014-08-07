
/**
 * Module dependencies
 */

var fs = require('fs')
  , path = require('path')
  , syntax = require('./syntax')
  , template = require('./templates/build/templates')
  , file = require('../../libraries/file')
  , log = require('../../libraries/_log')
  , defer = require('q').defer;

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
};

/**
 * Compile task
 *
 * @return {void}
 * @api public
 */

Compiler.prototype.run = function() {
  var _this = this;

  for(locale in project.locales) {
    (function(locale) {
      _this._getLocalizationMap(locale)
        .then(function(localizationMap) {
          var content = template.javascriptWrapper({
            functionName: language.GET_LOCALIZATION_STRING_FUNCTION_NAME,
            localizationMap: localizationMap,
            functions: _this.indentSpaces(2, template.functions())
          });
          fs.writeFileSync(project.output + '/' + locale + '.js', content);
        })
        .fail(function(error) {
          if(commands.stack && error && error.stack) {
            console.log(error.stack);
          }

          if(error && error.message) {
            console.log(error.message);
          }
        });
    })(locale);
  }
};

/**
 * Indent spaces
 *
 * @param {Number} spaces
 * @param {String} string
 * @return {String}
 * @api public
 */

Compiler.prototype.indentSpaces = function(spaces, string) {
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
 * Get translation map
 *
 * @param {String} locale
 * @return {Promise}
 * @resolves {String} String representing a translation map
 * @api private
 */

Compiler.prototype._getLocalizationMap = function(locale) {
  var _this = this, deferred = defer();

  file.readLocalizations(locale)
    .then(function(localizations) {
      // Get Body string
      var n = 0, body = '';
      for(var key in localizations) {
        // Append a comma for previous hashes
        if(n !== 0) {
          body += _this.comma + _this.linefeed;
        }

        var field = _this.indentSpaces(2, template.JSONTranslationFunctionField({
          key: _this._normalizeText(key),
          functionString: _this._getFunctionBodyString(localizations, key)
        }));

        body += field;

        if(!this.quiet && locale === project.defaultLocale) {
          console.log('[compiled] '.green + _this._normalizeText(key));
        }

        n++;
      }

      // Store every function in a hash
      deferred.resolve(_this.indentSpaces(2, template.mapDeclaration({
        body: body
      })));
    })
    .fail(function(error) {
      deferred.reject(error);
    });

  return deferred.promise;
};

/**
 * Normalize text, ' should be \'
 *
 * @param {String} text
 * @api private
 */

Compiler.prototype._normalizeText = function(text) {
  return text.replace(/'/g, '\'');
};

/**
 * Get function body string
 *
 * @param {Object} translation
 * @return {String} function body string
 * @api private
 */

Compiler.prototype._getFunctionBodyString = function(localizations, key) {
  var str = '';
  if(localizations[key].values.length === 0) {
    str += this.indentSpaces(2, this._getNonTranslatedFunctionBodyString(this._normalizeText(key)));
  } else if(localizations[key].values[0][0] === program.CONDITION_IF) {
    str += this.indentSpaces(2, this._getConditionsString(
      localizations[key].values,
      localizations[key].variables
    ));
  } else {
    str += this._getNonConditionsFunctionBodyString(
      this._getFormatedTranslatedText(
        localizations[key].values[0],
        localizations[key].variables
      )
    );
  }

  return (new Function([this.namespace], str)).toString();
};

/**
 * Get non-conditions function body string
 *
 * @param {String} key
 * @return {String}
 * @api private
 */

Compiler.prototype._getNonConditionsFunctionBodyString = function(string) {
  return this.indentSpaces(2, template.nonConditionFunctionBody({
    string: string
  }));
};

/**
 * Get non-translated function body string
 *
 * @param {String} key
 * @return {String}
 * @api private
 */

Compiler.prototype._getNonTranslatedFunctionBodyString = function(key) {
  return template.nonTranslatedFunctionBody({
    key: key
  });
};

/**
 * Get conditions string
 *
 * @param {Array} conditions
 * @param {Array} variables
 * @return {String}
 * @api private
 */

Compiler.prototype._getConditionsString = function(conditions, variables) {
  var str = '';
  conditions.forEach(function(condition) {
    if(condition[0] !== program.CONDITION_ELSE) {
      str += this._getConditionString(condition, variables);
      str += this._getAdditionalConditionString(condition, variables);
    }
    else {
      str += this.space + this._getElseStatementString(condition[1], variables);
    }
  }, this);

  return str;
};

/**
 * Get condition string
 *
 * @param {Array} condition
 * @param {Array} variables
 * @return {String}
 * @api private
 */

Compiler.prototype._getConditionString = function(conditions, variables) {
  var _condition = conditions[0]
    , operand1 = this._getFormatedOperandString(conditions[1], variables)
    , operator = conditions[2]
    , operand2 = this._getFormatedOperandString(conditions[3], variables);

  // Check if string represent a condition
  if(!syntax.stringIsCondition(operand1, operator, operand2)) {
    throw new TypeError('string does not represent a condition');
  }

  if(operator !== 'lci') {
    return template.condition({
      condition: _condition,
      operand1: operand1,
      operator: operator,
      operand2: operand2
    });
  }
  else {
    return template.conditionFunction({
      condition: _condition,
      operand1: operand1,
      function: operator,
      operand2: operand2
    });
  }


};

/**
 * Get condition string
 *
 * @param {ConditionArray}
 * @return {String}
 * @api private
 */

Compiler.prototype._getAdditionalConditionString = function(conditions, variables) {
  var str = '', index = 4;
  while(conditions[index] === program.ADDITIONAL_CONDITION_AND ||
        conditions[index] === program.ADDITIONAL_CONDITION_OR) {

    // Declare additional condition
    var additionalCondition = conditions[index];

    // Declare operators and operands
    var operand1 = this._getFormatedOperandString(conditions[index + 1], variables)
      , operator = conditions[index + 2]
      , operand2 = this._getFormatedOperandString(conditions[index + 3], variables);

    // Check if string represent a condition
    if(!syntax.stringIsCondition(operand1, operator, operand2)) {
      throw new TypeError('string does not represent a condition');
    }
    if(operator !== 'lci') {
      str += this.space + template.additionalCondition({
        additionalCondition: additionalCondition,
        operand1: operand1,
        operator: operator,
        operand2: operand2
      });
    }
    else {
      str += this.space + template.additionalConditionFunction({
        additionalCondition: additionalCondition,
        operand1: operand1,
        function: operator,
        operand2: operand2
      });
    }

    index += 4;
  }

  // append condition body
  str += template.conditionBody({
    string: this._getFormatedTranslatedText(conditions[index], variables)
  });

  return str;
};

/**
 * Get condition body string
 *
 * @param {String} condition body
 * @api private
 */

Compiler.prototype._getConditionBodyString = function(string) {
  return template.conditionBody({ string: string });
};

/**
 * Get else statement string
 *
 * @return {String} else statement
 * @api private
 */

Compiler.prototype._getElseStatementString = function(string, variables) {
  string = this._getFormatedTranslatedText(string, variables);
  return template.elseStatement({ string: string });
};

/**
 * Reformats a translation JSON variable to javascript string
 *
 * @param {String} operand
 * @param {Array} variables
 * @return {String}
 * @api private
 */

Compiler.prototype._getFormatedOperandString = function(operand, variables) {
  program.SYNTAX_VARIABLE_MARKUP.lastIndex = 0;
  if(program.SYNTAX_VARIABLE_MARKUP.test(operand)) {
    // Re-formats all variables
    if(/^\$\{\d/.test(operand)) {
      throw new TypeError('variable can\'t begin with an integer.');
    }
    if(variables.indexOf(operand) === -1) {
      log.error('You have used an undefined variable ' + operand.red
      + '.\n Please add the variable or remove the operand from your source.');
      process.exit();
    }
    operand = this.namespace + this.dot + operand.substring(2, operand.length -1);
  }
  else if(!/^\d+$/.test(operand)) {
    operand = this.quote + operand + this.quote;
  }

  return operand;
};

/**
 * Get formated translated text
 *
 * @param {String} text
 * @return {String} formated text
 * @api private
 */

Compiler.prototype._getFormatedTranslatedText = function(text, variables) {
  var _this = this;
  // Replace quotations
  text = this._normalizeText(text);

  return text.replace(program.SYNTAX_VARIABLE_MARKUP, function(match) {
    if(variables.indexOf(match) === -1) {
      log.error('You have used an undefined variable ' + operand.red
      + '.\n Please add the variable or remove the operand from your source.');
      process.exit();
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
