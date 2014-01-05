
/**
 * Module dependencies
 */

var fs = require('fs')
  , path = require('path')
  , glob = require('glob');

/**
 * File
 *
 * @constructor
 */

function File() {
  this.localesFolder = cf.localesFolder;
  this.newline = '\n';
}

/**
 * Write new translations to files.
 *
 * @param {object} newTranslations
 * @param {function} callback
 *
 * @return {void}
 * @private
 */

File.prototype.writeTranslations = function(newTranslations, callback) {
  if(!fs.existsSync(this.localesFolder)) {
    fs.mkdirSync(this.localesFolder);
  }
  for(var i in this.locales) {
    var locale = this.locales[i];
    var p = this.localesFolder + '/' + locale + '.locale';
    if(fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
    for(var key in newTranslations[locale]) {
      fs.appendFileSync(p, JSON.stringify(newTranslations[locale][key], null, 2) + this.newline + this.newline);
    }
  }
  if(typeof callback === 'function') {
    callback();
  }
};

/**
 * Get all translations. If locale parameter is provided
 * than only the locales translations is provided. Otherwise
 * all languages is included in the translation object.
 *
 * @param {=string} locale
 *
 * @return {object} translations
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
 * @public
 */

File.prototype.readTranslations = function(locale) {
  if(locale && typeof locale !== 'string') {
    throw new TypeError('first parameter must be string or undefined');
  }

  var _this = this;

  var files = glob.sync('./*.locale', { cwd: this.localesFolder });
  var translations = {};
  files.forEach(function(file) {
    translations[path.basename(file, '.locale')] = _this._getHashMapTranslations(file);
  });

  if(locale) {
    return translations[locale];
  }
  else {
    return translations;
  }
};

/**
 * Get hash map translation
 *
 * @return {object} translations
 *
 *   Example:
 *   {
 *     'TRANSLATION_KEY'
 *      ...
 *   }
 *
 * @private
 */

File.prototype._getHashMapTranslations = function(file) {
  var content = fs.readFileSync(path.join(this.localesFolder, file), 'utf-8');
  content = content
    // Replace all double new lines with comma and double new lines
    .replace(/\n\n/g, ',\n\n')
    // Remove the last comma
    .slice(0, -3);


  // Wrap in hard brackets to represent a JSON Array
  content = '[' + content + ']';

  var translations = JSON.parse(content), _translations = {};
  for(var i in translations) {
    var translation = translations[i];
    _translations[translation.key] = translations[i];
  }

  return _translations;
};

/**
 * Export instance
 */

module.exports = new File;

/**
 * Export constructor
 */

module.exports.File = File;

