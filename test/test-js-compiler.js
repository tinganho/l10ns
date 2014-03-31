
/**
 * Module dependencies
 */

var fixtures = require('./fixtures/json')
  , Compiler = require('../plugins/javascript/compiler');

module.exports = function() {

  describe('javascript compiler', function() {
    it('should get the right translations', function() {
      var fileStub = {};
      var Compiler = proxyquire('../plugins/javascript/compiler', { '../../lib/file' : fileStub});
      fileStub.readTranslations = sinon.stub().returns(fixtures.basicTranslation);
      var compiler = new Compiler();
      var translations = compiler._getTranslations('en-US');
      expect(translations).to.have.property('test');
    });

    describe('#_normalizeText', function() {
      it('should be able to normalize text containing \' to \\\'', function() {
        var compiler = new Compiler();
        var text = compiler._normalizeText('test \'');
        expect(text).to.have.string('\\\'');
      });

      it('should be able to normailze text containing \\', function() {
        var compiler = new Compiler();
        var text = compiler._normalizeText('test \\');
        expect(text).to.have.string('\\');
      });
    });

    describe('#_getNonTranslatedFunctionBodyString', function() {
      it('should be able to get a non-condition function body string', function() {
        var compiler = new Compiler();
        var text = compiler._getNonConditionsFunctionBodyString('test');
        expect(text).to.have.string('return \'test\';')
      });

      it('should be able to get a non-translated function body string', function() {
        var compiler = new Compiler();
        var text = compiler._getNonTranslatedFunctionBodyString('test');
        expect(text).to.have.string('return \'KEY_NOT_TRANSLATED: \' + \'test\' + \';\';')
      });
    });

    describe('#_getFunctionBodyString', function() {
      it('should get a non-translated function body string, whenever a key is not translated with if and else', function() {
        var compiler = new Compiler();
        var text = compiler._getFunctionBodyString(fixtures.ifElseConditions, 'test');
        expect(text).to.have.string('if');
        expect(text).to.have.string('else');
      });

      it('should get a condition function body string whenever a key is translated with if and else and else if', function() {
        var compiler = new Compiler();
        var text = compiler._getFunctionBodyString(fixtures.ifElseifElseConditions, 'test');
        expect(text).to.have.string('if');
        expect(text).to.have.string('else if');
        expect(text).to.have.string('else');
      });

      it('should get a condition function body string whenever you use &&', function() {
        var compiler = new Compiler();
        var text = compiler._getFunctionBodyString(fixtures.additionalConditionAnd, 'test');
        expect(text).to.have.string('if');
        expect(text).to.have.string('else');
        expect(text).to.have.string('&&');
      });

      it('should get a condition function body string whenever you use ||', function() {
        var compiler = new Compiler();
        var text = compiler._getFunctionBodyString(fixtures.additionConditionOr, 'test');
        expect(text).to.have.string('if');
        expect(text).to.have.string('else');
        expect(text).to.have.string('||');
      });

      it('should get a condition function body string whenever you use multiple condition addition', function() {
        var compiler = new Compiler();
        var text = compiler._getFunctionBodyString(fixtures.multipleAdditionConditions, 'test');
        expect(text).to.have.string('if');
        expect(text).to.have.string('else');
        expect(text).to.have.string('||');
        expect(text).to.have.string('&&');
      });

      it('should get a non-conditional function body string whenever a key is translated using non-conditions', function() {
        var compiler = new Compiler();
        var text = compiler._getFunctionBodyString(fixtures.basicTranslationItem, 'test');
        expect(text).to.have.string('return \'');
      });
    });

    describe('#_getElseStatementString', function() {
      it('should be able to get en alse statement string', function() {
        var compiler = new Compiler();
        var text = compiler._getElseStatementString('test');
        expect(text).to.have.string('else {');
        expect(text).to.have.string('return \'test\';');
      });
    });

    describe('#_getTranslationMap', function() {
      it('should be able to get a translation map', function() {
        var compiler = new Compiler();
        compiler.quiet = true;
        var map = compiler._getTranslationMap('en-US');
        expect(map).to.have.string('var t = {');
        expect(map).to.have.string('};');
      });
    });

    describe('#_getFormatedOperandString', function() {
      it('should return an int if the operand is just using 0-9', function() {
        var compiler = new Compiler();
        compiler.quiet = true;
        var operand = compiler._getFormatedOperandString('1', []);
        expect(operand).to.equal('1');
      });

      it('should return a string if the operand is not just containing 0-9', function() {
        var compiler = new Compiler();
        compiler.quiet = true;
        var operand = compiler._getFormatedOperandString('1f', []);
        expect(operand).to.equal('\'1f\'');
      });

      it('should return a variable if the operand have mustach ${...} syntax', function() {
        var compiler = new Compiler();
        compiler.quiet = true;
        var operand = compiler._getFormatedOperandString('${test}', ['${test}']);
        expect(operand).to.equal('it.test');
      });

      it('should throw an error if the variable begins with an integer', function() {
        var compiler = new Compiler();
        compiler.quiet = true;
        function test() {
          var operand = compiler._getFormatedOperandString('${1test}', ['${1test}']);
        };
        expect(test).to.throw(TypeError);
      });

      it('should return a string if the variable syntax doesn\'t contain [0-9a-zA-Z]', function() {
        var compiler = new Compiler();
        compiler.quiet = true;
        var operand = compiler._getFormatedOperandString('${test/}', ['${test/}']);
        expect(operand).to.equal('\'${test/}\'');
      });
    });
  });

};
