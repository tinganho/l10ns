
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

function Log() {
  this.defaultLocale = pcf.defaultLocale;
  this.locales = pcf.locales;
  this._length = pcf.LOG_LENGTH;
}


/**
 * Get latest translation updates
 *
 * @param {String} locale
 * @return {Array}
 * @api private
 */

Log.prototype.outputLog = function(locale) {
  locale = locale || this.defaultLocale;

  var translations = this._getLatestUpdates(locale).slice(0, this._length);

  if(!translations.length) {
    return log.log('No translations');
  }

  var n = 1;
  for(var i in translations) {
    var tag;
    if((n+'').length < 2) {
      tag = ' %' + n;
    }
    else {
      tag = '%' + n;
    }
    log.log((tag).yellow + ' ' + translations[i].key + ' | ' + translations[i].text.green);
    n++;
  }
};

/**
 * Get latest translation updates
 *
 * @param {String} locale
 * @return {Array}
 * @api private
 */

Log.prototype._getLatestUpdates = function(locale) {
  if(locale && typeof locale !== 'string') {
    throw new TypeError('first parameter must contain a locale string');
  }

  var translations = file.readTranslations(locale, { returnType : 'array' });

  return translations;
};

/**
 * Export constructor
 */

module.exports.Log = Log;
