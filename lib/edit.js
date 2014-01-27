
/**
 * Module dependencies
 */

var file = require('./file')
  , Q = require('q');

/**
 * Get translations execute edit functions for editing the current
 * translations. This constructor provides methods for editing
 * translations.
 *
 * @constructor Edit
 */

function Edit() {
  this.defaultLocale = cf.defaultLocale;
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
  this._getKey(ref)
  .then(function(key) {
    console.log(key);
  }, function(err) {

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
 * @return {String}
 * @api private
 */

Edit.prototype._getKeyFromLatestTranslations = function(ref) {
  var translations = file.readTranslations();
};

/**
 * Export instance
 */

module.exports = new Edit();

/**
 * Export constructor
 */

module.exports.Edit = Edit;
