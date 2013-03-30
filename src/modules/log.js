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

module.exports = function(options, silent) {

  if(typeof silent === 'undefined') {
    silent = false;
  }

  var translations = grunt.file.readJSON(options.config + '/locales/' + options.defaultLanguage + '.json');

  var keys = config.getLatestTranslations(options, 10);
  var n = 1;
  if(!silent) {
    grunt.log.ok('10 latest translation keys:');
  }
  var result = {};
  for(var i in keys) {
    key = keys[i];
    var number = '-' + n;
    var translation;
    if(typeof translations[key].translations === 'string') {
      translation = translations[key].translations;
    } else {
      if(translations[key].translations.length === 0) {
        translation = 'NO TRANSLATION';
      } else {
        translation = 'if...';
      }
    }
    if(!silent) {
      grunt.log.writeln(number.yellow + ' ' + key + ' ' + translation);
    }
    result[key] = translation;
    n++;
  }

  return result;
};
