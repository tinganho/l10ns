var grunt   = require('grunt'),
    config  = require('./config');

grunt.util = grunt.util || grunt.utils;
grunt.file.expand = grunt.file.expandFiles || grunt.file.expand;

var engine = {};

/**
  Helper for appending js module content
  @return String RequireJS content
 */
engine.appendModuleContent = function(options) {
  var js = 'var ' + options.translationFunctionName + ' = (function() {' + grunt.util.linefeed;
  return js;
};

/**
  Reformats a translation JSON variable to javascript string
  @param String operand
  @param Array vars Vars is an array of defined variables
  @return String
 */
engine.reformatOperandIfVariable = function(operand, vars) {

  if(/^[a-zA-Z]\w+$/.test(operand)) {
    // Re-formats all params/vars
    operand = operand.replace('$', '');
    if(vars.indexOf(operand) === -1) {
      throw new TypeError('You have defined a variable in the translated text that is not used: \n' + operand.replace('$', '') + ' should instead be one of ' + vars.join(', '));
    }
    operand = 'it.' + operand;
  }
  return operand;
};

/**
  Helper for appending translation content
  @param Array files
  @return String Translation content
 */
engine.appendTranslationContent = function(file) {

  // Store every function in a hash
  var t = '  var t = {' + grunt.util.linefeed;

  // Append translation content
  var translations = grunt.file.readJSON(file);
  var n = 0;

  for( var key in translations ) {

    if(translations.hasOwnProperty(key)) {

      // Define function body
      var fb = '';

      // Append a comma for previous hashes
      if(n !== 0) {
        t += ',' + grunt.util.linefeed;
      }
      _key = key.replace(/"/, '\\"');

      if(translations[key].translations.length === 0){

        fb += '      return "HASH_NOT_TRANSLATED: ' + _key + '";';
      } else if(translations[key].translations[0][0] === 'if') {
        var trans = translations[key].translations;
        trans.forEach(function(condition){

          var conditionAdditionIndex = 4;

          // Check if conditions are right will throw an error if not
          if(condition[0] !== 'else') {
            config.isConditions(condition[1], condition[2], condition[3]);

            // Reformat variables
            condition[1] = engine.reformatOperandIfVariable(condition[1], translations[key].vars);
            condition[3] = engine.reformatOperandIfVariable(condition[3], translations[key].vars);

            fb += '      ' + condition[0] + '( ' + condition[1] + ' ' + condition[2] + ' ' + condition[3] + ' ';

            while(condition[conditionAdditionIndex] === '&&' ||
                  condition[conditionAdditionIndex] === '||') {

              // Give some space
              fb += condition[conditionAdditionIndex] + ' ';

              // Check if conditions are right will throw an error if not
              config.isConditions(condition[conditionAdditionIndex + 1], condition[conditionAdditionIndex + 2], condition[conditionAdditionIndex + 3]);

              // Reformat variables
              condition[conditionAdditionIndex + 1] = engine.reformatOperandIfVariable(condition[conditionAdditionIndex + 1], translations[key].vars);
              condition[conditionAdditionIndex + 3] = engine.reformatOperandIfVariable(condition[conditionAdditionIndex + 3], translations[key].vars);

              // Add conditions
              for(var i = 1; i <= 3; i++) {
                fb += condition[conditionAdditionIndex + i] + ' ';
              }
              conditionAdditionIndex += 4;
            }

            // Check translated text
            config.isTranslationText( condition[conditionAdditionIndex], key );

            // Add
            fb += ') {' + grunt.util.linefeed;
            fb += '        return ' + engine.reformatTranslatedText(condition[conditionAdditionIndex], translations[key].vars) + ';' + grunt.util.linefeed; // Return the translated text
            fb += '      }' + grunt.util.linefeed;

          } else {// If an else statement

            // Check translated text
            config.isTranslationText(condition[1], key);

            fb += '      else {'+ grunt.util.linefeed;
            fb += '        return ' + engine.reformatTranslatedText(condition[1], translations[key].vars) + ';' + grunt.util.linefeed;
            fb += '      }';

          }

        });

      } else {

        // Check translated text
        config.isTranslationText(translations[key].translations, key);

        fb += '      return ' + engine.reformatTranslatedText(translations[key].translations, translations[key].vars) + ';';
      }

      /*jshint evil:true */

       // Normalize key
      t += '    "' + _key + '": ' + (new Function(['it'], fb)).toString();
      t = t.slice(0, -1) + '    }';
      /*jshint evil:false */

      // Update loop
      n++;


    }
  }

  t += grunt.util.linefeed + '  };' + grunt.util.linefeed;

  // Return the t function
  t += '  return function(translationKey) {' + grunt.util.linefeed;
  t += '    if(!(translationKey in t)) {' + grunt.util.linefeed;
  t += '      console.log("You have used an undefined translation key:" + translationKey);' + grunt.util.linefeed;
  t += '      return false;' + grunt.util.linefeed;
  t += '    }' + grunt.util.linefeed;
  t += '    delete arguments[0];' + grunt.util.linefeed;
  t += '    if("1" in arguments) {' + grunt.util.linefeed;
  t += '      arguments[0] = arguments[1];' + grunt.util.linefeed;
  t += '    }' + grunt.util.linefeed;
  t += '    delete arguments[1];' + grunt.util.linefeed;
  t += '    return t[translationKey].apply(undefined, arguments);' + grunt.util.linefeed;
  t += '  };' + grunt.util.linefeed;

  // Return string
  return t;

};

/**
  Reformat translated text
  @param String text
  @return String translated text
 */
engine.reformatTranslatedText = function(text, vars){

  var text = '"' + text.substring(1, text.length - 1).replace(/"/g, function(m) {

    return '" + "' + '\\"' + '" + "';
  }) + '"';

  console.log(text);

  return text.replace(/\$\{\w+\}/g, function( m ) {

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

/**
  Helper for appending requirejs file content
  @return String RequireJS content
 */
engine.appendRequireJSContent = function() {
  var js = '';
      js += 'if( typeof define !== "function" ) {' + grunt.util.linefeed;
      js += '  var define = require( "amdefine" )( module );' + grunt.util.linefeed;
      js += '}' + grunt.util.linefeed;
      js += 'define(function() {' + grunt.util.linefeed;
  return js;
};

module.exports = engine;



