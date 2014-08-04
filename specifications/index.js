
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

global.lcf = {
  TRANSLATION_FUNCTION_CALL_REGEX: /gt\(['|"](.*?)['|"]\s*(\,\s*\{\s*((.*?)|(\s*?))+?\s*\})??\s*\)/g,
  TRANSLATION_INNER_FUNCTION_CALL_REGEX: /\s+(?!gt)[.|\w]+?\((.*?\s*?)*?\)/g
};

global.pcf = {};

/**
 * Specifications
 */

require('./update');
require('./file');
require('./init');
