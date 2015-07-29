describe('Variables', function() {
  it('should be able to compile a single variable', function(done) {
    var localizations = getLocalizations('{variable1}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'string += it.variable1;\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile multiple variables', function(done) {
    var localizations = getLocalizations('{variable1}{variable2}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'string += it.variable1;\n' +
      'string += it.variable2;\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });
});
