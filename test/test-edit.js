
/**
 * Module dependencies
 */

var Edit = require('../lib/edit').Edit
  , Q = require('q');

module.exports = function() {
  describe('Edit', function() {
    describe('#contructor', function() {
      it('should set default locale from global config', function() {
        var edit = new Edit;
        expect(edit.defaultLocale).to.equal(cf.defaultLocale);
      });

      it('should set locales from global config', function() {
        var edit = new Edit;
        expect(edit.locales).to.equal(cf.locales);
      });
    });

    describe('#_getKey', function() {
      it('should eventually return an error if supplied key is not of type string', function(done) {
        var edit = new Edit;
        edit._getKey(1).should.be.rejectedWith(/first parameter is not of type string/).notify(done);
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
        edit._getKey('%1').then(function(key) {
          edit._getKeyFromLatestTranslations.should.have.been.calledOnce;
          edit._getKeyFromLatestTranslations.should.have.been.calledWith(1);
          done();
        });
      });

      it('should return the same ref if it isn\'t beginning with `@` or `-`', function(done) {
        var edit = new Edit;
        edit._getKey('test').should.eventually.equal('test').notify(done);
      });
    });

    describe('#_getKeyFromLatestSearch', function() {
      it('should eventually return a key from a search reference of type string', function(done) {
        var fileStub = { readSearchTranslations : sinon.stub().returns(Q.resolve([{
          ref : 'test'
        }]))};
        var Edit = proxyquire('../lib/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestSearch('1').should.eventually.equal('test').notify(done);
      });

      it('should eventually return a key from a search reference of type number', function(done) {
        var fileStub = { readSearchTranslations : sinon.stub().returns(Q.resolve([{
          ref : 'test'
        }]))};
        var Edit = proxyquire('../lib/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestSearch(1).should.eventually.equal('test').notify(done);
      });

      it('should reject, if ref is smaller than 1', function(done) {
        var fileStub = { readSearchTranslations : sinon.stub().returns(Q.resolve([{
          ref : 'test'
        }]))};
        var Edit = proxyquire('../lib/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestSearch(0).should.be.rejectedWith(TypeError, /ref is out of index/).notify(done);
      });

      it('should reject, if ref is bigger than cached search length ', function(done) {
        var fileStub = { readSearchTranslations : sinon.stub().returns(Q.resolve([{
          ref : 'test'
        }]))};
        var Edit = proxyquire('../lib/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestSearch(2).should.be.rejectedWith(TypeError, /ref is out of index/).notify(done);
      });
    });

    describe('#_getKeyFromLatestTranslations', function() {
      it('should reject if ref is smaller than 1', function(done) {
        var fileStub = { readTranslations : sinon.stub().returns([]) };
        var Edit = proxyquire('../lib/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestTranslations(0).should.be.rejectedWith(TypeError, /ref is out of index/).notify(done);
      });

      it('should reject if ref is out of index in translations', function(done) {
        var fileStub = { readTranslations : sinon.stub().returns([{}, {}]) };
        var Edit = proxyquire('../lib/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestTranslations(-3).should.be.rejectedWith(TypeError, /ref is out of index/).notify(done);
      });

      it('should reject if ref is out of index in translations', function(done) {
        var fileStub = { readTranslations : sinon.stub().returns([{}, {}]) };
        var Edit = proxyquire('../lib/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestTranslations(-3).should.be.rejectedWith(TypeError, /ref is out of index/).notify(done);
      });

      it('should return key', function(done) {
        var fileStub = { readTranslations : sinon.stub().returns({ 'en-US' : [{ key : 'test' }] }) };
        var Edit = proxyquire('../lib/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestTranslations(1).should.become('test').notify(done);
      });
    });

    describe('#_replace', function() {
      it('should set the', function() {

      });
    });
  });
};
