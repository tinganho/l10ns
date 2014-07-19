
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
 * Specifications
 */

require('./update');
