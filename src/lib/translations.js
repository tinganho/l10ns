var grunt       = require('grunt'),
    engine      = require('./engine'),
    path        = require('path'),
    OPERATORS   = require('./operators');

function Translations() {
  // Set grunt
  grunt.util = grunt.util || grunt.utils;
  grunt.file.expand = grunt.file.expandFiles || grunt.file.expand;
  var _ = grunt.util._;

  // Get config
  var translation = './translations';
  this.opt = _.defaults(grunt.config.get('translate').dist.options, {
    config: './translation',
    requirejs: true,
    translationFunctionName: 'gt'
  });
  this.opt.output = this.opt.config + '/output';
  this.opt.deleteLog = this.opt.config + '/delete.log';

}

Translations.prototype.update = function(key, value, language, cb, err) {

  if(typeof language === 'function'){
    cb = language;
    language = this.opt.defaultLanguage;
  } else {
    language = language || this.opt.defaultLanguage;
  }

  try {
    var _path = this.opt.config + '/locales/' + language + '.json';
    var translations = grunt.file.readJSON(_path);
    if(value === '') {
      value = [];
    } else if(typeof value  === 'string') {
      value = '\"' + value + '\"';
    }

    translations[key].translations = value;

    grunt.file.write(_path, JSON.stringify(translations, null, 2));

  } catch(e) {
    err();
  }

  if(typeof cb === 'function') {
    cb();
  }
};


module.exports = Translations;
