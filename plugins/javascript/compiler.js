var grunt   = require('grunt')
  , fs      = require('fs')
  , path    = require('path')
  , syntax  = require('./syntax')
  , tmpl    = require('../templates/tmpl');


/**
 * Compiler
 *
 * @constructor
 */

var Compiler = function() {

  if(typeof cf.programmingLanguageOptions !== 'object') {
    throw new TypeError('cf.programmingLanguageOptions is not set');
  }
  // Programming languague options
  // {
  //  node : {boolean},
  //  requirejs : {boolean}
  // }
  this.opts = cf.programmingLanguageOptions;
  // Languague wrapper
  this.wrap = null;
  // Default namespace
  this.namespace = 'it';
  // New line
  this.newline = '\n';
};

/**
 * Compile task
 *
 * @return {void}
 * @public
 */

Compiler.prototype.compile = function() {
  if(!this.wrapper) {
    this.wrap = this._getWrapper();
  }

  for(locale in cf.locales) {
    var content = this.wrap({
      translationMap : this._getTranslationMap(locale)
    });
    fs.writeFileSync(cf.output, content);
  }
};

/**
 * Get wrapper for translation content
 *
 * @return {void}
 * @private
 */

Compiler.prototype._getWrapper = function() {
  var wrapper;
  if(this.opts.requirejs && this.opts.node) {
    wrapper = tmpl.requirejsAndNodejsWrapper;
  }
  else if(this.opts.requirejs) {
    wrapper = tmpl.requirejsWrapper
  }
  else {
    wrapper = tmpl.nodejsWrapper;
  }
  return wrapper;
};

/**
 * Get translations
 *
 * @param {string} locale
 *
 * @param {JSONObject}
 * @private
 */

Compiler.prototype._getTranslations = function(locale) {
  return require(path.normalize(cf.localesFolder + '/' + locale + '.json'));
};

/**
 * Get translation map
 *
 * @param {locale} string
 *
 * @return {string} JS String representation fo translation map
 * @private
 */

Compiler.prototype._getTranslationMap = function(locale) {
  // Get translations
  var translations = this._getTranslations(locale);

  // Get Body string
  var n = 0, body = '';
  for(var key in translations) {
    // Append a comma for previous hashes
    if(n !== 0) {
      body += ',' + this.newline;
    }
    body += tmpl.JSONTranslationFunctionField({
      key : key,
      functionString : this._getFunctionBodyString(translations, key)
    });

    n++;
  }

  // Store every function in a hash
  return tmpl.mapDeclaration({
    body : body
  });

};

/**
 * Get function body string
 *
 * @param {TranslationObject} translation
 *
 * @return {string} function body string
 * @private
 */

Compiler.prototype._getFunctionBodyString = function(translation, key) {
  var str = '';
  if(translation[key].translations.length === 0){
    str += this._getUntranslatedFunctionBodyString(key);
  } else if(translations[key].translations[0][0] === pcf.CONDITION_IF) {
    str += this._getConditionsFunctionBodyString(
      translation[key].translations[0],
      translation[key].vars
    );
  } else {
    str += this._getNonConditionsFunctionBodyString(
      _this._getFormatTranslatedText(
        translation[key].translations,
        translation[key].vars
      )
    );
  }

  return (new Function([this.namespace], str)).toString();
};

/**
 * Get non-conditions function body string
 *
 * @param {string} key
 *
 * @return {string}
 * @private
 */

Compiler.prototype._getNonConditionsFunctionBodyString = function(string) {
  return tmpl.nonTranslatedFunctionBody(string);
};

/**
 * Get non-translated function body string
 *
 * @param {string} key
 *
 * @return {string}
 * @private
 */

Compiler.prototype._getUntranslatedFunctionBodyString = function(key) {
  return tmpl.nonTranslatedFunctionBody({
    key : key
  });
};

/**
 * Get conditions function body string
 *
 * @param {ConditionArray}
 *
 * @return {string}
 * @private
 */

Compiler.prototype._getConditionsFunctionBodyString = function(conditions, vars) {
  var _this = this;

  var str = '';
  conditions.forEach(function(condition) {
    if(condition[0] !== pcf.CONDITION_ELSE) {
      str += _this._getConditionString(condition);
      str += _this._getAdditionalConditionString(condition);
    }
    else {
      str += _this._getElseStatementString();
    }
  });

  return str;
};

/**
 * Get condition string
 *
 * @param {ConditionArray}
 *
 * @return {string}
 * @private
 */

Compiler.prototype._getConditionString = function(condition) {
  var _condition = condition[0]
    , operand1   = _this._getFormatedOperandString(condition[1], vars)
    , operator   = condition[2]
    , operand2   = _this._getFormatedOperandString(condition[3], vars);

  // Check if string represent a condition
  if(syntax.stringIsCondition(operand1, operator, operand2)) {
    throw new TypeError('string does not represent a condition');
  }

  return tmpl.condition({
    condition : _condition
    operand1  : operand1,
    operator  : operator,
    operand2  : operand2
  });
};

/**
 * Get condition string
 *
 * @param {ConditionArray}
 *
 * @return {string}
 * @private
 */

Compiler.prototype._getAdditionalConditionString = function(condition) {
  var str = '', index = 4;
  while(condition[index] === pcf.ADDITIONAL_CONDITION_AND ||
        condition[index] === pcf.ADDITIONAL_CONDITION_OR) {

    // Declare additional condition
    var additionalCondition = condition[index];

    // Declare operators and operands
    var operand1 = _this._getFormatedOperandString(condition[index + 1], vars)
      , operator = condition[index + 2]
      , operand2 = _this._getFormatedOperandString(condition[index + 3], vars);

    // Check if string represent a condition
    if(syntax.stringIsCondition(operand1, operator, operand2)) {
      throw new TypeError('string does not represent a condition');
    }

    str += tmpl.additionalCondition({
      additionalCondition : additionalCondition,
      operand1            : operand1,
      operator            : operator,
      operand2            : operand2
    });

    index += 4;
  }

  return str;
};

/**
 * Get condition body string
 *
 * @param {string} condition body
 * @private
 */

Compiler.prototype._getConditionBodyString = function(string) {
  return tmpl.conditionBody({ string : string });
};

/**
 * Get else statement string
 *
 * @return {string} else statement
 * @private
 */

Compiler.prototype._getElseStatementString = function(string) {
  return tmpl.elseStatement({ string : string });
};

/**
 * Reformats a translation JSON variable to javascript string
 *
 * @param {string} operand
 * @param {array} vars
 *
 * @return {string}
 * @private
 */

Compiler.prototype._getFormatedOperandString = function(operand, vars) {
  if(pcf.SYNTAX_VARIABLE.test(operand)) {
    // Re-formats all params/vars
    operand = operand.replace('$', '');
    if(vars.indexOf(operand) === -1) {
      throw new TypeError('You have used an undefined variable ' + operand);
    }
    operand = this.namespace + '.' + operand;
  }

  return operand;
};

/**
 * Get formated translated text
 *
 * @param {string} text
 *
 * @return {string} formated text
 * @private
 */

Compiler.prototype._getFormatTranslatedText = function(text, vars){
  var text = '"' + text.substring(1, text.length - 1).replace(/"/g, function(m) {
    return '" + "' + '\\"' + '" + "';
  }) + '"';

  return text.replace(/\$\{[a-zA-Z0-9]+\}/g, function(m) {
    m = m.substring(2, m.length - 1);
    if(vars.indexOf(m) === -1) {
      throw {
        name: 'Use of undefined variable',
        message: '"' + m + '" is never defined'
      };
    }
    return '\" + it.' + m + ' + \"';
  });
};

module.exports = Compiler;
