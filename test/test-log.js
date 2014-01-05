
/**
 * Module dependencies
 */

var sinon        = require('sinon')
  , _            = require('underscore')
  , path         = require('path')
  , expect       = require('chai').expect
  , proxyquire   = require('proxyquire')
  , fixtures     = require('./fixtures/json');

var Log = require('../lib/log').Log;

module.exports = function() {
  describe('Log', function() {
    describe('#_getLatestUpdates', function() {
      it('should throw an error if locale string is not provided as a parameter', function() {
        var log = new Log;
        var fn = function() {
          log._getLatestUpdates(1);
        };
        expect(fn).to.throw(TypeError, /first parameter must contain a locale string/);
      });

      it('should set the default locale if no locale is added', function() {
        var fileStub = { readTranslations : sinon.spy() };
        var Log = proxyquire('../lib/log', { './file' : fileStub }).Log;
        var log = new Log;
        log.defaultLocale = 'en-US';
        log._getLatestUpdates();
        expect(fileStub.readTranslations.args[0][0]).to.equal('en-US');
      });
    });
  });
};
