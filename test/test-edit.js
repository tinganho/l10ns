
/**
 * Module dependencies
 */

var Edit = require('../libraries/edit').Edit
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

    describe('#edit', function() {
      it('should show an error if first parameter is not of type string', function() {
        var logStub = { error : sinon.spy() };
        var Edit = proxyquire('../libraries/edit', { './_log' : logStub }).Edit;
        var edit = new Edit;
        edit.edit(1);
        logStub.error.should.have.been.calledOnce;
        logStub.error.should.have.been.calledWith('ref must be of type string');
      });

      it('should show an error if second parameter is not of type string', function() {
        var logStub = { error : sinon.spy() };
        var Edit = proxyquire('../libraries/edit', { './_log' : logStub }).Edit;
        var edit = new Edit;
        edit.edit('test', 1);
        logStub.error.should.have.been.calledOnce;
        logStub.error.should.have.been.calledWith('value must be of type string');
      });

      it('should show an error if third parameter locale is not in global config', function() {
        var logStub = { error : sinon.spy() };
        var Edit = proxyquire('../libraries/edit', { './_log' : logStub }).Edit;
        var edit = new Edit;
        edit.locales = { 'en-US' : 'English' };
        edit.edit('test', 'wef', 'zh-CN');
        logStub.error.should.have.been.calledOnce;
        logStub.error.should.have.been.calledWith('locale is not defined');
      });

      it('should write the translaton on edit', function(done) {
        var logStub = { success : sinon.spy() };
        var fileStub = { writeTranslations : sinon.stub().callsArg(1) };
        var Edit = proxyquire('../libraries/edit', {  './file' : fileStub, './_log' : logStub }).Edit;
        var edit = new Edit;
        edit._getKey = sinon.stub().returns(Q.resolve('tewefwst'));
        edit._replace = sinon.stub().returns({});
        edit.edit('test', 'test', 'zh-CN');
        setTimeout(function() {
          expect(fileStub.writeTranslations.args[0][0]).to.eql({});
          fileStub.writeTranslations.should.have.been.calledOnce;
          done();
        }, 20);
      });

      it('should show succes text', function(done) {
        var logStub = { success : sinon.spy() };
        var fileStub = { writeTranslations : sinon.stub().callsArg(1) };
        var Edit = proxyquire('../libraries/edit', {  './file' : fileStub, './_log' : logStub }).Edit;
        var edit = new Edit;
        edit._getKey = sinon.stub().returns(Q.resolve('tewefwst'));
        edit._replace = sinon.stub().returns({});
        edit.edit('test', 'test', 'zh-CN');
        setTimeout(function() {
          logStub.success.should.have.been.calledWithMatch('successfully');
          logStub.success.should.have.been.calledOnce;
          done();
        }, 20);
      });

      it('should show error if get key fails', function(done) {
        var logStub = { error : sinon.spy() };
        var Edit = proxyquire('../libraries/edit', { './_log' : logStub }).Edit;
        var edit = new Edit;
        var err = new TypeError;
        edit._getKey = sinon.stub().returns(Q.reject(err));
        edit.edit('test', 'test', 'en-US');
        setTimeout(function() {
          logStub.error.should.have.been.calledWithMatch('Couldn\'t edit your translations');
          logStub.error.should.have.been.calledOnce;
          done();
        }, 20);
      })
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
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestSearch('1').should.eventually.equal('test').notify(done);
      });

      it('should eventually return a key from a search reference of type number', function(done) {
        var fileStub = { readSearchTranslations : sinon.stub().returns(Q.resolve([{
          ref : 'test'
        }]))};
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestSearch(1).should.eventually.equal('test').notify(done);
      });

      it('should reject, if ref is smaller than 1', function(done) {
        var fileStub = { readSearchTranslations : sinon.stub().returns(Q.resolve([{
          ref : 'test'
        }]))};
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestSearch(0).should.be.rejectedWith(TypeError, /ref is out of index/).notify(done);
      });

      it('should reject, if ref is bigger than cached search length ', function(done) {
        var fileStub = { readSearchTranslations : sinon.stub().returns(Q.resolve([{
          ref : 'test'
        }]))};
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestSearch(2).should.be.rejectedWith(TypeError, /ref is out of index/).notify(done);
      });
    });

    describe('#_getKeyFromLatestTranslations', function() {
      it('should reject if ref is smaller than 1', function(done) {
        var fileStub = { readTranslations : sinon.stub().returns([]) };
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestTranslations(0).should.be.rejectedWith(TypeError, /ref is out of index/).notify(done);
      });

      it('should reject if ref is out of index in translations', function(done) {
        var fileStub = { readTranslations : sinon.stub().returns([{}, {}]) };
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestTranslations(-3).should.be.rejectedWith(TypeError, /ref is out of index/).notify(done);
      });

      it('should reject if ref is out of index in translations', function(done) {
        var fileStub = { readTranslations : sinon.stub().returns([{}, {}]) };
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestTranslations(-3).should.be.rejectedWith(TypeError, /ref is out of index/).notify(done);
      });

      it('should return key', function(done) {
        var fileStub = { readTranslations : sinon.stub().returns({ 'en-US' : [{ key : 'test' }] }) };
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        edit._getKeyFromLatestTranslations(1).should.become('test').notify(done);
      });
    });

    describe('#_replace', function() {
      it('should set the default locale if no locale is specified', function() {
        var fileStub = { readTranslations : sinon.stub().returns({ 'en-US' : { 'test' : { value : [], text : '' }}}) };
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        var res = edit._replace('test', 'test');
        expect(res[cf.defaultLocale]['test'].value).to.equal('test');
        expect(res[cf.defaultLocale]['test'].text).to.equal('test');
      });

      it('should show an error if locale is not translations', function() {
        var logStub = { error : sinon.spy() };
        var fileStub = { readTranslations : sinon.stub().returns({ 'en-US' : { 'test' : { value : [], text : '' }}}) };
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub, './_log' : logStub }).Edit;
        var edit = new Edit;
        var res = edit._replace('test', 'test', 'zh-CN');
        logStub.error.should.have.been.calledWithMatch('is not in current translations');
      });

      it('should show an error if key is not translations', function() {
        var logStub = { error : sinon.spy() };
        var fileStub = { readTranslations : sinon.stub().returns({ 'en-US' : { 'test' : { value : [], text : '' }}}) };
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub, './_log' : logStub }).Edit;
        var edit = new Edit;
        var res = edit._replace('test2', 'test', 'en-US');
        logStub.error.should.have.been.calledWithMatch('is not in current translations');
      });

      it('should edit value and text', function() {
        var fileStub = { readTranslations : sinon.stub().returns({ 'en-US' : { 'test' : { value : [], text : '' }}}) };
        var Edit = proxyquire('../libraries/edit', { './file' : fileStub }).Edit;
        var edit = new Edit;
        var res = edit._replace('test', 'test');
        expect(res[cf.defaultLocale]['test'].value).to.equal('test');
        expect(res[cf.defaultLocale]['test'].text).to.equal('test');
      });
    });
  });
};
