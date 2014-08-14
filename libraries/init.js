var readline = require('readline')
  , defer = require('q').defer
  , fs = require('fs')
  , path = require('path')
  , log = require('./_log')
  , _ = require('underscore')
  , findup = require('findup-sync');

/**
 * Project initializer
 *
 * @constructor Init
 */

function Init() {
  this.rl = null;
  this.projectName = '';
  this.json = program.DEFAULT_CONFIGURATIONS;
}

/**
 * Initialize
 *
 * @return {void}
 * @api public
 */

Init.prototype.run = function() {
  var _this = this;
  if(findup('l10ns.json') || fs.existsSync(process.cwd() + '/l10ns.json')) {
    console.log(text.PROJECT_ALREADY_INITIATED);
    process.exit();
  }
  this._createReadlineInterface();
  this._outputIntroduction();
  this._getProjectName()
  .then(function(projectName) {
    _this.projectName = projectName;
    return _this._getLocales();
  })
  .then(function(locales) {
    _this.json.locales = locales;
    return _this._getDefaultLocale(locales);
  })
  .then(function(locale) {
    _this.json.defaultLocale = locale;
    return _this._getProgrammingLanguage();
  })
  .then(function(programmingLanguage) {
    _this.json.programmingLanguage = programmingLanguage;
    return _this._getStorageFolder();
  })
  .then(function(folder) {
    _this.json.store = folder;
    _this.json.outputFile = folder + 'output/localizations.js';
    _this._setDefaultSrc();
    _this._writeProject();
    process.exit();
  })
  .fail(function(error) {
    if(commands.stack && error) {
      console.log(error.stack);
    }

    log.error('Could not initialize project.');
  });
};

/**
 * Create readline interface
 *
 * @return {void}
 * @api private
 */

Init.prototype._createReadlineInterface = function() {
  this.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal : false
  });
};

/**
 * Output introduction to get-translation
 *
 * @return {void}
 * @api private
 */

Init.prototype._outputIntroduction = function() {
  process.stdout.write(text.INIT_INTRODUCTION);
};

/**
 * Get project name
 *
 * @return {Promise}
 * @api public
 */

Init.prototype._getProjectName = function() {
  var _this = this
    , deferred = defer()
    , question = text.PROJECT_NAME_QUESTION;

  var currentWorkingDirectory = _.last(process.cwd().split('/'));

  question += '(' + currentWorkingDirectory + ')?';

  this.rl.question(question, function(option) {
    option = option.trim();

    if(option === '') {
      deferred.resolve(currentWorkingDirectory);
    }
    else {
      deferred.resolve(option);
    }
  });

  return deferred.promise;
};

/**
 * Get locales
 *
 * @return {Promise}
 * @api public
 */

Init.prototype._getLocales = function() {
  var _this = this
    , deferred = defer()
    , question = text.LOCALES_DESCRIPTION + 'locales: (' +
      program.DEFAULT_LOCALE_CODE + ':' + program.DEFAULT_LOCALE_NAME + ') '
    , wrongAnswer = text.LOCALES_WRONG_ANSWER + question
    , answeredWrong = false;

  (function ask() {
    if(answeredWrong) {
      question = wrongAnswer;
    }
    _this.rl.question(question, function(locales) {
      locales = locales.trim();

      var result = {};
      if(locales === '') {
        result[program.DEFAULT_LOCALE_CODE] = program.DEFAULT_LOCALE_NAME;
        return deferred.resolve(result);
      }
      if(!program.LOCALES_SYNTAX.test(locales)) {
        answeredWrong = true;
        return ask();
      }
      locales.split(',').forEach(function(locale) {
        locale = locale.split(':');
        result[locale[0]] = locale[1];
      });

      deferred.resolve(result);
    });
  })();

  return deferred.promise;
};

/**
 * Get default locale
 *
 * @param {Array} locales
 * @return {Promise}
 * @api public
 */

Init.prototype._getDefaultLocale = function(locales) {
  var  _this = this
    , deferred = defer()
    , codes = Object.keys(locales)
    , size = codes.length;

  if(size === 1) {
    deferred.resolve(codes[0]);
    return deferred.promise;
  }

  var options = '[', optionsEndWrap = '] '
    , answeredWrong = false
    , question = text.DEFAULT_LOCALE_QUESTION
    , n = 1;

  for(var code in locales) {
    question += ('[' + n + ']').lightBlue + ' - ' + locales[code] + '\n';
    options += n + ',';
    n++;
  }

  options = options.slice(0, -1) + optionsEndWrap;
  question = question.slice(0, -1) + '\n' + options.lightBlue;
  var wrongAnswer = text.DEFAULT_LOCALE_WRONG_ANSWER + question;
  (function ask() {
    if(answeredWrong) {
      question = wrongAnswer;
    }
    _this.rl.question(question, function(option) {
      if(/^\d+$/.test(option)) {
        option = parseInt(option, 10) - 1;
        if(codes[option]) {
          return deferred.resolve(codes[option]);
        }
      }
      answeredWrong = true;
      ask();
    });
  })();

  return deferred.promise;
};

/**
 * Set the default programming language by asking the
 * user
 *
 * @return {Promise}
 * @api private
 */

Init.prototype._getProgrammingLanguage = function() {
  var _this = this
    , deferred = defer()
    , answeredWrong = false
    , question = text.CHOOSE_PROGRAMMING_LANGUAGE_QUESTION
    , options = '['
    , optionsEndWrap = '] '
    , n = 1;

  for(var i = 0; i < program.PROGRAMMING_LANGUAGUES.length; i++) {
    question +=  ('[' + n + ']').lightBlue + ' - ' + program.PROGRAMMING_LANGUAGUES[i] + '\n';
    options += n + ',';
    n++;
  }
  options = options.slice(0, -1) + optionsEndWrap;
  question = question + options.lightBlue;

  var wrongAnswer = text.CHOOSE_PROGRAMMING_LANGUAGE_WRONG_ANSWER + question;

  (function ask() {
    if(answeredWrong) {
      question = wrongAnswer;
    }
    _this.rl.question(question, function(option) {
      if(/^\d+$/.test(option)) {
        option = parseInt(option, 10) - 1;
        if(program.PROGRAMMING_LANGUAGUES[option]) {
          return deferred.resolve(program.PROGRAMMING_LANGUAGUES[option]);
        }
      }
      answeredWrong = true;
      ask();
    });
  })();

  return deferred.promise;
};

/**
 * Set the default output folder. Where all the compiled
 * localization files should be hosted
 *
 * @return {void}
 * @api private
 */

Init.prototype._getStorageFolder = function() {
  var _this = this
    , deferred = defer()
    , defaultStorage
    , question
    , answeredWrong = false;

  if(fs.existsSync(process.cwd() + '/app')) {
    defaultStorage = 'app/' + program.DEFAULT_STORAGE_FOLDER;
  }
  else if(fs.existsSync(process.cwd() + '/application')) {
    defaultStorage = 'application/' + program.DEFAULT_STORAGE_FOLDER;
  }
  else {
    defaultStorage = program.DEFAULT_STORAGE_FOLDER;
  }
  question = text.DEFAULT_STORAGE_FOLDER_QUESTION + 'storage: (' + defaultStorage + ') ';
  var wrongAnswer = text.DEFAULT_STORAGE_FOLDER_WRONG_ANSWER + question;
  (function ask() {
    if(answeredWrong) {
      question = wrongAnswer;
    }
    _this.rl.question(question, function(option) {
      if(option === '') {
        return deferred.resolve(defaultStorage);
      }
      else {
        option = path.normalize(option);
        if(option) {
          return deferred.resolve(option);
        }
      }
      answeredWrong = true;
      ask();
    });
  })();

  return deferred.promise;
};

/**
 * Set the default source file glob pattern for the
 * project
 *
 * @return {void}
 * @api private
 */

Init.prototype._setDefaultSrc = function() {
  this.json.source = program.DEFAULT_SOURCE_MAP[
    this.json.programmingLanguage
  ];
};

/**
 * Write to project after json configuration is set
 *
 * @return {void}
 * @api private
 */

Init.prototype._writeProject = function() {
  var cwd = process.cwd()
    , file = cwd + '/l10ns.json'
    , folder = cwd + '/.l10ns';

  if(!fs.existsSync(file)) {
    var projects = { defaultProject: this.projectName };
    projects.projects = {};
    projects.projects[this.projectName] = this.json;
    fs.writeFileSync(file, JSON.stringify(projects, null, 2));
  }

  if(!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
};

/**
 * Export instance
 */

module.exports = new Init;

/**
 * Exports constructor
 */

module.exports.Init = Init;
