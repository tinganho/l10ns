
/**
 * Module dependencies
 */

var fixtures = require('./fixtures/json')
  , Compiler = require('../plugins/javascript/compiler');

module.exports = function() {

  describe('javascript compiler', function() {
    it('should use the requireJsAndNodejsWrapper whenever opts.node and opts.requirejs is true', function() {
      var compiler = new Compiler();
      compiler.opts.node = true;
      compiler.opts.requirejs = true;
      var wrap = compiler._getWrapper();
      expect(wrap.toString()).to.have.string('require(\\\'amdefine\\\')(module);');
    });

    it('should use the nodejsWrapper whenever opts.node is true and opts.requirejs is false', function() {
      var compiler = new Compiler();
      compiler.opts.node = true;
      compiler.opts.requirejs = false;
      var wrap = compiler._getWrapper();
      expect(wrap.toString()).to.have.string('module.exports');
    });

    it('should use the requirejsWrapper whenever opts.node is false and opts.requirejs is false', function() {
      var compiler = new Compiler();
      compiler.opts.node = false;
      compiler.opts.requirejs = true;
      var wrap = compiler._getWrapper();
      expect(wrap.toString()).to.have.string('define(function() {');
      expect(wrap.toString()).to.not.have.string('require(\\\'amdefine\\\')(module);');
    });

    it('should use the javascriptWrapper whenever opts.node and opts.requirejs is false', function() {
      var compiler = new Compiler();
      compiler.opts.node = false;
      compiler.opts.requirejs = false;
      var wrap = compiler._getWrapper();
      expect(wrap.toString()).to.have.string('= (function() {');
      expect(wrap.toString()).to.have.string('})()');
    });

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

    it('should be able to get a translation map', function() {
      var compiler = new Compiler();
      compiler.quiet = true;
      var map = compiler._getTranslationMap('en-US');
      expect(map).to.have.string('var t = {');
      expect(map).to.have.string('};');
    });
  });

};
