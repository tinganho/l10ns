
global.lcf = {
  TRANSLATION_FUNCTION_CALL_REGEX: /gt\(['|"](.*?)['|"]\s*(\,\s*\{\s*((.*?)|(\s*?))+?\s*\})??\s*\)/g,
  TRANSLATION_INNER_FUNCTION_CALL_REGEX: /\s+(?!gt)[.|\w]+?\((.*?\s*?)*?\)/g
};

global.pcf = {

};

var dependencies = {
  'fs': {},
  'readline': {},
  'underscore': {},
  'path': {},
  './parser': {},
  './syntax': {},
  './merger': {},
  './file': {},
  './_log': {}
};

describe('update', function() {
  describe('#update', function() {
    it('should get the source keys', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._getSourceKeys = sinon.spy();
      update._mergeTranslations = function() {};
      update.update();
      update._getSourceKeys.should.have.been.calledOnce;
    });

    it('should merge source keys with old translations', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._getSourceKeys = function() {};
      update._mergeTranslations = sinon.spy();
      update.update();
      update._mergeTranslations.should.have.been.calledOnce;
    });

    it('should write all the translation to storage', function() {
      dependencies['./file'].writeTranslations = sinon.spy();
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._getSourceKeys = function() {};
      update._mergeTranslations = sinon.stub().callsArgWith(1, null, {});
      update.update();
      dependencies['./file'].writeTranslations.should.have.been.calledOnce;
      dependencies['./file'].writeTranslations.should.have.been.calledWith({});
    });

    it('should log an error if merge translations have been failed', function() {
      dependencies['./file'].writeTranslations = function() {};
      dependencies['./_log'].error = sinon.spy();
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._getSourceKeys = function() {};
      update._mergeTranslations = sinon.stub().callsArgWith(1, new Error('test'), {});
      update.update();
      dependencies['./_log'].error.should.have.been.calledOnce;
      dependencies['./_log'].error.should.have.been.calledWith('Translation update failed');
    });
  });

  describe('#_stripInnerFunctionCalls', function() {
    it('should remove inner function calls', function() {
      var callString = 'gt(\'TRANSLATION_KEY\', { innerFunction: innerFunction() });';
      var resultString = 'gt(\'TRANSLATION_KEY\', { innerFunction: });';
      var method = proxyquire('../libraries/update', dependencies).Update.prototype._stripInnerFunctionCalls;
      expect(method(callString)).to.equal(resultString);
    });

    it('should not remove inner gt function calls', function() {
      var callString = 'gt(\'TRANSLATION_KEY\', { innerFunction: gt() });';
      var resultString = 'gt(\'TRANSLATION_KEY\', { innerFunction: gt() });';
      var method = proxyquire('../libraries/update', dependencies).Update.prototype._stripInnerFunctionCalls;
      expect(method(callString)).to.equal(resultString);
    });
  });
});
