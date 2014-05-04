
define(['squire'], function(Squire) {
  require(['content/translation/TranslationView'], function(TranslationView) {
    describe('TranslationView', function() {
      describe('#constructor', function() {
        it('should set model property', function() {
          var obj = { test : 'test'};
          var translationView = new TranslationView(obj);
          expect(translationView.model).to.eql(obj);
        });

        it('should bind methods', function() {
          sinon.stub(TranslationView.prototype, '_bindMethods');
          var translationView = new TranslationView();
          translationView._bindMethods.should.have.been.calledOnce;
          TranslationView.prototype._bindMethods.restore();
        });

        it('should set an empty array as condition view property', function() {
          var translationView = new TranslationView();
          expect(translationView._conditionViews).to.eql([]);
        });

        it('should set an empty array as input view property', function() {
          var translationView = new TranslationView();
          expect(translationView._inputViews).to.eql([]);
        });
      });
    });

    mocha.checkLeaks();
    mocha.run();
  });
});
