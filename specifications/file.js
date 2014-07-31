
var dependencies = {
  'fs': {},
  'path': {},
  'mkdirp': {},
  'glob': {},
  'q': {},
};

describe('File', function() {
  describe('#constructor()', function() {
    it('should set this.linefeed to \\n', function() {
      var file = new (proxyquire('../libraries/file', dependencies).File);
      expect(file.linefeed).to.eql('\n');
    });

    it('should set this.outputFolderExists to true', function() {
      var file = new (proxyquire('../libraries/file', dependencies).File);
      expect(file.outputFolderExists).to.be.true;
    });
  });

  describe('#writeLocalizations()', function() {
    it('should return a promise', function() {
      pcf.locales = {};
      dependencies.q.defer = sinon.stub().returns({ promise: 'promise' });
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.localizationMaptoArray = function() {};
      expect(file.writeLocalizations()).to.equal('promise');
    });

    it('should transform localization to an array', function() {
      pcf.locales = {};
      dependencies.q.defer = sinon.stub().returns({ promise: 'promise' });
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.localizationMaptoArray = sinon.spy();
      file.writeLocalizations('localizations');
      file.localizationMaptoArray.should.have.been.calledOnce;
      file.localizationMaptoArray.should.have.been.calledWith('localizations');
    });

    it('should on each localization write to storage', function(done) {
      pcf.locales = { 'en-US': 'English (US)' };
      var deferred = { resolve: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.writeLocalization = sinon.stub().withArgs('localizations', 'en-US').returns(Q.resolve());
      file.writeLocalizations('localizations');
      eventually(function() {
        deferred.resolve.should.have.been.calledOnce;
        done();
      });
    });
  });

  describe('#writeLocalization()', function() {
    it('should return a promise', function() {
      pcf.store = 'storage-folder';
      dependencies.q.defer = sinon.stub().returns({ promise: 'promise' });
      dependencies.fs.existsSync = sinon.stub().withArgs(pcf.store).returns(true);
      dependencies.fs.unlink = function() {};
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.outputFolderExists = true;
      expect(file.writeLocalization('localizations', 'en-US')).to.eql('promise');
    });

    it('should create a folder if a storage folder does not exists', function() {
      pcf.store = 'storage-folder';
      dependencies.mkdirp.sync = sinon.spy();
      dependencies.fs.unlink = function() {};
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.outputFolderExists = false;
      file.writeLocalization('localizations', 'en-US');
      expect(file.outputFolderExists).to.equal(true);
      dependencies.mkdirp.sync.should.have.been.calledOnce;
      dependencies.mkdirp.sync.should.have.been.calledWith(pcf.store);
    });

    it('should unlink current localizations', function() {
      pcf.store = 'storage-folder';
      dependencies.q.defer = sinon.stub().returns({});
      dependencies.fs.unlink = sinon.stub();
      dependencies.fs.existsSync = sinon.stub().withArgs(pcf.store).returns(true);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.outputFolderExists = true;
      file.writeLocalization('localizations', 'en-US');
      dependencies.fs.unlink.should.have.been.calledOnce;
      dependencies.fs.unlink.should.have.been.calledWith(pcf.store + '/en-US.locale');
    });

    it('if unlinking returns an error(none ENOENT) it should reject', function() {
      pcf.store = 'storage-folder';
      var deferred = { reject: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      dependencies.fs.unlink = sinon.stub();
      dependencies.fs.unlink.callsArgWith(1, { code: 'NOT_ENOENT' });
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.outputFolderExists = true;
      file.writeLocalization('localizations', 'en-US');
      deferred.reject.should.have.been.calledOnce;
    });

    it('should write a JSON line to storage', function() {
      pcf.store = 'storage-folder';
      var deferred = { resolve: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      dependencies.fs.existsSync = sinon.stub().withArgs(pcf.store).returns(true);
      dependencies.fs.appendFile = sinon.stub();
      dependencies.fs.appendFile.callsArgWith(2, null);
      dependencies.fs.unlink = sinon.stub();
      dependencies.fs.unlink.callsArgWith(1, null);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      var localizations = { 'en-US': [{ key: 'key1'}] };
      file.writeLocalization(localizations, 'en-US');
      dependencies.fs.appendFile.should.have.been.calledOnce;
      dependencies.fs.appendFile.should.have.been.calledWith('storage-folder/en-US.locale', '{"key":"key1"}\n');
      deferred.resolve.should.have.been.calledOnce;
    });

    it('if file writing returns an error it should reject', function() {
      pcf.store = 'storage-folder';
      var deferred = { reject: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      dependencies.fs.existsSync = sinon.stub().withArgs(pcf.store).returns(true);
      dependencies.fs.appendFile = sinon.stub();
      dependencies.fs.appendFile.callsArgWith(2, 'error');
      dependencies.fs.unlink = sinon.stub();
      dependencies.fs.unlink.callsArgWith(1, null);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      var localizations = { 'en-US': [{ key: 'key1'}] };
      file.writeLocalization(localizations, 'en-US');
      deferred.reject.should.have.been.calledOnce;
      deferred.reject.should.have.been.calledWith('error');
    });
  });

  describe('#localizationMaptoArray()', function() {
    it('should sort after timestamp and return an array', function() {
      pcf.locales = { 'en-US': 'English (US)' };
      var file = new (proxyquire('../libraries/file', dependencies).File);
      var localizations = { 'en-US': [{ key: 'key1', timestamp: 1 }, { key: 'key2', timestamp: 2 }] };
      expect(file.localizationMaptoArray(localizations)).to.eql(
        { 'en-US': [{ key: 'key2', timestamp: 2 }, { key: 'key1', timestamp: 1 }]});
    });

    it('should sort after translation key if timestamp is the same and return an array', function() {
      pcf.locales = { 'en-US': 'English (US)' };
      var file = new (proxyquire('../libraries/file', dependencies).File);
      var localizations = { 'en-US': [{ key: 'key1', timestamp: 2 }, { key: 'key2', timestamp: 2 }] };
      expect(file.localizationMaptoArray(localizations)).to.eql(
        { 'en-US': [{ key: 'key1', timestamp: 2 }, { key: 'key2', timestamp: 2 }]});
    });
  });

  describe('#readLocalizations()', function() {
    it('should return a promise', function() {
      pcf.store = 'storage-folder';
      dependencies.q.defer = sinon.stub().returns({ promise: 'promise', resolve: function() {} });
      dependencies.glob.sync = sinon.stub().withArgs(pcf.store + '/*.locale').returns([]);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      expect(file.readLocalizations()).to.eql('promise');
    });

    it('if there is no files it should resolve to empty', function(done) {
      var deferred = { resolve: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      dependencies.glob.sync = sinon.stub().withArgs(pcf.store + '/*.locale').returns([]);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.readLocalizations();
      eventually(function() {
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith({});
        done();
      });
    });

    it('should for each file read localization map', function() {
      var deferred = { resolve: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      dependencies.glob.sync = sinon.stub().withArgs(pcf.store + '/*.locale').returns(['locale1.locale', 'locale2.locale']);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.readLocalizationMap = sinon.stub().returns(Q.resolve());
      file.readLocalizations();
      file.readLocalizationMap.should.have.been.calledTwice;
      file.readLocalizationMap.should.have.been.calledWith('locale1.locale');
      file.readLocalizationMap.should.have.been.calledWith('locale2.locale');
    });

    it('should resolve to a localization map', function() {
      var deferred = { resolve: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      dependencies.glob.sync = sinon.stub().withArgs(pcf.store + '/*.locale').returns(['locale1.locale', 'locale2.locale']);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.readLocalizationMap = sinon.stub().returns(Q.resolve('localizations'));
      file.readLocalizations();
      eventually(function() {
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith({ 'locale1': 'localizations', 'locale2': 'localizations' });
      });
    });

    it('if a locale is provided it should resolve to a localization map represnting that locale', function() {
      var deferred = { resolve: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      dependencies.glob.sync = sinon.stub().withArgs(pcf.store + '/*.locale').returns(['locale1.locale', 'locale2.locale']);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.readLocalizationMap = sinon.stub().returns(Q.resolve('localizations'));
      file.readLocalizations('locale1');
      eventually(function() {
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith('localizations');
      });
    });

    it('should reject if a locale is provided but there is not storage file for that locale', function(done) {
      var deferred = { reject: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      dependencies.glob.sync = sinon.stub().withArgs(pcf.store + '/*.locale').returns(['locale1.locale', 'locale2.locale']);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.readLocalizationMap = sinon.stub().returns(Q.resolve('localizations'));
      file.readLocalizations('locale3');
      eventually(function() {
        deferred.reject.should.have.been.calledOnce;
        deferred.reject.should.have.been.calledWith(new TypeError('The file locale3.locale does not exists.'));
        done();
      });
    });

    it('should reject if reading of localization map rejects', function(done) {
      var deferred = { reject: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.readLocalizationMap = sinon.stub().returns(Q.reject('error'));
      file.readLocalizations();
      eventually(function() {
        deferred.reject.should.have.been.calledOnce;
        deferred.reject.should.have.been.calledWith('error');
        done();
      });
    });
  });

  describe('#readLocalizationArray()', function() {
    it('should return a promise', function() {
      var deferred = { promise: 'promise' };
      dependencies.q.defer = sinon.stub().returns(deferred);
      dependencies.fs.readFile = function() {};
      var file = new (proxyquire('../libraries/file', dependencies).File);
      expect(file.readLocalizationArray('storage-folder/locale1.locale')).to.equal('promise');
    });

    it('should read localization storage files', function() {
      dependencies.q.defer = sinon.stub().returns({});
      dependencies.fs.readFile = sinon.spy();
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.readLocalizationArray('storage-folder/locale1.locale');
      dependencies.fs.readFile.should.have.been.calledOnce;
      dependencies.fs.readFile.should.have.been.calledWith('storage-folder/locale1.locale');
    });

    it('should resolve to a localization array', function() {
      var deferred = { resolve: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      dependencies.fs.readFile = sinon.stub();
      dependencies.fs.readFile
        .withArgs('storage-folder/locale1.locale', { encoding: 'utf-8' })
        .callsArgWith(2, null, '{ "key1": {}}\n{ "key2": {}}\n');
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.readLocalizationArray('storage-folder/locale1.locale');
      eventually(function() {
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith([{ 'key1': {}}, {'key2': {}}]);
      });
    });

    it('should reject if reading of a storage file sends an error', function(done) {
      var deferred = { reject: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      dependencies.fs.readFile = sinon.stub();
      dependencies.fs.readFile
        .withArgs('storage-folder/locale1.locale', { encoding: 'utf-8' })
        .callsArgWith(2, 'error');

      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.readLocalizationArray('storage-folder/locale1.locale');
      eventually(function() {
        deferred.reject.should.have.been.calledOnce;
        deferred.reject.should.have.been.calledWith('error');
        done();
      });
    });
  });

  describe('#readLocalizationMap()', function() {
    it('should return a promise', function() {
      var deferred = { promise: 'promise', reject: function() {} };
      dependencies.q.defer = sinon.stub().returns(deferred);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.readLocalizationArray = sinon.stub().returns(Q.reject());
      expect(file.readLocalizationMap('storage-folder/locale1.locale')).to.equal('promise');
    });

    it('should transform localization array to a map', function(done) {
      var deferred = { resolve: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      var localizations = [{ key: 'key1' }, { key: 'key2'}];
      file.readLocalizationArray = sinon.stub()
        .withArgs('storage-folder/locale1.locale')
        .returns(Q.resolve(localizations));
      file.readLocalizationMap('storage-folder/locale1.locale');
      eventually(function() {
        deferred.resolve.should.have.been.calledOnce;
        deferred.resolve.should.have.been.calledWith({ 'key1': { key: 'key1' }, 'key2': { key: 'key2' }});
        done();
      });
    });

    it('should reject if reading of localization array rejects', function(done) {
      var deferred = { reject: sinon.spy() };
      dependencies.q.defer = sinon.stub().returns(deferred);
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file.readLocalizationArray = sinon.stub().returns(Q.reject('error'));
      file.readLocalizationMap('storage-folder/locale1.locale');
      eventually(function() {
        deferred.reject.should.have.been.calledOnce;
        deferred.reject.should.have.been.calledWith('error');
        done();
      });
    });
  });
});
