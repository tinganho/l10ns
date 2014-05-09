
/**
 * Module dependencies
 */

var fs = require('fs')
  , path = require('path')
  , syntax = require('./syntax')
  , tmpl = require('./templates/build/tmpl')
  , file = require('../../libraries/file')
  , log = require('../../libraries/_log');

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
  // set default translation function
  this.defaultTranslationFunction = pcf.DEFAULT_TRANSLATION_FUNCTION;
  // languague wrapper
  this.wrap = null;
  // default namespace
  this.namespace = 'it';
  // new line
  this.newline = '\n';
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
  // quote
  this.quote = '\'';
  // Quiet
  this.quiet = lcf.quiet;
  // Set locales
  this.locales = pcf.locales;
};

/**
 * Compile task
 *
 * @return {void}
 * @api public
 */

Compiler.prototype.compile = function() {
  for(locale in this.locales) {
    var content = tmpl.javascriptWrapper({
      variable : this.defaultTranslationFunction,
      translationMap : this._getTranslationMap(locale)
    });
    fs.writeFileSync(pcf.output + '/' + locale + '.js', content);
  }
};

/**
 * Get translations
 *
 * @param {String} locale
 * @param {Object}
 * @api private
 */

Compiler.prototype._getTranslations = function(locale) {
  var translations = file.readTranslations();
  return translations[locale];
};

/**
 * Get translation map
 *
 * @param {String} locale
 * @return {String} JS String representation fo translation map
 * @api private
 */

Compiler.prototype._getTranslationMap = function(locale) {
  // Get translations
  var translations = this._getTranslations(locale);

  // Get Body string
  var n = 0, body = '';
  for(var key in translations) {
    // Append a comma for previous hashes
    if(n !== 0) {
      body += this.comma + this.newline;
    }

    var field = tmpl.JSONTranslationFunctionField({
      key : this._normalizeText(key),
      functionString : this._getFunctionBodyString(translations, key)
    });

    body += field;

    if(!this.quiet) {
      console.log(locale, this._normalizeText(key));
    }

    n++;
  }

  // Store every function in a hash
  return tmpl.mapDeclaration({
    body : body
  });

};

/**
 * Normalize text, ' should be \'
 *
 * @param {String} text
 * @api private
 */

Compiler.prototype._normalizeText = function(text) {
  return text
    .replace('\\', 'ESCAPE_CHAR')
    .replace(/'/, '\\\'')
    .replace(/[^\\]ESCAPE_CHAR/g, function(m) {
      return m.replace('ESCAPE_CHAR', '\\\\');
    });
};

/**
 * Get function body string
 *
 * @param {Object} translation
 * @return {String} function body string
 * @api private
 */

Compiler.prototype._getFunctionBodyString = function(translations, key) {
  var str = '';
  if(translations[key].values.length === 0) {
    str += this._getNonTranslatedFunctionBodyString(this._normalizeText(key));
  } else if(translations[key].values[0][0] === pcf.CONDITION_IF) {
    str += this._getConditionsString(
      translations[key].values,
      translations[key].vars
    );
  } else {
    str += this._getNonConditionsFunctionBodyString(
      this._getFormatedTranslatedText(
        translations[key].values[0],
        translations[key].vars
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
  return tmpl.nonConditionFunctionBody({
    string : string
  });
};

/**
 * Get non-translated function body string
 *
 * @param {String} key
 * @return {String}
 * @api private
 */

Compiler.prototype._getNonTranslatedFunctionBodyString = function(key) {
  return tmpl.nonTranslatedFunctionBody({
    key : key
  });
};

/**
 * Get conditions string
 *
 * @param {Array} conditions
 * @param {Array} vars
 * @return {String}
 * @api private
 */

Compiler.prototype._getConditionsString = function(conditions, vars) {
  var str = '';
  conditions.forEach(function(condition) {
    if(condition[0] !== pcf.CONDITION_ELSE) {
      str += this._getConditionString(condition, vars);
      str += this._getAdditionalConditionString(condition, vars);
    }
    else {
      str += this.space + this._getElseStatementString(condition[1]);
    }
  }, this);

  return str;
};

/**
 * Get condition string
 *
 * @param {Array} condition
 * @param {Array} vars
 * @return {String}
 * @api private
 */

Compiler.prototype._getConditionString = function(conditions, vars) {
  var _condition = conditions[0]
    , operand1   = this._getFormatedOperandString(conditions[1], vars)
    , operator   = conditions[2]
    , operand2   = this._getFormatedOperandString(conditions[3], vars);

  // Check if string represent a condition
  if(!syntax.stringIsCondition(operand1, operator, operand2)) {
    throw new TypeError('string does not represent a condition');
  }

  return tmpl.condition({
    condition : _condition,
    operand1  : operand1,
    operator  : operator,
    operand2  : operand2
  });
};

/**
 * Get condition string
 *
 * @param {ConditionArray}
 * @return {String}
 * @api private
 */

Compiler.prototype._getAdditionalConditionString = function(conditions, vars) {
  var str = '', index = 4;
  while(conditions[index] === pcf.ADDITIONAL_CONDITION_AND ||
        conditions[index] === pcf.ADDITIONAL_CONDITION_OR) {

    // Declare additional condition
    var additionalCondition = conditions[index];

    // Declare operators and operands
    var operand1 = this._getFormatedOperandString(conditions[index + 1], vars)
      , operator = conditions[index + 2]
      , operand2 = this._getFormatedOperandString(conditions[index + 3], vars);

    // Check if string represent a condition
    if(!syntax.stringIsCondition(operand1, operator, operand2)) {
      throw new TypeError('string does not represent a condition');
    }

    str += this.space + tmpl.additionalCondition({
      additionalCondition : additionalCondition,
      operand1            : operand1,
      operator            : operator,
      operand2            : operand2
    });

    index += 4;
  }

  // append condition body
  str += tmpl.conditionBody({
    string : this._getFormatedTranslatedText(conditions[index], vars)
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
  return tmpl.conditionBody({ string : string });
};

/**
 * Get else statement string
 *
 * @return {String} else statement
 * @api private
 */

Compiler.prototype._getElseStatementString = function(string) {
  return tmpl.elseStatement({ string : string });
};

/**
 * Reformats a translation JSON variable to javascript string
 *
 * @param {String} operand
 * @param {Array} vars
 * @return {String}
 * @api private
 */

Compiler.prototype._getFormatedOperandString = function(operand, vars) {
  pcf.SYNTAX_VARIABLE_MARKUP.lastIndex = 0;
  if(pcf.SYNTAX_VARIABLE_MARKUP.test(operand)) {
    // Re-formats all vars
    if(/^\$\{\d/.test(operand)) {
      throw new TypeError('variable can\'t begin with an integer.');
    }
    if(vars.indexOf(operand) === -1) {
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

Compiler.prototype._getFormatedTranslatedText = function(text, vars) {
  var _this = this;
  // Replace quotations
  text = this._normalizeText(text);

  return text.replace(pcf.SYNTAX_VARIABLE_MARKUP, function(match) {
    if(vars.indexOf(match) === -1) {
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

module.exports = Compiler;
