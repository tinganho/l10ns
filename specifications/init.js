
var dependencies = {
  'fs': {},
  'path': {},
  'mkdirp': {},
  'glob': {},
  'readline': {},
  'q': {},
};

describe('Init', function() {
  describe('#constructor()', function() {
    it('should set this.json to default values', function() {
      pcf.DEFAULT_CONFIGURATIONS = 'default-configurations';
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      expect(init.json).to.eql(pcf.DEFAULT_CONFIGURATIONS);
    });

    it('should set this.rl to null', function() {
      pcf.DEFAULT_CONFIGURATIONS = 'default-configurations';
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      expect(init.rl).to.eql(null);
    });
  });

  describe('#init()', function() {
    it('if project already exists it should send an message and exit process', function() {
      pcf.PROJECT_ALREADY_INITIATED = 'project-already-initiated';
      var cwdStub = sinon.stub(process, 'cwd');
      cwdStub.returns('current-working-directory');
      var exitStub = sinon.stub(process, 'exit');
      var consoleStub = sinon.stub(console, 'log');
      dependencies.fs.existsSync = sinon.stub().withArgs('current-working-directory/l10ns.json').returns(true);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = function() {};
      init._outputIntroduction = function() {};
      init._getLocales = sinon.stub().returns(Q.reject());
      init.init();
      exitStub.should.have.been.calledOnce;
      consoleStub.should.have.been.calledOnce;
      consoleStub.should.have.been.calledWith(pcf.PROJECT_ALREADY_INITIATED);
      consoleStub.restore();
      exitStub.restore();
      cwdStub.restore();
    });

    it('should create a readline interface, output introduction and get locales', function() {
      dependencies.fs.existsSync = sinon.stub().returns(false);
      dependencies['findup-sync'] = sinon.stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = sinon.spy();
      init._outputIntroduction = sinon.spy();
      init._getLocales = sinon.stub().returns(Q.reject());
      init.init();
      init._createReadlineInterface.should.have.been.calledOnce;
      init._outputIntroduction.should.have.been.calledOnce;
      init._getLocales.should.have.been.calledOnce;
    });

    it('after getting locales it should set it and then ask for default locale', function(done) {
      pcf.DEFAULT_CONFIGURATIONS = {};
      dependencies.fs.existsSync = sinon.stub().returns(false);
      dependencies['findup-sync'] = sinon.stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = function() {};
      init._outputIntroduction = function() {};
      init._getLocales = sinon.stub().returns(Q.resolve({ 'locale1': 'locale1-title' }));
      init._getDefaultLocale = sinon.stub().returns(Q.reject());
      init.init();
      eventually(function() {
        expect(init.json.locales).to.eql({ 'locale1': 'locale1-title' });
        init._getDefaultLocale.should.have.been.calledOnce;
        init._getDefaultLocale.should.have.been.calledWith({ 'locale1': 'locale1-title' });
        done();
      });
    });

    it('after getting default locale, it should set it and then ask for programming languague', function(done) {
      pcf.DEFAULT_CONFIGURATIONS = {};
      dependencies.fs.existsSync = sinon.stub().returns(false);
      dependencies['findup-sync'] = sinon.stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = function() {};
      init._outputIntroduction = function() {};
      init._getLocales = sinon.stub().returns(Q.resolve({ 'locale1': 'locale1-title' }));
      init._getDefaultLocale = sinon.stub().returns(Q.resolve('locale1'));
      init._getProgrammingLanguage = sinon.stub().returns(Q.reject());
      init.init();
      eventually(function() {
        expect(init.json.defaultLocale).to.eql('locale1');
        init._getProgrammingLanguage.should.have.been.calledOnce;
        done();
      });
    });

    it('after getting programming language, it should set it and then ask for storage folder', function(done) {
      pcf.DEFAULT_CONFIGURATIONS = {};
      dependencies.fs.existsSync = sinon.stub().returns(false);
      dependencies['findup-sync'] = sinon.stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = function() {};
      init._outputIntroduction = function() {};
      init._getLocales = sinon.stub().returns(Q.resolve({ 'locale1': 'locale1-title' }));
      init._getDefaultLocale = sinon.stub().returns(Q.resolve('locale1'));
      init._getProgrammingLanguage = sinon.stub().returns(Q.resolve('javascript'));
      init._getStorageFolder = sinon.stub().returns(Q.reject());
      init.init();
      eventually(function() {
        expect(init.json.programmingLanguage).to.eql('javascript');
        init._getStorageFolder.should.have.been.calledOnce;
        done();
      });
    });

    it('after getting storage folder, it should set it along with default values and write a configuration file', function(done) {
      pcf.DEFAULT_CONFIGURATIONS = {};
      dependencies.fs.existsSync = sinon.stub().returns(false);
      dependencies['findup-sync'] = sinon.stub().returns(false);
      var exitStub = sinon.stub(process, 'exit');
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = function() {};
      init._outputIntroduction = function() {};
      init._getLocales = sinon.stub().returns(Q.resolve({ 'locale1': 'locale1-title' }));
      init._getDefaultLocale = sinon.stub().returns(Q.resolve('locale1'));
      init._getProgrammingLanguage = sinon.stub().returns(Q.resolve('javascript'));
      init._getStorageFolder = sinon.stub().returns(Q.resolve('storage-folder/'));
      init._setDefaultSrc = sinon.spy();
      init._writeProject = sinon.spy();
      init.init();
      eventually(function() {
        expect(init.json.store).to.eql('storage-folder/');
        expect(init.json.output).to.eql('storage-folder/output/');
        init._getStorageFolder.should.have.been.calledOnce;
        init._setDefaultSrc.should.have.been.calledOnce;
        init._writeProject.should.have.been.calledOnce;
        exitStub.should.have.been.calledOnce;
        done();
      });
    });

    it('should log if any errors occurs', function(done) {
      pcf.DEFAULT_CONFIGURATIONS = {};
      dependencies.fs.existsSync = sinon.stub().returns(false);
      dependencies['findup-sync'] = sinon.stub().returns(false);
      var consoleStub = sinon.stub(console, 'log');
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = function() {};
      init._outputIntroduction = function() {};
      init._getLocales = sinon.stub().returns(Q.reject('error'));
      init.init();
      eventually(function() {
        consoleStub.should.have.been.calledOnce;
        consoleStub.should.have.been.calledWith('error');
        consoleStub.restore();
        done();
      });
    });
  });

  describe('#_createReadlineInterface()', function() {
    it('should create a readline interface', function() {
      dependencies.readline.createInterface = sinon.spy();
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface();
      dependencies.readline.createInterface.should.have.been.calledOnce;
    });
  });

  describe('#_outputIntroduction()', function() {
    it('should write introduction to output', function() {
      pcf.INIT_INTRODUCTION = 'introduction';
      var stdoutWrite = sinon.stub(process.stdout, 'write');
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._outputIntroduction();
      stdoutWrite.should.have.been.calledOnce;
      stdoutWrite.should.have.been.calledWith(pcf.INIT_INTRODUCTION);
      stdoutWrite.restore();
    });
  });

  describe('#_getLocales()', function() {
    it('should return a promise', function() {
      dependencies.q.defer = sinon.stub().returns({ promise: 'promise' });
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: function() {} };
      expect(init._getLocales()).to.equal('promise');
    });

    it('should resolve to default locale if empty option is choosed', function() {
      pcf.DEFAULT_LOCALE_CODE = 'default-locale-code';
      pcf.DEFAULT_LOCALE_NAME = 'default-lcoale-name';
      var deferred = { resolve: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl = {};
      init.rl.question = sinon.stub().callsArgWith(1, '');
      init._getLocales();
      var res = {};
      res[pcf.DEFAULT_LOCALE_CODE] = pcf.DEFAULT_LOCALE_NAME;
      deferred.resolve.should.have.been.calledOnce;
      deferred.resolve.should.have.been.calledWith(res);
    });

    it('if option has syntax wrong, it should ask again', function() {
      var deferred = { resolve: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      pcf.LOCALES_SYNTAX = { test: sinon.stub().returns(false) };
      init.rl = {};
      init.rl.question = sinon.stub()
      init.rl.question.onCall(0).callsArgWith(1, 'syntax-wrong');
      init.rl.question.onCall(1).callsArgWith(1, '');
      init._getLocales();
      pcf.LOCALES_SYNTAX.test.should.have.been.calledOnce;
      pcf.LOCALES_SYNTAX.test.should.have.been.calledWith('syntax-wrong');
      deferred.resolve.should.have.been.calledOnce;
    });

    it('should resolve to a syntax wrong-free option', function() {
      var deferred = { resolve: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      pcf.LOCALES_SYNTAX = { test: sinon.stub().returns(true) };
      init.rl = {};
      init.rl.question = sinon.stub()
      init.rl.question.onCall(0).callsArgWith(1, 'en-US:English (US)');
      init._getLocales();
      deferred.resolve.should.have.been.calledOnce;
      deferred.resolve.should.have.been.calledWith({ 'en-US': 'English (US)' });
    });
  });
});
