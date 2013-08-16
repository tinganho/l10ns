
/**
 * Module dependencies.
 */

var fs           = require('fs')
  , path         = require('path')
  , parser       = require('./parser')
  , translations = require('./translations')
  , colors       = require('colors')
  , crypto       = require('crypto')
  , os           = require('os')
  , syntax       = require('./syntax')
  , _            = require('underscore')
  , program      = require('commander')
  , Hashids      = require('hashids')
  , hashids      = new Hashids(pcf.TRANSLATION_ID_HASH_SECRET, pcf.TRANSLATION_ID_CHAR_LENGTH);


function Update() {
  this.functionCallRegex = /gt\(['|"](.*)['|"]\s*(\,\s*\{\s*((.*?)|(\s*?))+?\s*\})??\s*\)/g;
}

Update.prototype.update = function() {
  var calls = this.getTranslationFunctionCalls()
    , newTranslations = this.mergeWithCurrentTranslations(calls);

  newTranslations = this.mergeWithUpdatedKeys(newTranslations);
  this.write(newTranslations);
};

/**
 * Normalize file content. All function calls that is not gt()
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

Update.prototype.normalizeFileContent = function(content) {
  return content.replace(/\s+(?!gt)[.|\w]+?\((.*?\s*?)*?\)/g, function(m) {
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
 */

Update.prototype.getTranslationFunctionCalls = function() {
  var _this = this, res = {};
  cf.src.forEach(function(file) {
    var content = _this.normalizeFileContent(fs.readFileSync(file, 'utf8'));
    // Match all gt() calls
    var calls = content.match(_this.functionCallRegex);
    if(calls !== null) {
      calls.forEach(function(call){
        var key  = parser.getKey(call)
          , vars = parser.getVars(call);
        if(!(key in res)) {
          res[key] = {};
          res[key].vars = vars;
          res[key].file = file;
        } else {
          if(syntax.hasErrorDuplicate(res, key, vars)) {
            _this.logDuplicateErrorMessage(key, file);
          }
          res[key].file = ', ' + file;
        }
      });
    }
  });

  return res;
};

Update.prototype.mergeWithCurrentTranslations = function(calls) {
  var now             = (new Date).getTime()
    , _now            = parseInt(now / 1000, 10)
    , oldTranslations = translations.getAllTranslations()
    , newTranslations = {};

  for(var locale in cf.locales) {
    newTranslations[locale] = JSON.parse(JSON.stringify(calls));
    var x = 0;
    for(var key in newTranslations[locale]) {
      if(typeof oldTranslations[locale] !== 'undefined') {
        // Assign translation
        if(key in oldTranslations[locale] && 'translations' in oldTranslations[locale][key]) {
          newTranslations[locale][key].translations = oldTranslations[locale][key].translations;
          newTranslations[locale][key].queryTranslation = key;
        }
        else {
          newTranslations[locale][key].translations = [];
          newTranslations[locale][key].queryTranslation = key;
        }

        // Assign timestamp
        if(key in oldTranslations[locale] && 'timestamp' in oldTranslations[locale][key]) {
          newTranslations[locale][key].timestamp = oldTranslations[locale][key].timestamp;
        }
        else {
          newTranslations[locale][key].timestamp = now;
        }

        // Assign id
        if(key in oldTranslations[locale] && 'id' in oldTranslations[locale][key]) {
          if(oldTranslations[locale][key].id.length > 15) {
            newTranslations[locale][key].id = hashids.encrypt(_now, x);
          }
          else {
            newTranslations[locale][key].id = oldTranslations[locale][key].id;
          }
        }
        else {
          newTranslations[locale][key]._new = true;
          newTranslations[locale][key].id = hashids.encrypt(_now, x);
        }
      }
      else {
        newTranslations[locale][key].translations = [];
        newTranslations[locale][key].timestamp = now;
      }
      x++;
    }
  }

  return newTranslations;
};

Update.prototype.mergeWithUpdatedKeys = function(newTranslations) {
  var oldTranslations      = translations.getAllTranslations()
    , deletedTranslations  = {}
    , now                  = (new Date).getTime()
    , deletedTranslationFileReferences = []
    , newTranslationFileReferences     = {};

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
        deletedTranslations[key].file = oldTranslations[locale][key].file;
        if(!_.contains(deletedTranslationFileReferences, oldTranslations[locale][key].file)) {
          deletedTranslationFileReferences.push(oldTranslations[locale][key].file);
        }
      }
    }
  }

  if(_.size(deletedTranslations) === 0) {
    return newTranslations;
  }

  for(var key in newTranslations[cf.defaultLocale]) {
    if(!(key in oldTranslations[cf.defaultLocale])) {
      if(_.contains(newTranslationFileReferences[newTranslations[cf.defaultLocale][key].file], newTranslations[cf.defaultLocale][key].file)) {
        newTranslationFileReferences[newTranslations[cf.defaultLocale][key].file].push(key);
      }
      else {
        newTranslationFileReferences[newTranslations[cf.defaultLocale][key].file] = [key];
      }
    }
  }

  for(key in deletedTranslations) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdout.write('The key "' + key + '" is now gone in source\n');
    process.stdout.write('What do you want to do with it?\n');
    var n = 1, options = '['.blue , deleteOption = 'd]?'.blue + '\n';
    for(var newKey in newTranslationFileReferences[deletedTranslations[key].file]) {
      process.stdout.write(('[' + n + ']').cyan + ' - merge with "' + newTranslationFileReferences[deletedTranslations[key].file][newKey].yellow + '"\n');
      options += (n + ',').cyan
      n++;
    }
    process.stdout.write(options + deleteOption);
    process.stdin.on('data', function(chunk) {
      process.stdout.write('data: ' + chunk);
      process.exit();
    });
  }

  return newTranslations;
};

Update.prototype.write = function(newTranslations) {
  if(!fs.existsSync(cf.localesFolder)) {
    fs.mkdirSync(cf.localesFolder);
  }
  for(var loc in cf.locales) {
    var p = cf.localesFolder + '/' + loc + '.json';
    if(fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
    fs.writeFileSync(p, JSON.stringify(newTranslations[loc], null, 2));
  }
};

Update.prototype.writeDeleteLog = function(deletedTranslations) {
  var deleteLog;
  if(fs.existsSync(cf.deleteLog)) {
    try {
      deleteLog = require(cf.deleteLog);
    } catch(e) {
      deleteLog = {};
    }
  } else {
    deleteLog = {};
  }
  deleteLog = _.extend(deleteLog, deletedTranslations);
  if(fs.existsSync(cf.deleteLog)) {
    fs.unlinkSync(cf.deleteLog);
  }
  fs.writeFileSync(cf.deleteLog, JSON.stringify(deletedTranslations, null, 2));
};

module.exports = function() {
  var update = new Update;
  update.update();
};


/**
module.exports = function() {

  var machineHash = getHash();

  var res = {};
  // get all locales
  var allTranslations = config.getAllTranslations(),
      deletedTranslations = {};

  var files = grunt.file.expand({ filter: 'isFile' }, cf.src);
  files.forEach(function(file){
    var content = grunt.file.read(file);

    content = content.replace(/\s+(?!gt)[.|\w]+?\((.*?\s*?)*?\)/g, function(m) {
      if(/gt\(/g.test(m)) {
        return m;
      } else {
        return '';
      }
    });


    // Match all gt()
    var regex = /gt\(['|"](.*)['|"]\s*(\,\s*\{\s*((.*?)|(\s*?))+?\s*\})??\s*\)/g;
    var translations = content.match(regex);

    if(translations !== null) {
      translations.forEach(function(translation){
        var key = config.getTranslationKey(translation);
        var vars = config.getVars(translation);
        if(!(key in res)) {
          res[key] = {};
          res[key].vars = vars;
        } else {
          config.hasErrorDuplicate(res, key, vars);
        }
      });
    }
  });
  var now = (new Date()).getTime();
  var locales = config.getAllLocales(true);
  locales.forEach(function(locale) {
    var x = 0;
    (function(locale){
      var newLocal = res;
      Object.keys(newLocal).forEach(function(key) {
        if(typeof allTranslations[locale] !== 'undefined') {
          if(key in allTranslations[locale] && 'translations' in allTranslations[locale][key]) {
            newLocal[key].translations = allTranslations[locale][key].translations;
            newLocal[key].query_translation = allTranslations[locale][key].translations;
          } else {
            newLocal[key].translations = [];
          }

          // Assign timestamp
          newLocal[key].query_translation = key;
          if(key in allTranslations[locale] && 'timestamp' in allTranslations[locale][key]) {
            newLocal[key].timestamp = allTranslations[locale][key].timestamp;
          } else {
            newLocal[key].timestamp = now;
          }

          // Assign id
          if(key in allTranslations[locale] && 'id' in allTranslations[locale][key]) {
            newLocal[key].id = allTranslations[locale][key].id;
          } else {
            newLocal[key].id = crypto.createHash('md5').update(machineHash + now + x).digest('hex');
          }

        } else {
          newLocal[key].translations = [];
          newLocal[key].timestamp = now;
        }
        x++;
      });
      var localPath = options.config + '/locales/';
      if(!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath);
      }
      var p = localPath + locale + '.json';
      if(fs.existsSync(p)) {
        fs.unlinkSync(p);
      }
      fs.writeFileSync(p, JSON.stringify(newLocal, null, 2));

      // Add deleted translation to delete log object
      for(var key in allTranslations[locale]) {
        if(!(key in newLocal)) {
          if(!(key in deletedTranslations)){
            deletedTranslations[key] = {};
          }
          if('translations' in allTranslations[locale][key]) {
            deletedTranslations[key][locale] = allTranslations[locale][key];
          } else {
            deletedTranslations[key][locale] = [];
          }
          deletedTranslations[key].timestamp = now;
        }
      }
    })(locale);
  });

  // Add deleted translation to delete log
  var deleteLog;
  if(fs.existsSync(options.deleteLog)) {
    try {
      deleteLog = grunt.file.readJSON(options.deleteLog);
    } catch(e) {
      deleteLog = {};
    }
  } else {
    deleteLog = {};
  }
  _.extend(deleteLog, deletedTranslations);
  if(fs.existsSync(options.deleteLog)) {
    fs.unlinkSync(options.deleteLog);
  }
  fs.appendFileSync(options.deleteLog, JSON.stringify(deleteLog, null, 2));

  // Delete all the files that is not part of the locales.json
  var languageStore = grunt.file.expand({filter: 'isFile'}, options.config + '/locales/*.json');
  languageStore = languageStore.concat(grunt.file.expand({filter: 'isFile'}, options.config + '/output/*.js'));

  languageStore.forEach(function(file){
    var lang;

    if(path.extname(file) === '.json') {
      lang = path.basename(file, '.json');
      if(locales.indexOf(lang) === -1) {
        if(fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }
    } else if(path.extname(file) === '.js') {
      lang = path.basename(file, '.js');
      if(locales.indexOf(lang) === -1) {
        if(fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }
    }

  });

  grunt.log.ok('Updated all translation keys from source');
};
*/
