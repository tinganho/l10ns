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
  var fs    = require('fs'),
      path  = require('path'),
      _     = grunt.utils._;

  // vars
  var OPERATORS = ['<', '>', '===', '>==', '<==', '==', '>=', '<='];
  var options;


  grunt.registerMultiTask('translate', 'Your task description goes here.', function() {

    // Set default options
    options = _.defaults(this.data || {}, {
      configDir: './translation',
      output: './translation/output',
      requireJS: true,
      translationFunctionName: 'gt'
    });

    // Set UTF-8
    grunt.file.defaultEncoding = 'utf8';

    // Get all localization files
    var files = grunt.file.expand(options.configDir + '/locales/**/*.json');

    // Check configuration are right
    if( !fs.existsSync(options.configDir + '/locales.json') ) {
      throw {
        name:     'Configuration Directory Misconfiguration',
        message:  'Please see configurations to correct your failures'
      };
    }

    // Define translation file content
    files.forEach(function(file){
      var js = '';

      // RequireJS
      if(options.requireJS) {
        js += grunt.helper('appendRequirejsContent');
      } else {
        js+= grunt.helper('appendModuleContent');
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
      fs.unlinkSync(p);
      fs.appendFileSync(p, js);

    });

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

        // Minimum requirements for a conditional statement
        if(translations[key].translations[0][0] === 'if') {

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
              grunt.helper('isTranslationText', condition[conditionAdditionIndex]);


              // Add
              fb += ') {' + grunt.utils.linefeed;
              fb += '        return ' + grunt.helper('reformatTranslatedText', condition[conditionAdditionIndex], translations[key].vars) + ';' + grunt.utils.linefeed; // Return the translated text
              fb += '      }' + grunt.utils.linefeed;

            } else {// If an else statement

              // Check translated text
              grunt.helper('isTranslationText', condition[1]);

              fb += '      else {'+ grunt.utils.linefeed;
              fb += '        return ' + grunt.helper('reformatTranslatedText', condition[1], translations[key].vars) + ';' + grunt.utils.linefeed;
              fb += '      }';

            }

          });

        } else {

          // Check translated text
          grunt.helper('isTranslationText', translations[key].translations);

          fb += '      return ' + grunt.helper('reformatTranslatedText', translations[key].translations, translations[key].vars) + ';';
        }

        // Make function
        var params = translations[key].vars.map(function(item){
          return item.replace('$', '');
        });
        /*jshint evil:true */
        t += '    "' + key + '": ' + (new Function(params, fb)).toString();
        t = t.slice(0, -1) + '    }';
        /*jshint evil:false */

        // Update loop
        n++;


      }
    }

    t += grunt.utils.linefeed + '  };' + grunt.utils.linefeed;

    // Return the t function
    t += '  return function(hashkey) {' + grunt.utils.linefeed;
    t += '    delete arguments[0];' + grunt.utils.linefeed;
    t += '    for(var i in arguments) {' + grunt.utils.linefeed;
    t += '      if(arguments.hasOwnProperty(i)){' + grunt.utils.linefeed;
    t += '        arguments[i - 1] = arguments[i];' + grunt.utils.linefeed;
    t += '      }' + grunt.utils.linefeed;
    t += '    }' + grunt.utils.linefeed;
    t += '    return t[hashkey].apply(undefined, arguments);' + grunt.utils.linefeed;
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
      if(vars.indexOf('$' + m) === -1) {
        throw {
          name: 'Use of Undefined variable',
          message: '"' + m + '" is never defined'
        };
      }
      return '\" + ' + m + ' + \"';
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
  grunt.registerHelper('isTranslationText', function(text) {
    function ttexterr(){
      throw {
        name: 'Translation Text Wrong Syntax',
        message: 'You have wrong syntaxt in: ' + text
      };
    }

    if(text.substr(0,1) !== '"' || text.substr(-1) !== '"') {
      ttexterr();
    }

  });

  /**
    Reformats a translation JSON variable to javascript string
    @param String operand
    @param Array vars Vars is an array of defined variables
    @return String
   */
  grunt.registerHelper('reformatOperandIfVariable', function(operand, vars) {

    if(/\$\w+/.test(operand)) {
      if(vars.indexOf(operand) !== -1) {
        // Re-formats all params/vars
        operand = operand.replace('$', '');
      } else {
        throw {
          name: 'Use of Undefined Variable',
          message: 'You have defined a variable in the translated text that is not used: ' + operand + ' should instead be one of ' + vars.join(', ')
        };
      }
    }
    return operand;
  });

};
