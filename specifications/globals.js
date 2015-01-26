
/**
 * Globalize convenient functions
 */

global.sinon = require('sinon');
global.chai = require('chai');
global.expect = require('chai').expect;
global.proxyquire = require('proxyquire');
global.path = require('path');
global.Q = require('q');
global.eventually = function(callback) { setTimeout(callback, 0) };
global.spy = sinon.spy;
global.stub = sinon.stub;
global.noop = function() {};
global.resolvesTo = Q.resolve;
global.resolves = Q.resolve;
global.rejectsWith = Q.reject;
global.rejects = Q.reject;

/**
 * Plugins
 */

var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

/**
 * Globals
 */

global.language = {
  GET_LOCALIZATION_FUNCTION_CALL_SYNTAX: /l\(['|"](.*?)['|"]\s*(\,\s*\{\s*((.*?)|(\s*?))+?\s*\})??\s*\)/g,
  GET_LOCALIZATION_INNER_FUNCTION_CALL_SYNTAX: /\s+(?!l)[.|\w]+?\((.*?\s*?)*?\)/g
};

global.project = {
  cache: {},
  output: '/Application/Localizations/Output',
  root: '/var/www',
  timezones: ['Europe/Stockholm', 'America/Los_Angeles'],
  currencies: ['USD']
};

global.program = {};
global.text = {};
global.commands = {};

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
