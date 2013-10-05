var colors       = require('colors')
  , translations = require('./translations');


function Log() {}

Log.prototype.getLatestUpdates = function() {

};

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

module.exports = function(loc) {

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

  return translations;
};
