
/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Q = require('q');
var mkdirp = require('mkdirp');
var _ = require('underscore');

/**
 * File
 *
 * @constructor
 */

function File() {
  this.linefeed = '\n';
  this.storageFolderExists = true;
}

/**
 * Write localizations.
 *
 * @param {Object} localizations
 * @param {Function} callback
 * @return {Promise}
 * @api private
 */

File.prototype.writeLocalizations = function(localizations) {
  var deferred = Q.defer();
  var localizations = this.localizationMapToArray(localizations);
  var count = 0;
  var endCount = _.size(project.languages);

  for(var language in project.languages) {
    this.writeLocalization(localizations, language)
      .then(function() {
        count++;
        if(count === endCount) {
          deferred.resolve();
        }
      })
      .fail(function(error) {
        deferred.reject(error);
      });
  }

  return deferred.promise;
};

/**
 * Sort object. We want to sort object before writing to disk.
 *
 * @param {Object} object
 * @return {Object}
 * @api private
 */

File.prototype._sortObject = function(object) {
  var keys = _.sortBy(_.keys(object), function(key) { return key; });
  var newMap = {};
  keys.forEach(function(key) {
    newMap[key] = object[key];
    if(key === 'files') {
      newMap[key].sort();
    }
  });

  return newMap;
};

/**
 * Write localization.
 *
 * @param {Object} localizations
 * @param {String} language
 * @return {Promise}
 * @api private
 */

File.prototype.writeLocalization = function(localizations, language) {
  var _this = this;
  var deferred = Q.defer();

  if(!this.storageFolderExists || !fs.existsSync(project.store)) {
    mkdirp.sync(project.store);
    this.storageFolderExists = true;
  }

  var p = project.store + '/' + language + '.json';
  fs.unlink(p, function(error) {
      if(error && error.code !== 'ENOENT') {
        return deferred.reject(error);
      }

      var localizationString = _this.linefeed;
      for(var index = 0; index < localizations[language].length; index++) {
        localizations[language][index] = _this._sortObject(localizations[language][index]);
      }
      localizationString = JSON.stringify(localizations[language], null, 2);
      fs.appendFile(p, localizationString, function(error) {
          if(error) {
            return deferred.reject(error);
          }

          deferred.resolve();
        });
    });

  return deferred.promise;
};

/**
 * Sort localization map to an localization array.
 *
 * @param {Object} localizations
 * @return {Object}
 * @api private
 */

File.prototype.localizationMapToArray = function(localizations) {
  var result = {};

  for(var language in project.languages) {
    result[language] = [];
    for(var key in localizations[language]) {
      result[language].push(localizations[language][key]);
    }

    var newKeys = [];
    var oldKeys = [];
    result[language].forEach(function(key) {
      if (key.new) newKeys.push(key);
      else oldKeys.push(key);
    });

    result[language] = oldKeys.concat(newKeys);
  }

  return result;
};

/**
 * Read localizations from disk. The promise returns a localization map
 * for other methods to consume.
 *
 * @param {String} language
 * @return {Promise}
 * @api public
 */

File.prototype.readLocalizations = function(language) {
  var _this = this;
  var deferred = Q.defer();
  var files = glob.sync(project.store + '/*.json');
  var localizations = {};
  var count = 0;
  var endCount = 0;
  var rejected = false;

  if(files.length === 0) {
    _.defer(function() {
      deferred.resolve({});
    });
  }

  files.forEach(function(file) {
    if(!(path.basename(file, '.json') in project.languages)) {
      return;
    }
    endCount++;
    _this.readLocalizationMap(file)
      .then(function(_localizations) {
        if(rejected) {
          return;
        }

        localizations[path.basename(file, '.json')] = _localizations;
        count++;
        if(count === endCount) {
          if(language) {
            if(typeof localizations[language] === 'undefined') {
              rejected = true;
              return deferred.reject(
                new TypeError('The file ' + language + '.json does not exists.'));
            }
            return deferred.resolve(localizations[language]);
          }
          return deferred.resolve(localizations);
        }
      })
      .fail(function(error) {
        if(rejected) {
          return;
        }

        deferred.reject(error);
        rejected = true;
      });
  });

  return deferred.promise;
};

/**
 * Read localization as an array from storage.
 *
 * @param {String} file
 * @return {Promise}
 * @resolves
 *
 *   [
 *     {
 *       key: 'key1',
 *       values: [],
 *       timestamp: 38734782834,
 *       ...
 *     },
 *     ...
 *   ]
 *
 * @api public
 */

File.prototype.readLocalizationArray = function(file) {
  var deferred = Q.defer();

  fs.readFile(file
    , { encoding : 'utf-8' }
    , function(error, content) {
      if(error) {
        return deferred.reject(error);
      }

      deferred.resolve(JSON.parse(content));
    });

  return deferred.promise;
};

/**
 * Read localization map from storage.
 *
 * @param {String} file
 * @return {Promise}
 * @resolves
 *
 *   {
 *     'key1': {
 *       key: 'key1',
 *       values: [],
 *       timestamp: 827387234324,
 *       ...
 *     },
 *     ...
 *   }
 *
 * @api public
 */

File.prototype.readLocalizationMap = function(file) {
  var deferred = Q.defer();
  var result = {};

  this.readLocalizationArray(file)
    .then(function(localizations) {
      for(var index in localizations) {
        result[localizations[index].key] = localizations[index];
      }
      deferred.resolve(result);
    })
    .fail(function(error) {
      deferred.reject(error);
    });

  return deferred.promise;
};

/**
 * Read latest search translations saved on disk.
 *
 * @return {Promise}
 * @api public
 */

File.prototype.readSearchLocalizations = function() {
  var deferred = Q.defer();

  fs.readFile(project.cache.search,
    { encoding : 'utf-8' },
    function(error, data) {
      if(error) {
        return deferred.reject(error);
      }

      try {
        var search = JSON.parse(data);
        deferred.resolve(search);
      }
      catch(error) {
        deferred.reject(error);
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
