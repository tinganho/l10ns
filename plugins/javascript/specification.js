
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

    describe('#_getLocalizationMap(locale)', function() {
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

    describe('#_getFunctionBodyString(localizations, key)', function() {
      it('should return a function string that returns the key that is not localized', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor)
          , localizations = { 'key1': { values: [] }};
        expect(compiler._getFunctionBodyString(localizations, 'key1')).to.equal('function anonymous(it) {\n  return \'KEY_NOT_TRANSLATED: key1\';\n}');
      });

      it('should return a function string that has if/else if/else statement and returns a localization', function() {
        program.CONDITION_IF = 'if';
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor)
          , localizations = { 'key1': { values: [['if', '${variable1}', '==', '1', 'value1'], ['else', 'value2']], variables: ['variable1'] }};
        compiler._getConditionsString = stub().withArgs(localizations.key1.values, localizations.key1.variables).returns('conditions');
        expect(compiler._getFunctionBodyString(localizations, 'key1')).to.equal('function anonymous(it) {\n  conditions\n}');
      });

      it('should return a function that returns a localization', function() {
        program.CONDITION_IF = 'if';
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor)
          , localizations = { 'key1': { values: ['value1'] }};
        compiler._getFormatedLocalizedText = stub().withArgs(localizations.key1.values, localizations.key1.variables).returns('formated-localized-text');
        compiler._getNonConditionsFunctionBodyString = stub().withArgs('formated-localized-text').returns('nonConditionsFunctionBodyString');
        expect(compiler._getFunctionBodyString(localizations, 'key1')).to.equal('function anonymous(it) {\nnonConditionsFunctionBodyString\n}');
      });
    });

    describe('#_getNonConditionsFunctionBodyString(string)', function() {
      it('should return a non-condition function body string', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler._getNonConditionsFunctionBodyString('value1')).to.equal('  return \'value1\';');
      });
    });

    describe('#_getNonLocalizedFunctionBodyString(key)', function() {
      it('should return a non-condition function body string', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler._getNonLocalizedFunctionBodyString('key1')).to.equal('return \'KEY_NOT_TRANSLATED: key1\';');
      });
    });

    describe('#_getConditionsString(conditions, variables)', function() {
      it('should return a condition string', function() {
        program.CONDITION_ELSE = 'else';
        var conditions = [['if', '${variable1}', '==', '1', 'value1'], ['else', 'value2']]
          , variables = ['variable1']
          , compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getConditionString = stub().withArgs(conditions[0], variables).returns('if( variable1 == 1');
        compiler._getAdditionalConditionString = stub().withArgs(conditions[0], variables).returns(')\n{\n  return \'value1\'\n}');
        compiler._getElseStatementString = stub().withArgs('else', variables).returns('else {\n  return \'value2\';\n}');
        expect(compiler._getConditionsString(conditions, variables)).to.equal('if( variable1 == 1)\n{\n  return \'value1\'\n} else {\n  return \'value2\';\n}');
      });
    });

    describe('#_getConditionString(condition, variables)', function() {
      it('should return a condition string', function() {
        dependencies['./syntax'].stringIsCondition = stub().withArgs('variable1', '==', '1').returns(true);
        var condition = ['if', '${variable1}', '==', '1', 'value1']
          , variables = ['variable1']
          , compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getFormatedOperandString = stub();
        compiler._getFormatedOperandString.withArgs(condition[1], variables).returns('variable1');
        compiler._getFormatedOperandString.withArgs(condition[3], variables).returns('1');
        expect(compiler._getConditionString(condition,variables)).to.equal('if(variable1 == 1');
      });

      it('should return a condition string containing "last character is"-function', function() {
        dependencies['./syntax'].stringIsCondition = stub().withArgs('variable1', '==', '1').returns(true);
        var condition = ['if', '${variable1}', 'lci', '1', 'value1']
          , variables = ['variable1']
          , compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getFormatedOperandString = stub();
        compiler._getFormatedOperandString.withArgs(condition[1], variables).returns('variable1');
        compiler._getFormatedOperandString.withArgs(condition[3], variables).returns('1');
        expect(compiler._getConditionString(condition,variables)).to.equal('if(lci(variable1, 1)');
      });
    });

    describe('#_getAdditionalConditionString(conditions, variables)', function() {
      before(function() {
        program.ADDITIONAL_CONDITION_AND = '&&';
        program.ADDITIONAL_CONDITION_OR = '||';
      });

      it('should return a additional condition string', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor)
          , conditions = ['if', '${variable1}', 'lci', '1', '&&', '${variable2}', '==', '1', 'value2']
          , variables = ['variable1', 'variable2'];
        compiler._getFormatedOperandString = stub();
        compiler._getFormatedOperandString.withArgs(conditions[5], variables).returns('variable2');
        compiler._getFormatedOperandString.withArgs(conditions[7], variables).returns('1');
        compiler._getFormatedLocalizedText = stub().withArgs(conditions[8], variables).returns('value2');
        expect(compiler._getAdditionalConditionString(conditions, variables)).to.equal(' && variable2 == 1) {\n  return \'value2\';\n}');
      });

      it('should return a additional condition string with "last character is"-function', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor)
          , conditions = ['if', '${variable1}', 'lci', '1', '&&', '${variable2}', 'lci', '1', 'value2']
          , variables = ['variable1', 'variable2'];
        compiler._getFormatedOperandString = stub();
        compiler._getFormatedOperandString.withArgs(conditions[5], variables).returns('variable2');
        compiler._getFormatedOperandString.withArgs(conditions[7], variables).returns('1');
        compiler._getFormatedLocalizedText = stub().withArgs(conditions[8], variables).returns('value2');
        expect(compiler._getAdditionalConditionString(conditions, variables)).to.equal(' && lci(variable2, 1)) {\n  return \'value2\';\n}');
      });
    });

    describe('#_getConditionBodyString(string)', function() {
      it('should return condition body string', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler._getConditionBodyString('string')).to.equal(') {\n  return \'string\';\n}');
      });
    });

    describe('#_getElseStatementString(string, variables)', function() {
      it('should else statement string', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        compiler._getFormatedLocalizedText = stub().withArgs('string', []).returns('string');
        expect(compiler._getElseStatementString('string', [])).to.equal('else {\n  return \'string\';\n}');
      });
    });

    describe('#_getFormatedOperandString(operand, variables)', function() {
      before(function() {
        program.SYNTAX_VARIABLE_MARKUP = /\$\{([a-zA-Z0-9]+)\}/g;
      });

      it('should throw an error if variable begins with a number', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor)
          , variables = ['1variable']
          , method = function() { compiler._getFormatedOperandString('${1variable}', variables) };
        expect(method).to.throw(TypeError, 'variable can\'t begin with an integer.');
      });

      it('should throw an error if variable string does not exists in provided variables', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor)
          , variables = ['variable2']
          , method = function() { compiler._getFormatedOperandString('${variable1}', variables) };
        expect(method).to.throw(TypeError, /You have used an undefined variable/);
      });

      it('should return a string containing variable with a namespace', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor)
          , variables = ['variable1'];
        expect(compiler._getFormatedOperandString('${variable1}', variables)).to.equal('it.variable1');
      });

      it('if operand is a number string, it should return it', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler._getFormatedOperandString('1', [])).to.equal('1');
      });

      it('if operand is not a number string, it should return it in quotes', function() {
        var compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler._getFormatedOperandString('string1', [])).to.equal('\'string1\'');
      });
    });

    describe('#_getFormatedLocalizedText(text, variables)', function() {
      it('should return localized string with variable', function() {
        var variables = ['variable1']
          , compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor);
        expect(compiler._getFormatedLocalizedText('text with ${variable1}', variables)).to.equal('text with \' + it.variable1 + \'');
      });

      it('should throw an error if variable in string is not provided in argument', function() {
        var variables = ['variable1']
          , compiler = new (proxyquire('../plugins/javascript/compiler', dependencies).Constructor)
          , method = function() { compiler._getFormatedLocalizedText('text with ${variable2}', variables); };
        expect(method).to.throw(TypeError, /You have used an undefined variable/);
      });
    });
  });
});
