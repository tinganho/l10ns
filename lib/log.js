
/*jshint unused:false */
var colors = require('colors')
  , file = require('./file');


function Log() {
  this.defaultLocale = cf.defaultLocale;
  this.locales = cf.locales;
  this._length = cf.LOG_LENGTH;
}

/**
 * We need to attach console.log method to Log. Because we need
 * to test the logging functionality
 *
 * @attach console.log to _log
 */

Log.prototype._log = console.log;

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
    return this._log('\nNo translations\n');
  }

  this._log('\nLatest translations in ' + this.locales[locale].toLowerCase());
  this._log('=============================================\n');
  var n = 1, result = {};
  for(var i in translations) {
    var tag;
    if((n+'').length < 2) {
      tag = ' -' + n;
    }
    else {
      tag = '-' + n;
    }
    this._log((tag).yellow + ' ' + translations[i].key + ' | ' + translations[i].text.green);
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
  else {
    locale = this.defaultLocale;
  }

  var translations = file.readTranslations(locale, { returnType : 'array' });

  return translations;
};

/**
 * Export constructor
 */

module.exports.Log = Log;
