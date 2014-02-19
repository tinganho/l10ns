
/**
 * Module dependencies
 */

var Init = require('../lib/init').Init;

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
      // it('should output introduction', function() {
      //   var init = new Init;
      //   init._outputIntroduction = sinon.spy();
      //   init.getLocales = sinon.spy();
      //   init.init();
      //   init._outputIntroduction.should.have.been.calledOnce;
      // });
    });

    describe('#_createReadlineInterface', function() {
      it('should create a readline interface', function() {
        var readlineStub = { createInterface : sinon.spy() };
        var arg = { input: process.stdin, output: process.stdout, terminal : false };
        var Init = proxyquire('../lib/init', { readline : readlineStub }).Init;
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
  });
};
