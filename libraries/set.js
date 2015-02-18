
/**
 * Module dependencies
 */

var file = require('./file')
  , defer = require('q').defer
  , log = require('./_log')
  , MessageFormat = require('./MessageFormat');

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

Set.prototype.run = function(reference, value, language) {
  var _this = this, key;

  language = language || project.defaultLanguage;

  if(typeof reference !== 'string') {
    return log.error('You must reference a translation. Either using a translation key or tag.');
  }
  if(typeof value !== 'string') {
    return log.error('You must specify a value for the translation.');
  }
  if(!(language in project.languages)) {
    return log.error('Locale ' + language.yellow + ' is not defined.');
  }

  try {
    var messageFormat = new MessageFormat(language);
    messageFormat.parse(value);
  }
  catch(error) {
    return log.error(error.message);
  }

  value = this._removeEscapes(value);

  this._getKey(reference)
    .then(function(_key) {
      key = _key;
      return _this._replace(key, value, language);
    })
    .then(function(localizations) {
      return file.writeLocalizations(localizations);
    })
    .then(function() {
      log.success('Updated key ' + key.yellow + ' in ' + language.yellow + ' to ' + value.yellow + '.');
    })
    .fail(function(error) {
      if(commands.stack) {
        console.log(error.stack);
      }

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
 * Get localization key using reference. End-users use a reference to a key.
 * Could be latest localizations using "@" or latest search using "%". This
 * method resolves back the key the reference is referencing.
 *
 * @param {String} reference
 * @return {Promise}
 * @api public
 */

Set.prototype._getKey = function(reference) {
  var deferred = defer();

  if(typeof reference !== 'string') {
    deferred.reject(new TypeError('First parameter is not of type string.'));
    return deferred.promise;
  }

  var key = reference;
  if(/^@\d+$/.test(reference)) {
    reference = /^@(\d+)$/.exec(reference)[1];
    this._getKeyFromLatestLocalizations(parseInt(reference, 10))
    .then(function(key) {
      deferred.resolve(key);
    })
    .fail(function(err) {
      deferred.reject(err);
    });
  }
  else if(/^%\d+$/.test(reference)) {
    reference = /^%(\d+)$/.exec(reference)[1];
    key = this._getKeyFromLatestSearch(reference)
    .then(function(key) {
      deferred.resolve(key);
    })
    .fail(function(err) {
      deferred.reject(err);
    });
  }
  else {
    deferred.resolve(reference);
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
  var deferred = defer();

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
    .fail(function(error) {
      deferred.reject(error);
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

Set.prototype._getKeyFromLatestLocalizations = function(reference) {
  var deferred = defer();

  reference = Math.abs(reference) - 1;

  file.readLocalizations()
    .then(function(localizations) {
      localizations = file.localizationMapToArray(localizations);
      if(reference < 0 || reference > localizations.length - 1) {
        deferred.reject(new TypeError('Reference is not indexed.'));
      }

      deferred.resolve(localizations[project.defaultLocale][reference].key);
    })
    .fail(function(error) {
      deferred.reject(error);
    });

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
  var deferred = defer();
  locale = locale || project.defaultLocale;

  file.readLocalizations()
    .then(function(localizations) {
      if(!(locale in localizations)) {
        return log.error('Locale: ' + locale.yellow + ' is not in current localizations.');
      }
      if(!(key in localizations[locale])) {
        return log.error('Key: ' + key.yellow + ' is not in current localizations.');
      }

      // Save value
      localizations[locale][key].value = value;

      deferred.resolve(localizations);
    })
    .fail(function(error) {
      deferred.reject(error);
    });

  return deferred.promise;
};

/**
 * Export instance
 */

module.exports = new Set;

/**
 * Export constructor
 */

module.exports.Set = Set;
