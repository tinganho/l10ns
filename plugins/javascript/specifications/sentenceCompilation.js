
describe('Sentences', function() {
  it('should be able to compile a single sentece', function(done) {
    var localizations = {
      'en-US': {
        'key-1': {
          value: 'sentence1'
        }
      }
    };
    var dependencies = getDependencies(localizations);
    var compiler = proxyquire('../plugins/javascript/compiler', dependencies);
    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'string += \'sentence1\';\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile multiple sentences', function(done) {
    var localizations = getLocalizations('sentence1{variable1}sentence2')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'string += \'sentence1\';\n' +
      'string += it.variable1;\n' +
      'string += \'sentence2\';\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });
});