
/**
 * Module dependencies
 */

var jsonFixtures = require('./fixtures/json')
  , fixtures = require('./fixtures/update')
  , File = require('../libraries/file').File;

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
        var File = proxyquire('../libraries/file', { glob : globStub, fs : fsStub, path : pathStub }).File
        var file = new File();
        file._getHashMapTranslations = sinon.spy();
        file._getArrayTranslations = sinon.spy();
        file.localesFolder = cf.localesFolder;
        file.readTranslations();
        file._getHashMapTranslations.should.have.been.calledOnce;
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
        var File = proxyquire('../libraries/file', { glob : globStub, fs : fsStub, path : pathStub }).File
        var file = new File();
        file.localesFolder = cf.localesFolder;
        file.locales = locales;
        var translations = file.readTranslations();
        expect(translations).to.have.property(locales[0]);
      });

      it('should be able to return a translation object containing just one language', function() {
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
        var File = proxyquire('../libraries/file', { glob : globStub, fs : fsStub, path : pathStub }).File
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
        var File = proxyquire('../libraries/file', { glob : globStub, fs : fsStub, path : pathStub }).File
        var file = new File();
        file.localesFolder = cf.localesFolder;
        file.locales = locales;
        expect(file.readTranslations()).to.have.eql({ 'en-US' : {} });
      });

      it('should return an empty object if there does not exist any translations and one locale code is provided', function() {
        var localesFolder = cf.localesFolder;
        var locales =  { 'en-US' : 'English' };
        var globStub = {
          sync : sinon.stub().returns(['en-US.locale'])
        };
        var fsStub = {
          readFileSync : sinon.stub().returns('')
        };
        var pathStub = {
          join : sinon.stub().returns('en-US.locale')
        };
        var File = proxyquire('../libraries/file', { glob : globStub, fs : fsStub, path : pathStub }).File
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
        var File = proxyquire('../libraries/file', { fs : fsStub }).File;
        var file = new File();
        file.locales = {};
        file.localesFolder = localesFolder;
        file.writeTranslations();
        fsStub.mkdirSync.should.not.have.been.calledOnce;
      });

      it('should sort map to array', function() {
        var file = new File();
        file.locales = {};
        file._sortMaptoArray = sinon.spy();
        file.localesFolder = cf.localesFolder;
        var newTranslations = { 'test' : {}};
        file.writeTranslations(newTranslations);
        file._sortMaptoArray.should.have.been.calledOnce;
        file._sortMaptoArray.should.have.been.calledWith(newTranslations);
      });

      it('should make a folder for locales storage if it does not exists', function() {
        var localesFolder = 'test-folder';
        var fsStub = {
          existsSync : sinon.stub().withArgs(localesFolder).returns(false),
          mkdirSync : sinon.spy()
        };
        var File = proxyquire('../libraries/file', { fs : fsStub }).File;
        var file = new File();
        file.locales = {};
        file.localesFolder = localesFolder;
        file.writeTranslations();
        fsStub.mkdirSync.should.have.been.calledOnce;
        fsStub.mkdirSync.should.have.been.calledWith(localesFolder);
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
        var File = proxyquire('../libraries/file', { fs : fsStub }).File;
        var file = new File();
        file.locales =  { 'en-US' : 'English' };
        file.localesFolder = localesFolder;
        file.writeTranslations({ 'en-US': {} });
        fsStub.existsSync.calledWith(p);
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
        var File = proxyquire('../libraries/file', { fs : fsStub }).File;
        var file = new File();
        file.locales =  { 'en-US' : 'English' };
        file.localesFolder = localesFolder;
        file.writeTranslations({ 'en-US': {} });
        fsStub.existsSync.calledWith(p);
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
        var File = proxyquire('../libraries/file', { fs : fsStub }).File;
        var file = new File();
        file.locales =  { 'en-US' : 'English' };
        file.localesFolder = localesFolder;
        var obj = { 'en-US': { 'test' : {} } };
        file.writeTranslations(obj);
        fsStub.appendFileSync.calledWith(p);
        fsStub.appendFileSync.calledWith(JSON.stringify(obj['en-US']['test']) + '\n\n');
      });
    });


    describe('#writeSingleLocaleTranslations', function() {
      it('should make a folder for locales storage if it does not exists', function() {
        var localesFolder = 'test-folder';
        var fsStub = {
          existsSync : sinon.stub().withArgs(localesFolder).returns(false),
          mkdirSync : sinon.spy()
        };
        var File = proxyquire('../libraries/file', { fs : fsStub }).File;
        var file = new File();
        file.locales = {};
        file.localesFolder = localesFolder;
        file.writeTranslations();
        fsStub.mkdirSync.should.have.been.calledOnce;
        fsStub.mkdirSync.should.have.been.calledWith(localesFolder);
      });

      it('should not make a folder for locales storage if it does exists', function() {
        var localesFolder = 'test-folder/en-US.locale';
        var fsStub = {
          existsSync : sinon.stub().withArgs(localesFolder).returns(true),
          mkdirSync : sinon.spy(),
          unlinkSync : function() {}
        };
        var File = proxyquire('../libraries/file', { fs : fsStub }).File;
        var file = new File();
        file.locales = {};
        file.localesFolder = localesFolder;
        file.writeSingleLocaleTranslations({}, 'en-US');
        fsStub.mkdirSync.should.not.have.been.calledOnce;
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
        var File = proxyquire('../libraries/file', { fs : fsStub }).File;
        var file = new File();
        file.locales =  { 'en-US' : 'English' };
        file.localesFolder = localesFolder;
        file.writeTranslations({ 'en-US': {} });
        fsStub.existsSync.calledWith(p);
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
        var File = proxyquire('../libraries/file', { fs : fsStub }).File;
        var file = new File();
        file.locales =  { 'en-US' : 'English' };
        file.localesFolder = localesFolder;
        file.writeTranslations({ 'en-US': {} });
        fsStub.existsSync.calledWith(p);
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
        var File = proxyquire('../libraries/file', { fs : fsStub }).File;
        var file = new File();
        file.locales =  { 'en-US' : 'English' };
        file.localesFolder = localesFolder;
        var obj = [{}, {}, {}];
        file.writeTranslations(obj, 'en-US');
        fsStub.appendFileSync.calledWith(p);
        fsStub.appendFileSync.calledWith(JSON.stringify(obj[0]) + '\n');
      });
    });

    describe('#readSearchTranslations', function() {
      it('should read files from cache/latestSearch.json', function() {
        var deferStub = { promise : null, resolve : sinon.spy(), reject : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferStub) };
        var fsStub = { readFile : sinon.stub().callsArg(2) };
        var File = proxyquire('../libraries/file', { q : qStub, fs : fsStub }).File;
        var file = new File;
        file.readSearchTranslations();
        expect(fsStub.readFile.args[0][0]).to.contain('cache/latestSearch.json');
      });

      it('should read files using utf-8', function() {
        var deferStub = { promise : null, resolve : sinon.spy(), reject : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferStub) };
        var fsStub = { readFile : sinon.stub().callsArg(2) };
        var File = proxyquire('../libraries/file', { q : qStub, fs : fsStub }).File;
        var file = new File;
        file.readSearchTranslations();
        expect(fsStub.readFile.args[0][1]).to.eql({ encoding : 'utf-8' });
      });

      it('should reject if an error occur in fs#readFile', function() {
        var deferStub = { promise : null, resolve : sinon.spy(), reject : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferStub) };
        var err = new TypeError;
        var fsStub = { readFile : sinon.stub().callsArgWith(2, err) };
        var File = proxyquire('../libraries/file', { q : qStub, fs : fsStub }).File;
        var file = new File;
        file.readSearchTranslations();
        deferStub.reject.should.have.been.calledOnce;
        deferStub.reject.should.have.been.calledWith(err);
      });

      it('should resolve when file content contain valid JSON', function() {
        var deferStub = { promise : null, resolve : sinon.spy(), reject : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferStub) };
        var data = JSON.stringify({ 'test' : null });
        var fsStub = { readFile : sinon.stub().callsArgWith(2, null, data) };
        var File = proxyquire('../libraries/file', { q : qStub, fs : fsStub }).File;
        var file = new File;
        file.readSearchTranslations();
        deferStub.resolve.should.have.been.calledOnce;
        deferStub.resolve.should.have.been.calledWith(JSON.parse(data));
      });
    });
  });
};

