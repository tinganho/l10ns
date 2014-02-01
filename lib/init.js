
var readline = require('readline')
  , Q = require('q')
  , _ = require('underscore');

/**
 * Project initializer
 *
 * @constructor Init
 */

function Init() {
  this.rl = null;
  this.json = {};
  this.initIntro = cf.INIT_INTRO;
  this.localesSyntax = cf.LOCALES_SYNTAX;
  this.localesWrongAnswer = cf.LOCALES_WRONG_ANSWER;
  this.localesDescription = cf.LOCALES_DESCRIPTION;
  this.defaultLocaleCode = cf.DEFAULT_LOCALE_CODE;
  this.defaultLocaleName = cf.DEFAULT_LOCALE_NAME;
  this.defautlLocaleQuestion = cf.DEFAULT_LOCALE_QUESTION;
  this.defautlLocaleWrongAnswer = cf.DEFAULT_LOCALE_WRONG_ANSWER;
  this._createReadlineInterface();
}

/**
 * Initialize
 *
 * @return {void}
 * @api public
 */

Init.prototype.init = function() {
  var _this = this;
  this._outputIntroduction();
  this._getLocales()
  .then(function(locales) {
    _this.json.locales = locales;
    return _this._getDefaultLocale(locales);
  })
  .then(function(locale) {
    _this.json.defaultLocale = locale;
  })
  .fail(function(err) {
    console.log(err);
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
  process.stdout.write(this.initIntro);
};

/**
 * Get locales
 *
 * @return {Promise}
 * @api public
 */

Init.prototype._getLocales = function() {
  var deferred = Q.defer();
  var _this = this;
  var question =
  this.localesDescription + 'locales: (' +
  this.defaultLocaleCode + ':' + this.defaultLocaleName + ') ';
  var wrongAnswer = _this.localesWrongAnswer + question;
  var answeredWrong = false;
  (function ask() {
    if(answeredWrong) {
      question = wrongAnswer;
    }
    _this.rl.question(question, function(locales) {
      var res = {};
      if(locales === '') {
        res[_this.defaultLocaleCode] = _this.defaultLocaleName;
        return deferred.resolve(res);
      }
      if(!_this.localesSyntax.test(locales)) {
        answeredWrong = true;
        return ask();
      }
      locales.split(',').forEach(function(locale) {
        var locale = locale.split(':');
        res[locale[0]] = locale[1];
      });

      deferred.resolve(res);
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
    , size = _.size(locales)
    , codes = Object.keys(locales);

  if(size === 1) {
    deferred.resolve(codes[0]);
    return deferred.promise;
  }

  var options = '[', optionsEndWrap = '] ', answeredWrong = false
    , question = this.defautlLocaleQuestion, n = 1, _this = this;
  for(var code in locales) {
    question += ('[' + n + ']').lightBlue + ' - ' + locales[code] + '\n';
    options += n + ',';
    n++;
  }
  options = options.slice(0, -1) + optionsEndWrap;
  question = question.slice(0, -1) + '\n' + options.lightBlue;
  var wrongAnswer = this.defautlLocaleWrongAnswer + question;
  (function ask() {
    if(answeredWrong) {
      question = wrongAnswer;
    }
    _this.rl.question(question, function(option) {
      if(/^\d+$/.test(option)) {
        option = parseInt(option, 10) - 1;
        if(typeof codes[option] === 'undefined') {
          answeredWrong = true;
          return ask();
        }
      }
      else {
        answeredWrong = true;
        return ask();
      }
      deferred.resolve(codes[option]);
    });
  })();

  return deferred.promise;
};


Init.prototype._getDefaultProgrammingLanguage = function() {
  var deferred = Q.defer();

  this.rl.question(question, function() {

  });

  return deferred.promise;
};

Init.prototype.validateProject = function() {

};

Init.prototype.generate = function() {

};

/**
 * Export instance
 */

module.exports = new Init;

/**
 * Exports constructor
 */

module.exports.Init = Init;
