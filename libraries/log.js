
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

Log.prototype.outputLog = function(locale, type) {
  locale = locale || project.defaultLocale;

  file.readLocalizationArray(project.store + '/' + locale + '.locale')
    .then(function(localizations) {
      localizations = localizations.slice(0, program.LOG_LENGTH);

      if(!localizations.length) {
        return log.log('No localizations.');
      }

      if(type === 'empty-values') {
        var n = 1;
        for(var i in localizations) {
          if(localizations[i].values.length === 0) {
            if(n <= program.LOG_LENGTH) {
              log.log(localizations[i].key + ' | ' + localizations[i].text.green);
            }
            else {
              break;
            }
            n++;
          }
        }

        if(n === 1) {
          log.log('None empty-values for locale ' + locale.yellow + '.');
        }
      }
      else {
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
      }

    })
    .fail(function(error) {
      console.log(error.stack);
    });
};

/**
 * Export constructor
 */

module.exports.Log = Log;
