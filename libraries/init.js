var readline = require('readline')
  , Q = require('q')
  , fs = require('fs')
  , path = require('path')
  , findup = require('findup-sync');

/**
 * Project initializer
 *
 * @constructor Init
 */

function Init() {
  this.rl = null;
  this.json = pcf.DEFAULT_CONFIGURATIONS;
  this.defaultLocaleQuestion = pcf.DEFAULT_LOCALE_QUESTION;
  this.defaultLocaleWrongAnswer = pcf.DEFAULT_LOCALE_WRONG_ANSWER;
  this.programmingLanguages = pcf.PROGRAMMING_LANGUAGUES;
  this.chooseProgrammingLanguagePrompt = pcf.CHOOSE_PROGRAMMING_LANGUAGE_PROMPT;
  this.chooseProgrammingLanguageWrongAnswer = pcf.CHOOSE_PROGRAMMING_LANGUAGE_WRONG_ANSWER;
  this.programmingLanguageToDefaultSrcMap = pcf.PROGRAMMING_LANGUAGUE_TO_DEFAULT_SRC_MAP;
  this.defaultOutputFolder = pcf.DEFAULT_OUTPUT_FOLDER;
  this.defaultOutputFolderPrompt = pcf.DEFAULT_OUTPUT_FOLDER_PROMPT;
  this.defaultOutputFolderWrongAnswer = pcf.DEFAULT_OUTPUT_FOLDER_WRONG_ANSWER;
}

/**
 * Initialize
 *
 * @return {void}
 * @api public
 */

Init.prototype.init = function() {
  var _this = this;
  if(findup('l10ns.json') || fs.existsSync(process.cwd() + '/l10ns.json')) {
    console.log(pcf.PROJECT_ALREADY_INITIATED);
    process.exit();
  }
  this._createReadlineInterface();
  this._outputIntroduction();
  this._getLocales()
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
    _this.json.output = folder + 'output/'
    _this._setDefaultSrc();
    _this._writeProject();
    process.exit();
  })
  .fail(function(err) {
    if(err) console.log(err);
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
  process.stdout.write(pcf.INIT_INTRODUCTION);
};

/**
 * Get locales
 *
 * @return {Promise}
 * @api public
 */

Init.prototype._getLocales = function() {
  var _this = this
    , deferred = Q.defer()
    , question = pcf.LOCALES_DESCRIPTION + 'locales: (' +
      pcf.DEFAULT_LOCALE_CODE + ':' + pcf.DEFAULT_LOCALE_NAME + ') '
    , wrongAnswer = pcf.LOCALES_WRONG_ANSWER + question
    , answeredWrong = false;

  (function ask() {
    if(answeredWrong) {
      question = wrongAnswer;
    }
    _this.rl.question(question, function(locales) {
      var result = {};
      if(locales === '') {
        result[pcf.DEFAULT_LOCALE_CODE] = pcf.DEFAULT_LOCALE_NAME;
        return deferred.resolve(result);
      }
      if(!pcf.LOCALES_SYNTAX.test(locales)) {
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
  var deferred = Q.defer()
    , codes = Object.keys(locales)
    , size = codes.length;

  if(size === 1) {
    deferred.resolve(codes[0]);
    return deferred.promise;
  }

  var options = '[', optionsEndWrap = '] ', answeredWrong = false
    , question = this.defaultLocaleQuestion, n = 1, _this = this;
  for(var code in locales) {
    question += ('[' + n + ']').lightBlue + ' - ' + locales[code] + '\n';
    options += n + ',';
    n++;
  }
  options = options.slice(0, -1) + optionsEndWrap;
  question = question.slice(0, -1) + '\n' + options.lightBlue;
  var wrongAnswer = this.defaultLocaleWrongAnswer + question;
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
    , deferred = Q.defer(), answeredWrong = false
    , question = this.chooseProgrammingLanguagePrompt
    , options = '[', optionsEndWrap = '] '
    , n = 1;

  for(var i = 0; i < this.programmingLanguages.length; i++) {
    question +=  ('[' + n + ']').lightBlue + ' - ' + this.programmingLanguages[i] + '\n';
    options += n + ',';
    n++;
  }
  options = options.slice(0, -1) + optionsEndWrap;
  question = question + options.lightBlue;

  var wrongAnswer = this.chooseProgrammingLanguageWrongAnswer + question;

  (function ask() {
    if(answeredWrong) {
      question = wrongAnswer;
    }
    _this.rl.question(question, function(option) {
      if(/^\d+$/.test(option)) {
        option = parseInt(option, 10) - 1;
        if(_this.programmingLanguages[option]) {
          return deferred.resolve(_this.programmingLanguages[option]);
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
    , deferred = Q.defer()
    , defaultOutput, question
    , answeredWrong = false;

  if(fs.existsSync(process.cwd() + '/app')) {
    defaultOutput = 'app/' + this.defaultOutputFolder;
  }
  else if(fs.existsSync(process.cwd() + '/application')) {
    defaultOutput = 'application/' + this.defaultOutputFolder;
  }
  else {
    defaultOutput = this.defaultOutputFolder;
  }
  question = this.defaultOutputFolderPrompt + 'output: (' + defaultOutput + ') ';
  var wrongAnswer = this.defaultOutputFolderWrongAnswer + question;
  (function ask() {
    if(answeredWrong) {
      question = wrongAnswer;
    }
    _this.rl.question(question, function(option) {
      if(option === '') {
        return deferred.resolve(defaultOutput);
      }
      else {
        option = path.normalize(option);
        if(path) {
          return deferred.resolve(path);
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
  this.json.src =
  this.programmingLanguageToDefaultSrcMap[
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
    fs.writeFileSync(file, JSON.stringify(this.json, null, 2));
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
