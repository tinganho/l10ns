
var jsonFixtures = require('./fixtures/json')
  , fixtures = require('./fixtures/update')
  , Update = require('../lib/update').Update;

module.exports = function() {
  describe('update', function() {
    describe('_stripInnerFunctionCalls', function() {
      it('should be able to strip inner functions', function() {
        var update = new Update();
        var str = update._stripInnerFunctionCalls(fixtures.innerFunction);
        expect(str).to.not.have.string('test()');
      });
    });

    describe('#_getSourceKeys', function() {
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

    describe('#_mergeTranslations', function() {
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

    describe('#_getDeletedTranslations', function() {
      it('should be able to return delete translations', function() {
        var update = new Update();
        update.locales = ['en-US'];
        var deletedTranslations = update._getDeletedTranslations(jsonFixtures.deletedBasicTranslation, jsonFixtures.oldBasicTranslation);
        expect(deletedTranslations).to.have.property('test');
        expect(deletedTranslations.test).to.have.property('en-US');
      });
    });

    describe('#_getUpdatedFiles', function() {
      it('should be able to retrieve updated files', function() {
        var update = new Update();
        update.defaultLocale = 'en-US';
        var files = update._getUpdatedFiles(jsonFixtures.deletedBasicTranslation, jsonFixtures.oldBasicTranslation);
        expect(files).to.have.property('test.js');
        expect(files['test.js']).to.include('test1');
      });
    });

    describe('#_mergeUserInputs', function() {
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
          expect(update.addedKeys).to.eql([['test1']]);
        });
      });
    });

    describe('#_pushToUserInputStream', function() {
      it('should push added keys and deleted keys to update.addedKeys array and update.deletedKeys array', function() {
        var deletedKey = 'test'
          , addedKeys = ['test1', 'test2'];

        var update = new Update();
        update._pushToUserInputStream(deletedKey, addedKeys);
        expect(update.deletedKeys).to.contain(deletedKey);
        expect(update.addedKeys).to.eql([addedKeys]);
      });
    });

    describe('#_executeUserInputStream', function() {
      it('should throw a type error if addedKeys property or deletedKeys property has length 0', function() {
        var update = new Update();
        // addedKeys and deletedKeys has [] as default
        var fn = function() {
          update._executeUserInputStream(jsonFixtures.deletedBasicTranslation, jsonFixtures.oldBasicTranslation, function() {});
        }
        expect(fn).to.throw(TypeError, new RegExp('You can\'t execute user input stream if you have neither deletedKeys nor addedKeys'));
      });

      it('should throw a type error if addedKeys and deletedKeys have different length', function() {
        var update = new Update();
        update.addedKeys = ['key1', 'key2'];
        update.deletedKeys = ['key3'];
        var fn = function() {
          update._executeUserInputStream(jsonFixtures.deletedBasicTranslation, jsonFixtures.oldBasicTranslation, function() {});
        }
        expect(fn).to.throw(TypeError, /Deleted keys must have same array length as added keys length/);
      });

      it('should send the proper addedKeys and proper deletedKeys to _getUserInputKey', function() {
        var update = new Update();
        update.addedKeys = [['key1']];
        update.deletedKeys = ['key3'];
        sinon.stub(update, '_getUserInputKey', function(deletedKeys, addedKeys, callback) {
          callback(null, 'key1', ['key3']);
        });
        sinon.stub(update, '_setOldTranslation', function(newKey, oldKey, newTranslations, oldTranslations) {
          return jsonFixtures.deletedBasicTranslation;
        });
        update.rl = { close : sinon.spy() };
        update._executeUserInputStream(jsonFixtures.deletedBasicTranslation, jsonFixtures.oldBasicTranslation, function(err, newKey, oldKey) {
          update.rl.close.should.have.been.calledOnce;
          update._setOldTranslation.should.have.been.calledOnce;
          expect(update._getUserInputKey.args[0][0]).to.equal('key3');
          expect(update._getUserInputKey.args[0][1]).to.eql(['key1']);
        });
      });
    });

    describe('#_setOldTranslation', function() {
      it('should be able to set an old translation to new', function() {
        var update = new Update();
        update.locales = ['en-US'];
        var translations = update._setOldTranslation('test', 'test1', jsonFixtures.deletedBasicTranslation, jsonFixtures.oldBasicTranslation);
        expect(translations['en-US']).to.have.property('test1');
        expect(translations['en-US']).not.have.property('test');
      });
    });

    describe('#_getUserInputKey', function() {
      it('should be able to handle one to many options', function() {
        var readlineStub = {};
        var Update = proxyquire('../lib/update', { readline : readlineStub }).Update;
        readlineStub.createInterface = sinon.stub().returns({
          question : sinon.stub().callsArgWith(1, '1'),
          on : sinon.spy()
        });
        var update = new Update();
        update._getUserInputKey('key1', ['key2', 'key3'], function(err, migrationKey, deletedKey) {
          expect(migrationKey).to.equal('key2');
          expect(deletedKey).to.equal('key1');
        });
        update.rl.question.should.have.been.calledOnce;
        // It should contain two options for migrate
        expect(update.rl.question.args[0][0]).to.contain('\u001b[36m[1]\u001b[39m - migrate to');
        expect(update.rl.question.args[0][0]).to.contain('\u001b[36m[2]\u001b[39m - migrate to');
        expect(update.rl.question.args[0][0]).to.contain('\u001b[36m[d]\u001b[39m - \u001b[31mdelete');
        update.rl.on.should.have.been.calledOnce;
      });

      it('should have one delete option', function() {
        var readlineStub = {};
        var Update = proxyquire('../lib/update', { readline : readlineStub }).Update;
        readlineStub.createInterface = sinon.stub().returns({
          question : sinon.stub().callsArgWith(1, 'd'),
          on : sinon.spy()
        });
        var update = new Update();
        update._getUserInputKey('key1', ['key2', 'key3'], function(err, migrationKey, deletedKey) {
          expect(migrationKey).to.equal('DELETE');
        });
        update.rl.question.should.have.been.calledOnce;
        // It should contain two options for migrate
        expect(update.rl.question.args[0][0]).to.contain('\u001b[36m[1]\u001b[39m - migrate to');
        expect(update.rl.question.args[0][0]).to.contain('\u001b[36m[2]\u001b[39m - migrate to');
        expect(update.rl.question.args[0][0]).to.contain('\u001b[36m[d]\u001b[39m - \u001b[31mdelete');
        update.rl.on.should.have.been.calledOnce;
      });
    });
  });
};
