
var file = require('./file')
  , log = require('./_log');

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

Log.prototype.run = function(locale, type) {
  var _this = this;

  locale = locale || project.defaultLocale;

  file.readLocalizationArray(project.store + '/' + locale + '.locale')
    .then(function(localizations) {
      localizations = localizations.slice(0, program.DEFAULT_LOG_LENGTH);

      if(!localizations.length) {
        return log.log('No localizations.');
      }

      if(type === 'empty') {
        _this.printEmptyValuesLog(localizations, locale)
      }
      else {
        _this.printRegularLog(localizations);
      }

    })
    .fail(function(error) {
      console.log(error.stack);
    });
};

/**
 * Print empty values log.
 *
 * @param {Array} localizations
 * @return {void}
 * @api public
 */

Log.prototype.printEmptyValuesLog = function(localizations, locale) {
  var n = 1;
  for(var i in localizations) {
    if(localizations[i].values.length === 0) {
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
    log.log('No empty-values for locale ' + locale.yellow + '.');
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
    var tag;
    if((n+'').length < 2) {
      tag = ' @' + n;
    }
    else {
      tag = '@' + n;
    }
    log.log((tag).yellow + ' ' + localizations[i].key + ' | ' + localizations[i].text.green);
    n++;
  }

  if(n === 1) {
    log.log('No localizations updated from source. Please update with `l10ns update`.');
  }
};

/**
 * Export constructor
 */

module.exports.Log = Log;
