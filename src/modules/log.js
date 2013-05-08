var grunt  = require('grunt'),
    findup = require('findup-sync'),
    fs     = require('fs'),
    _      = grunt.util._,
    path   = require('path'),
    colors = require('colors'),
    engine = require('../lib/engine'),
    config = require('../lib/config');

grunt.util = grunt.util || grunt.utils;
grunt.file.expand = grunt.file.expandFiles || grunt.file.expand;

module.exports = function(opt, silent, loc) {

  loc = loc || opt.defaultLangauge;
  if(typeof silent === 'undefined') {
    silent = false;
  }

  if(!(translations = config.getLatestTranslations(opt, 10, loc))) {
    return false;
  }
  var n = 1;
  if(!silent) {
    grunt.log.ok('10 latest translation keys:');
  }
  var result = {};
  for(var i in translations) {
    var translation = translations[i];

    if(!silent) {
      grunt.log.writeln(('-' + n).yellow + ' ' + translation.key + ' ' + translation.value.text);
    }
    n++;
  }

  return translations;
};
