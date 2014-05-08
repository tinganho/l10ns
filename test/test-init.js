
/**
 * Module dependencies
 */

var Init = require('../libraries/init').Init
  , Q = require('q')
  , _ = require('underscore');

module.exports = function() {
  describe('Init', function() {
    describe('#constructor', function() {
      it('should set json property to null', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.json).to.eql(cf.DEFAULT_CONFIGS);
      });

      it('should set initIntro property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.initIntro).to.eql(cf.INIT_INTRO);
      });

      it('should set localesDescription property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.localesDescription).to.eql(cf.LOCALES_DESCRIPTION);
      });

      it('should set localesSyntax property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.localesSyntax).to.eql(cf.LOCALES_SYNTAX);
      });

      it('should set localesWrongAnswer property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.localesWrongAnswer).to.eql(cf.LOCALES_WRONG_ANSWER);
      });

      it('should set localesDescription property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.localesDescription).to.eql(cf.LOCALES_DESCRIPTION);
      });

      it('should set defaultLocaleCode property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.defaultLocaleCode).to.eql(cf.DEFAULT_LOCALE_CODE);
      });

      it('should set defaultLocaleQuestion property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.defaultLocaleQuestion).to.eql(cf.DEFAULT_LOCALE_QUESTION);
      });

      it('should set defaultLocaleWrongAnswer property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.defaultLocaleWrongAnswer).to.eql(cf.DEFAULT_LOCALE_WRONG_ANSWER);
      });

      it('should set defaultLocaleCode property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.defaultLocaleCode).to.eql(cf.DEFAULT_LOCALE_CODE);
      });

      it('should set programmingLanguages property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.programmingLanguages).to.eql(cf.PROGRAMMING_LANGUAGUES);
      });

      it('should set chooseProgrammingLanguagePrompt property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.chooseProgrammingLanguagePrompt).to.eql(cf.CHOOSE_PROGRAMMING_LANGUAGE_PROMPT);
      });

      it('should set chooseProgrammingLanguageWrongAnswer property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.chooseProgrammingLanguageWrongAnswer).to.eql(cf.CHOOSE_PROGRAMMING_LANGUAGE_WRONG_ANSWER);
      });

      it('should set programmingLanguageToDefaultSrcMap property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.programmingLanguageToDefaultSrcMap).to.eql(cf.PROGRAMMING_LANGUAGUE_TO_DEFAULT_SRC_MAP);
      });

      it('should set defaultOutputFolder property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.defaultOutputFolder).to.eql(cf.DEFAULT_OUTPUT_FOLDER);
      });

      it('should set defaultOutputFolderPrompt property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.defaultOutputFolderPrompt).to.eql(cf.DEFAULT_OUTPUT_FOLDER_PROMPT);
      });

      it('should set defaultOutputFolderWrongAnswer property to the one specified in global config', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        expect(init.defaultOutputFolderWrongAnswer).to.eql(cf.DEFAULT_OUTPUT_FOLDER_WRONG_ANSWER);
      });
    });

    describe('#init', function() {
      it('should create a readline interface', function() {
        sinon.stub(process, 'exit');
        var fsStub = { existsSync : sinon.stub().returns(false) };
        var Init = proxyquire('../libraries/init', {
          'findup-sync' : sinon.stub().returns(false),
          fs : fsStub
        }).Init;
        init._createReadlineInterface = sinon.spy();
        init._outputIntroduction = sinon.spy();
        init._getLocales = sinon.stub().returns(Q.reject());
        init.init();
        init._createReadlineInterface.should.have.been.calledOnce;
        process.exit.restore();
      });

      it('should output an introduction', function() {
        var init = new Init;
        init._createReadlineInterface = sinon.spy();
        init._outputIntroduction = sinon.spy();
        init._getLocales = sinon.stub().returns(Q.reject());
        init.init();
        init._outputIntroduction.should.have.been.calledOnce;
      });

      it('should get locales', function() {
        var init = new Init;
        init._createReadlineInterface = function() {};
        init._outputIntroduction = function() {};
        init._getLocales = sinon.stub().returns(Q.reject());
        init.init();
        init._getLocales.should.have.been.calledOnce;
      });

      it('should get and set default locale if locales have been got', function(done) {
        var locales = { 'en-US' : 'English (US)'};
        var init = new Init;
        init._createReadlineInterface = function() {};
        init._outputIntroduction = function() {};
        init._getLocales = sinon.stub().returns(Q.resolve(locales));
        init._getDefaultLocale = sinon.stub().returns(Q.reject());
        init.init();
        init._getLocales.should.have.been.calledOnce;
        _.defer(function() {
          init._getDefaultLocale.should.have.been.calledOnce;
          expect(init.json.locales).to.be.eql(locales);
          done();
        });
      });

      it('should get and set default programming language if default locales have been got', function(done) {
        var locales = { 'en-US' : 'English (US)'};
        var init = new Init;
        init._createReadlineInterface = function() {};
        init._outputIntroduction = function() {};
        init._getLocales = sinon.stub().returns(Q.resolve(locales));
        init._getDefaultLocale = sinon.stub().returns(Q.resolve('en-US'));
        init._getDefaultProgrammingLanguage = sinon.stub().returns(Q.reject());
        init.init();
        init._getLocales.should.have.been.calledOnce;
        _.defer(function() {
          init._getDefaultLocale.should.have.been.calledOnce;
          init._getDefaultProgrammingLanguage.should.have.been.calledOnce;
          expect(init.json.defaultLocale).to.be.equal('en-US');
          done();
        });
      });

      it('should get and set default output if default programmingLanguage have been got', function(done) {
        var locales = { 'en-US' : 'English (US)'};
        var init = new Init;
        init._createReadlineInterface = function() {};
        init._outputIntroduction = function() {};
        init._getLocales = sinon.stub().returns(Q.resolve(locales));
        init._getDefaultLocale = sinon.stub().returns(Q.resolve('en-US'));
        init._getDefaultProgrammingLanguage = sinon.stub().returns(Q.resolve('javascript'));
        init._setDefaultOutput = sinon.stub().returns(Q.reject());
        init.init();
        init._getLocales.should.have.been.calledOnce;
        _.defer(function() {
          init._getDefaultLocale.should.have.been.calledOnce;
          init._getDefaultProgrammingLanguage.should.have.been.calledOnce;
          init._setDefaultOutput.should.have.been.calledOnce;
          expect(init.json.programmingLanguage).to.be.equal('javascript');
          done();
        });
      });

      it('should set default src and write project', function(done) {
        var locales = { 'en-US' : 'English (US)'};
        var init = new Init;
        init._createReadlineInterface = function() {};
        init._outputIntroduction = function() {};
        init._getLocales = sinon.stub().returns(Q.resolve(locales));
        init._getDefaultLocale = sinon.stub().returns(Q.resolve('en-US'));
        init._getDefaultProgrammingLanguage = sinon.stub().returns(Q.resolve('javascript'));
        init._setDefaultOutput = sinon.stub().returns(Q.resolve('some/output'));
        init._setDefaultSrc = sinon.spy();
        init._writeProject = sinon.spy();
        init.init();
        init._getLocales.should.have.been.calledOnce;
        _.defer(function() {
          init._getDefaultLocale.should.have.been.calledOnce;
          init._getDefaultProgrammingLanguage.should.have.been.calledOnce;
          init._setDefaultOutput.should.have.been.calledOnce;
          init._setDefaultSrc.should.have.been.calledOnce;
          init._writeProject.should.have.been.calledOnce;
          expect(init.json.programmingLanguage).to.be.equal('javascript');
          done();
        });
      });
    });

    describe('#_createReadlineInterface', function() {
      it('should create a readline interface', function() {
        var readlineStub = { createInterface : sinon.spy() };
        var arg = { input: process.stdin, output: process.stdout, terminal : false };
        var Init = proxyquire('../libraries/init', { readline : readlineStub }).Init;
        var init = new Init;
        init._createReadlineInterface();
        // Twice because we are exporting an instance too
        readlineStub.createInterface.should.have.been.calledOnce;
        readlineStub.createInterface.should.have.been.calledWith(arg);
      });
    });

    describe('#_outputIntroduction', function() {
      it('should write to stdoutput with content from global config', function() {
        sinon.stub(process.stdout, 'write');
        var init = new Init;
        init._outputIntroduction();
        process.stdout.write.should.have.been.calledOnce;
        process.stdout.write.should.have.been.calledWith(cf.INIT_INTRO);
        process.stdout.write.restore();
      });
    });

    describe('#_getLocales', function() {
      it('should ask the user to input locales', function() {
        var question = 'Please add at least one locale to your project';
        var init = new Init;
        init.rl = { question : sinon.spy() };
        init._getLocales();
        init.rl.question.should.have.been.calledWithMatch(question);
      });

      it('should parse locales from colon separated string to JSON', function() {
        var question = 'Please add at least one locale to your project';
        var deferredStub = { resolve : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferredStub) };
        var Init = proxyquire('../libraries/init', { q : qStub }).Init
        var init = new Init;
        init.rl = { question : sinon.stub().callsArgWith(1, 'en-US:English (US)') };
        init._getLocales();
        deferredStub.resolve.should.have.been.calledWith({ 'en-US' : 'English (US)' });
      });

      it('should parse multiple locales from colon separated string to JSON', function() {
        var question = 'Please add at least one locale to your project';
        var deferredStub = { resolve : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferredStub) };
        var Init = proxyquire('../libraries/init', { q : qStub }).Init
        var init = new Init;
        init.rl = { question : sinon.stub().callsArgWith(1, 'en-US:English (US),zh-CN:Chinese') };
        init._getLocales();
        deferredStub.resolve.should.have.been.calledWith({ 'en-US' : 'English (US)', 'zh-CN' : 'Chinese' });
      });

      it('should be able to use default locale', function() {
        var question = 'Please add at least one locale to your project';
        var deferredStub = { resolve : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferredStub) };
        var Init = proxyquire('../libraries/init', { q : qStub }).Init
        var init = new Init;
        init.rl = { question : sinon.stub().callsArgWith(1, '') };
        init._getLocales();
        var defaultLocale = {};
        defaultLocale[init.defaultLocaleCode] = init.defaultLocaleName;
        deferredStub.resolve.should.have.been.calledWith(defaultLocale);
      });

      it('should ask the question again if user provides wrong syntax', function(done) {
        var deferredStub = { resolve : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferredStub) };
        var Init = proxyquire('../libraries/init', { q : qStub }).Init
        var init = new Init;
        var n = 0;
        init.rl = { question : function(question, callback) {
          n++;
          if(n < 2) callback('wrong-locale-syntax');
        }};
        init._getLocales();
        _.defer(function() {
          expect(n).to.equal(2);
          done();
        });
      });
    });

    describe('#_getDefaultLocale', function() {
      it('should set the default locale to the provided locales if the locales is only one locale', function() {
        var deferredStub = { resolve : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferredStub) };
        var Init = proxyquire('../libraries/init', { q : qStub }).Init;
        var init = new Init;
        init._getDefaultLocale({ 'en-US' : 'English (US)' });
        deferredStub.resolve.should.have.been.calledWith('en-US');
      });

      it('should ask to choose locale if two locales have been set to the project', function() {
        var deferredStub = { resolve : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferredStub) };
        var Init = proxyquire('../libraries/init', { q : qStub }).Init;
        var init = new Init;
        init.rl = { question : sinon.spy() };
        init._getDefaultLocale({ 'en-US' : 'English (US)', 'zh-CN' : 'Chinese' });
        init.rl.question.should.have.been.calledOnce;
      });

      it('should map the user selected option to the correct locale', function() {
        var deferredStub = { resolve : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferredStub) };
        var Init = proxyquire('../libraries/init', { q : qStub }).Init;
        var init = new Init;
        init.rl = { question : sinon.stub().callsArgWith(1, '1') };
        init._getDefaultLocale({ 'en-US' : 'English (US)', 'zh-CN' : 'Chinese' });
        deferredStub.resolve.should.have.been.calledWith('en-US');
      });

      it('should ask the user again if wrong option is provided', function(done) {
        var deferredStub = { resolve : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferredStub) };
        var Init = proxyquire('../libraries/init', { q : qStub }).Init;
        var init = new Init;
        var n = 0;
        init.rl = { question : function(question, callback) {
          n++;
          if(n < 2) callback('3');
        }};
        init._getDefaultLocale({ 'en-US' : 'English (US)', 'zh-CN' : 'Chinese' });
        _.defer(function() {
          expect(n).to.equal(2);
          done();
        });
      });
    });

    describe('#_getDefaultProgrammingLanguage', function() {
      it('should ask what kind programming language the user want to set to his project', function() {
        var init = new Init;
        init.rl = { question : sinon.spy() };
        init._getDefaultProgrammingLanguage();
        init.rl.question.should.have.been.calledOnce;
      });

      it('should map the user chosen option with the available programming languages', function() {
        var deferredStub = { resolve : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferredStub) };
        var Init = proxyquire('../libraries/init', { q : qStub }).Init;
        var init = new Init;
        init.rl = { question : sinon.stub().callsArgWith(1, 1) };
        init._getDefaultProgrammingLanguage();
        deferredStub.resolve.should.have.been.calledWith('javascript');
        init.rl = { question : sinon.stub().callsArgWith(1, 2) };
        init._getDefaultProgrammingLanguage();
        deferredStub.resolve.should.have.been.calledWith('go');
      });

      it('should ask the user again if wrong option is provided', function(done) {
        var init = new Init;
        var n = 0;
        init.rl = { question : function(question, callback) {
          n++;
          if(n < 2) callback('odd-language');
        }};
        init._getDefaultProgrammingLanguage();
        _.defer(function() {
          expect(n).to.equal(2);
          done();
        });
      });
    });

    describe('#_setDefaultOutput', function() {
      it('should set the default output to l10n/ folder if there doesn\'t exist any app/ folder', function() {
        var deferredStub = { resolve : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferredStub) };
        var fsStub = { existsSync : sinon.stub().returns(false) };
        var Init = proxyquire('../libraries/init', { fs : fsStub, q : qStub }).Init;
        var init = new Init;
        init.rl = { question : sinon.stub().callsArgWith(1, '') };
        init._setDefaultOutput();
        deferredStub.resolve.should.have.been.calledWith('l10n/');
      });

      it('should set the default output to app/l10n/ folder if there does exist an app/ folder', function() {
        var deferredStub = { resolve : sinon.spy() };
        var qStub = { defer : sinon.stub().returns(deferredStub) };
        var fsStub = { existsSync : sinon.stub().returns(true) };
        var Init = proxyquire('../libraries/init', { fs : fsStub, q : qStub }).Init;
        var init = new Init;
        init.rl = { question : sinon.stub().callsArgWith(1, '') };
        init._setDefaultOutput();
        deferredStub.resolve.should.have.been.calledWith('app/l10n/');
      });
    });

    describe('#_setDefaultSrc', function() {
      it('should set map the programming language with the right default source', function() {
        var init = new Init;
        init.json.programmingLanguage = 'javascript';
        init._setDefaultSrc();
        expect(init.json.src).to.eql(['**/*.js']);
      });
    });

    describe('#writeProject', function() {
      it('should write gt.json file if it doesn\'t exists', function() {
        var existsSyncStub = sinon.stub()
        existsSyncStub.onCall(0).returns(false);
        existsSyncStub.onCall(1).returns(true);
        var fsStub = { existsSync : existsSyncStub, writeFile : sinon.spy() };
        var Init = proxyquire('../libraries/init', { fs : fsStub }).Init;
        var init = new Init;
        init.json = JSON.stringify({});
        init._writeProject();
        fsStub.writeFile.should.have.been.calledOnce;
      });

      it('should make a l10n folder if it doesn\' already exists', function() {
        var existsSyncStub = sinon.stub()
        existsSyncStub.onCall(0).returns(true);
        existsSyncStub.onCall(1).returns(false);
        var fsStub = { existsSync : existsSyncStub, mkdir : sinon.spy() };
        var Init = proxyquire('../libraries/init', { fs : fsStub }).Init;
        var init = new Init;
        init._writeProject();
        fsStub.mkdir.should.have.been.calledOnce;
      });
    });
  });
};
