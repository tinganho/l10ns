var grunt = require('grunt'),
   findup = require('findup-sync'),
       fs = require('fs'),
        _ = grunt.util._,
     path = require('path'),
   engine = require('../helpers/engine'),
   config = require('../helpers/config');


module.exports = function(options) {

  var res = {};

  // get all locales
  var allTranslations = config.getAllTranslations(options),
      deletedTranslations = {};


  var files = grunt.file.expand({ filter: 'isFile' },options.src);
  files.forEach(function(file){
    var content = grunt.file.read(file);
    var regex = /\s+gt\(\s*['|"][\w|\-|\s|\&|<|>|\/|\.|’|'|"|\(|\)|€|\$|%|#|\?|!|,|\_|\^|`|´|\+|=|\*|\\]+['|"](\,\s*\{[\w|\s|\:|'|"|\,]*\})?\)/g;
    var translations = content.match(regex);

    if(translations !== null) {
      translations.forEach(function(translation){
        var key = config.getTranslationKey(translation);

        var vars = config.getVars(translation);
        if(!( key in res )) {
          res[key] = {};
          res[key].vars = vars;
        } else {
          config.hasErrorDuplicte(res, key, vars);
        }
      });
    }
  });
  var now = (new Date()).getTime();
  var locales = config.getAllLocales(options);
  locales.forEach(function(locale){
    (function(locale){
      var newLocal = res;
      Object.keys(newLocal).forEach(function(key){
        if(typeof allTranslations[locale] !== 'undefined') {
          if(key in allTranslations[locale] && 'translations' in allTranslations[locale][key]) {
            newLocal[key].translations = allTranslations[locale][key].translations;
          } else {
            newLocal[key].translations = [];
          }
          if(key in allTranslations[locale] && 'timestamp' in allTranslations[locale][key]) {
            newLocal[key].timestamp = allTranslations[locale][key].timestamp;
          } else {
            newLocal[key].timestamp = now;
          }
        } else {
          newLocal[key].translations = [];
        }
      });
      var localPath = options.configDir + '/locales/';
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
            deletedTranslations[key][locale] = allTranslations[locale][key].translations;
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
  var languageStore = grunt.file.expand({filter: 'isFile'}, options.configDir + '/locales/*.json');
  languageStore = languageStore.concat(grunt.file.expand({filter: 'isFile'}, options.configDir + '/output/*.js'));

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
};
