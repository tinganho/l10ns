
/**
 * Module dependencies
 */

var Edit = require('../lib/edit').Edit;

module.exports = function() {
  describe('Edit', function() {
    describe('#contructor', function() {
      it('should set default locale form global config', function() {
        var edit = new Edit;
        expect(edit.defaultLocale).to.equal(cf.defaultLocale);
      }); 
    });

    describe('#_getKey', function() {
      it('should get key from latest search if it begins with `@`', function() {
        var edit = new Edit;
        edit._getKeyFromLatestSearch= sinon.spy();
        edit._getKey('@1');
        edit._getKeyFromLatestSearch.should.have.been.calledOnce;
      });

      it('should get formated key whenver ref begins with `@`', function() {
        var edit = new Edit;
        edit._getKeyFromLatestSearch = sinon.spy();
        edit._getKey('@1');
        edit._getKeyFromLatestSearch.should.have.been.calledWith('1');
      });

      it('should get key from latest translations if it begins with `-`', function() {
        var edit = new Edit;
        edit._getKeyFromLatestTranslations = sinon.spy();
        edit._getKey('-1');
        edit._getKeyFromLatestTranslations.should.have.been.calledOnce;
        edit._getKeyFromLatestTranslations.should.have.been.calledWith(-1);
      });

      it('should return the same ref if it isn\'t beginning with `@` or `-`', function() {
        var edit = new Edit;
        var res = edit._getKey('test');
        expect(res).to.equal('test');
      });
    });
  });
};
