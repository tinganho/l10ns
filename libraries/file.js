
/**
 * Module dependencies
 */

var fs = require('fs')
  , path = require('path')
  , glob = require('glob')
  , Q = require('q');

/**
 * File
 *
 * @constructor
 */

function File() {
  this.locales = cf.locales;
  this.newline = '\n';
}

/**
 * Write new translations to files.
 *
 * @param {Object} newTranslations
 * @param {Function} callback
 * @return {void}
 * @api private
 */

File.prototype.writeTranslations = function(newTranslations, callback) {
  if(!fs.existsSync(cf.output)) {
    fs.mkdirSync(cf.output);
  }

  var translations = this._sortMaptoArray(newTranslations);
  for(var locale in this.locales) {
    var p = cf.output + '/' + locale + '.locale';
    if(fs.existsSync(p)) {
      fs.unlinkSync(p);
    }

    for(var i = 0; i < translations[locale].length; i++) {
      fs.appendFileSync(p, JSON.stringify(translations[locale][i]) + this.newline);
    }
  }
  if(typeof callback === 'function') {
    callback();
  }
};

/**
 * Write new translations to files.
 *
 * @param {Object} newTranslations
 * @param {Function} callback
 * @return {void}
 * @api private
 */

File.prototype.writeSingleLocaleTranslations = function(newTranslations, locale, callback) {
  if(!fs.existsSync(cf.output)) {
    fs.mkdirSync(cf.output);
  }

  var p = cf.output + '/' + locale + '.locale';
  if(fs.existsSync(p)) {
    fs.unlinkSync(p);
  }

  for(var i = 0; i < newTranslations.length; i++) {
    fs.appendFileSync(p, JSON.stringify(newTranslations[i]) + this.newline);
  }

  if(typeof callback === 'function') {
    callback();
  }
};

/**
 * Sort translation map to an array
 *
 * @param {Object} newTranslations
 * @return {Object}
 * @api private
 */

File.prototype._sortMaptoArray = function(newTranslations) {
  var translations = {};

  for(var locale in this.locales) {
    translations[locale] = [];
    for(var key in newTranslations[locale]) {
      translations[locale].push(newTranslations[locale][key]);
    }

    translations[locale] = translations[locale].sort(function(a, b) {
      return b.timestamp - a.timestamp;
    });
  }

  return translations;
};

/**
 * Get all translations. If locale parameter is provided
 * than only the locales translations is provided. Otherwise
 * all languages is included in the translation object.
 *
 * @param {=String} locale
 * @param {?Object} opts (opts.returnType) Specify the return
 * type for the object. Could be either `array` or `json`
 * @return {Object|Array} translations
 *
 *   Example:
 *   {
 *      'en-US': {
 *          ...
 *      },
 *      'zh-ZN': {
 *          ...
 *       }
 *   }
 *
 *   Or..
 *
 *   Example:
 *   {
 *      ...
 *   }
 *
 * @api public
 */

File.prototype.readTranslations = function(locale, opts) {
  if(locale && typeof locale !== 'string') {
    throw new TypeError('first parameter must have type string or undefined');
  }
  if(opts && typeof opts !== 'object') {
    throw new TypeError('second parameter must have type object or undefined');
  }

  locale = locale || cf.DEFAULT_LOCALE;

  opts = opts || {};

  if(!opts.returnType) {
    opts.returnType = 'json';
  }

  var _this = this;

  var files = glob.sync('./*.locale', { cwd: cf.output });
  var translations = {};
  files.forEach(function(file) {
    if(opts.returnType === 'json') {
      translations[path.basename(file, '.locale')] = _this._getHashMapTranslations(file);
    }
    else {
      translations[path.basename(file, '.locale')] = _this._getArrayTranslations(file);
    }
  });

  if(locale) {
    return translations[locale];
  }
  else {
    return translations;
  }
};

/**
 * We are haveing a different format in our localization files. We need to format
 * them into JSON object. So we just append commas in each object and wrap the file
 * content in hard brackets to create a JSON array of translation
 *
 * @param {String} file
 * @return {Array} translations
 *
 *   Example:
 *   [
 *     {
 *      ...
 *     },
 *     ...
 *   ]
 *
 * @api private
 */

File.prototype._getArrayTranslations = function(file) {
  var content = fs.readFileSync(path.join(cf.output, file), 'utf-8');
  content = content
    // Replace all double new lines with comma and double new lines
    .replace(/\}\n+\{/g, '},{');

  // Wrap in hard brackets to represent a JSON Array
  return JSON.parse('[' + content + ']');
};

/**
 * Get hash map translation
 *
 * @param {String} file
 * @return {Object} translations
 *
 *   Example:
 *   {
 *     'TRANSLATION_KEY'
 *      ...
 *   }
 *
 * @api private
 */

File.prototype._getHashMapTranslations = function(file) {
  var translations = this._getArrayTranslations(file);

  var _translations = {};
  for(var i in translations) {
    var translation = translations[i];
    _translations[translation.key] = translations[i];
  }

  return _translations;
};

/**
 * Read latest search translations saved on disk
 *
 * @return {Promise}
 * @api public
 */

File.prototype.readSearchTranslations = function() {
  var deferred = Q.defer();
  fs.readFile(this.folder + '/cache/latestSearch.json',
  { encoding : 'utf-8' },
  function(err, data) {
    if(err) return deferred.reject(err);
    try {
      var search = JSON.parse(data);
      deferred.resolve(search);
    }
    catch(err) {
      deferred.reject(err);
    }
  });

  return deferred.promise;
};

/**
 * Export instance
 */

module.exports = new File;

/**
 * Export constructor
 */

module.exports.File = File;

