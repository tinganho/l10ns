
/**
 * Module dependencies
 */

var file = require('./file')
  , Q = require('q')
  , log = require('./_log');

/**
 * Get translations execute edit functions for editing the current
 * translations. This constructor provides methods for editing
 * translations.
 *
 * @constructor Edit
 */

function Set() {}

/**
 * Edit current translations
 *
 * @param {String} ref
 * @param {String} value
 * @param {String} locale
 * @return {void}
 * @api public
 */

Set.prototype.run = function(ref, value, locale) {
  var _this = this;

  if(typeof ref !== 'string') {
    return log.error('You must reference a translation. Either using a translation key or tag.');
  }
  if(typeof value !== 'string') {
    return log.error('You must specify a value for the translation.');
  }
  if(!(locale in this.locales)) {
    return log.error('Locale ' + locale.yellow + ' is not defined.');
  }

  value = this._removeEscapes(value);

  this._getKey(ref)
  .then(function(key) {
    var translations = _this._replace(key, value, locale);
    file.writeTranslations(translations, function() {
      log.success('Updated key ' + key.yellow + ' in ' + locale.yellow + ' to ' + value.yellow + '.');
    });
  })
  .fail(function(err) {
    console.log(err.stack);
    log.error('Could not edit your translations.');
  });
};

/**
 * Remove escaped characters
 *
 * @param {String} value
 * @return {String}
 * @api private
 */

Set.prototype._removeEscapes = function(value) {
  return value.replace('\\!', '!');
};

/**
 * Get key
 *
 * @param {String} ref
 * @return {Promise}
 * @api public
 */

Set.prototype._getKey = function(ref) {
  var deferred = Q.defer();

  if(typeof ref !== 'string') {
    deferred.reject(new TypeError('First parameter is not of type string.'));
    return deferred.promise;
  }

  var key = ref;
  if(/^@\d+$/.test(ref)) {
    ref = /^@(\d+)$/.exec(ref)[1];
    this._getKeyFromLatestTranslations(parseInt(ref, 10))
    .then(function(key) {
      deferred.resolve(key);
    })
    .fail(function(err) {
      deferred.reject(err);
    });
  }
  else if(/^%\d+$/.test(ref)) {
    ref = /^%(\d+)$/.exec(ref)[1];
    key = this._getKeyFromLatestSearch(ref)
    .then(function(key) {
      deferred.resolve(key);
    })
    .fail(function(err) {
      deferred.reject(err);
    });
  }
  else {
    deferred.resolve(ref);
  }

  return deferred.promise;
};

/**
 * Get key from latest search
 *
 * @param {Number|(number castable)String} reference
 * @return {Promise}
 * @api private
 */

Set.prototype._getKeyFromLatestSearch = function(reference) {
  var deferred = Q.defer();

  reference = parseInt(reference, 10);

  if(isNaN(reference)) {
    deferred.reject(new TypeError('First parameter is not a number nor a number castable string.'));
    return deferred.promise;
  }

  // Decrease reference with one;
  reference--;

  if(reference < 0) {
    deferred.reject(new TypeError('Reference is not indexed.'));
    return deferred.promise;
  }

  file.readSearchTranslations()
    .then(function(data) {
      if(reference > data.length - 1) {
        return deferred.reject(new TypeError('Reference is not indexed.'));
      }
      deferred.resolve(data[reference].ref);
    })
    .fail(function(err) {
      deferred.reject(err);
    });

  return deferred.promise;
};

/**
 * Get key from latest translations
 *
 * @param {Number} ref
 * @return {Promise}
 * @api private
 */

Set.prototype._getKeyFromLatestTranslations = function(reference) {
  var deferred = Q.defer();

  reference = Math.abs(reference) - 1;

  var translations = file.readTranslations(null, { returnType : 'array' });

  if(reference < 0 || reference > translations.length - 1) {
    deferred.reject(new TypeError('Reference is not indexed.'));
    return deferred.promise;
  }

  try {
    deferred.resolve(translations[project.defaultLocale][reference].key);
  }
  catch(err) {
    deferred.reject(new TypeError('Reference is not indexed.'));
  }

  return deferred.promise;
};

/**
 * Replaces old value with new
 *
 * @param {String} key
 * @param {String} value
 * @return {Object}
 * @api private
 */

Set.prototype._replace = function(key, value, locale) {
  locale = locale || this.defaultLocale;

  var translations = file.readTranslations();

  if(!(locale in translations)) {
    return log.error('Locale: ' + locale.yellow + ' is not in current translations.');
  }
  if(!(key in translations[locale])) {
    return log.error('Key: ' + key.yellow + ' is not in current translations.');
  }

  // Save value
  translations[locale][key].values = [value];
  translations[locale][key].text = value;

  return translations;
};

/**
 * Export instance
 */

module.exports = new Set;

/**
 * Export constructor
 */

module.exports.Set = Set;
