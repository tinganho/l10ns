
var dependencies = {
  'fs': {},
  'path': {},
  'mkdirp': {},
  'glob': {},
  'readline': {},
  './_log': {},
  'q': {},
};

describe('Init', function() {
  describe('#constructor()', function() {
    it('should set this.json to default values', function() {
      program.DEFAULT_CONFIGURATIONS = 'default-configurations';
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      expect(init.json).to.eql(program.DEFAULT_CONFIGURATIONS);
    });

    it('should set this.rl to null', function() {
      program.DEFAULT_CONFIGURATIONS = 'default-configurations';
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      expect(init.rl).to.eql(null);
    });

    it('should set this.projectName to empty string', function() {
      program.DEFAULT_CONFIGURATIONS = 'default-configurations';
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      expect(init.projectName).to.eql('');
    });
  });

  describe('#run()', function() {
    beforeEach(function() {
      dependencies['./_log'].error = noop;
    });

    it('if project already exists it should send an message and exit process', function() {
      text.PROJECT_ALREADY_INITIATED = 'project-already-initiated';
      var cwdStub = stub(process, 'cwd');
      cwdStub.returns('current-working-directory');
      var exitStub = stub(process, 'exit');
      var consoleStub = stub(console, 'log');
      dependencies.fs.existsSync = stub().withArgs('current-working-directory/l10ns.json').returns(true);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = noop;
      init._outputIntroduction = noop;
      init._getProjectName = stub().returns(rejects());
      init.run();
      exitStub.should.have.been.calledOnce;
      consoleStub.should.have.been.calledOnce;
      consoleStub.should.have.been.calledWith(text.PROJECT_ALREADY_INITIATED);
      consoleStub.restore();
      exitStub.restore();
      cwdStub.restore();
    });

    it('should create a readline interface, output introduction and get project name', function() {
      dependencies.fs.existsSync = stub().returns(false);
      dependencies['findup-sync'] = stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = spy();
      init._outputIntroduction = spy();
      init._getProjectName = stub().returns(rejects());
      init.run();
      init._createReadlineInterface.should.have.been.calledOnce;
      init._outputIntroduction.should.have.been.calledOnce;
      init._getProjectName.should.have.been.calledOnce;
    });

    it('after getting project name it should set it and then ask for languages', function(done) {
      program.DEFAULT_CONFIGURATIONS = {};
      dependencies.fs.existsSync = stub().returns(false);
      dependencies['findup-sync'] = stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = noop;
      init._outputIntroduction = noop;
      init._getProjectName = stub().returns(resolvesTo('name1'));
      init._getLanguages = stub().returns(rejects());
      init.run();
      eventually(function() {
        expect(init.projectName).to.equal('name1');
        init._getLanguages.should.have.been.calledOnce;
        done();
      });
    });

    it('after getting languages it should set it and then ask for default language', function(done) {
      program.DEFAULT_CONFIGURATIONS = {};
      dependencies.fs.existsSync = stub().returns(false);
      dependencies['findup-sync'] = stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = noop;
      init._outputIntroduction = noop;
      init._getProjectName = stub().returns(resolvesTo('name1'));
      init._getLanguages = stub().returns(resolvesTo({ 'language1': 'language1-title' }));
      init._getDefaultLanguage = stub().returns(rejects());
      init.run();
      eventually(function() {
        expect(init.json.languages).to.eql({ 'language1': 'language1-title' });
        init._getDefaultLanguage.should.have.been.calledOnce;
        init._getDefaultLanguage.should.have.been.calledWith({ 'language1': 'language1-title' });
        done();
      });
    });

    it('after getting default language, it should set it and then ask for programming languague', function(done) {
      program.DEFAULT_CONFIGURATIONS = {};
      dependencies.fs.existsSync = stub().returns(false);
      dependencies['findup-sync'] = stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = noop;
      init._outputIntroduction = noop;
      init._getProjectName = stub().returns(resolvesTo('name1'));
      init._getLanguages = stub().returns(resolvesTo({ 'language1': 'language1-title' }));
      init._getDefaultLanguage = stub().returns(resolvesTo('language1'));
      init._getProgrammingLanguage = stub().returns(rejects());
      init.run();
      eventually(function() {
        expect(init.json.defaultLanguage).to.eql('language1');
        init._getProgrammingLanguage.should.have.been.calledOnce;
        done();
      });
    });

    it('after getting programming language, it should set it and then ask for storage folder', function(done) {
      program.DEFAULT_CONFIGURATIONS = {};
      dependencies.fs.existsSync = stub().returns(false);
      dependencies['findup-sync'] = stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = noop;
      init._outputIntroduction = noop;
      init._getProjectName = stub().returns(resolvesTo('name1'));
      init._getLanguages = stub().returns(resolvesTo({ 'language1': 'language1-title' }));
      init._getDefaultLanguage = stub().returns(resolvesTo('language1'));
      init._getProgrammingLanguage = stub().returns(resolvesTo('javascript'));
      init._getStorageFolder = stub().returns(rejects());
      init.run();
      eventually(function() {
        expect(init.json.programmingLanguage).to.eql('javascript');
        init._getStorageFolder.should.have.been.calledOnce;
        done();
      });
    });

    it('after getting storage folder, it should set it along with default values and write a configuration file', function(done) {
      program.DEFAULT_CONFIGURATIONS = {};
      dependencies.fs.existsSync = stub().returns(false);
      dependencies['findup-sync'] = stub().returns(false);
      var exitStub = stub(process, 'exit');
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = noop;
      init._outputIntroduction = noop;
      init._getProjectName = stub().returns(resolvesTo('name1'));
      init._getLanguages = stub().returns(resolvesTo({ 'language1': 'language1-title' }));
      init._getDefaultLanguage = stub().returns(resolvesTo('language1'));
      init._getProgrammingLanguage = stub().returns(resolvesTo('javascript'));
      init._getStorageFolder = stub().returns(resolvesTo('storage-folder/'));
      init._setDefaultSrc = spy();
      init._writeProject = spy();
      init.run();
      eventually(function() {
        expect(init.json.store).to.eql('storage-folder//');
        expect(init.json.output).to.eql('storage-folder//output');
        init._getStorageFolder.should.have.been.calledOnce;
        init._setDefaultSrc.should.have.been.calledOnce;
        init._writeProject.should.have.been.calledOnce;
        exitStub.should.have.been.calledOnce;
        done();
      });
    });

    it('should log if any errors occurs', function(done) {
      dependencies['./_log'].error = spy();
      program.DEFAULT_CONFIGURATIONS = {};
      dependencies.fs.existsSync = stub().returns(false);
      dependencies['findup-sync'] = stub().returns(false);
      var consoleStub = stub(console, 'log');
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface = noop;
      init._outputIntroduction = noop;
      init._getProjectName = stub().returns(rejectsWith('error'));
      init.run();
      eventually(function() {
        dependencies['./_log'].error.should.have.been.calledOnce;
        dependencies['./_log'].error.should.have.been.calledWith('Could not initialize project.');
        consoleStub.restore();
        done();
      });
    });
  });

  describe('#_createReadlineInterface()', function() {
    it('should create a readline interface', function() {
      dependencies.readline.createInterface = spy();
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._createReadlineInterface();
      dependencies.readline.createInterface.should.have.been.calledOnce;
    });
  });

  describe('#_outputIntroduction()', function() {
    it('should write introduction to output', function() {
      text.INIT_INTRODUCTION = 'introduction';
      var stdoutWrite = stub(process.stdout, 'write');
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init._outputIntroduction();
      stdoutWrite.should.have.been.calledOnce;
      stdoutWrite.should.have.been.calledWith(text.INIT_INTRODUCTION);
      stdoutWrite.restore();
    });
  });

  describe('#_getLanguages()', function() {
    it('should return a promise', function() {
      dependencies.q.defer = stub().returns({ promise: 'promise' });
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: function() {} };
      expect(init._getLanguages()).to.equal('promise');
    });

    it('should resolve to default language if empty option is choosed', function() {
      program.DEFAULT_LANGUAGE_TAG = 'default-language-tag';
      program.DEFAULT_LANGUAGE_NAME = 'default-language-name';
      var deferred = { resolve: spy() };
      dependencies.q.defer = stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl = {};
      init.rl.question = stub().callsArgWith(1, '');
      init._getLanguages();
      var res = {};
      res[program.DEFAULT_LANGUAGE_TAG] = program.DEFAULT_LANGUAGE_NAME;
      deferred.resolve.should.have.been.calledOnce;
      deferred.resolve.should.have.been.calledWith(res);
    });

    it('if option has syntax wrong, it should ask again', function() {
      var deferred = { resolve: spy() };
      dependencies.q.defer = stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      program.LANGUAGES_SYNTAX = { test: stub().returns(false) };
      init.rl = {};
      init.rl.question = stub()
      init.rl.question.onCall(0).callsArgWith(1, 'syntax-wrong');
      init.rl.question.onCall(1).callsArgWith(1, '');
      init._getLanguages();
      program.LANGUAGES_SYNTAX.test.should.have.been.calledOnce;
      program.LANGUAGES_SYNTAX.test.should.have.been.calledWith('syntax-wrong');
      deferred.resolve.should.have.been.calledOnce;
    });

    it('should resolve to a syntax wrong-free language(single) option', function() {
      var deferred = { resolve: spy() };
      dependencies.q.defer = stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      program.LANGUAGES_SYNTAX = { test: stub().returns(true) };
      init.rl = {};
      init.rl.question = stub()
      init.rl.question.onCall(0).callsArgWith(1, 'en-US:English (US)');
      init._getLanguages();
      deferred.resolve.should.have.been.calledOnce;
      deferred.resolve.should.have.been.calledWith({ 'en-US': 'English (US)' });
    });

    it('should resolve to a syntax wrong-free languages(multiple) option', function() {
      var deferred = { resolve: spy() };
      dependencies.q.defer = stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      program.LANGUAGES_SYNTAX = { test: stub().returns(true) };
      init.rl = {};
      init.rl.question = stub()
      init.rl.question.onCall(0).callsArgWith(1, 'en-US:English (US),zh-CN:Chinese');
      init._getLanguages();
      deferred.resolve.should.have.been.calledOnce;
      deferred.resolve.should.have.been.calledWith({ 'en-US': 'English (US)', 'zh-CN':'Chinese' });
    });
  });

  describe('#_getDefaultLanguage(languages)', function() {
    it('should return a promise', function() {
      dependencies.q.defer = stub().returns({ promise: 'promise' });
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: function() {} };
      var languages = { 'en-US': 'English (US)', 'zh-CN': 'Chinese' };
      expect(init._getDefaultLanguage(languages)).to.equal('promise');
    });

    it('if there is only one language it should resolve to it', function() {
      var deferred = { resolve: spy() };
      dependencies.q.defer = stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: function() {} };
      var languages = { 'en-US': 'English (US)'};
      init._getDefaultLanguage(languages);
      deferred.resolve.should.have.been.calledOnce;
      deferred.resolve.should.have.been.calledWith('en-US');
    });

    it('should create a form for choosing default language', function() {
      text.DEFAULT_LANGUAGE_QUESTION = 'Default language question';
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: spy() };
      var languages = { 'en-US': 'English (US)', 'zh-CN': 'Chinese' };
      init._getDefaultLanguage(languages);
      expect(init.rl.question.args[0][0]).to.contain(text.DEFAULT_LANGUAGE_QUESTION);
      expect(init.rl.question.args[0][0]).to.contain('English (US)');
      expect(init.rl.question.args[0][0]).to.contain('Chinese');
    });

    it('should resolve to a choosen language', function(done) {
      var deferred = { resolve: spy() };
      dependencies.q.defer = stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: stub().callsArgWith(1, '1') };
      var languages = { 'en-US': 'English (US)', 'zh-CN': 'Chinese' };
      init._getDefaultLanguage(languages);
      eventually(function() {
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith('en-US');
        done();
      });
    });

    it('should re-ask if an invalid option is given', function(done) {
      text.DEFAULT_LANGUAGE_WRONG_ANSWER = 'wrong-answer';
      var deferred = { resolve: spy() };
      dependencies.q.defer = stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: stub() };
      init.rl.question.onCall(0).callsArgWith(1, 'invalid-option');
      init.rl.question.onCall(1).callsArgWith(1, '1');
      var languages = { 'en-US': 'English (US)', 'zh-CN': 'Chinese' };
      init._getDefaultLanguage(languages);
      eventually(function() {
        init.rl.question.should.have.been.calledTwice;
        expect(init.rl.question.args[1][0]).to.contain(text.DEFAULT_LANGUAGE_WRONG_ANSWER);
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith('en-US');
        done();
      });
    });
  });

  describe('#_getProgrammingLanguage()', function() {
    it('should return a promise', function() {
      program.PROGRAMMING_LANGUAGUES = ['javascript'];
      dependencies.q.defer = stub().returns({ promise: 'promise' });
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: function() {} };
      expect(init._getProgrammingLanguage()).to.equal('promise');
    });

    it('should create a form for choosing a programming language', function() {
      text.CHOOSE_PROGRAMMING_LANGUAGE_QUESTION = 'programming-language-question';
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: spy() };
      init._getProgrammingLanguage();
      expect(init.rl.question.args[0][0]).to.contain(text.CHOOSE_PROGRAMMING_LANGUAGE_QUESTION);
      expect(init.rl.question.args[0][0]).to.contain('javascript');
    });

    it('should resolve to a choosen programming language', function() {
      program.PROGRAMMING_LANGUAGUES = ['javascript'];
      var deferred = { resolve: spy() };
      dependencies.q.defer = stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: stub().callsArgWith(1, '1') };
      init._getProgrammingLanguage();
      deferred.resolve.should.have.been.calledOnce;
      deferred.resolve.should.have.been.calledWith('javascript');
    });

    it('should re-ask if an invalid option is given', function() {
      program.PROGRAMMING_LANGUAGUES = ['javascript'];
      text.CHOOSE_PROGRAMMING_LANGUAGE_WRONG_ANSWER = 'wrong-answer';
      var deferred = { resolve: spy() };
      dependencies.q.defer = stub().returns(deferred);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: stub() };
      init.rl.question.onCall(0).callsArgWith(1, 'invalid-option');
      init.rl.question.onCall(1).callsArgWith(1, '1');
      init._getProgrammingLanguage();
      eventually(function() {
        init.rl.question.should.have.been.calledTwice;
        expect(init.rl.question.args[1][0]).to.contain(text.CHOOSE_PROGRAMMING_LANGUAGE_WRONG_ANSWER);
        expect(init.rl.question.args[1][0]).to.contain('javascript');
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith('javascript');
      });
    });
  });

  describe('#_getStorageFolder()', function() {
    it('should return a promise', function() {
      program.PROGRAMMING_LANGUAGUES = ['javascript'];
      dependencies.q.defer = stub().returns({ promise: 'promise' });
      dependencies.fs.existsSync = stub().returns(true);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: function() {} };
      expect(init._getStorageFolder()).to.equal('promise');
    });

    it('should default to localization/', function() {
      program.DEFAULT_STORAGE_FOLDER = 'localizations';
      var cwdStub = stub(process, 'cwd');
      cwdStub.returns('current-working-directory');
      dependencies.fs.existsSync = stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: spy() };
      init._getStorageFolder();
      expect(init.rl.question.args[0][0]).to.contain('localizations');
      cwdStub.restore();
    });

    it('if an app/ folder exists, it should default to app/localizations', function() {
      program.DEFAULT_STORAGE_FOLDER = 'localizations';
      var cwdStub = stub(process, 'cwd');
      cwdStub.returns('current-working-directory');
      dependencies.fs.existsSync = stub();
      dependencies.fs.existsSync.withArgs('current-working-directory/app').returns(true);
      dependencies.fs.existsSync.returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: spy() };
      init._getStorageFolder();
      expect(init.rl.question.args[0][0]).to.contain('app/localizations');
      cwdStub.restore();
    });

    it('if an application/ folder exists, it should default to application/localizations', function() {
      program.DEFAULT_STORAGE_FOLDER = 'localizations';
      var cwdStub = stub(process, 'cwd');
      cwdStub.returns('current-working-directory');
      dependencies.fs.existsSync = stub();
      dependencies.fs.existsSync.withArgs('current-working-directory/application').returns(true);
      dependencies.fs.existsSync.returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: spy() };
      init._getStorageFolder();
      expect(init.rl.question.args[0][0]).to.contain('application/localizations');
      cwdStub.restore();
    });

    it('if empty option is provided it should resolve to default option', function(done) {
      program.DEFAULT_STORAGE_FOLDER = 'localizations';
      var deferred = { resolve: spy() };
      dependencies.q.defer = stub().returns(deferred);
      var cwdStub = stub(process, 'cwd');
      cwdStub.returns('current-working-directory');
      dependencies.fs.existsSync = stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: stub().callsArgWith(1, '') };
      init._getStorageFolder();
      eventually(function() {
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith(program.DEFAULT_STORAGE_FOLDER);
        done();
      });
      cwdStub.restore();
    });

    it('if a path is choosen, it should resolve to a normalized version of that path', function(done) {
      program.DEFAULT_STORAGE_FOLDER = 'localizations';
      var deferred = { resolve: spy() };
      dependencies.q.defer = stub().returns(deferred);
      var cwdStub = stub(process, 'cwd');
      cwdStub.returns('current-working-directory');
      dependencies.fs.existsSync = stub().returns(false);
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.rl =  { question: stub().callsArgWith(1, 'path//') };
      init._getStorageFolder();
      eventually(function() {
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith('path/');
        done();
      });
      cwdStub.restore();
    });
  });

  describe('#_setDefaultSrc()', function() {
    it('set default source map', function() {
      program.DEFAULT_SOURCE_MAP = { 'programming-language1': 'default-source-for-programming-language1' }
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.json.programmingLanguage = 'programming-language1';
      init._setDefaultSrc();
      expect(init.json.source).to.eql('default-source-for-programming-language1');
    });
  });

  describe('#_writeProject()', function() {
    it('should write a project file if it does not exists', function() {
      var cwdStub = stub(process, 'cwd');
      cwdStub.returns('current-working-directory');
      dependencies.fs.existsSync = stub();
      dependencies.fs.existsSync.withArgs('current-working-directory/l10ns.json').returns(false);
      dependencies.fs.existsSync.returns(true);
      dependencies.fs.writeFileSync = spy();
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.json = {};
      init._writeProject();
      dependencies.fs.writeFileSync.should.have.been.calledOnce;
      dependencies.fs.writeFileSync.should.have.been.calledWith('current-working-directory/l10ns.json', '{\n  "defaultProject": "",\n  "projects": {\n    "": {}\n  }\n}');
      cwdStub.restore();
    });

    it('should not write a project file if it does exists', function() {
      var cwdStub = stub(process, 'cwd');
      cwdStub.returns('current-working-directory');
      dependencies.fs.existsSync = stub();
      dependencies.fs.existsSync.returns(true);
      dependencies.fs.writeFileSync = spy();
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.json = {};
      init._writeProject();
      dependencies.fs.writeFileSync.should.have.not.been.called;
      cwdStub.restore();
    });

    it('should make cache folder if it does not exists', function() {
      var cwdStub = stub(process, 'cwd');
      cwdStub.returns('current-working-directory');
      dependencies.fs.existsSync = stub();
      dependencies.fs.existsSync.withArgs('current-working-directory/.l10ns').returns(false);
      dependencies.fs.existsSync.returns(true);
      dependencies.fs.mkdirSync = spy();
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.json = {};
      init._writeProject();
      dependencies.fs.mkdirSync.should.have.been.calledOnce;
      dependencies.fs.mkdirSync.should.have.been.calledWith('current-working-directory/.l10ns');
      cwdStub.restore();
    });

    it('should not make cache folder if it does exists', function() {
      var cwdStub = stub(process, 'cwd');
      cwdStub.returns('current-working-directory');
      dependencies.fs.existsSync = stub();
      dependencies.fs.existsSync.returns(true);
      dependencies.fs.mkdirSync = spy();
      var init = new (proxyquire('../libraries/init', dependencies).Init);
      init.json = {};
      init._writeProject();
      dependencies.fs.mkdirSync.should.have.not.been.called;
      cwdStub.restore();
    });
  });
});
