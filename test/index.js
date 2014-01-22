
/**
 * Sets global vars pcf and cf
 */

require('../bin/gt');

/**
 * Globalize convenient functions
 */

global.sinon = require('sinon');
global.chai = require('chai');
global.should = require("chai").should();
global.expect = require("chai").expect;
global.proxyquire = require('proxyquire');
global.path = require('path');

var sinonChai = require('sinon-chai');

/**
 * Use sinon chai
 */

chai.use(sinonChai);

/**
 * Test core
 */

require('./test-update')();
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
