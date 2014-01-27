
/**
 * Module dependencies
 */

var Edit = require('../lib/edit').Edit
  , Q = require('q');

module.exports = function() {
  describe('Edit', function() {
    describe('#contructor', function() {
      it('should set default locale form global config', function() {
        var edit = new Edit;
        expect(edit.defaultLocale).to.equal(cf.defaultLocale);
      });
    });

    describe('#_getKey', function() {
      it('should eventually return an error if supplied key is not of type string', function(done) {
        var edit = new Edit;
        edit._getKey(1).should.be.rejectedWith('r').notify(done);
      });

      it('should get key from latest search if it begins with `@`', function(done) {
        var edit = new Edit;
        edit._getKeyFromLatestSearch = sinon.stub().returns(Q.resolve('test'));
        edit._getKey('@1').then(function(key) {
          edit._getKeyFromLatestSearch.should.have.been.calledOnce;
          done();
        });
      });

      it('should get formated key whenever ref begins with `@`', function(done) {
        var edit = new Edit;
        edit._getKeyFromLatestSearch = sinon.stub().returns(Q.resolve('test'));
        edit._getKey('@1').then(function(key) {
          edit._getKeyFromLatestSearch.should.have.been.calledWith('1');
          done();
        });
      });

      it('should get key from latest translations if it begins with `-`', function(done) {
        var edit = new Edit;
        edit._getKeyFromLatestTranslations = sinon.stub().returns(Q.resolve('test'));
        edit._getKey('-1').then(function(key) {
          edit._getKeyFromLatestTranslations.should.have.been.calledOnce;
          edit._getKeyFromLatestTranslations.should.have.been.calledWith(-1);
          done();
        });
      });

      it('should return the same ref if it isn\'t beginning with `@` or `-`', function(done) {
        var edit = new Edit;
        edit._getKey('test').should.eventually.equal('test').notify(done);
      });
    });

    describe('#_getKeyFromLatestSearch', function() {

    });
  });
};
