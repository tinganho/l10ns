
/**
 * Module dependencies
 */

var sinon        = require('sinon')
  , _            = require('underscore')
  , path         = require('path')
  , expect       = require('chai').expect
  , proxyquire   = require('proxyquire')
  , jsonFixtures = require('./fixtures/json')
  , fixtures     = require('./fixtures/update');

var File = require('../lib/file').File;

module.exports = function() {
  describe('File', function() {
    describe('readTranslations', function() {
      it('should be able to return a translation object', function() {
        var localesFolder = cf.localesFolder;
        var locales = ['en-US'];
        var globStub = {
          sync : function(path, opts) {
            if(/\.locale/.test(path)
            && opts.cwd === localesFolder) {
              return locales;
            }
          }
        };
        var fsStub = {
          readFileSync : sinon.stub().returns(jsonFixtures.basicTranslationItemString)
        };
        var pathStub = {
          join : function() {
            return 'en-US.locale';
          }
        };
        var File = proxyquire('../lib/file', { glob : globStub, fs : fsStub, path : pathStub }).File
        var file = new File();
        file.localesFolder = cf.localesFolder;
        file.locales = locales;
        var translations = file.readTranslations();
        expect(translations).to.have.property(locales[0]);
      });
    });
  });
};

