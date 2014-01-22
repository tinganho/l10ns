
/**
 * Module dependencies
 */

var jsonFixtures = require('./fixtures/json')
  , fixtures = require('./fixtures/update')
  , File = require('../lib/file').File;

module.exports = function() {
  describe('File', function() {
    describe('#readTranslations', function() {
      it('should throw an error if first parameter is not a string', function() {
        var file = new File();
        var fn = function() {
          file.readTranslations(1);
        };
        expect(fn).to.throw(TypeError, /first parameter must have type string or undefined/);
      });

      it('should throw an error if second parameter has not the type object', function() {
        var file = new File();
        var fn = function() {
          file.readTranslations('en-US', 1);
        };
        expect(fn).to.throw(TypeError, /second parameter must have type object or undefined/);
      });

      it('should have the default return type of json', function() {
        var localesFolder = cf.localesFolder;
        var locales = ['en-US'];
        var globStub = {
          sync : sinon.stub().returns(locales)
        };
        var fsStub = {
          readFileSync : sinon.stub().returns(jsonFixtures.basicTranslationItemString)
        };
        var pathStub = {
          join : sinon.stub().returns('en-US.locale')
        };
        var File = proxyquire('../lib/file', { glob : globStub, fs : fsStub, path : pathStub }).File
        var file = new File();
        file._getHashMapTranslations = sinon.spy();
        file._getArrayTranslations = sinon.spy();
        file.localesFolder = cf.localesFolder;
        file.readTranslations();
        expect(file._getHashMapTranslations.calledOnce).to.be.true;
        expect(file._getArrayTranslations.called).to.be.false;
      });

      it('should be able to return a translation object containing all translations', function() {
        var localesFolder = cf.localesFolder;
        var locales = ['en-US'];
        var globStub = {
          sync : sinon.stub().returns(locales)
        };
        var fsStub = {
          readFileSync : sinon.stub().returns(jsonFixtures.basicTranslationItemString)
        };
        var pathStub = {
          join : sinon.stub().returns('en-US.locale')
        };
        var File = proxyquire('../lib/file', { glob : globStub, fs : fsStub, path : pathStub }).File
        var file = new File();
        file.localesFolder = cf.localesFolder;
        file.locales = locales;
        var translations = file.readTranslations();
        expect(translations).to.have.property(locales[0]);
      });

      it('should be able to return an translation object containing just one language', function() {
        var localesFolder = cf.localesFolder;
        var locales = ['en-US'];
        var globStub = {
          sync : sinon.stub().returns(locales)
        };
        var fsStub = {
          readFileSync : sinon.stub().returns(jsonFixtures.basicTranslationItemString)
        };
        var pathStub = {
          join : sinon.stub().returns('en-US.locale')
        };
        var File = proxyquire('../lib/file', { glob : globStub, fs : fsStub, path : pathStub }).File
        var file = new File();
        file.localesFolder = cf.localesFolder;
        file.locales = locales;
        expect(file.readTranslations('en-US')).to.have.eql(jsonFixtures.basicTranslationItem);
      });

      it('should return an object containing only locale codes that references empty objects if there does not exist any translations', function() {
        var localesFolder = cf.localesFolder;
        var locales = ['en-US'];
        var globStub = {
          sync : sinon.stub().returns(['en-US.locale'])
        };
        var fsStub = {
          readFileSync : sinon.stub().returns('')
        };
        var pathStub = {
          join : sinon.stub().returns('en-US.locale')
        };
        var File = proxyquire('../lib/file', { glob : globStub, fs : fsStub, path : pathStub }).File
        var file = new File();
        file.localesFolder = cf.localesFolder;
        file.locales = locales;
        expect(file.readTranslations()).to.have.eql({ 'en-US' : {} });
      });

      it('should return an empty object if there does not exist any translations and one locale code is provided', function() {
        var localesFolder = cf.localesFolder;
        var locales = ['en-US'];
        var globStub = {
          sync : sinon.stub().returns(['en-US.locale'])
        };
        var fsStub = {
          readFileSync : sinon.stub().returns('')
        };
        var pathStub = {
          join : sinon.stub().returns('en-US.locale')
        };
        var File = proxyquire('../lib/file', { glob : globStub, fs : fsStub, path : pathStub }).File
        var file = new File();
        file.localesFolder = cf.localesFolder;
        file.locales = locales;
        expect(file.readTranslations('en-US')).to.have.eql({});
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

