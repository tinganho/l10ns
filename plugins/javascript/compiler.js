
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
 * Get localization map string.
 *
 * @param {String} locale
 * @return {Promise}
 * @resolves {String} String representing a localization map
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

        var field = _this.indentSpaces(2, template.JSONLocalizationFunctionField({
          key: key,
          functionString: _this._getFunctionBodyString(localizations, key)
        }));

        body += field;

        if(!this.quiet && locale === project.defaultLocale) {
          console.log('[compiled] '.green + key);
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
 * Get function body string
 *
 * @param {Object} localizations
 * @return {String} function body string
 * @api private
 */

Compiler.prototype._getFunctionBodyString = function(localizations, key) {
  var string = '';

  if(localizations[key].values.length === 0) {
    string += this.indentSpaces(2, this._getNonLocalizedFunctionBodyString(key));
  }
  else if(localizations[key].values[0][0] === program.CONDITION_IF) {
    string += this.indentSpaces(2, this._getConditionsString(
      localizations[key].values,
      localizations[key].variables
    ));
  }
  else {
    string += this._getNonConditionsFunctionBodyString(
      this._getFormatedLocalizedText(
        localizations[key].values[0],
        localizations[key].variables
      )
    );
  }

  return (new Function([this.namespace], string)).toString();
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
 * Get non-localized function body string
 *
 * @param {String} key
 * @return {String}
 * @api private
 */

Compiler.prototype._getNonLocalizedFunctionBodyString = function(key) {
  return template.nonLocalizedFunctionBody({
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
  var string = '';

  conditions.forEach(function(condition) {
    if(condition[0] !== program.CONDITION_ELSE) {
      string += this._getConditionString(condition, variables);
      string += this._getAdditionalConditionString(condition, variables);
    }
    else {
      string += this.space + this._getElseStatementString(condition[1], variables);
    }
  }, this);

  return string;
};

/**
 * Get condition string
 *
 * @param {Array} condition
 * @param {Array} variables
 * @return {String}
 * @api private
 */

Compiler.prototype._getConditionString = function(condition, variables) {
  var _condition = condition[0]
    , operand1 = this._getFormatedOperandString(condition[1], variables)
    , operator = condition[2]
    , operand2 = this._getFormatedOperandString(condition[3], variables);

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
  var string = '', index = 4;
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
      string += this.space + template.additionalCondition({
        additionalCondition: additionalCondition,
        operand1: operand1,
        operator: operator,
        operand2: operand2
      });
    }
    else {
      string += this.space + template.additionalConditionFunction({
        additionalCondition: additionalCondition,
        operand1: operand1,
        function: operator,
        operand2: operand2
      });
    }

    index += 4;
  }

  // append condition body
  string += template.conditionBody({
    string: this._getFormatedLocalizedText(conditions[index], variables)
  });

  return string;
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
  string = this._getFormatedLocalizedText(string, variables);
  return template.elseStatement({ string: string });
};

/**
 * Reformats a localization JSON variable to javascript string
 *
 * @param {String} operand
 * @param {Array} variables
 * @return {String}
 * @api private
 */

Compiler.prototype._getFormatedOperandString = function(operand, variables) {
  program.SYNTAX_VARIABLE_MARKUP.lastIndex = 0;
  if(program.SYNTAX_VARIABLE_MARKUP.test(operand)) {
    program.SYNTAX_VARIABLE_MARKUP.lastIndex = 0;
    // Re-formats all variables
    if(/^\$\{\d/.test(operand)) {
      throw new TypeError('variable can\'t begin with an integer.');
    }

    operand = operand.substring(2, operand.length - 1);

    if(variables.indexOf(operand) === -1) {
      throw new TypeError('You have used an undefined variable ' + operand.red
      + '.\n Please add the variable or remove the operand from your source.');
    }
    operand = this.namespace + this.dot + operand;
  }
  else if(!/^\d+$/.test(operand)) {
    operand = this.quote + operand + this.quote;
  }

  return operand;
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
    match = match.substring(2, match.length - 1);

    if(variables.indexOf(match) === -1) {
      throw new TypeError('You have used an undefined variable ' + match.red
      + '.\n Please add the variable or remove the operand from your source.');
    }

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
