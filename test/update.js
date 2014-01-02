
var sinon        = require('sinon')
  , _            = require('underscore')
  , path         = require('path')
  , expect       = require('chai').expect
  , proxyquire   = require('proxyquire')
  , jsonFixtures = require('./fixtures/json')
  , fixtures     = require('./fixtures/update');


var Update = require('../lib/update').Update;

module.exports = function() {
  describe('update', function() {
    describe('_stripInnerFunctionCalls', function() {
      it('should be able to strip inner functions', function() {
        var update = new Update();
        var str = update._stripInnerFunctionCalls(fixtures.innerFunction);
        expect(str).to.not.have.string('test()');
      });
    });

    describe('_getSourceKeys', function() {
      var fsStub = {
        readFileSync : function() {
          return 'gt(\'test\');';
        }
      };
      var Update = proxyquire('../lib/update', { fs : fsStub }).Update
      var update = new Update();
      update.src = ['test/test.js'];
      var translation = update._getSourceKeys();
      expect(translation).to.have.property('test');
      expect(translation.test).to.have.property('vars');
      expect(translation.test).to.have.property('files');
      expect(translation.test.files[0]).to.equal(update.src[0]);
      expect(translation.test.vars).to.have.length(0);
    });

    describe('_mergeTranslations', function() {
      it('should be able to merge source keys with old translations', function(done) {
        var fileStub = {
          localesFolder : cf.localesFolder,
          readTranslations : sinon.stub().returns(jsonFixtures.oldBasicTranslation)
        };
        var File = proxyquire('../lib/update', { file : fileStub }).Update
        var update = new Update();
        update.locales = ['en-US'];
        update._mergeUserInputs = function(_newTranslations, oldTranslations, callback) {
          callback(null, _newTranslations);
        };
        update._mergeTranslations(jsonFixtures.basicSourceUpdateItem, function(err, _newTranslations) {
          expect(_newTranslations['en-US'].test).to.have.property('vars');
          expect(_newTranslations['en-US'].test).to.have.property('id');
          expect(_newTranslations['en-US'].test).to.have.property('timestamp');
          expect(_newTranslations['en-US'].test).to.have.property('text');
          expect(_newTranslations['en-US'].test).to.have.property('_new');
          expect(_newTranslations['en-US'].test).to.have.property('value');
          expect(_newTranslations['en-US'].test).to.have.property('files');
          expect(_newTranslations['en-US'].test.text).to.have.string('test');
          done();
        });
      });
    });

    describe('_getDeletedTranslations', function() {
      it('should be able to return delete translations', function() {
        var update = new Update();
        update.locales = ['en-US'];
        var deletedTranslations = update._getDeletedTranslations(jsonFixtures.deletedBasicTranslation, jsonFixtures.oldBasicTranslation);
        expect(deletedTranslations).to.have.property('test');
        expect(deletedTranslations.test).to.have.property('en-US');
      });
    });

    describe('_getUpdatedFiles', function() {
      it('should be able to retrieve updated files', function() {
        var update = new Update();
        update.defaultLocale = 'en-US';
        var files = update._getUpdatedFiles(jsonFixtures.deletedBasicTranslation, jsonFixtures.oldBasicTranslation);
        expect(files).to.have.property('test.js');
        expect(files['test.js']).to.include('test1');
      });
    });

    describe('_mergeUserInputs', function() {
      it('should return newTranslations of there is no deleted translations', function() {
        var update = new Update();
        update._mergeUserInputs(jsonFixtures.oldBasicTranslation, jsonFixtures.oldBasicTranslation, function(err, newTranslations) {
          expect(newTranslations).to.eql(jsonFixtures.oldBasicTranslation);
        });
      });

      it('should be able to merge/migrate user inputs', function() {
        var update = new Update();
        update.locales = ['en-US'];
        var deletedKeys = [];
        sinon.stub(update, '_executeUserInputStream', function(newTranslations, oldTranslations, callback) {
          callback();
        });
        update._mergeUserInputs(jsonFixtures.deletedBasicTranslation, jsonFixtures.oldBasicTranslation, function(err, newTranslations) {
          expect(update._executeUserInputStream.calledOnce).to.be.true;
          expect(update.deletedKeys).to.eql(['test']);
          expect(update.addedKeys).to.eql(['test1']);
        });
      });
    });

    describe('_pushToUserInputStream', function() {
      it('should push added keys and deleted keys to update.addedKeys array and update.deletedKeys array', function() {
        var deletedKey = 'test'
          , addedKeys = ['test1', 'test2'];

        var update = new Update();
        update._pushToUserInputStream(deletedKey, addedKeys);
        expect(update.deletedKeys).to.contain(deletedKey);
        expect(update.addedKeys).to.eql(addedKeys);
      });
    });

  });
};
