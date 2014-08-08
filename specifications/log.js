
var dependencies = {
  './file': {},
  './_log': {}
};

describe('Log', function() {
  describe('#run(locale, type)', function() {
    it('should read default localization from storage', function() {
      project.store = 'storage-folder';
      project.defaultLocale = 'default-locale';
      dependencies['./file'].readLocalizationArray = stub().returns(rejects());
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.run(null, 'regular');
      dependencies['./file'].readLocalizationArray.should.have.been.calledOnce;
      dependencies['./file'].readLocalizationArray.should.have.been.calledWith(project.store + '/' + project.defaultLocale + '.locale');
    });

    it('should read given localization from storage', function() {
      project.store = 'storage-folder';
      project.defaultLocale = 'default-locale';
      dependencies['./file'].readLocalizationArray = stub().returns(rejects());
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.run('locale1', 'regular');
      dependencies['./file'].readLocalizationArray.should.have.been.calledOnce;
      dependencies['./file'].readLocalizationArray.should.have.been.calledWith(project.store + '/' + 'locale1.locale');
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

    it('should truncate on defined log length', function(done) {
      program.DEFAULT_LOG_LENGTH = 1;
      var localizations = [{ key: 'key1' }, { key: 'key2' }];
      dependencies['./file'].readLocalizationArray = stub().returns(resolvesTo(localizations));
      var log = new (proxyquire('../libraries/log', dependencies).Constructor);
      log.printRegularLog = spy();
      log.run('locale1', 'regular');
      eventually(function() {
        log.printRegularLog.should.have.been.calledOnce;
        log.printRegularLog.should.have.been.calledWith([{ key: 'key1' }]);
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
});
