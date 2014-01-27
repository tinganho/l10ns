
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

function Edit() {
  this.defaultLocale = cf.defaultLocale;
  this.locales = cf.locales;
}

/**
 * Edit current translations
 *
 * @param {String} ref
 * @param {String} value
 * @param {String} locale
 * @return {void}
 * @api public
 */

Edit.prototype.edit = function(ref, value, locale) {
  var _this = this;

  if(typeof ref !== 'string') {
    return log.error('ref must be of type string');
  }
  if(typeof value !== 'string') {
    return log.error('value must be of type string');
  }
  if(!(locale in this.locales)) {
    return log.error('locale is not defined');
  }

  this._getKey(ref)
  .then(function(key) {
    var translations = _this._replace(key, value, locale);
    file.writeTranslations(translations, function() {
      log.success('Edited key: `' + key + '` successfully!');
    });
  }, function(err) {
    log.error('Couldn\'t edit your translations');
  });
};

/**
 * Get key
 *
 * @param {String} ref
 * @return {Promise}
 * @api public
 */

Edit.prototype._getKey = function(ref) {
  var deferred = Q.defer();

  if(typeof ref !== 'string') {
    deferred.reject(new TypeError('first parameter is not of type string'));
    return deferred.promise;
  }

  var key = ref;
  if(/^\-\d+$/.test(ref)) {
    this._getKeyFromLatestTranslations(parseInt(ref, 10))
    .then(function(key) {
      deferred.resolve(key);
    })
    .fail(function(err) {
      deferred.reject(err);
    });
  }
  else if(/^@\d+$/.test(ref)) {
    var ref = /^@(\d+)$/.exec(ref)[1];
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
 * @param {Number|(number castable)String} ref
 * @return {Promise}
 * @api private
 */

Edit.prototype._getKeyFromLatestSearch = function(ref) {
  var deferred = Q.defer();

  var ref = parseInt(ref, 10);

  if(isNaN(ref)) {
    deferred.reject(new TypeError('first parameter is not a number nor a number castable string'));
    return deferred.promise;
  }

  // Decrease ref with one;
  ref--;

  if(ref < 0) {
    deferred.reject(new TypeError('ref is out of index'));
    return deferred.promise;
  }

  file.readSearchTranslations()
  .then(function(data) {
    if(ref > data.length - 1) {
      return deferred.reject(new TypeError('ref is out of index'));
    }
    deferred.resolve(data[ref].ref)
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

Edit.prototype._getKeyFromLatestTranslations = function(ref) {
  var deferred = Q.defer();

  ref = Math.abs(ref) - 1;

  var translations = file.readTranslations(null, { returnType : 'array' });

  if(ref < 0 || ref > translations.length - 1) {
    deferred.reject(new TypeError('ref is out of index'));
    return deferred.promise;
  }

  try {
    deferred.resolve(translations[ref].key);
  }
  catch(err) {
    deferred.reject(err);
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

Edit.prototype._replace = function(key, value, locale) {
  locale = locale || this.defaultLocale;

  var translations = file.readTranslations();

  if(!(locale in translations)) {
    log.error('Locale: ' + locale + ' is not in current translations');
    process.exit();
  }
  if(!(key in translations)) {
    log.error('Key: ' + key + ' is not in current translations');
    process.exit();
  }

  // Save value
  translations[locale][key] = value;

  return translations;
};

/**
 * Export instance
 */

module.exports = new Edit;

/**
 * Export constructor
 */

module.exports.Edit = Edit;
