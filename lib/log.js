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

Log.prototype.writeDeleteLog = function(deletedTranslations) {
  var deleteLog;
  if(fs.existsSync(cf.deleteLog)) {
    try {
      deleteLog = require(cf.deleteLog);
    } catch(e) {
      deleteLog = {};
    }
  } else {
    deleteLog = {};
  }
  deleteLog = _.extend(deleteLog, deletedTranslations);
  if(fs.existsSync(cf.deleteLog)) {
    fs.unlinkSync(cf.deleteLog);
  }
  fs.writeFileSync(cf.deleteLog, JSON.stringify(deletedTranslations, null, 2));
};

/**
 * Get latest translation updates
 *
 * @param {String} locale
 * @return {Array}
 * @api private
 */

Log.prototype.outputLog = function(locale) {
  var locale = locale || this.defaultLocale
    , translations = this._getLatestUpdates(locale).slice(0, this._length);

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
