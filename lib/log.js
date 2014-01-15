var colors = require('colors')
  , file = require('./file');


function Log() {
  this.defaultLocale = cf.defaultLocale;
}

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
 * @private
 */

Log.prototype.outputLog = function(locale) {
  var loc = loc || cf.defaultLocale
    , translations = this._getTranslations(locale, { returnType : 'array' });

  if(!translations.length) {
    return console.log('\nNo translations');
  }

  console.log('\nLatest translations in ' + cf.locales[loc].toLowerCase());
  console.log('=============================================\n');
  var n = 1, result = {};
  for(var i in translations) {
    var tag;
    if((n+'').length < 2) {
      tag = ' -' + n;
    }
    else {
      tag = '-' + n;
    }
    console.log((tag).yellow + ' ' + translations[i].key + ' | ' + translations[i].value.text.green);
    n++;
  }
};

/**
 * Get latest translation updates
 *
 * @param {String} locale
 * @return {Array}
 * @private
 */

Log.prototype._getLatestUpdates = function(locale) {
  if(locale && typeof locale !== 'string') {
    throw new TypeError('first parameter must contain a locale string');
  }
  else {
    locale = this.defaultLocale;
  }

  var translations = file.readTranslations(locale);

  return translations;
};

/**
 * Export constructor
 */

module.exports.Log = Log;
