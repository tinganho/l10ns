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

  it('should be able to compile a exponential format', function(done) {
    var localizations = getLocalizations('{variable1, number, 0.00##E0}')
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
      '    exponent: {\n' +
      '      digits: 1,\n' +
      '      plusSign: false\n' +
      '    },\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 4,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 8\n' +
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
      '    exponent: {\n' +
      '      digits: 1,\n' +
      '      plusSign: false\n' +
      '    },\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 4,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 8\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile a exponential format with plus sign', function(done) {
    var localizations = getLocalizations('{variable1, number, 0.00##E+0}')
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
      '    exponent: {\n' +
      '      digits: 1,\n' +
      '      plusSign: true\n' +
      '    },\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 4,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 9\n' +
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
      '    exponent: {\n' +
      '      digits: 1,\n' +
      '      plusSign: true\n' +
      '    },\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 4,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 9\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile a exponential format with multiple non-absent digits', function(done) {
    var localizations = getLocalizations('{variable1, number, 0.00##E00}')
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
      '    exponent: {\n' +
      '      digits: 2,\n' +
      '      plusSign: false\n' +
      '    },\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 4,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 9\n' +
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
      '    exponent: {\n' +
      '      digits: 2,\n' +
      '      plusSign: false\n' +
      '    },\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 4,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 9\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile a significant number format with one non-absent significant number', function(done) {
    var localizations = getLocalizations('{variable1, number, @}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 1,\n' +
      '    maximumSignificantDigits: 1,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 1\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 1,\n' +
      '    maximumSignificantDigits: 1,\n' +
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

  it('should be able to compile a significant number format with multiple non-absent significant numbers', function(done) {
    var localizations = getLocalizations('{variable1, number, @@}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 2,\n' +
      '    maximumSignificantDigits: 2,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 2\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 2,\n' +
      '    maximumSignificantDigits: 2,\n' +
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

  it('should be able to compile a significant number format with a non-absent significant number and a absent significant number', function(done) {
    var localizations = getLocalizations('{variable1, number, @#}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 1,\n' +
      '    maximumSignificantDigits: 2,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 2\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 1,\n' +
      '    maximumSignificantDigits: 2,\n' +
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

  it('should be able to compile a significant number format with multiple non-absent significant number and multiple absent significant number', function(done) {
    var localizations = getLocalizations('{variable1, number, @@##}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 2,\n' +
      '    maximumSignificantDigits: 4,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 4\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 2,\n' +
      '    maximumSignificantDigits: 4,\n' +
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

  it('should be able to compile a significant number format with an exponent digit', function(done) {
    var localizations = getLocalizations('{variable1, number, @@##E0}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: {\n' +
      '      digits: 1,\n' +
      '      plusSign: false\n' +
      '    },\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 2,\n' +
      '    maximumSignificantDigits: 4,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 6\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: {\n' +
      '      digits: 1,\n' +
      '      plusSign: false\n' +
      '    },\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 2,\n' +
      '    maximumSignificantDigits: 4,\n' +
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

  it('should be able to compile a significant number format with multiple exponent digits', function(done) {
    var localizations = getLocalizations('{variable1, number, @@##E00}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: {\n' +
      '      digits: 2,\n' +
      '      plusSign: false\n' +
      '    },\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 2,\n' +
      '    maximumSignificantDigits: 4,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 7\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: {\n' +
      '      digits: 2,\n' +
      '      plusSign: false\n' +
      '    },\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 2,\n' +
      '    maximumSignificantDigits: 4,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 7\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to parse a floating number format with grouping', function(done) {
    var localizations = getLocalizations('{variable1, number, ##,00}')
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
      '    groupSize: {\n' +
      '      primary: 2,\n' +
      '      secondary: 2\n' +
      '    },\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 2,\n' +
      '    maximumIntegerDigits: 4,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
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
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: {\n' +
      '      primary: 2,\n' +
      '      secondary: 2\n' +
      '    },\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 2,\n' +
      '    maximumIntegerDigits: 4,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
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

  it('should be able to parse a significant number format with grouping', function(done) {
    var localizations = getLocalizations('{variable1, number, ##,@@,###}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'if(it.variable1 >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: {\n' +
      '      primary: 3,\n' +
      '      secondary: 2\n' +
      '    },\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 2,\n' +
      '    maximumSignificantDigits: 5,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 9\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'significant\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: {\n' +
      '      primary: 3,\n' +
      '      secondary: 2\n' +
      '    },\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 0,\n' +
      '    maximumIntegerDigits: 0,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 2,\n' +
      '    maximumSignificantDigits: 5,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 9\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to parse a number format with padding characters', function(done) {
    var localizations = getLocalizations('{variable1, number, *x########00}')
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
      '    prefix: \'*x\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 2,\n' +
      '    maximumIntegerDigits: 10,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: \'x\',\n' +
      '    patternLength: 10\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'*x-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 2,\n' +
      '    maximumIntegerDigits: 10,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols,\n' +
      '    paddingCharacter: \'x\',\n' +
      '    patternLength: 10\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to parse a number format with rounding', function(done) {
    var localizations = getLocalizations('{variable1, number, #05}')
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
      '    roundTo: 5,\n' +
      '    prefix: \'\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 2,\n' +
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
      '    roundTo: 5,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: null,\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 2,\n' +
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

  it('should be able to compile a percentage format', function(done) {
    var localizations = getLocalizations('{variable1, number, 0.00##%}')
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
      '    suffix: \'%\',\n' +
      '    percentage: true,\n' +
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
      '    patternLength: 7\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'%\',\n' +
      '    percentage: true,\n' +
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
      '    patternLength: 7\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile a permille format', function(done) {
    var localizations = getLocalizations('{variable1, number, 0.00##‰}')
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
      '    suffix: \'‰\',\n' +
      '    percentage: null,\n' +
      '    permille: true,\n' +
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
      '    patternLength: 7\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'-\',\n' +
      '    suffix: \'‰\',\n' +
      '    percentage: null,\n' +
      '    permille: true,\n' +
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
      '    patternLength: 7\n' +
      '  });\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile a negative format', function(done) {
    var localizations = getLocalizations('{variable1, number, #0;(#0)}')
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
      '    prefix: \'(\',\n' +
      '    suffix: \')\',\n' +
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
});
