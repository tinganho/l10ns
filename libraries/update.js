
/**
 * Module dependencies.
 */

var fs = require('fs');
var Q = require('q');
var parser = require('./parser');
var syntax = require('./syntax');
var _ = require('underscore');
var merger = require('./merger');
var readline = require('readline');
var file = require('./file');
var log = require('./_log');
var Hashids = require('hashids');
var hashids = new Hashids(program.LOCALIZATION_ID_HASH_SECRET, program.LOCALIZATION_ID_CHARACTER_LENGTH);

/**
 * Add terminal colors
 */

require('terminal-colors');

/**
 * Update
 *
 * @constructor
 */

function Update() {
  this.isWaitingUserInput = false;
  this.deletedKeys = [];
  this.addedKeys = [];
  this.migratedKeys = [];
  this.rl = null;
}

/**
 * Update keys
 *
 * @return {void}
 * @api public
 */

Update.prototype.run = function() {
  var _this = this;

  this.getNewLocalizations()
    .then(function(newLocalizations) {
      return _this._mergeWithOldLocalizations(newLocalizations);
    })
    .then(function(mergedLocalizations) {
      return file.writeLocalizations(mergedLocalizations)
    })
    .fail(function(error) {
      if(commands.stack && error) {
        console.log(error.stack);
      }

      log.error('Update failed: ' + error.message);
    });
};

/**
 * Strip inner functions calls. All function calls that is not from l10ns
 * needs to be removed. Because they can cause updating error
 * when they are defined inside variables like below
 *
 *    Example:
 *
 *      l('SOME_TRANSLATION_KEY', {
 *        prop1 : test() // Becomes ''
 *      });
 *
 * @param {string} content, file content
 * @api private
 */

Update.prototype._stripInnerFunctionCalls = function(content) {
  var getLocalizationStringFunctionSyntax = new RegExp(language.GET_LOCALIZATION_STRING_FUNCTION_NAME + '\\(', 'g')
    , getLocalizationStringUsingDataFunctionSyntax = new RegExp(language.GET_LOCALIZATION_STRING_USING_DATA_FUNCTION_NAME + '\\(', 'g');

  return content.replace(language.GET_LOCALIZATION_INNER_FUNCTION_CALL_SYNTAX, function(match, p1, p2) {
    getLocalizationStringUsingDataFunctionSyntax.lastIndex = 0;
    getLocalizationStringFunctionSyntax.lastIndex = 0;
    if(getLocalizationStringFunctionSyntax.test(match) || getLocalizationStringUsingDataFunctionSyntax.test(match)) {
      return match;
    }
    else {
      return '';
    }
  });
};

/**
 * Get translation function calls form source
 *
 * @return {Object} newLocalizations
 * @api private
 */

Update.prototype.getNewLocalizations = function() {
  var _this = this;
  var deferred = Q.defer();
  var now = parseInt(Date.now() / 1000, 10);
  var newLocalizations = {};
  var hashCount = 0;
  var fileCount = 0;
  var rejected = false;

  project.source.forEach(function(file) {
    if(fs.lstatSync(file).isDirectory()) {
      fileCount++;
      return;
    }

    fs.readFile(file, 'utf8', function(error, content) {
        fileCount++;

        if(rejected) {
          return;
        }

        if(error) {
          rejected = true;
          return deferred.reject(error);
        }

        content = _this._stripInnerFunctionCalls(content);
        // Match all l() calls
        var calls = (' ' + content).match(language.GET_LOCALIZATION_FUNCTION_CALL_SYNTAX);
        if(calls !== null) {
          calls.forEach(function(call) {
            var key  = parser.getKey(call)
              , variables = parser.getVariables(call);
            if(!(key in newLocalizations)) {
              newLocalizations[key] = {};
              newLocalizations[key].id = hashids.encrypt(now, hashCount);
              newLocalizations[key].key = key;
              newLocalizations[key].variables = variables;
              newLocalizations[key].files = [file];
              hashCount++;
            }
            else {
              if(syntax.hasErrorDuplicate(newLocalizations, key, variables)) {
                rejected = true;
                return deferred.reject(new TypeError('You have defined a localization key ('
                  + key + ') with different variables.\n In file:' + file));
              }
              if(newLocalizations[key].files.indexOf(file) === -1) {
                newLocalizations[key].files.push(file);
              }
            }
          });
        }

        if(fileCount === project.source.length && !rejected) {
          deferred.resolve(newLocalizations);
        }
      });

  });

  return deferred.promise;
};

/**
 * Merge new translations with old translations
 *
 * @param {Object} newLocalizations
 * @return {Promise}
 * @api private
 */

Update.prototype._mergeWithOldLocalizations = function(newLocalizations) {
  var _this = this;
  var deferred = Q.defer();

  file.readLocalizations()
    .then(function(oldLocalizations) {
      var newLocalizationsCopy = {};
      var now = (new Date).toISOString();
      var defaultIds = {};

      for(var key in oldLocalizations[project.defaultLanguage]) {
        defaultIds[key] = oldLocalizations[project.defaultLanguage][key].id;
      }

      for(var language in project.languages) {
        newLocalizationsCopy[language] = JSON.parse(JSON.stringify(newLocalizations));
        for(var key in newLocalizationsCopy[language]) {
          if(typeof oldLocalizations[language] !== 'undefined'
          && typeof oldLocalizations[language][key] !== 'undefined') {
            var _new = newLocalizationsCopy[language]
              , old  = oldLocalizations[language];
            // Assign translation
            newLocalizationsCopy[language] = merger.mergeLocalizations(_new, old, key);
            // Set timestamp
            newLocalizationsCopy[language] = merger.mergeTimeStamp(_new, old, key);
            // Assign id
            newLocalizationsCopy[language] = merger.mergeId(_new, defaultIds, key);
          }
          else {
            newLocalizationsCopy[language][key].new = true;
            newLocalizationsCopy[language][key].value = '';
            newLocalizationsCopy[language][key].timestamp = now;
            if(key in defaultIds) {
              newLocalizationsCopy[language][key].id = defaultIds[key];
            }

            if(language === project.defaultLanguage) {
              console.log('[added]'.green + ' ' + key);
            }
          }
        }
      }

      var deletedKeys = [];
      outer: for (var lang in oldLocalizations) {
        for (var key in oldLocalizations[lang]) {
          if (!newLocalizationsCopy[lang]) {
            console.log('[deleted language]'.red + ' ' + lang);
            continue outer;
          }
          if (!newLocalizationsCopy[lang][key] && deletedKeys.indexOf(key) === -1) {
            console.log('[deleted]'.red + ' ' + key);
            deletedKeys.push(key);
            continue outer;
          }
        }
      }

      _this._mergeUserInputs(newLocalizationsCopy, oldLocalizations, function(error, mergedLocalizations) {
        if(!error) {
          return deferred.resolve(mergedLocalizations);
        }
        if(error.error === 'SIGINT') {
          return deferred.resolve(oldLocalizations);
        }

        deferred.reject(error);
      });

    })
    .fail(function(error) {
      deferred.reject(error);
    });

  return deferred.promise;
};

/**
 * Get deleted translations. This method returns deleted translations
 * by looking at the source updated translations (newLocalizations)
 * and the current stored translations (oldLocalizations)
 *
 * @param {Object} newLocalizations
 * @param {Object} oldLocalizations
 * @return deletedTranslations {Object}
 *
 *   Returns:
 *     {
 *       TRANSLATION_KEY1 : {
 *          LOCALE1 : {
 *
 *          },
 *          LOCALE2 : {
 *
 *          },
 *          ...
 *          timestamp : TIMESTAMP,
 *          files : [FILE1, FILE2, ...]
 *       },
 *       TRANSLATION_KEY2 : {
 *          LOCALE1 : {
 *
 *          },
 *          LOCALE2 : {
 *
 *          },
 *          ...
 *          timestamp : TIMESTAMP,
 *          files : [FILE1, FILE2, ...]
 *       },
 *       ...
 *     }
 *
 * @api private
 */

Update.prototype._getDeletedLocalizations = function(newLocalizations, oldLocalizations) {
  var now = (new Date).toISOString(), deletedTranslations = {};
  for(var language in project.languages) {
    for(var key in oldLocalizations[language]) {
      if(!(key in newLocalizations[language])) {
        if(!(key in deletedTranslations)){
          deletedTranslations[key] = {};
        }
        deletedTranslations[key][language] = oldLocalizations[language][key];
        deletedTranslations[key].timestamp = now;
        deletedTranslations[key].files = oldLocalizations[language][key].files;
      }
    }
  }

  return deletedTranslations;
};

/**
 * Get newly added translation key files. If a key have been added
 * to source that never been added before. You can get
 * the path to the file/files where the key is used. This method
 * is useful during translation key update. Because we can
 * check which other keys is existing in that newly added key's file.
 * So smart updating of keys without losing stored values can be achieved.
 *
 * @param {Object} newLocalizations
 * @param {Object} oldLocalizations
 * @return {Object} files
 *
 *   Returns:
 *      {
 *        'FILE1' : [TRANSLATION_KEY1, TRANSLATION_KEY2, ...],
 *        'FILE2' : [TRANSLATION_KEY1, TRANSLATION_KEY2, ...],
 *        ...
 *      }
 *
 * @api private
 */

Update.prototype._getUpdatedFiles = function(newLocalizations, oldLocalizations) {
  var files = {};

  for(var key in newLocalizations[project.defaultLanguage]) {
    if(!(key in oldLocalizations[project.defaultLanguage])) {
      var translationFiles = newLocalizations[project.defaultLanguage][key].files;
      for(var file in translationFiles) {
        if(!(translationFiles[file] in files)) {
          files[translationFiles[file]] = [key];
        }
        else if(!_.contains(files[translationFiles[file]], key)) {
          files[translationFiles[file]].push(key);
        }
      }
    }
  }

  return files;
};

/**
 * Merge user inputs. It will only ask for user inputs if any of the deleted translation's
 * files paths exists on the updated translation's file paths.
 *
 * @param {Object} newLocalizations
 * @param {Object} oldLocalizations
 * @param {Function} callback
 * @return {void}
 * @api private
 */

Update.prototype._mergeUserInputs = function(newLocalizations, oldLocalizations, callback) {
  var deletedTranslations = this._getDeletedLocalizations(newLocalizations, oldLocalizations);
  if(_.size(deletedTranslations) === 0) {
    return callback(null, newLocalizations);
  } else if( (process.argv.length <= 3) || (process.argv[3] !== '--deleteUnused') ) {
    _.each(deletedTranslations, function(el, key, obj){
      _.each(project.languages, function(language, langCode){
        if ((langCode in newLocalizations) && !(key in newLocalizations[langCode])) {
          if ((langCode in el) && el[langCode]) {
            newLocalizations[langCode][key] = el[langCode];
          }
        }
      });
    });
    return callback(null, newLocalizations);
  }

  var updatedFiles = this._getUpdatedFiles(newLocalizations, oldLocalizations);

  // Push to user input stream
  for(var key in deletedTranslations) {
    for(var index in deletedTranslations[key].files) {
      if(!updatedFiles.hasOwnProperty(deletedTranslations[key].files[index])) {
        continue;
      }
      // Add deleted key and added keys for the file
      this._pushToUserInputStream(key, updatedFiles[deletedTranslations[key].files[index]]);
    }
  }

  this._executeUserInputStream(newLocalizations, oldLocalizations, function(err, _newLocalizations) {
    if(!err) {
      return callback(null, _newLocalizations);
    }
    callback(err);
  });
};

/**
 * Push to user input stream. addedKeys are keys added for a specific files
 * that is in the same file as deletedKey.
 *
 * @param {String} deletedKey
 * @param {Array} addedKeys
 * @return {void}
 * @api private
 */

Update.prototype._pushToUserInputStream = function(deletedKey, addedKeys) {
  this.deletedKeys.push(deletedKey);
  this.addedKeys.push(addedKeys);
};

/**
 * Execute user input stream
 *
 * @param {Object} newLocalizations
 * @param {Object} oldLocalizations
 * @param {Function} callback
 * @return {void}
 * @api private
 */

Update.prototype._executeUserInputStream = function(newLocalizations, oldLocalizations, callback) {
  var _this = this;

  if(this.deletedKeys.length === 0
  || this.addedKeys.length === 0) {
    return callback(null, newLocalizations);
  }

  // Error handling
  if(this.deletedKeys.length !== this.addedKeys.length) {
    throw new TypeError('Deleted keys must have same array length as added keys length');
  }

  var hasError = false;

  function recurse() {
    var deletedKey = _this.deletedKeys.shift();

    var addedKeys  = _.difference(_this.addedKeys.shift(), _this.migratedKeys);
    _this._getUserInputKey(deletedKey, addedKeys, function(err, newKey, oldKey) {
      if(err) {
        hasError = true;
        return callback(err);
      }
      if(newKey === 'DELETE' && _this.deletedKeys.length !== 0) {
        return recurse();
      }
      else if(newKey === 'DELETE') {
        if(_this.rl) _this.rl.close();
        return callback(null, newLocalizations);
      }
      newLocalizations = _this._migrateLocalization(newKey, oldKey, newLocalizations, oldLocalizations);
      if(_this.deletedKeys.length !== 0) {
        return recurse();
      }
      else {
        _this.rl.close();
        callback(null, newLocalizations);
      }
    });
  }

  recurse();

};

/**
 * Set old translation on the new translation object on a specfic key
 *
 * @param {String} newKey
 * @param {String} oldKey
 * @param {Object} newTranslation
 * @param {Object} oldTranslation
 * @return {Object} newTranslation
 * @api private
 */

Update.prototype._migrateLocalization = function(newKey, oldKey, newLocalizations, oldLocalizations) {
  for(var language in project.languages) {
    newLocalizations[language][newKey] = oldLocalizations[language][oldKey];
    newLocalizations[language][newKey].key = newKey;
  }
  return newLocalizations;
};

/**
 * Get user input update actions.
 *
 * @param {String} deletedKey
 * @param {Array.<String>} addedKeys
 * @param {Function(err, migrationKey, deletedKey)} callback
 * @return {void}
 * @api private
 */

Update.prototype._getUserInputKey = function(deletedKey, addedKeys, callback) {
  var _this = this;

  if(!addedKeys.length) {
    return callback(null, 'DELETE');
  }

  if(!this.rl) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal : false
    });
  }

  var n = 1, _addedKeys = [];

  var question =
    'The key "' + deletedKey + '" is now gone in source.\n'
    + 'What do you want to do with it?\n';

  var options = '[', optionsEndWrap = 'd]';
  for(var key in addedKeys) {
    question += ('[' + n + ']').lightBlue + ' - migrate to "' + addedKeys[key].yellow + '"\n';
    _addedKeys.push(addedKeys[key]);
    options += n + ',';
    n++;
  }

  // Add delete option
  question += '[d]'.lightBlue + ' - ' + 'delete'.red + '\n';
  question += (options + optionsEndWrap).lightBlue + ' (d)? ';

  this.rl.question(question, function(option) {
    if(/^\d+$/.test(option)
    && +option <= _addedKeys.length
    && +option > 0) {
      var migrationKey = _addedKeys[option - 1];
      _this.migratedKeys.push(migrationKey);
      callback(null, migrationKey, deletedKey);
    }
    else {
      callback(null, 'DELETE');
    }
  });

  this.rl.on('SIGINT', function() {
    callback({ error: 'SIGINT'});
    _this.rl.close();
  });
};

/**
 * Export instance
 */

module.exports = new Update();

/**
 * Export constructor
 */

module.exports.Update = Update;
