
/**
 * Module dependencies
 */

var Init = require('../lib/init').Init;

module.exports = function() {
  describe('Init', function() {
    describe('#constructor', function() {
      it('should set json property to null', function() {
        var init = new Init;
        expect(init.json).to.eql(null);
      });

      it('should set intro property to the one specified in global config', function() {
        var init = new Init;
        expect(init.intro).to.eql(cf.INTRO);
      });
    });

    describe('#init', function() {
      it('should output introduction', function() {
        var init = new Init;
        init._outputIntroduction = sinon.spy();
        init.init();
        init._outputIntroduction.should.have.been.calledOnce;
      });
    });

    describe('#_createReadlineInterface', function() {
      it('should create a readline interface', function() {
        var readlineStub = { createInterface : sinon.spy() };
        var arg = { input: process.stdin, output: process.stdout, terminal : false };
        var Init = proxyquire('../lib/init', { readline : readlineStub }).Init;
        var init = new Init;
        init._createReadlineInterface();
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
        process.stdout.write.should.have.been.calledWith(cf.INTRO);
        process.stdout.write.restore();
      });
    });
  });
};
