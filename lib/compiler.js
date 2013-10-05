var grunt   = require('grunt')
  , fs      = require('fs')
  , path    = require('path')
  , parser  = require('./parser');


var Compiler = function() {}

/**
 * Helper for appending js module content
 * @return String RequireJS content
 */

Compiler.prototype.appendModuleContent = function() {
  var js = 'var ' + cf.translationFunction + ' = (function() {' + grunt.util.linefeed;
  return js;
};

/**
 * Reformats a translation JSON variable to javascript string
 *
 * @param String operand
 * @param Array vars Vars is an array of defined variables
 * @return String
 */

Compiler.prototype.reformatOperandIfVariable = function(operand, vars) {

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
Compiler.prototype.appendTranslationContent = function(file) {

  // Store every function in a hash
  var t = '  var t = {' + grunt.util.linefeed;

  // Append translation content
  var translations = require(file);
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

  t += this.addReturnStatement();
  t += grunt.util.linefeed + '  };' + grunt.util.linefeed;


  // Return string
  return t;

};

Compiler.prototype.addReturnStatement = function() {
  return fs.readFileSync('./templates/return.js');
};

/**
  Reformat translated text
  @param String text
  @return String translated text
 */
Compiler.prototype.reformatTranslatedText = function(text, vars){

  var text = '"' + text.substring(1, text.length - 1).replace(/"/g, function(m) {

    return '" + "' + '\\"' + '" + "';
  }) + '"';

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
Compiler.prototype.appendRequireJSContent = function() {
  var js = '';
      js += 'if( typeof define !== "function" ) {' + grunt.util.linefeed;
      js += '  var define = require( "amdefine" )( module );' + grunt.util.linefeed;
      js += '}' + grunt.util.linefeed;
      js += 'define(function() {' + grunt.util.linefeed;
  return js;
};

Compiler.prototype.parseTranslations = function(translations) {
  var keys = [];
  for(var key in translations) {
    if(translations.hasOwnProperty(key)) {
      var translation, type;
      if(typeof translations[key].translations === 'string') {
        type = 'simple';
        var val = translations[key].translations.substr(1, translations[key].translations.length - 2);
        translation = {
          text  : val,
          value : val
        };
      } else {
        if(translations[key].translations.length === 0) {
          type = 'simple';
          translation = {
            text  : 'NO TRANSLATION',
            value : ''
          };
        } else {
          type = 'logical';
          translation = {
            text  : 'if...',
            value : translations[key].translations
          };
        }
      }

      keys.push({
        id    : translations[key].id,
        key   : key,
        vars  : translations[key].vars,
        type  : type,
        value : translation
      });
    }
  }

  return keys;
};

module.exports = Compiler;
// module.exports = function() {

//   // Get all localization files
//   var files = grunt.file.expand({filter: 'isFile'}, cf.locales + '/**/*.json');

//   if( !fs.existsSync(cf.output)) {
//     fs.mkdirSync(cf.output);
//   }

//   // Define translation file content
//   files.forEach(function(file){
//     var js = '';

//     // RequireJS
//     if(options.requirejs) {
//       js += engine.appendRequireJSContent();
//     } else {
//       js += engine.appendModuleContent(options);
//     }

//     //Append translation content
//     js += engine.appendTranslationContent(file);

//     // RequireJS
//     if(cf.requirejs) {
//       js += '});' + grunt.util.linefeed;
//     } else {
//       js += '})()' + grunt.util.linefeed;
//     }

//     var filename = path.basename(file, '.json');

//     var p = cf.output + '/' + filename + '.js';

//     if(fs.existsSync(p)) {
//       fs.unlinkSync(p);
//     }
//     fs.appendFileSync(p, js);

//   });

//   grunt.log.ok('Compiled new translation object in ' + options.config + '/output');
// };
