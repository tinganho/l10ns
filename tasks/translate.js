/*
 * grunt-translate
 * https://github.com/tinganho/grunt-translate
 *
 * Copyright (c) 2013 Tingan Ho
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // Requires
  var fs     = require('fs'),
      path   = require('path'),
      _      = grunt.utils._;

  // vars
  var OPERATORS = ['<', '>', '===', '>==', '<==', '==', '>=', '<='];
  var options;

  grunt.registerMultiTask('translate', 'Your task description goes here.', function() {

    // Extend
    options = _.extend(this.data || {}, grunt.config.get('translate').options);

    // Set default options
    var translation = './translation';
    options = _.defaults( options, {
      configDir: translation,
      output: './translation/output',
      requireJS: true,
      translationFunctionName: 'gt',
      deleteLog: options.configDir + '/delete.log'
    });

    // Set UTF-8
    grunt.file.defaultEncoding = 'utf8';

    // Run appropiate sub task
    grunt.helper(this.target);

  });


  grunt.registerHelper('update', function(){

    var res = {};

    // get all locales
    var allTranslations = grunt.helper('getAllTranslations'),
        deletedTranslations = {};


    var files = grunt.file.expand(options.src);
    files.forEach(function(file){
      var content = grunt.file.read(file);
      var regex = new RegExp('\\s+' + options.translationFunctionName + '\\(\\s*[\'|"][\\w|\\-|\\s|\\&|<|>|\\/]+[\'|"](\\,\\s*\\{[\\w|\\s|\\:|\'|"|\\,]*\\})?\\)', 'g');
      var translations = content.match(regex);
      if(translations !== null) {
        translations.forEach(function(translation){
          var key = grunt.helper('getTranslationKey', translation);
          var vars = grunt.helper('getVars', translation);
          if(!( key in res )) {
            res[key] = {};
            res[key].vars = vars;
          } else {
            grunt.registerHelper('hasErrorDuplicte', res, key, vars);
          }
        });
      }
    });
    var now = (new Date()).getTime();
    var locales = grunt.helper('getAllLocales');
    locales.forEach(function(locale){
      (function(locale){
        var newLocal = res;
        Object.keys(newLocal).forEach(function(key){
          if(typeof allTranslations[locale] !== 'undefined') {
            if(key in allTranslations[locale] && 'translations' in allTranslations[locale][key]) {
              newLocal[key].translations = allTranslations[locale][key].translations;
            } else {
              newLocal[key].translations = [];
            }
            if(key in allTranslations[locale] && 'timestamp' in allTranslations[locale][key]) {
              newLocal[key].timestamp = allTranslations[locale][key].timestamp;
            } else {
              newLocal[key].timestamp = now;
            }
          } else {
            newLocal[key].translations = [];
          }
        });
        var localPath = options.configDir + '/locales/';
        if(!fs.existsSync(localPath)) {
          fs.mkdirSync(localPath);
        }
        var p = localPath + locale + '.json';
        if(fs.existsSync(p)) {
          fs.unlinkSync(p);
        }
        fs.writeFileSync(p, JSON.stringify(newLocal, null, 2));

        // Add deleted translation to delete log object
        for(var key in allTranslations[locale]) {
          if(!(key in newLocal)) {
            if(!(key in deletedTranslations)){
              deletedTranslations[key] = {};
            }
            if('translations' in allTranslations[locale][key]) {
              deletedTranslations[key][locale] = allTranslations[locale][key].translations;
            } else {
              deletedTranslations[key][locale] = [];
            }
            deletedTranslations[key].timestamp = now;
          }
        }
      })(locale);
    });


    // Add deleted translation to delete log
    var deleteLog;
    if(fs.existsSync(options.deleteLog)) {
      try {
        deleteLog = grunt.file.readJSON(options.deleteLog);
      } catch(e) {
        deleteLog = {};
      }
    } else {
      deleteLog = {};
    }
    _.extend(deleteLog, deletedTranslations);
    if(fs.existsSync(options.deleteLog)) {
      fs.unlinkSync(options.deleteLog);
    }
    fs.appendFileSync(options.deleteLog, JSON.stringify(deleteLog, null, 2));

    // Delete all the files that is not part of the locales.json
    var languageStore = grunt.file.expandFiles(options.configDir + '/locales/*.json');
    languageStore = languageStore.concat(grunt.file.expandFiles(options.configDir + '/output/*.js'));

    languageStore.forEach(function(file){
      var lang;

      if(path.extname(file) === '.json') {
        lang = path.basename(file, '.json');
        if(locales.indexOf(lang) === -1) {
          if(fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        }
      } else if(path.extname(file) === '.js') {
        lang = path.basename(file, '.js');
        if(locales.indexOf(lang) === -1) {
          if(fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        }
      }

    });

  });


  grunt.registerHelper('compile', function(){

    // Get all localization files
    var files = grunt.file.expandFiles(options.configDir + '/locales/**/*.json');

    // Check configuration are right
    if( !fs.existsSync(options.configDir + '/locales.json') ) {
      throw {
        name:     'Configuration Directory Misconfiguration',
        message:  'Please see configurations to correct your failures'
      };
    }

    var output = options.configDir + '/output';
    if( !fs.existsSync(output)) {
      fs.mkdirSync(output);
    }

    // Define translation file content
    files.forEach(function(file){
      var js = '';

      // RequireJS
      if(options.requireJS) {
        js += grunt.helper('appendRequirejsContent');
      } else {
        js += grunt.helper('appendModuleContent');
      }

      //Append translation content
      js += grunt.helper('appendTranslationContent', file);

      // RequireJS
      if(options.requireJS) {
        js += '});' + grunt.utils.linefeed;
      } else {
        js += '})()' + grunt.utils.linefeed;
      }

      var filename = path.basename(file, '.json');

      var p = options.output + '/' + filename + '.js';

      if(fs.existsSync(p)) {
        fs.unlinkSync(p);
      }
      fs.appendFileSync(p, js);

    });

  });

  /**
    Check for error duplicate
    @param Object res result that has already the key
    @param String key
    @param Array vars Translation vars
    @throws Duplicate Translation Keys Error
   */
  grunt.registerHelper('hasErrorDuplicte', function(res, key, vars){

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
  });

  /**
    Get all locales
    return Array of all locales
   */
  grunt.registerHelper('getAllLocales', function(){
    return Object.keys(grunt.file.readJSON(options.configDir + '/locales.json'));
  });


  /**
    Get all locales
    @return Object of all locales
   */
  grunt.registerHelper('getAllTranslations', function(){
    var files = grunt.file.expandFiles(options.configDir + '/locales/*.json');
    var locales = {};
    files.forEach(function(locale){
      locales[path.basename(locale, '.json')] = grunt.file.readJSON(locale);
    });
    return locales;
  });

  /**
    Returns all the vars in a translation function
    @param String fn Function string
    @return Array of all vars
   */
  grunt.registerHelper('getVars', function(fn){
    var json = fn.match(/\{[\w|\s|:|"|'|\-|\{|\}|\,|\/]*\}/);
    if(json === null) {
      return [];
    }
    json = grunt.helper('reFormatJson', json[0]);
    var vars = JSON.parse(json);
    return Object.keys(vars);
  });


  /**
    Reformat json
    @param String json
    @return String Reformated json ready to use for JSON.parse
   */
  grunt.registerHelper('reFormatJson', function(json){
    return json.replace(/\s*\w+\s*\:/g, function(m){
      var key = m.match(/\w+/);
      return '"' + key + '":';
    }).replace(/'/g, function(){
      return '"';
    });
  });

  /**
    Returns translation key from a translation function string
    @param String fn string of the function
    @return String Translation key
   */
  grunt.registerHelper('getTranslationKey', function(fn){
    return (fn.match(/['|"][\w|\-|\s|\&|<|>|\/]+['|"]/))[0].replace(/'/g, '');
  });

  /**
    Helper for appending js module content
    @return String RequireJS content
   */
  grunt.registerHelper('appendModuleContent', function() {
    var js = 'var ' + options.translationFunctionName + ' = (function() {' + grunt.utils.linefeed;
    return js;
  });

  /**
    Helper for appending requirejs file content
    @return String RequireJS content
   */
  grunt.registerHelper('appendRequirejsContent', function() {
    var js = '';
        js += 'if( typeof define !== "function" ) {' + grunt.utils.linefeed;
        js += '  var define = require( "amdefine" )( module );' + grunt.utils.linefeed;
        js += '}' + grunt.utils.linefeed;
        js += 'define(function() {' + grunt.utils.linefeed;
    return js;
  });


  /**
    Helper for appending translation content
    @param Array files
    @return String Translation content
   */
  grunt.registerHelper('appendTranslationContent', function(file) {

    // Store every function in a hash
    var t = '  var t = {' + grunt.utils.linefeed;

    // Append translation content
    var translations = grunt.file.readJSON(file);
    var n = 0;

    for( var key in translations ) {
      if(translations.hasOwnProperty(key)) {

        // Define function body
        var fb = '';

        // Append a comma for previous hashes
        if(n !== 0) {
          t += ',' + grunt.utils.linefeed;
        }
        if(translations[key].translations.length === 0){

          fb += '      return "HASH_NOT_TRANSLATED: ' + key + '";';

        } else if(translations[key].translations[0][0] === 'if') {

          var trans = translations[key].translations;
          trans.forEach(function(condition){

            var conditionAdditionIndex = 4;

            // Check if conditions are right will throw an error if not
            if(condition[0] !== 'else') {
              grunt.helper('isConditions', condition[1], condition[2], condition[3]);

              // Reformat variables
              condition[1] = grunt.helper('reformatOperandIfVariable', condition[1], translations[key].vars);
              condition[3] = grunt.helper('reformatOperandIfVariable', condition[3], translations[key].vars);

              fb += '      ' + condition[0] + '( ' + condition[1] + ' ' + condition[2] + ' ' + condition[3] + ' ';

              while(condition[conditionAdditionIndex] === '&&' ||
                    condition[conditionAdditionIndex] === '||') {

                // Give some space
                fb += condition[conditionAdditionIndex] + ' ';

                // Check if conditions are right will throw an error if not
                grunt.helper('isConditions', condition[conditionAdditionIndex + 1], condition[conditionAdditionIndex + 2], condition[conditionAdditionIndex + 3]);

                // Reformat variables
                condition[conditionAdditionIndex + 1] = grunt.helper('reformatOperandIfVariable', condition[conditionAdditionIndex + 1], translations[key].vars);
                condition[conditionAdditionIndex + 3] = grunt.helper('reformatOperandIfVariable', condition[conditionAdditionIndex + 3], translations[key].vars);

                // Add conditions
                for(var i = 1; i <= 3; i++) {
                  fb += condition[conditionAdditionIndex + i] + ' ';
                }
                conditionAdditionIndex += 4;
              }

              // Check translated text
              grunt.helper('isTranslationText', condition[conditionAdditionIndex], key);

              // Add
              fb += ') {' + grunt.utils.linefeed;
              fb += '        return ' + grunt.helper('reformatTranslatedText', condition[conditionAdditionIndex], translations[key].vars) + ';' + grunt.utils.linefeed; // Return the translated text
              fb += '      }' + grunt.utils.linefeed;

            } else {// If an else statement

              // Check translated text
              grunt.helper('isTranslationText', condition[1], key);

              fb += '      else {'+ grunt.utils.linefeed;
              fb += '        return ' + grunt.helper('reformatTranslatedText', condition[1], translations[key].vars) + ';' + grunt.utils.linefeed;
              fb += '      }';

            }

          });

        } else {

          // Check translated text
          grunt.helper('isTranslationText', translations[key].translations, key);

          fb += '      return ' + grunt.helper('reformatTranslatedText', translations[key].translations, translations[key].vars) + ';';
        }

        /*jshint evil:true */
        t += '    "' + key + '": ' + (new Function(['it'], fb)).toString();
        t = t.slice(0, -1) + '    }';
        /*jshint evil:false */

        // Update loop
        n++;


      }
    }

    t += grunt.utils.linefeed + '  };' + grunt.utils.linefeed;

    // Return the t function
    t += '  return function(translationKey) {' + grunt.utils.linefeed;
    t += '    if(!(translationKey in t)) {' + grunt.utils.linefeed;
    t += '      console.log("You have used an undefined translation key:" + translationKey);' + grunt.utils.linefeed;
    t += '      return false;' + grunt.utils.linefeed;
    t += '    }' + grunt.utils.linefeed;
    t += '    delete arguments[0];' + grunt.utils.linefeed;
    t += '    if("1" in arguments) {' + grunt.utils.linefeed;
    t += '      arguments[0] = arguments[1];' + grunt.utils.linefeed;
    t += '    }' + grunt.utils.linefeed;
    t += '    delete arguments[1];' + grunt.utils.linefeed;
    t += '    return t[translationKey].apply(undefined, arguments);' + grunt.utils.linefeed;
    t += '  };' + grunt.utils.linefeed;

    // Return string
    return t;

  });

  /**
    Reformat translated text
    @param String text
    @return String translated text
   */
  grunt.registerHelper('reformatTranslatedText', function(text, vars){

    return text.replace(/\$\{\w+\}/g, function( m ){

      m = m.substring(2, m.length - 1);
      if(vars.indexOf(m) === -1) {
        throw {
          name: 'Use of undefined variable',
          message: '"' + m + '" is never defined'
        };
      }
      return '\" + it.' + m + ' + \"';
    });

  });

  /**
    Checks if operands and operators has the correct syntax
    @param String operand1
    @param String operator
    @param String operand2
    @return Boolean true
    @throw Syntax Wrong in Translation JSON
   */
  grunt.registerHelper('isConditions', function(operand1, operator, operand2) {

    // Check operands
    if(!grunt.helper('isOperand', operand1) || !grunt.helper('isOperand', operand2)) {
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
  });

  /**
    Checks if an operand has the right syntax
    @param String operand
    @return Boolean
   */
  grunt.registerHelper('isOperand', function(operand) {
    if(/^"?\$?\w+"?$/.test(operand)) {
      return true;
    }
    return false;
  });

  /**
    Checks if an operand has the right syntax
    @param String text
    @return Boolean
   */
  grunt.registerHelper('isTranslationText', function(text, key) {
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
  });

  /**
    Reformats a translation JSON variable to javascript string
    @param String operand
    @param Array vars Vars is an array of defined variables
    @return String
   */
  grunt.registerHelper('reformatOperandIfVariable', function(operand, vars) {

    if(/^[a-zA-Z]\w+$/.test(operand)) {
      // Re-formats all params/vars
      operand = operand.replace('$', '');
      if(vars.indexOf(operand) === -1) {
        throw {
          name: 'Use of Undefined Variable',
          message: 'You have defined a variable in the translated text that is not used: \n' + operand.replace('$', '') + ' should instead be one of ' + vars.join(', ')
        };
      }
      operand = 'it.' + operand;
    }
    return operand;
  });

};
