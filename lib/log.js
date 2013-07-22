var grunt        = require('grunt')
  , colors       = require('colors')
  , translations = require('./translations');

module.exports = function() {

  var _translations;
  if(!(_translations = translations.getTranslations(0, pcf.LOG_LENGTH, cf.defaultLocale))) {
    return false;
  }
  grunt.log.ok('10 latest translation keys:');
  var n = 1, result = {};
  for(var i in _translations) {
    grunt.log.writeln(('-' + n).yellow + ' ' + _translations[i].key + ' ' + _translations[i].value.text);
    n++;
  }

  return translations;
};
