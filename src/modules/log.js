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
  var keys = [];
  for(var key in translations) {
    if(translations.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  keys.sort(function(a, b) {
    return translations[b].timestamp - translations[a].timestamp;
  });
  var n = 1;
  if(!silent) {
    grunt.log.writeln('');
    grunt.log.subhead('The 20 latest translation keys:');
    grunt.log.writeln('');
  }
  var result = {};
  for(var i in keys) {
    key = keys[i];
    var hash = n < 10 ? ' #' : '#';
    var number = hash + n;
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
      grunt.log.writeln(number.green + ' ' + key + ' ' + translation.yellow);
    }
    result[key] = translation;
    if(n > 20) {
      if(!silent) {
        grunt.log.writeln('');
      }
      break;
    }
    n++;
  }

  return result;
};
