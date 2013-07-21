var grunt  = require('grunt'),
    findup = require('findup-sync'),
    fs     = require('fs'),
    _      = grunt.util._,
    path   = require('path'),
    engine = require('../lib/engine'),
    config = require('../lib/config'),
    crypto = require('crypto'),
    os     = require('os'),
    prompt = require('prompt');



module.exports = function(options) {

  var machineHash = crypto.createHash('md5').update(os.hostname()).digest('hex');

  var res = {};
  // get all locales
  var allTranslations = config.getAllTranslations(options),
      deletedTranslations = {};

  var files = grunt.file.expand({ filter: 'isFile' }, options.src);
  files.forEach(function(file){
    var content = grunt.file.read(file);

    // Normalize file content from functions
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

  prompt.start();

   prompt.get(['username', 'email'], function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  username: ' + result.username);
    console.log('  email: ' + result.email);
  });

  grunt.log.ok('Updated all translation keys from source');
};
