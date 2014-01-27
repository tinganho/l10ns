
/**
 * Sets global vars pcf and cf
 */

require('../bin/gt');

/**
 * Globalize convenient functions
 */

global.sinon = require('sinon');
global.chai = require('chai');
global.expect = require('chai').expect;
global.proxyquire = require('proxyquire');
global.path = require('path');

/**
 * Plugins
 */
var sinonChai = require('sinon-chai')
  , chaiAsPromised = require('chai-as-promised');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

/**
 * Test core
 */

require('./test-update')();
require('./test-edit')();
require('./test-merger')();
require('./test-log')();
require('./test-file')();
require('./test-parser')();
require('./test-syntax')();
require('./test-search')();

/**
 * Test compilers
 */

require('./test-js-compiler')();
