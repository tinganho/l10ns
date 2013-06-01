var config = require('../lib/config'),
    grunt  = require('grunt');


module.exports = function(opt, hash, lang, val) {
  var key, latest;
  if(/-\d+/.test(hash)) {
    latest = +hash.match(/\d+/)[0];
    var latestTranslations = config.getLatestTranslations(opt, 0, 10);
    var n = 1;
    for(var i in latestTranslations) {
      if(latest === n) {
        key = latestTranslations[i].key;
        break;
      }
      n++;
    }
    if(!key) {
      grunt.log.error('Your log doesn\'t contain: ' + hash);
      return false;
    }
  } else if(/@\d+/.test(hash)) {
    latest = hash.match(/\d+/)[0] - 1;
    var latestSearchTranslations = config.getLatestSearchTranslations(opt, 10);
    if(typeof latestSearchTranslations[latest] !== 'undefined') {
      key = latestSearchTranslations[latest];
    } else {
      grunt.log.error('Your latest search didn\'t contain ' + hash);
      return false;
    }
  } else {
    key = hash;
  }
  var file = opt.locales + '/' + lang + '.json';
  if(!grunt.file.exists(file)) {
    grunt.log.error('File does not exist. You haven\'t added the langague ' + lang + ' maybe?');
    return false;
  } else {
    var translations = grunt.file.readJSON(file);
    if(typeof translations[key] === 'undefined') {
      grunt.log.error('Key: "' + key + '" does not exist.');
      return false;
    } else {
      translations[key].query_translation = val;
      translations[key].translations = '"' + val + '"';
      grunt.file.write(file, JSON.stringify(translations, null, 2));
      grunt.log.ok('Translation key: "' + key + '" has now the value: "' + val + '"');
    }
  }
};
