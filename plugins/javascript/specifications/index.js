
/**
 * Module dependencies
 */

var fs = require('fs')
  , path = require('path');

/**
 * Get dependencies
 *
 * @param {Object} localizations
 * @return {Object} representing dependencies
 * @api public
 */

global.getDependencies = function(localizations) {
  return {
    '../../libraries/file': {
      readLocalizations: stub().returns(resolvesTo(localizations))
    },
    'mkdirp': { sync: stub() },
    fs: {
      writeFileSync: spy()
    }
  };
};


/**
 * Get localizations
 *
 * @param {String} value message formated
 * @return {Object}
 * @api public
 */

global.getLocalizations = function(value) {
  return {
    'en-US': {
      'key-1': {
        value: value
      }
    }
  };
};

/**
 * Indent spaces
 *
 * @param {Number} spaces
 * @param {String} string
 * @return {String}
 * @api public
 */

global.indentSpaces = function(spaces, string) {
  for(var i = 0; i<spaces; i++) {
    string = string.replace(/\n/g, '\n ');
  }
  if(/^[^\s]$/.test(string.charAt(0))) {
    for(var i = 0; i<spaces; i++) {
      string = ' ' + string;
    }
  }

  string = string.replace(/\n\s+\n/g, '\n\n');

  return string;
};

global.template = require('./templates/build/templates');

describe('Javascript Compiler', function() {
  require('./sentenceCompilation');
  require('./variableCompilation');
  require('./formatNumberCompilation');
  require('./numberFormatCompilation');
  require('./dateFormatCompilation');
  require('./currencyFormatCompilation');
  require('./pluralFormatCompilation');
  require('./selectOrdinalFormatCompilation');
});
