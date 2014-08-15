
var dependencies = {
  'fs': {},
  'path': {},
  './parser': {},
  './syntax': {},
  './merger': {},
  './file': {},
  './_log': {}
};

describe('Update', function() {
  describe('#constructor', function() {
    it('should set this.isWaitingUserInput to false', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      expect(update.isWaitingUserInput).to.be.false;
    });

    it('should set this.deletedKeys to empty array', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      expect(update.deletedKeys).to.eql([]);
    });

    it('should set this.addedKeys to empty array', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      expect(update.addedKeys).to.eql([]);
    });

    it('should set this.migratedKeys to empty array', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      expect(update.migratedKeys).to.eql([]);
    });

    it('should set this.rl to null', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      expect(update.rl).to.eql(null);
    });
  });

  describe('#run()', function() {
    it('should get new localizations', function() {
      dependencies['./file'].writeLocalizations = stub().returns(Q.resolve());
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update.getNewLocalizations = stub().returns(Q.resolve());
      update._mergeWithOldLocalizations = stub().returns(Q.resolve());
      update.run();
      update.getNewLocalizations.should.have.been.calledOnce;
    });

    it('should merge source keys with old localizations', function(done) {
      dependencies['./file'].writeLocalizations = stub().returns(Q.resolve());
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update.getNewLocalizations = stub().returns(Q.resolve());
      update._mergeWithOldLocalizations = stub().returns(Q.resolve());
      update.run();
      eventually(function() {
        update._mergeWithOldLocalizations.should.have.been.calledOnce;
        done();
      });
    });

    it('should write all the localization to storage', function(done) {
      dependencies['./file'].writeLocalizations = stub().returns(Q.resolve());
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update.getNewLocalizations = stub().returns(Q.resolve());
      update._mergeWithOldLocalizations = stub().returns(Q.resolve());
      update.run();
      eventually(function() {
        dependencies['./file'].writeLocalizations.should.have.been.calledOnce;
        done();
      });
    });

    it('should log an error if merge localizations have been failed', function(done) {
      // Reject on second promise
      dependencies['./_log'].error = spy();
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update.getNewLocalizations = stub().returns(Q.resolve());
      update._mergeWithOldLocalizations = stub().returns(Q.reject());
      update.run();
      eventually(function() {
        dependencies['./_log'].error.should.have.been.calledOnce;
        dependencies['./_log'].error.should.have.been.calledWith('Localizations update failed');
        done();
      });
    });
  });

  describe('#_stripInnerFunctionCalls()', function() {
    it('should remove inner function calls', function() {
      var callString = 'l(\'TRANSLATION_KEY\', { innerFunction: innerFunction() });';
      var resultString = 'l(\'TRANSLATION_KEY\', { innerFunction: });';
      var method = proxyquire('../libraries/update', dependencies).Update.prototype._stripInnerFunctionCalls;
      expect(method(callString)).to.equal(resultString);
    });

    it('should not remove inner gt function calls', function() {
      var callString = 'l(\'TRANSLATION_KEY\', { innerFunction: l() });';
      var resultString = 'l(\'TRANSLATION_KEY\', { innerFunction: l() });';
      var method = proxyquire('../libraries/update', dependencies).Update.prototype._stripInnerFunctionCalls;
      expect(method(callString)).to.equal(resultString);
    });
  });

  describe('#getNewLocalizations()', function() {
    describe('should loop through each file path and...', function() {
      it('check if the file path is a directory', function() {
        project.source = ['file1'];
        dependencies['fs'].lstatSync = stub().returns({
          isDirectory: stub().returns(true)
        });
        var update = new (proxyquire('../libraries/update', dependencies).Update);
        update.getNewLocalizations();
        dependencies['fs'].lstatSync.should.have.been.calledOnce;
      });

      it('should eventually reject if the file reading is sending an error', function(done) {
        project.source = ['file1'];
        var deferred = {};
        deferred.reject = spy();
        dependencies.q = {};
        dependencies.q.defer = stub().returns(deferred);
        dependencies['fs'].lstatSync = stub().returns({
          isDirectory: stub().returns(false)
        });
        dependencies['fs'].readFile = stub();
        dependencies['fs'].readFile.callsArgWith(2, 'error');
        var update = new (proxyquire('../libraries/update', dependencies).Update);
        update._stripInnerFunctionCalls = stub().returns({ match: stub().returns(null) });
        update.getNewLocalizations();
        eventually(function() {
          deferred.reject.should.have.been.calledOnce;
          done();
        });
      });

      it('strip inner function calls', function(done) {
        project.source = ['file1'];
        var deferred = {};
        deferred.resolve = noop;
        dependencies.q = {};
        dependencies.q.defer = stub().returns(deferred);
        dependencies['fs'].lstatSync = stub().returns({
          isDirectory: stub().returns(false)
        });
        dependencies['fs'].readFile = stub();
        dependencies['fs'].readFile.callsArgWith(2, null, '');
        var update = new (proxyquire('../libraries/update', dependencies).Update);
        update._stripInnerFunctionCalls = stub().returns({ match: stub().returns(null) });
        update.getNewLocalizations();
        eventually(function() {
          update._stripInnerFunctionCalls.should.have.been.calledOnce;
          done();
        });
      });

      it('find all l() function call strings', function() {
        project.source = ['file1'];
        var deferred = {};
        deferred.resolve = noop;
        dependencies.q = {};
        dependencies.q.defer = stub().returns(deferred);
        dependencies['fs'].lstatSync = stub().returns({
          isDirectory: stub().returns(false)
        });
        dependencies['fs'].readFile = stub();
        dependencies['fs'].readFile.callsArgWith(2, null, '');
        var update = new (proxyquire('../libraries/update', dependencies).Update);
        var innerFunctionCallResultObject = { match: stub().returns(null) };
        update._stripInnerFunctionCalls = stub().returns(innerFunctionCallResultObject);
        update.getNewLocalizations();
        innerFunctionCallResultObject.match.should.have.been.calledOnce;
      });

      it('get the key and variables on each l() call strings', function(done) {
        project.source = ['file1'];
        var deferred = {};
        deferred.resolve = noop;
        dependencies.q = {};
        dependencies.q.defer = stub().returns(deferred);
        dependencies['fs'].lstatSync = stub().returns({
          isDirectory: stub().returns(false)
        });
        dependencies['fs'].readFile = stub();
        dependencies['fs'].readFile.callsArgWith(2, null, '');
        dependencies['./parser'].getKey = stub().returns('SOME_KEY');
        dependencies['./parser'].getVariables = stub().returns(['test1', 'test2']);
        var Hashids = function() {}
        Hashids.prototype.encrypt = noop;
        dependencies['hashids'] = Hashids;
        var update = new (proxyquire('../libraries/update', dependencies).Update);
        var innerFunctionCallResultObject = { match: stub().returns(['l(\'SOME_KEY\')']) };
        update._stripInnerFunctionCalls = stub().returns(innerFunctionCallResultObject);
        update.getNewLocalizations();
        eventually(function() {
          dependencies['./parser'].getKey.should.have.been.calledOnce;
          dependencies['./parser'].getKey.should.have.been.calledWith('l(\'SOME_KEY\')');
          dependencies['./parser'].getVariables.should.have.been.calledOnce;
          dependencies['./parser'].getVariables.should.have.been.calledWith('l(\'SOME_KEY\')');
          done();
        });
      });

      it('set properties id, key, variables, text, files', function(done) {
        project.source = ['file1'];
        var deferred = {};
        deferred.resolve = spy();
        dependencies.q = {};
        dependencies.q.defer = stub().returns(deferred);
        dependencies['fs'].lstatSync = stub().returns({
          isDirectory: stub().returns(false)
        });
        dependencies['fs'].readFile = stub();
        dependencies['fs'].readFile.callsArgWith(2, null, '');
        dependencies['./parser'].getKey = stub().returns('SOME_KEY');
        dependencies['./parser'].getVariables = stub().returns(['test1', 'test2']);
        var Hashids = function() {}
        Hashids.prototype.encrypt = stub().returns('id');
        dependencies['hashids'] = Hashids;
        var update = new (proxyquire('../libraries/update', dependencies).Update);
        var innerFunctionCallResultObject = { match: stub().returns(['l(\'SOME_KEY\')']) };
        update._stripInnerFunctionCalls = stub().returns(innerFunctionCallResultObject);
        update.getNewLocalizations();
        eventually(function() {
          deferred.resolve.should.have.been.calledOnce;
          deferred.resolve.should.have.been.calledWith({ SOME_KEY: {
            id: 'id',
            key: 'SOME_KEY',
            variables: ['test1', 'test2'],
            text: 'SOME_KEY',
            files: ['file1'] }});
          done();
        });
      });

      it('append file path if a localization key already exist on a different file', function(done) {
        project.source = ['file1', 'file2'];
        var deferred = {};
        deferred.resolve = spy();
        dependencies.q = {};
        dependencies.q.defer = stub().returns(deferred);
        dependencies['fs'].lstatSync = stub().returns({
          isDirectory: stub().returns(false)
        });
        dependencies['fs'].readFileSync = noop;
        dependencies['./parser'].getKey = stub().returns('SOME_KEY');
        dependencies['./parser'].getVariables = stub().returns(['test1', 'test2']);
        dependencies['./syntax'].hasErrorDuplicate = stub().returns(false);
        var Hashids = function() {}
        Hashids.prototype.encrypt = stub().returns('id');
        dependencies['hashids'] = Hashids;
        var update = new (proxyquire('../libraries/update', dependencies).Update);
        var innerFunctionCallResultObject = { match: stub().returns(['l(\'SOME_KEY\')']) };
        update._stripInnerFunctionCalls = stub().returns(innerFunctionCallResultObject);
        update.getNewLocalizations();
        eventually(function() {
          deferred.resolve.should.have.been.calledOnce;
          deferred.resolve.should.have.been.calledWith({ SOME_KEY: {
            id: 'id',
            key: 'SOME_KEY',
            variables: ['test1', 'test2'],
            text: 'SOME_KEY',
            files: ['file1', 'file2'] }});
          done();
        });
      });

      it('should reject if a function call have two different variable set', function(done) {
        project.source = ['file1'];
        var deferred = {};
        deferred.reject = spy();
        dependencies.q = {};
        dependencies.q.defer = stub().returns(deferred);
        dependencies['fs'].lstatSync = stub().returns({
          isDirectory: stub().returns(false)
        });
        dependencies['fs'].readFileSync = noop;
        dependencies['./parser'].getKey = stub().returns('SOME_KEY');
        dependencies['./parser'].getVariables = stub();
        dependencies['./parser'].getVariables.onCall(0).returns(['test1']);
        dependencies['./parser'].getVariables.onCall(1).returns(['test1', 'test2']);
        dependencies['./syntax'].hasErrorDuplicate = stub().returns(true);
        var Hashids = function() {}
        Hashids.prototype.encrypt = stub().returns('id');
        dependencies['hashids'] = Hashids;
        var update = new (proxyquire('../libraries/update', dependencies).Update);
        var innerFunctionCallResultObject = { match: stub().returns(['l(\'SOME_KEY\')', 'l(\'SOME_KEY\')']) };
        update._stripInnerFunctionCalls = stub().returns(innerFunctionCallResultObject);
        update.getNewLocalizations();
        eventually(function() {
          deferred.reject.should.have.been.calledOnce;
          expect(deferred.reject.args[0][0].message).to.contain('You have defined a localization key (SOME_KEY) with different variables');
          done();
        });
      });
    });
  });

  describe('#_mergeWithOldLocalizations()', function() {
    it('should read old localizations', function(done) {
      project.locales = {};
      dependencies['./file'].readLocalizations = stub().returns(Q.resolve());
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      project.locales = {};
      update._mergeUserInputs = noop;
      update._mergeWithOldLocalizations();
      eventually(function() {
        dependencies['./file'].readLocalizations.should.have.been.calledOnce;
        done();
      });
    });

    it('if an old localization exists, it should merge with new localizations', function(done) {
      dependencies['./file'].readLocalizations = stub().returns(Q.resolve({
        'en-US': {
          'key1': {}
        }
      }));
      dependencies['./merger'].mergeLocalizations = spy();
      dependencies['./merger'].mergeTimeStamp = spy();
      dependencies['./merger'].mergeId = spy();
      project.locales = { 'en-US': 'English (US)' };
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._mergeUserInputs = noop;
      update._mergeWithOldLocalizations({
        'key1': {}
      });
      eventually(function() {
        dependencies['./merger'].mergeLocalizations.should.have.been.calledOnce;
        dependencies['./merger'].mergeTimeStamp.should.have.been.calledOnce;
        dependencies['./merger'].mergeId.should.have.been.calledOnce;
        done();
      });
    });

    it('if an old localization does not exists, it should create a new localization', function(done) {
      dependencies['./file'].readLocalizations = stub().returns(Q.resolve({
        'en-US': {}
      }));
      project.locales = { 'en-US': 'English (US)' };
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._mergeUserInputs = spy();
      update._mergeWithOldLocalizations({
        'key1': {}
      });
      eventually(function() {
        expect(update._mergeUserInputs.args[0][0]['en-US']['key1']).to.contain.keys('values', 'timestamp');
        expect(update._mergeUserInputs.args[0][0]['en-US']['key1'].values).to.eql([['']]);
        done();
      });
    });

    it('should merge with user input option', function(done) {
      dependencies['./file'].readLocalizations = stub().returns(Q.resolve({
        'en-US': {}
      }));
      dependencies['./merger'].mergeTimeStamp = stub().returns(0);
      project.locales = { 'en-US': 'English (US)' };
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._mergeUserInputs = spy();
      update._mergeWithOldLocalizations({
        'key1': {}
      });
      eventually(function() {
        update._mergeUserInputs.should.have.been.calledOnce;
        done();
      });
    });

    it('if merging of user inputs is without errors, it should resolve with new localizations', function(done) {
      dependencies['./file'].readLocalizations = stub().returns(Q.resolve({
        'en-US': {}
      }));
      var deferred = {};
      deferred.resolve = spy();
      dependencies.q = {};
      dependencies.q.defer = stub().returns(deferred);
      project.locales = { 'en-US': 'English (US)' };
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._mergeUserInputs = stub().callsArgWith(2, null, { 'new-localization': {} });
      update._mergeWithOldLocalizations({
        'key1': {}
      });
      eventually(function() {
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith({ 'new-localization': {} });
        done();
      });
    });

    it('if merging of user inputs is with a SIGINT error, it should callback with old localizations', function(done) {
      dependencies['./file'].readLocalizations = stub().returns(Q.resolve({
        'en-US': {}
      }));
      var deferred = {};
      deferred.resolve = spy();
      dependencies.q = {};
      dependencies.q.defer = stub().returns(deferred);
      project.locales = { 'en-US': 'English (US)' };
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._mergeUserInputs = stub().callsArgWith(2, { error: 'SIGINT' }, { 'new-localization': {} });
      update._mergeWithOldLocalizations({
        'key1': {}
      });
      eventually(function() {
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith({ 'en-US': {} });
        done();
      });
    });

    it('if merging of user inputs is with an error, it should callback with the error', function(done) {
      dependencies['./file'].readLocalizations = stub().returns(Q.resolve({
        'en-US': {}
      }));
      var deferred = {};
      deferred.reject = spy();
      dependencies.q = {};
      dependencies.q.defer = stub().returns(deferred);
      project.locales = { 'en-US': 'English (US)' };
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._mergeUserInputs = stub().callsArgWith(2, { error: 'other-error' }, { 'new-localization': {} });
      update._mergeWithOldLocalizations({
        'key1': {}
      });
      eventually(function() {
        deferred.reject.should.have.been.calledOnce;
        deferred.reject.should.have.been.calledWith({ error: 'other-error' });
        done();
      });
    });
  });

  describe('#_getDeletedLocalizations()', function() {
    it('should return deleted localizations keys', function() {
      project.locales = { 'en-US': 'English (US)' };
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var oldLocalizations = { 'en-US': { 'key1': {}}};
      var newLocalizations = { 'en-US': { 'key2': {}}};
      expect(update._getDeletedLocalizations(newLocalizations, oldLocalizations)).to.have.keys('key1');
    });

    it('should add deleted locales, timestamp and files', function() {
      project.locales = { 'en-US': 'English (US)', 'zh-CN': 'Chinese (Simplified)' };
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var oldLocalizations = { 'en-US': { 'key1': { files: ['file1'] }}, 'zh-CN': { 'key1': { files: ['file1'] }}};
      var newLocalizations = { 'en-US': { 'key2': {}}, 'zh-CN': { 'key2': {}}};
      expect(update._getDeletedLocalizations(newLocalizations, oldLocalizations)['key1']).to.have.keys('en-US', 'zh-CN', 'timestamp', 'files');
    });
  });

  describe('#_getUpdatedFiles()', function() {
    it('should return updated files', function() {
      project.locales = { 'en-US': 'English (US)' };
      project.defaultLocale = 'en-US';
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var oldLocalizations = { 'en-US': { 'key1': { files: ['file1'] }}};
      var newLocalizations = { 'en-US': { 'key2': { files: ['file1', 'file2'] }}};
      expect(update._getUpdatedFiles(newLocalizations, oldLocalizations)).to.have.keys('file1', 'file2');
    });

    it('should return updated localization key(single) mapped to each file', function() {
      project.locales = { 'en-US': 'English (US)' };
      project.defaultLocale = 'en-US';
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var oldLocalizations = { 'en-US': { 'key1': { files: ['file1'] }}};
      var newLocalizations = { 'en-US': { 'key2': { files: ['file1', 'file2'] }}};
      expect(update._getUpdatedFiles(newLocalizations, oldLocalizations)['file1']).to.eql(['key2']);
      expect(update._getUpdatedFiles(newLocalizations, oldLocalizations)['file2']).to.eql(['key2']);
    });

    it('should return updated localization keys(multiple) mapped to each file', function() {
      project.locales = { 'en-US': 'English (US)' };
      project.defaultLocale = 'en-US';
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var oldLocalizations = { 'en-US': { 'key1': { files: ['file1'] }}};
      var newLocalizations = { 'en-US': { 'key2': { files: ['file1', 'file2'] }, 'key3': { files: ['file1'] }}};
      expect(update._getUpdatedFiles(newLocalizations, oldLocalizations)).to.have.keys('file1', 'file2');
      expect(update._getUpdatedFiles(newLocalizations, oldLocalizations)['file1']).to.eql(['key2', 'key3']);
      expect(update._getUpdatedFiles(newLocalizations, oldLocalizations)['file2']).to.eql(['key2']);
    });
  });

  describe('#_mergeUserInputs()', function() {
    it('should get deleted localizations', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._getDeletedLocalizations = stub().returns({});
      var oldLocalizations = {};
      var newLocalizations = {};
      var callback = noop;
      update._mergeUserInputs(newLocalizations, oldLocalizations, callback);
      update._getDeletedLocalizations.should.have.been.calledOnce;
    });

    it('should callback if there is no deleted localizations', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._getDeletedLocalizations = stub().returns({});
      update._executeUserInputStream = noop;
      var oldLocalizations = {};
      var newLocalizations = {};
      var callback = spy();
      update._mergeUserInputs(newLocalizations, oldLocalizations, callback);
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith(null, {});
    });

    it('should get updated files', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._getDeletedLocalizations = stub().returns({ 'file2': ['key3'] });
      update._pushToUserInputStream = noop;
      update._executeUserInputStream = noop;
      update._getUpdatedFiles = spy();
      var oldLocalizations = { 'key1': { files: ['file1'] }};
      var newLocalizations = { 'key2': { files: ['file1'] }};
      var callback = noop;
      update._mergeUserInputs(newLocalizations, oldLocalizations, callback);
      update._getUpdatedFiles.should.have.been.calledOnce;
    });

    it('should ask for user input if a key have been renamed', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._getDeletedLocalizations = stub().returns({ 'key3': { files: ['file1'] }});
      update._pushToUserInputStream = spy();
      update._executeUserInputStream = noop;
      update._getUpdatedFiles = stub().returns({'file1': ['key4']});
      var oldLocalizations = { 'key1': { files: ['file1'] }};
      var newLocalizations = { 'key2': { files: ['file1'] }};
      var callback = noop;
      update._mergeUserInputs(newLocalizations, oldLocalizations, callback);
      update._pushToUserInputStream.should.have.been.calledOnce;
      update._pushToUserInputStream.should.have.been.calledWith('key3', ['key4']);
    });

    it('should callback with merged user input localization if user have been asked for input', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._getDeletedLocalizations = stub().returns({ 'key3': { files: ['file1'] }});
      update._pushToUserInputStream = noop;
      update._executeUserInputStream = stub();
      update._executeUserInputStream.callsArgWith(2, null, 'merged-localization');
      update._getUpdatedFiles = stub().returns({'file1': ['key4']});
      var oldLocalizations = { 'key1': { files: ['file1'] }};
      var newLocalizations = { 'key2': { files: ['file1'] }};
      var callback = spy();
      update._mergeUserInputs(newLocalizations, oldLocalizations, callback);
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith(null, 'merged-localization')
    });

    it('should callback with error if a merge error have been occurred', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._getDeletedLocalizations = stub().returns({ 'key3': { files: ['file1'] }});
      update._pushToUserInputStream = noop;
      update._executeUserInputStream = stub();
      update._executeUserInputStream.callsArgWith(2, 'error');
      update._getUpdatedFiles = stub().returns({'file1': ['key4']});
      var oldLocalizations = { 'key1': { files: ['file1'] }};
      var newLocalizations = { 'key2': { files: ['file1'] }};
      var callback = spy();
      update._mergeUserInputs(newLocalizations, oldLocalizations, callback);
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith('error');
    });
  });

  describe('#_pushToUserInputStream()', function() {
    it('should push to deleted and added keys queue', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._pushToUserInputStream('deleted-key', ['added-key']);
      expect(update.deletedKeys).to.eql(['deleted-key']);
      expect(update.addedKeys).to.eql([['added-key']]);
    });
  });

  describe('#_executeUserInputStream()', function() {
    it('if deleted and added keys is empty it should callback with new localizations', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var callback = spy();
      update.deletedKeys = [];
      update.addedKeys = [];
      update._executeUserInputStream({}, {}, callback);
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith(null, {});
    });

    it('if deleted keys length is not equal to added keys length it should throw an error', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var callback = spy();
      update.deletedKeys = ['key1'];
      update.addedKeys = ['key2', 'key3'];
      var method = function() {
        update._executeUserInputStream({}, {}, callback);
      };
      expect(method).to.throw(TypeError, /Deleted keys must have same array length as added keys length/);
    });

    it('should callback with error if user input key sends an error', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var callback = spy();
      update.deletedKeys = ['key1'];
      update.addedKeys = ['key2'];
      update._getUserInputKey = stub();
      update._getUserInputKey.callsArgWith(2, 'error');
      update._executeUserInputStream({}, {}, callback);
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith('error');
    });

    it('should callback with merged localization from user input ' +
       'if the user have chose the option delete', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var callback = spy();
      update.deletedKeys = ['key1'];
      update.addedKeys = ['key2'];
      update.rl = { close: spy() };
      update._getUserInputKey = stub();
      update._getUserInputKey.callsArgWith(2, null, 'DELETE');
      update._executeUserInputStream({}, {}, callback);
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith(null, {});
      update.rl.close.should.have.been.calledOnce;
    });

    it('should migrate old localization', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var callback = spy();
      update.deletedKeys = ['key1'];
      update.addedKeys = ['key2'];
      update.rl = { close: spy() };
      update._getUserInputKey = stub();
      update._getUserInputKey.callsArgWith(2, null, 'key3', 'key1');
      update._migrateLocalization = stub().returns('merged-localization');
      update._executeUserInputStream({}, {}, callback);
      update._migrateLocalization.should.have.been.calledOnce;
      update._migrateLocalization.should.have.been.calledWith('key3', 'key1', {}, {});
      update.rl.close.should.have.been.calledOnce;
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith(null, 'merged-localization');
    });

    it('should recurse on migration option if deleted keys still exists', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var callback = spy();
      update.deletedKeys = ['key1', 'key2'];
      update.addedKeys = ['key3', 'key4'];
      update.rl = { close: spy() };
      update._getUserInputKey = stub();
      update._getUserInputKey.callsArgWith(2, null, 'key3', 'key1');
      update._migrateLocalization = stub().returns('merged-localization');
      update._executeUserInputStream({}, {}, callback);
      update._migrateLocalization.should.have.callCount(2);
      update._migrateLocalization.should.have.been.calledWith('key3', 'key1', {}, {});
      update.rl.close.should.have.been.calledOnce;
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith(null, 'merged-localization');
    });

    it('should recurse on delete option if deleted keys still exists', function() {
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      var callback = spy();
      update.deletedKeys = ['key1', 'key2'];
      update.addedKeys = ['key3', 'key4'];
      update.rl = { close: spy() };
      update._getUserInputKey = stub();
      update._getUserInputKey.callsArgWith(2, null, 'DELETE');
      update._executeUserInputStream({}, {}, callback);
      update.rl.close.should.have.been.calledOnce;
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith(null, {});
    });
  });

  describe('#_migrateLocalization()', function() {
    it('should migrate old localization', function() {
      project.locales = { 'en-US': 'English (US' };
      var oldLocalizations = {'en-US': { 'key1': 'old-localization' }};
      var newLocalizations = {'en-US': { 'key2': 'new-localization' }};
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      expect(update._migrateLocalization('key2', 'key1', newLocalizations, oldLocalizations)).to.eql({ 'en-US': { 'key2': 'old-localization'}})
    });
  });

  describe('#_getUserInputKey()', function() {
    it('if added keys\'s length is zero it should callback with \'DELETE\'', function() {
      var callback = spy();
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update._getUserInputKey([], [], callback);
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith(null, 'DELETE');
    });

    it('if user inputs a added key option it should migrate', function() {
      var callback = spy();
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update.rl = {};
      update.rl.on = noop;
      update.rl.question = stub();
      update.rl.question.callsArgWith(1, '1');
      update._getUserInputKey('key1', ['key2'], callback);
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith(null, 'key2', 'key1');
    });

    it('if user inputs delete option it should delete', function() {
      var callback = spy();
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update.rl = {};
      update.rl.on = noop;
      update.rl.question = stub();
      update.rl.question.callsArgWith(1, 'd');
      update._getUserInputKey('key1', ['key2'], callback);
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith(null, 'DELETE');
    });

    it('should bind to SIGINT event and close readline interface', function() {
      var callback = spy();
      var update = new (proxyquire('../libraries/update', dependencies).Update);
      update.rl = {};
      update.rl.on = stub();
      update.rl.on.callsArg(1);
      update.rl.close = spy();
      update.rl.question = noop;
      update._getUserInputKey('key1', ['key2'], callback);
      update.rl.close.should.have.been.calledOnce;
      callback.should.have.been.calledOnce;
      callback.should.have.been.calledWith({ error: 'SIGINT' });
    });
  });
});
