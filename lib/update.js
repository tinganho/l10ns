
/**
 * Module dependencies.
 */

var fs           = require('fs')
  , path         = require('path')
  , parser       = require('./parser')
  , translations = require('./translations')
  , colors       = require('colors')
  , syntax       = require('./syntax')
  , _            = require('underscore')
  , merger       = require('./merger')
  , readline     = require('readline');

function Update() {
  this.functionCallRegex = lcf.FUNCTION_CALL_REGEX;
  this.isWaitingUserInput = false;
  this.deletedKeys = [];
  this.addedKeys = [];
  this.migratedKeys = [];
  // readline interface
  this.rl;
}

/**
 * Update keys
 */

Update.prototype.update = function() {
  var _this = this;
  var newTranslations = this.getNewTranslations()
  this.mergeOldTranslations(newTranslations, function(err, _newTranslations) {
    if(!err) {
      return _this.writeToFiles(_newTranslations);
    }
    console.error('Translation update failed');
  });
};

/**
 * Strip inner functions calls. All function calls that is not gt()
 * needs to be removed. Because they can cause updating error
 * when they are defined inside vars like below
 *
 *    Example:
 *
 *      gt('SOME_TRANSLATION_KEY', {
 *        prop1 : test() // Becomes ''
 *      });
 *
 * @param {String} content, file content
 */

Update.prototype.stripInnerFunctionCalls = function(content) {
  return content.replace(lcf.INNER_FUNCTION_CALL_REGEX, function(m) {
    if(/gt\(/g.test(m)) {
      return m;
    } else {
      return '';
    }
  });
};

/**
 * Logs duplicate error message and output
 *
 * @param {String} key
 * @param {String} file
 */

Update.prototype.logDuplicateErrorMessage = function(key, file) {
  console.log('>>'.red + ' You have defined same translation key (' + key + ') with different vars.\n');
  console.log('In ' + file);
};

/**
 * Get translation function calls form source
 *
 * @return newTranslations {Object}
 */

Update.prototype.getNewTranslations = function() {
  var _this = this, newTranslations = {};
  cf.src.forEach(function(file) {
    var content = _this.stripInnerFunctionCalls(fs.readFileSync(file, 'utf8'));
    // Match all gt() calls
    var calls = content.match(_this.functionCallRegex);
    if(calls !== null) {
      calls.forEach(function(call){
        var key  = parser.getKey(call)
          , vars = parser.getVars(call);
        if(!(key in newTranslations)) {
          newTranslations[key] = {};
          newTranslations[key].vars = vars;
          newTranslations[key].files = [file];
        } else {
          if(syntax.hasErrorDuplicate(newTranslations, key, vars)) {
            _this.logDuplicateErrorMessage(key, file);
          }
          newTranslations[key].files.push(file);
        }
      });
    }
  });

  return newTranslations;
};

/**
 * Merge new translations with old translations
 *
 * @param newTranslations {Object}
 *
 * @return newTranslations {Object}
 */

Update.prototype.mergeOldTranslations = function(newTranslations, callback) {

  var oldTranslations  = translations.getAllTranslations()
    , _newTranslations = {}
    , now              = Date.now();

  for(var locale in cf.locales) {
    _newTranslations[locale] = JSON.parse(JSON.stringify(newTranslations));
    for(var key in _newTranslations[locale]) {
      if(typeof oldTranslations[locale] !== 'undefined') {
        var _new = _newTranslations[locale]
          , old  = oldTranslations[locale];
        // Assign translation
        _newTranslations[locale] = merger.mergeTranslations(_new, old, key);
        // Set timestamp
        _newTranslations[locale] = merger.mergeTimeStamp(_new, old, key);
        // Assign id
        _newTranslations[locale] = merger.mergeId(_new, old, key);
      }
      else {
        _newTranslations[locale][key].translations = [];
        _newTranslations[locale][key].timestamp = now;
      }
    }
  }

  this.mergeUserInputs(_newTranslations, oldTranslations, function(err, __newTranslations) {
    if(!err) {
      return callback(null, __newTranslations);
    }
    if(err.error === 'SIGINT') {
      return callback(null, oldTranslations);
    }
    callback(err);
  });
};

/**
 * Get deleted translations. This method returns deleted translations
 * by looking at the source updated translations (newTranslations)
 * and the current stored translations (oldTranslations)
 *
 * @param newTranslations {Object}
 * @param oldTranslations {Object}
 *
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
 *       ...
 *     }
 */

Update.prototype.getDeletedTranslations = function(newTranslations, oldTranslations) {
  var now = Date.now(), deletedTranslations = {};
  for(var locale in cf.locales) {
    for(var key in oldTranslations[locale]) {
      if(!(key in newTranslations[locale])) {
        if(!(key in deletedTranslations)){
          deletedTranslations[key] = {};
        }
        if('translations' in oldTranslations[locale][key]) {
          deletedTranslations[key][locale] = oldTranslations[locale][key];
        } else {
          deletedTranslations[key][locale] = [];
        }
        deletedTranslations[key].timestamp = now;
        deletedTranslations[key].files = oldTranslations[locale][key].files;
      }
    }
  }

  return deletedTranslations;
};

/**
 * Get newly added translation key files. If a key have been added
 * to to source that never been added before. You can get
 * the path to the file/files where the key is used. This method
 * is useful during translation key update. Because we can
 * check which other keys is existing in that newly added key's file.
 * So smart updating of keys without losing stored values can be achieved.
 *
 * @param newTranslations {Object}
 * @param oldTranslations {Object}
 * @return files {Object}
 *
 *   Returns:
 *      {
 *        'FILE1' : [TRANSLATION_KEY1, TRANSLATION_KEY2, ...],
 *        'FILE2' : [TRANSLATION_KEY1, TRANSLATION_KEY2, ...],
 *        ...
 *      }
 *
 * @private
 */

Update.prototype.getUpdatedFiles = function(newTranslations, oldTranslations) {
  var files = {};
  for(var key in newTranslations[cf.defaultLocale]) {
    if(!(key in oldTranslations[cf.defaultLocale])) {
      var translationFiles = newTranslations[cf.defaultLocale][key].files;
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
 * Merge user inputs.
 *
 * @param newTranslations {Object}
 * @param oldTranslations {Object}
 */

Update.prototype.mergeUserInputs = function(newTranslations, oldTranslations, callback) {
  var _this = this;
  var deletedTranslations = this.getDeletedTranslations(newTranslations, oldTranslations);
  if(_.size(deletedTranslations) === 0) {
    return callback(null, newTranslations);
  }

  var updatedFiles = this.getUpdatedFiles(newTranslations, oldTranslations);
  for(var key in deletedTranslations) {
    for(var file in deletedTranslations[key].files) {
      if(!_.has(updatedFiles, deletedTranslations[key].files[file])) {
        continue;
      }
      this.pushToUserInputStream(key, updatedFiles[deletedTranslations[key].files[file]]);
    }
  }

  this.executeUserInputStream(newTranslations, oldTranslations, function(err, _newTranslations) {
    if(!err) {
      return callback(null, _newTranslations);
    }
    callback(err);
  });
};

/**
 * Push to user input stream.
 *
 * @param deletedKey {String}
 * @param addedKeys {Array}
 */

Update.prototype.pushToUserInputStream = function(deletedKey, addedKeys) {
  if(typeof deletedKey !== 'string') {
    throw new TypeError('Frist parameter must be a string');
  }
  if(!_.isArray(addedKeys)) {
    throw new TypeError('Second parameter must be an array, containing translation keys');
  }
  this.deletedKeys.push(deletedKey);
  this.addedKeys.push(addedKeys);
};

/**
 * Execute user inpute stream
 */

Update.prototype.executeUserInputStream = function(newTranslations, oldTranslations, callback) {
  var _this = this;
  if(this.deletedKeys.length === 0
  && this.addedKeys.length === 0) {
    throw new TypeError('You must push deleted keys and added keys in order to get user inputs');
  }
  if(this.deletedKeys.length !== this.addedKeys.length) {
    throw new TypeError('Deleted keys must have same array length as added keys length');
  }
  var callbacks = 0, hasError = false;

  function recurse() {
    var deletedKey = _this.deletedKeys.shift();
    var addedKeys  = _.difference(_this.addedKeys.shift(), _this.migratedKeys);
    _this.getUserInputKey(deletedKey, addedKeys, function(err, newKey, oldKey) {
      if(err) {
        hasError = true;
        return callback(err);
      }
      if(newKey === 'DELETE' && _this.deletedKeys.length !== 0) {
        return recurse();
      }
      else if(newKey === 'DELETE') {
        _this.rl.close();
        callback(null, newTranslations);
      }
      newTranslations = _this.setOldTranslation(newKey, oldKey, newTranslations, oldTranslations);
      if(_this.deletedKeys.length !== 0) {
        return recurse();
      }
      else {
        _this.rl.close();
        callback(null, newTranslations);
      }
    });
  }

  recurse();

};

/**
 * Set old translation on a specfic key
 *
 * @param key {String}
 * @param newTranslation {Object}
 * @param oldTranslation {Object}
 *
 * @return newTranslation {Object}
 */
Update.prototype.setOldTranslation = function(newKey, oldKey, newTranslations, oldTranslations) {
  for(var locale in cf.locales) {
    newTranslations[locale][newKey] = oldTranslations[locale][oldKey];
  }
  return newTranslations;
};

/**
 * Get user input update actions.
 *
 * @param files {Array}
 * @private
 */

Update.prototype.getUserInputKey = function(deletedKey, addedKeys, callback) {
  var _this = this;

  if(!this.rl) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  var n = 1, _addedKeys = [];

  var question =
    'The key "' + deletedKey + '" is now gone in source\n'
    + 'What do you want to do with it?\n';

  for(var key in addedKeys) {
    question += ('[' + n + ']').cyan + ' - migrate to "' + addedKeys[key].yellow + '"\n';
    _addedKeys.push(addedKeys[key]);
    n++;
  }
  // Add delete option
  question += '[d]'.cyan + ' - ' + 'delete'.red + '\n\n';

  // Address new line problem with three or more options
  if(addedKeys.length > 1) {
    question += '\n';
  }

  this.rl.question(question, function(option) {
    if(/^\d+$/.test(option)
    && +option < _addedKeys.length
    && +option > 0) {
      var migrationKey = _addedKeys[option - 1];
      _this.migratedKeys.push(migrationKey)
      callback(null, migrationKey, deletedKey);
    }
    else if(option === 'd') {
      callback(null, 'DELETE');
    }
  });

  this.rl.on('SIGINT', function() {
    callback({ error: 'SIGINT'});
    _this.rl.close();
  });
};

/**
 * Write new translations to files.
 *
 * @param newTranslations {Object}
 * @param callback {Function}
 */

Update.prototype.writeToFiles = function(newTranslations, callback) {
  if(!fs.existsSync(cf.localesFolder)) {
    fs.mkdirSync(cf.localesFolder);
  }
  for(var loc in cf.locales) {
    var p = cf.localesFolder + '/' + loc + '.json';
    if(fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
    fs.writeFile(p, JSON.stringify(newTranslations[loc], null, 2), function() {
      if(typeof callback === 'function') {
        callback();
      }
    });
  }
};

module.exports = function() {
  var update = new Update;
  update.update();
};
