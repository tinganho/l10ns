
/**
 * Module dependencies
 */

var sinon = require('sinon')
  , _ = require('underscore')
  , path = require('path')
  , expect = require('chai').expect
  , proxyquire = require('proxyquire')
  , fixtures = require('./fixtures/json');

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

      it('should set the default locale if no locale is added', function() {
        var fileStub = { readTranslations : sinon.stub().returns(fixtures.readTranslationJSON['en-US']) };
        var Log = proxyquire('../lib/log', { './file' : fileStub }).Log;
        var log = new Log;
        var translations = log._getLatestUpdates('en-US');
        expect(translations).to.eql(fixtures.readTranslationJSON['en-US']);
      });
    });

    describe('#outputLog', function() {
      it('should use the default locale whenever a locale parameter is not provided', function() {
        var log = new Log;
        log._log = sinon.spy();
        log.defaultLocale = 'en-US';
        log._getLatestUpdates = sinon.stub().returns([]);
        log.outputLog();
        expect(log._getLatestUpdates.args[0][0]).to.equal('en-US');
      });

      it('should output no translation whenever there is no translations', function() {
        var log = new Log;
        log._log = sinon.spy();
        log._getLatestUpdates = sinon.stub().returns([]);
        log.defaultLocale = 'en-US';
        log.outputLog();
        expect(log._log.calledOnce).to.be.true;
        expect(log._log.args[0][0]).to.equal('\nNo translations\n');
      });
    });
  });
};
