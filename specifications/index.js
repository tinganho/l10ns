
/**
 * Globalize convenient functions
 */

global.sinon = require('sinon');
global.chai = require('chai');
global.expect = require('chai').expect;
global.proxyquire = require('proxyquire');
global.path = require('path');
global.Q = require('q');
global.eventually = require('underscore').defer;
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

var sinonChai = require('sinon-chai')
  , chaiAsPromised = require('chai-as-promised');

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
global.project = { cache: {}};
global.program = {};
global.text = {};
global.commands = {};

/**
 * Specifications
 */

require('./update');
require('./file');
require('./init');
require('./log');

require('../plugins/javascript/specifications');
require('./messageFormat');
require('./LDML');
