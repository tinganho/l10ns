var grunt       = require('grunt'),
    engine      = require('./engine'),
    path        = require('path'),
    OPERATORS   = require('./operators');

grunt.util = grunt.util || grunt.utils;
grunt.file.expand = grunt.file.expandFiles || grunt.file.expand;

var config = {};

/**
  Get all locales
  return Array of all locales
 */
config.getAllLocales = function(options){
  return Object.keys(grunt.file.readJSON(options.configDir + '/locales.json'));
};

/**
  Check for error duplicate
  @param Object res result that has already the key
  @param String key
  @param Array vars Translation vars
  @throws Duplicate Translation Keys Error
 */
config.hasErrorDuplicate = function(res, key, vars){

  // Check for error duplicate
  var errorDuplicate = false;
  if(vars.length !== res[key].vars.length) {
    errorDuplicate = true;
  } else {
    for(var i in vars) {
      if(res[key].vars[i] !== vars[i]) {
        errorDuplicate = true;
        break;
      }
    }
  }
  if(errorDuplicate) {
    throw {
      name: 'Duplicate Translation Keys',
      message: 'You have used gt(\'' + key + '\') and input two different vars: \n' + 'Variables: ' + res[key].vars.join(',') + '\n' + 'Is not equal: ' + vars.join(',')
    };
  }
};

/**
  Get all locales
  @return Object of all locales
 */
config.getAllTranslations = function(options){
  var files = grunt.file.expand({filter: 'isFile'}, options.configDir + '/locales/*.json');
  var locales = {};
  files.forEach(function(locale){
    locales[path.basename(locale, '.json')] = grunt.file.readJSON(locale);
  });
  return locales;
};

/**
  Returns translation key from a translation function string
  @param String fn string of the function
  @return String Translation key
 */
config.getTranslationKey = function(fn){
  var str = fn.match(/['|"][\w|\-|\s|\&|<|>|\/|\.|’|'|"|€|\$|%|#|\\|\?|!|,|\_|\^|`|´|\+|=|\*]+['|"]/)[0];
  return str.slice(1, str.length - 1);
};

/**
  Returns all the vars in a translation function
  @param String fn Function string
  @return Array of all vars
 */
config.getVars = function(fn){
  var json = fn.match(/\{[\w|\s|:|"|'|\-|\{|\}|\,|\/|\.]*\}/);
  if(json === null) {
    return [];
  }
  json = json[0].replace(/\s*\w+\s*\:/g, function(m){
    var key = m.match(/\w+/);
    return '"' + key + '":';
  }).replace(/'/g, function(){
    return '"';
  });
  var vars = JSON.parse(json);
  return Object.keys(vars);
};

/**
  Checks if an operand has the right syntax
  @param String text
  @return Boolean
 */
config.isTranslationText = function(text, key) {
  if(typeof text === 'undefined') {
    throw {
      name: 'Undefined translation',
      message: 'You have an undefined translation in:\n' + key
    };
  } else if(text.substr(0,1) !== '"' || text.substr(-1) !== '"') {
    throw {
      name: 'Translation Text Wrong Syntax',
      message: 'You have missed quotation in:\n' + text
    };
  }
};

/**
  Checks if operands and operators has the correct syntax
  @param String operand1
  @param String operator
  @param String operand2
  @return Boolean true
  @throw Syntax Wrong in Translation JSON
 */
config.isConditions = function(operand1, operator, operand2) {

  // Check operands
  if(!this.isOperand(operand1) || !this.isOperand(operand2)) {
    throw {
      name: 'Syntax Wrong in Translation JSON',
      message: 'One of the operands have wrong syntax: ' + operand1 + ' or ' + operand2
    };
  }

  // Validate operator
  if(OPERATORS.indexOf(operator) === -1) {
    throw {
      name: 'Syntax Wrong in Translation JSON',
      message: '"' + operator + '" should be one of ' + OPERATORS.join(',')
    };
  }
  return true;
};

/**
  Checks if an operand has the right syntax
  @param String operand
  @return Boolean
 */
config.isOperand = function(operand) {
  if(/^"?\$?\w+"?$/.test(operand)) {
    return true;
  }
  return false;
};

module.exports = config;

