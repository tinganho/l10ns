
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
        expect(init.json).to.eql({});
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
        // Twice because we are exporting an instance too
        readlineStub.createInterface.should.have.been.calledTwice;
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
