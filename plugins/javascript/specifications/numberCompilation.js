describe('compilation', function() {
  it('should be able to compile a non-absent integer', function(done) {
    var localizations = getLocalizations('{variable1, number, 0}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 1\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 1\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile an absent integer with a non-absent integer', function(done) {
    var localizations = getLocalizations('{variable1, number, #0}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 2,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 2\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 2,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 2\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile mutliple absent integer with a non-absent integer', function(done) {
    var localizations = getLocalizations('{variable1, number, ##0}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 3,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 3\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 3,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 3\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile mutliple absent integer with multiple non-absent integer', function(done) {
    var localizations = getLocalizations('{variable1, number, ##00}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 2,\n' +
      '    maximumIntegerDigits: 4,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 4\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 2,\n' +
      '    maximumIntegerDigits: 4,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 4\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile a non-absent fraction', function(done) {
    var localizations = getLocalizations('{variable1, number, 0.0}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 1,\n' +
      '    maximumFractionDigits: 1,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 3\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 1,\n' +
      '    maximumFractionDigits: 1,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 3\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile a non-absent fraction with a absent fraction', function(done) {
    var localizations = getLocalizations('{variable1, number, 0.0#}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 1,\n' +
      '    maximumFractionDigits: 2,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 4\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 1,\n' +
      '    maximumFractionDigits: 2,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 4\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile multiple non-absent fraction with a absent fraction', function(done) {
    var localizations = getLocalizations('{variable1, number, 0.00#}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 3,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 5\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 3,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 5\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile multiple non-absent fraction with mutliple absent fraction', function(done) {
    var localizations = getLocalizations('{variable1, number, 0.00##}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 4,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 6\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 4,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 6\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });
});
