
var dependencies = {
  './file': {},
  './_log': {}
};

describe('Log', function() {
  describe('#run(locale, type)', function() {
    it('should read default localization from storage', function() {
      project.store = 'storage-folder';
      project.defaultLanguage = 'default-locale';
      dependencies['./file'].readLocalizationArray = stub().returns(rejects());
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.run(null, 'regular');
      dependencies['./file'].readLocalizationArray.should.have.been.calledOnce;
      dependencies['./file'].readLocalizationArray.should.have.been.calledWith(project.store + '/' + project.defaultLanguage + '.json');
    });

    it('should read given localization from storage', function() {
      project.store = 'storage-folder';
      project.defaultLanguage = 'default-locale';
      dependencies['./file'].readLocalizationArray = stub().returns(rejects());
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.run('locale1', 'regular');
      dependencies['./file'].readLocalizationArray.should.have.been.calledOnce;
      dependencies['./file'].readLocalizationArray.should.have.been.calledWith(project.store + '/' + 'locale1.json');
    });

    it('should print log', function(done) {
      var localizations = [{ key: 'key1' }];
      dependencies['./file'].readLocalizationArray = stub().returns(resolvesTo(localizations));
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.printRegularLog = spy();
      log.run('locale1', 'regular');
      eventually(function() {
        log.printRegularLog.should.have.been.calledOnce;
        log.printRegularLog.should.have.been.calledWith(localizations);
        done();
      });
    });

    it('if with --empty option it should print empty values only', function(done) {
      var localizations = [{ key: 'key1' }];
      dependencies['./file'].readLocalizationArray = stub().returns(resolvesTo(localizations));
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.printEmptyValuesLog = spy();
      log.run('locale1', 'empty');
      eventually(function() {
        log.printEmptyValuesLog.should.have.been.calledOnce;
        log.printEmptyValuesLog.should.have.been.calledWith(localizations, 'locale1');
        done();
      });
    });

    it('should print no localizations if there is no localization from storage', function(done) {
      var localizations = [];
      dependencies['./_log'].log = spy();
      dependencies['./file'].readLocalizationArray = stub().returns(resolvesTo(localizations));
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.printEmptyValuesLog = spy();
      log.run('locale1', 'empty');
      eventually(function() {
        dependencies['./_log'].log.should.have.been.calledOnce;
        expect(dependencies['./_log'].log.args[0][0]).to.contain('No localizations.');
        done();
      });
    });

    it('should print error message', function(done) {
      stub(console, 'log');
      commands.stack = false;
      dependencies['./file'].readLocalizationArray = stub().returns(rejectsWith({ message: 'message' }));
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.run('locale1', 'regular');
      eventually(function() {
        console.log.should.have.been.calledOnce;
        console.log.should.have.been.calledWith('message');
        console.log.restore();
        done();
      });
    });

    it('if with --stack option it should print stack', function(done) {
      stub(console, 'log');
      commands.stack = true;
      dependencies['./file'].readLocalizationArray = stub().returns(rejectsWith({ stack: 'stack', message: 'message' }));
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.run('locale1', 'regular');
      eventually(function() {
        console.log.should.have.been.calledTwice;
        console.log.firstCall.should.have.been.calledWith('stack');
        console.log.secondCall.should.have.been.calledWith('message');
        console.log.restore();
        done();
      });
    });
  });

  describe('#printEmptyValuesLog(localizations, locale)', function() {
    it('should output each empty key', function() {
      program.DEFAULT_LOG_LENGTH = 1;
      var localizations = [{ key: 'key1', values: [] }, { key: 'key2', values: ['value1'] }];
      dependencies['./_log'].log = spy();
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.printEmptyValuesLog(localizations, 'locale1');
      dependencies['./_log'].log.should.have.been.calledOnce;
      dependencies['./_log'].log.should.have.been.calledWith('key1');
    });

    it('should truncate on specified max log length', function() {
      program.DEFAULT_LOG_LENGTH = 1;
      var localizations = [{ key: 'key1', values: [] }, { key: 'key2', values: [] }];
      dependencies['./_log'].log = spy();
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.printEmptyValuesLog(localizations, 'locale1');
      dependencies['./_log'].log.should.have.been.calledOnce;
      dependencies['./_log'].log.should.have.been.calledWith('key1');
    });

    it('should output message if no localization has empty values', function() {
      program.DEFAULT_LOG_LENGTH = 1;
      var localizations = [{ key: 'key1', values: ['value1'] }, { key: 'key2', values: ['value2'] }];
      dependencies['./_log'].log = spy();
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.printEmptyValuesLog(localizations, 'locale1');
      dependencies['./_log'].log.should.have.been.calledOnce;
      expect(dependencies['./_log'].log.args[0][0]).to.contain('No empty-values for locale');
      expect(dependencies['./_log'].log.args[0][0]).to.contain('locale1');
    });
  });

  describe('#printRegularLog(localizations)', function() {
    it('should print log with tags', function() {
      program.DEFAULT_LOG_LENGTH = 10;
      var localizations = [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' }
      ];
      dependencies['./_log'].log = spy();
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.printRegularLog(localizations);
      dependencies['./_log'].log.should.have.been.calledTwice;
      expect(dependencies['./_log'].log.args[0][0]).to.contain('@1');
      expect(dependencies['./_log'].log.args[0][0]).to.contain('key1');
      expect(dependencies['./_log'].log.args[0][0]).to.contain('value1');
      expect(dependencies['./_log'].log.args[1][0]).to.contain('@2');
      expect(dependencies['./_log'].log.args[1][0]).to.contain('key2');
      expect(dependencies['./_log'].log.args[1][0]).to.contain('value2');
    });

    it('should truncate log with specified max length', function() {
      program.DEFAULT_LOG_LENGTH = 1;
      var localizations = [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' }
      ];
      dependencies['./_log'].log = spy();
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.printRegularLog(localizations);
      dependencies['./_log'].log.should.have.been.calledOnce;
      expect(dependencies['./_log'].log.args[0][0]).to.contain('@1');
      expect(dependencies['./_log'].log.args[0][0]).to.contain('key1');
      expect(dependencies['./_log'].log.args[0][0]).to.contain('value1');
    });

    it('should print message if there is localizations', function() {
      var localizations = [];
      dependencies['./_log'].log = spy();
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.printRegularLog(localizations);
      dependencies['./_log'].log.should.have.been.calledOnce;
      expect(dependencies['./_log'].log.args[0][0]).to.contain('No localizations updated from source. Please update with `l10ns update`.');
    });
  });
});
