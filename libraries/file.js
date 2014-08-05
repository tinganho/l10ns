
/**
 * Module dependencies
 */

var fs = require('fs')
  , path = require('path')
  , glob = require('glob')
  , Q = require('q')
  , mkdirp = require('mkdirp')
  , _ = require('underscore');

/**
 * File
 *
 * @constructor
 */

function File() {
  this.linefeed = '\n';
  this.outputFolderExists = true;
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
  var deferred = Q.defer()
    , localizations = this.localizationMaptoArray(localizations)
    , count = 0
    , endCount = _.size(project.locales);

  for(var locale in project.locales) {
    this.writeLocalization(localizations, locale)
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
 * Write localization.
 *
 * @param {Object} localizations
 * @param {String} locale
 * @return {Promise}
 * @api private
 */

File.prototype.writeLocalization = function(localizations, locale) {
  var _this = this
    , deferred = Q.defer();

  if(!this.outputFolderExists || !fs.existsSync(project.store)) {
    mkdirp.sync(project.store);
    this.outputFolderExists = true;
  }

  var p = project.store + '/' + locale + '.locale';
  fs.unlink(p, function(error) {
      if(error && error.code !== 'ENOENT') {
        return deferred.reject(error);
      }

      var localizationString = '';

      for(var index = 0; index < localizations[locale].length; index++) {
        localizationString += JSON.stringify(localizations[locale][index]) + _this.linefeed;
      }
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

  for(var locale in project.locales) {
    result[locale] = [];
    for(var key in localizations[locale]) {
      result[locale].push(localizations[locale][key]);
    }

    result[locale] = result[locale].sort(function(a, b) {
        if(b.timestamp > a.timestamp) {
          return 1;
        }
        else if(b.timestamp < a.timestamp) {
          return -1;
        }
        else if(a.key > b.key) {
          return 1;
        }
        else if(a.key < b.key) {
          return -1;
        }
        else {
          return 0;
        }
      });
  }

  return result;
};

/**
 * Read localizations from disk. The promise returns a localization map
 * for other methods to consume.
 *
 * @param {String} locale
 * @return {Promise}
 * @api public
 */

File.prototype.readLocalizations = function(locale) {
  var _this = this
    , deferred = Q.defer()
    , files = glob.sync(project.store + '/*.locale')
    , localizations = {}
    , count = 0
    , endCount = files.length
    , rejected = false;

  if(files.length === 0) {
    _.defer(function() {
      deferred.resolve({});
    });
  }

  files.forEach(function(file) {
    _this.readLocalizationMap(file)
      .then(function(_localizations) {
        if(rejected) {
          return;
        }

        localizations[path.basename(file, '.locale')] = _localizations;
        count++;
        if(count === endCount) {
          if(locale) {
            if(typeof localizations[locale] === 'undefined') {
              rejected = true;
              return deferred.reject(
                new TypeError('The file ' + locale + '.locale does not exists.'));
            }
            return deferred.resolve(localizations[locale]);
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

      deferred.resolve(JSON.parse('[' + content.replace(/\}\n+\{/g, '},{') + ']'));
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
  var deferred = Q.defer(), result = {};

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

