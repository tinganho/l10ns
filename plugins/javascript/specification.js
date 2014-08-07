
var dependencies = {
  'fs': {},
  'path': {},
  'q': {},
  './syntax': {},
  '../../libraries/file': {},
  '../../libraries/_log': {}
};

var template = require('./templates/build/templates');

describe('Compiler', function() {
  describe('Javascript', function() {
    describe('#constructor()', function() {
      it('should set this.namespace to \'it\'', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler.namespace).to.equal('it');
      });

      it('should set this.linefeed to \'\\n\'', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler.linefeed).to.equal('\n');
      });

      it('should set this.quote to \'\'\'', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler.quote).to.equal('\'');
      });

      it('should set this.dot to \'.\'', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler.dot).to.equal('.');
      });

      it('should set this.comma to \',\'', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler.comma).to.equal(',');
      });

      it('should set this.add to \' + \'', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler.add).to.equal(' + ');
      });

      it('should set this.space to \' \'', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler.space).to.equal(' ');
      });
    });

    describe('#run()', function() {
      it('should get localization map', function() {
        project.locales = { 'locale-code-1': 'locale-name-1' };
        dependencies.fs.writeFileSync = spy();
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getLocalizationMap = stub().returns(resolvesTo('localization-map'));
        compiler.run();
        compiler._getLocalizationMap.should.have.been.calledOnce;
      });

      it('should write localization content to output folder', function(done) {
        project.locales = { 'locale-code-1': 'locale-name-1' };
        project.output = 'output-folder';
        dependencies.fs.writeFileSync = spy();
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getLocalizationMap = stub().returns(resolvesTo('localization-map'));
        compiler.run();
        eventually(function() {
          dependencies.fs.writeFileSync.should.have.been.calledOnce;
          dependencies.fs.writeFileSync.should.have.been.calledWith(project.output + '/locale-code-1' + '.js');
          done();
        });
      });

      it('should write a localization function', function() {
        project.locales = { 'locale-code-1': 'locale-name-1' };
        project.output = 'output-folder';
        dependencies.fs.writeFileSync = spy();
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getLocalizationMap = stub().returns(resolvesTo('localization-map'));
        compiler.run();
        eventually(function() {
          dependencies.fs.writeFileSync.should.have.been.calledOnce;
          expect(dependencies.fs.writeFileSync.args[0][1]).to.equal(template.javascriptWrapper({
            functionName: language.GET_LOCALIZATION_STRING_FUNCTION_NAME,
            localizationMap: 'localization-map',
            functions: compiler.indentSpaces(2, template.functions())
          }));
        });
      });

      it('should log error stack if getting localization map rejects and --stack option is choosen', function(done) {
        stub(console, 'log');
        commands.stack = true;
        project.locales = { 'locale-code-1': 'locale-name-1' };
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getLocalizationMap = stub().withArgs('locale-code-1').returns(rejectsWith({ stack: 'stack' }));
        compiler.run();
        eventually(function() {
          console.log.should.have.been.calledOnce;
          console.log.should.have.been.calledWith('stack');
          console.log.restore();
          done();
        });
      });

      it('should log error message if getting localization map rejects', function(done) {
        stub(console, 'log');
        commands.stack = false;
        project.locales = { 'locale-code-1': 'locale-name-1' };
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getLocalizationMap = stub().withArgs('locale-code-1').returns(rejectsWith({ message: 'error-message' }));
        compiler.run();
        eventually(function() {
          console.log.should.have.been.calledOnce;
          console.log.should.have.been.calledWith('error-message');
          console.log.restore();
          done();
        });
      });
    });

    describe('#indentSpaces()', function() {
      it('shouldd indent content with specified spaces', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler.indentSpaces(2, 'content')).to.equal('  content');
      });

      it('should indent multilined content with specified spaces', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler.indentSpaces(2, 'content-line-1\ncontent-line-2')).to.equal('  content-line-1\n  content-line-2');
      });
    });

    describe('#_getLocalizationMap()', function() {
      it('should return a promise', function() {
        var deferred = { promise: 'promise', reject: noop };
        dependencies.q.defer = stub().returns(deferred);
        dependencies['../../libraries/file'].readLocalizations = stub().withArgs('locale1').returns(rejects());
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler._getLocalizationMap('locale1')).to.equal('promise');
      });

      it('should read localization from storage', function() {
        dependencies.q.defer = stub().returns({ reject: noop });
        dependencies['../../libraries/file'].readLocalizations = stub().withArgs('locale1').returns(rejects());
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getLocalizationMap('locale1');
        dependencies['../../libraries/file'].readLocalizations.should.have.been.calledOnce;
      });

      it('should resolve to a localization map', function(done) {
        var deferred = { resolve: spy() };
        dependencies.q.defer = stub().returns(deferred);
        var localizations = { 'key1': {}};
        dependencies['../../libraries/file'].readLocalizations = stub().withArgs('locale1').returns(resolvesTo(localizations));
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getFunctionBodyString = stub().returns('function-string');
        compiler._getLocalizationMap('locale1');
        eventually(function() {
          deferred.resolve.should.have.been.calledOnce;
          deferred.resolve.should.have.been.calledWith('  var localizations = {\n    \'key1\': function-string\n  };\n  ');
          done();
        });
      });

      it('should reject with error if getting localization from storage rejects with error', function(done) {
        var deferred = { reject: spy() };
        dependencies.q.defer = stub().returns(deferred);
        dependencies['../../libraries/file'].readLocalizations = stub().withArgs('locale1').returns(rejectsWith('error'));
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getLocalizationMap('locale1');
        eventually(function() {
          deferred.reject.should.have.been.calledOnce;
          deferred.reject.should.have.been.calledWith('error');
          done();
        });
      });
    });

    describe('#_normalizeText()', function() {
      it('should turn single quote to \'\\\'\'', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler._normalizeText('\'')).to.equal('\\\'');
      });

      it('should turn escape character \\ to \'\\\\', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler._normalizeText('\\')).to.equal('\\\\');
      });
    });
  });
});
