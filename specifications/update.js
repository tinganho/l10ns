
global.lcf = {
  TRANSLATION_FUNCTION_CALL_REGEX: /gt\(['|"](.*?)['|"]\s*(\,\s*\{\s*((.*?)|(\s*?))+?\s*\})??\s*\)/g
};

global.pcf = {

};

var Update = proxyquire('../libraries/update', {
  'fs': {},
  './parser': {},
  './syntax': {},
  './merger': {},
  './file': {},
  'readline': {},
  'underscore': {},
  path: {} }).Update;

describe('update', function() {
  describe('#update', function() {
    it('should get the source keys', function() {
      var update = new Update;
      update._getSourceKeys = sinon.spy();
      update._mergeTranslations = function() {};
      update.update();
      update._getSourceKeys.should.have.been.calledOnce;
    });

    it('should merge source keys with old translations', function() {
      var update = new Update;
      update._getSourceKeys = function() {};
      update._mergeTranslations = sinon.spy();
      update.update();
      update._mergeTranslations.should.have.been.calledOnce;

    });
  });
});
