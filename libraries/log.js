
var file = require('./file');
var log = require('./_log');

/**
 * Add terminal colors
 */

require('terminal-colors');

/**
 * Log constructor helps you output all logs for you
 *
 * @constructor Log
 */

function Log() {}

/**
 * Get latest translation updates
 *
 * @param {String} locale
 * @return {Array}
 * @api private
 */

Log.prototype.run = function(language, type) {
  var _this = this;

  language = language || project.defaultLanguage;

  file.readLocalizationArray(project.store + '/' + language + '.json')
    .then(function(localizations) {
      if(!localizations.length) {
        return log.log('No localizations.');
      }

      if(type === 'empty') {
        _this.printEmptyValuesLog(localizations, language)
      }
      else {
        _this.printRegularLog(localizations);
      }
    })
    .fail(function(error) {
      if(commands.stack && error) {
        console.log(error.stack);
      }

      console.log(error.message);
    });
};

/**
 * Print empty values log.
 *
 * @param {Array} localizations
 * @param {String} language
 * @return {void}
 * @api public
 */

Log.prototype.printEmptyValuesLog = function(localizations, language) {
  var n = 1;
  for(var i = 0; i < localizations.length; i++) {
    if(localizations[i].value.length === 0) {
      if(n <= program.DEFAULT_LOG_LENGTH) {
        log.log(localizations[i].key);
      }
      else {
        break;
      }
      n++;
    }
  }

  if(n === 1) {
    log.log('No empty-values for locale ' + language.yellow + '.');
  }
};

/**
 * Print regular log.
 *
 * @param {Array} localizations
 * @return {void}
 * @api public
 */

Log.prototype.printRegularLog = function(localizations) {
  var n = 1;
  for(var i in localizations) {
    if(n > program.DEFAULT_LOG_LENGTH) {
      break;
    }

    var tag;
    if((n+'').length < 2) {
      tag = ' @' + n;
    }
    else {
      tag = '@' + n;
    }
    log.log((tag).yellow + ' ' + localizations[i].key + ' | ' + localizations[i].value.green);
    n++;
  }

  if(n === 1) {
    log.log('No localizations updated from source. Please update with `l10ns update`.');
  }
};

/**
 * Export constructor
 */

module.exports.Constructor = Log;
