var grunt  = require('grunt')
  , colors = require('colors')
  , parse = require('./parse');

module.exports = function() {

  var translations;
  if(!(translations = config.getLatestTranslations(0, pcf.LOG_LENGTH, cf.defaultLocale))) {
    return false;
  }
  grunt.log.ok('10 latest translation keys:');
  var n = 1, result = {};
  for(var i in translations) {
    var translation = translations[i];
    if(!silent) {
      grunt.log.writeln(('-' + n).yellow + ' ' + translation.key + ' ' + translation.value.text);
    }
    n++;
  }

  return translations;
};
