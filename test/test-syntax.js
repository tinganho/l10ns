
/**
 * Module dependencies
 */

var fixtures = require('./fixtures/json')
  , Syntax = require('../libraries/syntax').Syntax;

module.exports = function() {
  describe('Syntax', function() {
    describe('#hasErrorDuplicate', function() {
      it('should return false whenever newTranslations don\'t have the current key', function() {
        var syntax = new Syntax;
        var res = syntax.hasErrorDuplicate(fixtures.readTranslationJSON['en-US'], 'some-other-key', []);
        expect(res).to.be.false;
      });

      it('should return true if the variable array provided in the'
      + 'parameter doesn\'t have the same length as the some old'
      + 'translation variable array providied before', function() {
        var syntax = new Syntax;
        var res = syntax.hasErrorDuplicate(fixtures.readTranslationJSON['en-US'], 'test', ['${test1}']);
        expect(res).to.be.true;
      });

      it('should return true if the variables have the same length but different names', function() {
        var syntax = new Syntax;
        var res = syntax.hasErrorDuplicate(fixtures.readTranslationJSON['en-US'], 'test', ['${test1}', '${some-other-key}']);
        expect(res).to.be.true;
      });

      it('should return false if the variables have the same length and same names', function() {
        var syntax = new Syntax;
        var res = syntax.hasErrorDuplicate(fixtures.readTranslationJSON['en-US'], 'test', ['${test1}', '${test2}']);
        expect(res).to.be.false;
      });
    });
  });
};
