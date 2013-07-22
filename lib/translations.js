var grunt       = require('grunt'),
    engine      = require('./engine'),
    path        = require('path'),
    Compiler    = require('compiler').Compiler;




function Translations() {}

Translations.prototype.update = function(key, value, locale, cb, err) {

  if(typeof locale === 'function'){
    cb = locale;
    locale = cf.defaultLocale;
  } else {
    locale = locale || cf.defaultLocale;
  }

  try {
    var _path = cf.localesFolder + '/' + locale + '.json';
    var translations = require(_path);
    if(value === '') {
      value = [];
    } else if(typeof value  === 'string') {
      value = '\"' + value + '\"';
      translations[key].query_translation = value;
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

/**
 * Get all locales
 *
 * @param {Boolean} hashed
 * @return {Array} locales
 */

Translations.prototype.getLocales = function(hashed){

  hashed = !!hashed;

  if(hashed) {
    return Object.keys(cf.locales);
  } else {
    var res = [];
    for(var key in cf.locales) {
      res.push({key : key, text : cf.locales[key]});
    }
    res = res.sort(function(a, b) {
      if(a.text > b.text) {
        return 1;
      } else if(a.text < b.text) {
        return -1;
      } else {
        return 0;
      }
    });
    return res;
  }
};

/**
 * Check if translation has locale
 *
 * @param {String} loc
 * @return {Boolean}
 */

Translations.prototype.hasLocale = function(loc) {
  return cf.locales.indexOf(loc) !== -1;
};

/**
 * Get all translations
 *
 * @param {String} loc
 * @return {Boolean}
 */

Translations.prototype.getAllTranslations = function() {
  var files = grunt.file.expand({filter: 'isFile'}, cf.localesFolder + '/*.json');
  var locales = {};
  files.forEach(function(locale){
    locales[path.basename(locale, '.json')] = require(locale);
  });
  return locales;
};


/**
 * Get translation
 *
 * @param {Number} from
 * @param {Number} length
 * @param {String} locale
 * @return {Array}
 */

Translations.prototype.getTranslations = function(from, length, loc) {
  if(typeof loc === 'undefined' || loc === '') {
    loc = loc || cf.defaultLocale;
  } else if(!this.hasLocale(loc)) {
    grunt.log.error('Locale: ' + loc + ' is not defined in gt.json');
    return false;
  }
  length = length || cf.LOG_LENGTH;
  var translations = require(cf.localesFolder + '/' + loc + '.json');

  var keys = Compiler.prototype.normalizeTranslations(translations);

  keys.sort(function(a, b) {
    return translations[b.key].timestamp - translations[a.key].timestamp;
  });

  return keys.splice(from, length);
};


module.exports = Translations;
