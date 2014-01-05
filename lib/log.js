var colors = require('colors')
  , file = require('./file');


function Log() {}

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

Log.prototype.outputLog = function(locale) {
  var loc = loc || cf.defaultLocale
    , _translations;

  if(!(_translations = translations.getTranslations(0, pcf.LOG_LENGTH, loc))) {
    return false;
  }
  console.log('\nLatest translations in ' + cf.locales[loc].toLowerCase());
  console.log('=============================================\n');
  var n = 1, result = {};
  for(var i in _translations) {
    var tag;
    if((n+'').length < 2) {
      tag = ' -' + n;
    }
    else {
      tag = '-' + n;
    }
    console.log((tag).yellow + ' ' + _translations[i].key + ' | ' + _translations[i].value.text.green);
    n++;
  }
};

/**
 * Get latest translation updates
 *
 * @param {String} locale
 *
 * @return {Array}
 * @private
 */

Log.prototype._getLatestUpdates = function(locale) {
  if(typeof locale !== 'string') {
    throw new TypeError('first parameter must contain a local string');
  }

  var translations = file.readTranslations(locale);

  console.log(translations);
};

/**
 * Export constructor
 */

module.exports.Log = Log;
