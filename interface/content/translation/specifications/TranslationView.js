
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

      describe('#bindModel', function() {
        it('should bind condition addition, condition removal, input additions and else additions', function() {
          sinon.stub(TranslationView.prototype, '_bindConditionsAddition');
          sinon.stub(TranslationView.prototype, '_bindConditionRemoval');
          sinon.stub(TranslationView.prototype, '_bindInputAddition');
          sinon.stub(TranslationView.prototype, '_bindElseAddition');
          var translationView = new TranslationView();
          translationView.bindModel();
          translationView._bindConditionsAddition.should.have.been.calledOnce;
          translationView._bindConditionRemoval.should.have.been.calledOnce;
          translationView._bindInputAddition.should.have.been.calledOnce;
          translationView._bindElseAddition.should.have.been.calledOnce;
          TranslationView.prototype._bindConditionsAddition.restore();
          TranslationView.prototype._bindConditionRemoval.restore();
          TranslationView.prototype._bindInputAddition.restore();
          TranslationView.prototype._bindElseAddition.restore();
        });
      });

      describe('#_bindElseAddition', function() {
        it('should bind event change:else on the model', function() {
          var modelStub = { on : sinon.spy() };
          var translationView = new TranslationView(modelStub);
          translationView._bindElseAddition();
          modelStub.on.should.have.been.calledOnce;
          modelStub.on.should.have.been.calledWith('change:else')
        });
      });
    });

    mocha.checkLeaks();
    mocha.run();
  });
});
