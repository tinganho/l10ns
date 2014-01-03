
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
    describe('#readTranslations', function() {
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

    describe('#writeTranslations', function() {
      it('should not make a folder for locales storage if it does exists', function() {
        var localesFolder = 'test-folder';
        var fsStub = {
          existsSync : sinon.stub().withArgs(localesFolder).returns(true),
          mkdirSync : sinon.spy()
        };
        var File = proxyquire('../lib/file', { fs : fsStub }).File;
        var file = new File();
        file.localesFolder = localesFolder;
        file.writeTranslations();
        expect(fsStub.mkdirSync.calledOnce).to.be.false;
      });

      it('should make a folder for locales storage if it does not exists', function() {
        var localesFolder = 'test-folder';
        var fsStub = {
          existsSync : sinon.stub().withArgs(localesFolder).returns(false),
          mkdirSync : sinon.spy()
        };
        var File = proxyquire('../lib/file', { fs : fsStub }).File;
        var file = new File();
        file.localesFolder = localesFolder;
        file.writeTranslations();
        expect(fsStub.mkdirSync.calledOnce).to.be.true;
        expect(fsStub.mkdirSync.args[0][0]).to.equal(localesFolder);
      });

      it('should check if a current locale file exists', function() {
        var localesFolder = 'test-folder';
        var p = localesFolder + '/en-US.locale';
        var stub = sinon.stub();
        stub.withArgs(localesFolder).returns(true);
        stub.withArgs(p).returns(false);
        var fsStub = {
          existsSync : stub
        };
        var File = proxyquire('../lib/file', { fs : fsStub }).File;
        var file = new File();
        file.locales = ['en-US'];
        file.localesFolder = localesFolder;
        file.writeTranslations({ 'en-US': {} });
        expect(fsStub.existsSync.args[1][0]).to.equal(p);
      });

      it('should unlink existing localization files', function() {
        var localesFolder = 'test-folder';
        var p = localesFolder + '/en-US.locale';
        var stub = sinon.stub();
        stub.withArgs(localesFolder).returns(true);
        stub.withArgs(p).returns(false);
        var fsStub = {
          existsSync : stub
        };
        var File = proxyquire('../lib/file', { fs : fsStub }).File;
        var file = new File();
        file.locales = ['en-US'];
        file.localesFolder = localesFolder;
        file.writeTranslations({ 'en-US': {} });
        expect(fsStub.existsSync.args[1][0]).to.equal(p);
      });

      it('should append translation(JSON content) to localization file', function() {
        var localesFolder = 'test-folder';
        var p = localesFolder + '/en-US.locale';
        var existsSyncStub = sinon.stub();
        existsSyncStub.withArgs(localesFolder).returns(true);
        existsSyncStub.withArgs(p).returns(false);
        var fsStub = {
          existsSync : existsSyncStub,
          appendFileSync : sinon.spy()
        };
        var File = proxyquire('../lib/file', { fs : fsStub }).File;
        var file = new File();
        file.locales = ['en-US'];
        file.localesFolder = localesFolder;
        var obj = { 'en-US': { 'test' : {} } };
        file.writeTranslations(obj);
        expect(fsStub.appendFileSync.args[0][0]).to.equal(p);
        expect(fsStub.appendFileSync.args[0][1]).to.equal(JSON.stringify(obj['en-US']['test']) + '\n\n');
      });
    });
  });
};

