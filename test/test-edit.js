
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
  });
};
