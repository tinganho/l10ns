
/**
 * Module dependencies
 */

var fixtures = require('./fixtures/json')
  , Log = require('../lib/log').Log;

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
        var logStub = { log : sinon.spy() };
        var Log = proxyquire('../lib/log', { './_log' : logStub }).Log;
        var log = new Log;
        log.defaultLocale = 'en-US';
        log._getLatestUpdates = sinon.stub().returns([]);
        log.outputLog();
        expect(log._getLatestUpdates.args[0][0]).to.equal('en-US');
      });

      it('should output no translation whenever there is no translations', function() {
        var logStub = { log : sinon.spy() };
        var Log = proxyquire('../lib/log', { './_log' : logStub }).Log;
        var log = new Log;
        log._getLatestUpdates = sinon.stub().returns([]);
        log.defaultLocale = 'en-US';
        log.outputLog();
        expect(logStub.log.calledOnce).to.be.true;
        expect(logStub.log.args[0][0]).to.equal('\nNo translations\n');
      });

      it('should output translation log whenever there is translations', function() {
        var logStub = { log : sinon.spy() };
        var Log = proxyquire('../lib/log', { './_log' : logStub }).Log;
        var log = new Log;
        log._getLatestUpdates = sinon.stub().returns(fixtures.readTranslationArray['en-US']);
        log.defaultLocale = 'en-US';
        log.outputLog();
        expect(logStub.log.args[0][0]).to.contain('\nLatest translations in');
      });

      it('should output translation log of maxium length equal to ' + cf.LOG_LENGTH, function() {
        var logStub = { log : sinon.spy() };
        var Log = proxyquire('../lib/log', { './_log' : logStub }).Log;
        var log = new Log;
        log._getLatestUpdates = sinon.stub().returns(fixtures.readTranslationArray_long['en-US']);
        log.defaultLocale = 'en-US';
        log.outputLog();
        expect(logStub.log.callCount).to.equal(12);
        expect(logStub.log.args[11][0]).to.contain('-10');
      });
    });
  });
};
