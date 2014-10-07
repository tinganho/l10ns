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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    minimumFractionDigits: 1,\n' +
      '    maximumFractionDigits: 2,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 4\n' +
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
      '    minimumFractionDigits: 1,\n' +
      '    maximumFractionDigits: 2,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    roundTo: 0.001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 5\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 6\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 8\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 9\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 9\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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

  it('should be able to compile a floating number format with grouping', function(done) {
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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

  it('should be able to compile a significant number format with grouping', function(done) {
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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

  it('should be able to compile a number format with padding characters', function(done) {
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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

  it('should be able to compile a number format with a local symbol currency', function(done) {
    var localizations = getLocalizations('{variable1, number, ¤0}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var unit;\n' +
      'if(it.variable1.value && it.variable1.code) {\n' +
      '  if(!localizations[\'en-US\'].__currencies[it.variable1.code]) {\n' +
      '    throw new TypeError(\'Currency code \' + it.variable1.code + \' is not defined. Please define it on your l10ns.json file.\');\n' +
      '  }\n' +
      '  unit = localizations[\'en-US\'].__currencies[it.variable1.code][\'symbol\'][\'local\'];\n' +
      '}\n' +
      'else {\n' +
      '  throw TypeError(\'`variable1` must be an object that has properties value and code.\');\n' +
      '}\n' +
      'if(it.variable1.value >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1.value,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'¤\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 2\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1.value,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'¤-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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

  it('should be able to compile a number format with a global symbol currency', function(done) {
    var localizations = getLocalizations('{variable1, number, ¤¤0}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var unit;\n' +
      'if(it.variable1.value && it.variable1.code) {\n' +
      '  if(!localizations[\'en-US\'].__currencies[it.variable1.code]) {\n' +
      '    throw new TypeError(\'Currency code \' + it.variable1.code + \' is not defined. Please define it on your l10ns.json file.\');\n' +
      '  }\n' +
      '  unit = localizations[\'en-US\'].__currencies[it.variable1.code][\'symbol\'][\'global\'];\n' +
      '}\n' +
      'else {\n' +
      '  throw TypeError(\'`variable1` must be an object that has properties value and code.\');\n' +
      '}\n' +
      'if(it.variable1.value >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1.value,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'¤\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 2\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1.value,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'¤-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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

  it('should be able to compile a number format with a local text currency', function(done) {
    var localizations = getLocalizations('{variable1, number, ¤¤¤0}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var unit;\n' +
      'if(it.variable1.value && it.variable1.code) {\n' +
      '  if(!localizations[\'en-US\'].__currencies[it.variable1.code]) {\n' +
      '    throw new TypeError(\'Currency code \' + it.variable1.code + \' is not defined. Please define it on your l10ns.json file.\');\n' +
      '  }\n' +
      '  var pluralKeyword = localizations[\'en-US\'].__getPluralKeyword(it.variable1.value);\n' +
      '  if(localizations[\'en-US\'].__currencies[it.variable1.code][\'text\'][\'local\']) {\n' +
      '    unit = localizations[\'en-US\'].__currencies[it.variable1.code][\'text\'][\'local\'][pluralKeyword];\n' +
      '  }\n' +
      '  else {\n' +
      '    unit = localizations[\'en-US\'].__currencies[it.variable1.code][\'text\'][\'global\'][pluralKeyword];\n' +
      '  }\n' +
      '}\n' +
      'else {\n' +
      '  throw TypeError(\'`variable1` must be an object that has properties value and code.\');\n' +
      '}\n' +
      'if(it.variable1.value >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1.value,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'¤\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 2\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1.value,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'¤-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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

  it('should be able to compile a number format with a local text currency', function(done) {
    var localizations = getLocalizations('{variable1, number, ¤¤¤¤0}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var unit;\n' +
      'if(it.variable1.value && it.variable1.code) {\n' +
      '  if(!localizations[\'en-US\'].__currencies[it.variable1.code]) {\n' +
      '    throw new TypeError(\'Currency code \' + it.variable1.code + \' is not defined. Please define it on your l10ns.json file.\');\n' +
      '  }\n' +
      '  var pluralKeyword = localizations[\'en-US\'].__getPluralKeyword(it.variable1.value);\n' +
      '  unit = localizations[\'en-US\'].__currencies[it.variable1.code][\'text\'][\'global\'][pluralKeyword];\n' +
      '}\n' +
      'else {\n' +
      '  throw TypeError(\'`variable1` must be an object that has properties value and code.\');\n' +
      '}\n' +
      'if(it.variable1.value >= 0) {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1.value,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'¤\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 2\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1.value,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 1,\n' +
      '    prefix: \'¤-\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: null,\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 1,\n' +
      '    minimumFractionDigits: 0,\n' +
      '    maximumFractionDigits: 0,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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

  it('should be able to compile a number format with rounding', function(done) {
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 7\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 7\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  string += formatNumber({\n' +
      '    number: it.variable1,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.0001,\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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
      '    symbols: localizations[\'en-US\'].__numberSymbols[\'latn\'],\n' +
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

  it('should be able to compile arabic numbers', function(done) {
    var localizations = {
      'ar-AE': {
        'key-1': {
          value: '{variable1, number, 0}'
        }
      }
    };
    var dependencies = getDependencies(localizations)
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
      '    symbols: localizations[\'ar-AE\'].__numberSymbols[\'arab\'],\n' +
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
      '    symbols: localizations[\'ar-AE\'].__numberSymbols[\'arab\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 1\n' +
      '  });\n' +
      '}\n' +
      'string = string\n' +
      '  .replace(/1/g, \'١\')\n' +
      '  .replace(/2/g, \'٢\')\n' +
      '  .replace(/3/g, \'٣\')\n' +
      '  .replace(/4/g, \'٤\')\n' +
      '  .replace(/5/g, \'٥\')\n' +
      '  .replace(/6/g, \'٦\')\n' +
      '  .replace(/7/g, \'٧\')\n' +
      '  .replace(/8/g, \'٨\')\n' +
      '  .replace(/9/g, \'٩\')\n' +
      '  .replace(/0/g, \'٠\')\n\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.contain(indentSpaces(8, functionBody));
      done();
    });
  });

  it('should be able to compile arabic extended numerals', function(done) {
    var localizations = {
      'ur-IN': {
        'key-1': {
          value: '{variable1, number, 0}'
        }
      }
    };
    var dependencies = getDependencies(localizations)
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
      '    symbols: localizations[\'ur-IN\'].__numberSymbols[\'arabext\'],\n' +
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
      '    symbols: localizations[\'ur-IN\'].__numberSymbols[\'arabext\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 1\n' +
      '  });\n' +
      '}\n' +
      'string = string\n' +
      '  .replace(/1/g, \'۱\')\n' +
      '  .replace(/2/g, \'۲\')\n' +
      '  .replace(/3/g, \'۳\')\n' +
      '  .replace(/4/g, \'۴\')\n' +
      '  .replace(/5/g, \'۵\')\n' +
      '  .replace(/6/g, \'۶\')\n' +
      '  .replace(/7/g, \'۷\')\n' +
      '  .replace(/8/g, \'٨\')\n' +
      '  .replace(/9/g, \'٩\')\n' +
      '  .replace(/0/g, \'٠\')\n\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.contain(indentSpaces(8, functionBody));
      done();
    });
  });

  it('should be able to compile bengali numerals', function(done) {
    var localizations = {
      'bn-BD': {
        'key-1': {
          value: '{variable1, number, 0}'
        }
      }
    };
    var dependencies = getDependencies(localizations)
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
      '    symbols: localizations[\'bn-BD\'].__numberSymbols[\'beng\'],\n' +
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
      '    symbols: localizations[\'bn-BD\'].__numberSymbols[\'beng\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 1\n' +
      '  });\n' +
      '}\n' +
      'string = string\n' +
      '  .replace(/1/g, \'১\')\n' +
      '  .replace(/2/g, \'২\')\n' +
      '  .replace(/3/g, \'৩\')\n' +
      '  .replace(/4/g, \'৪\')\n' +
      '  .replace(/5/g, \'৫\')\n' +
      '  .replace(/6/g, \'৬\')\n' +
      '  .replace(/7/g, \'৭\')\n' +
      '  .replace(/8/g, \'৮\')\n' +
      '  .replace(/9/g, \'৯\')\n' +
      '  .replace(/0/g, \'০\')\n\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.contain(indentSpaces(8, functionBody));
      done();
    });
  });

  it('should be able to compile devanagari numerals', function(done) {
    var localizations = {
      'ne-IN': {
        'key-1': {
          value: '{variable1, number:deva, 0}'
        }
      }
    };
    var dependencies = getDependencies(localizations)
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
      '    symbols: localizations[\'ne-IN\'].__numberSymbols[\'deva\'],\n' +
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
      '    symbols: localizations[\'ne-IN\'].__numberSymbols[\'deva\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 1\n' +
      '  });\n' +
      '}\n' +
      'string = string\n' +
      '  .replace(/1/g, \'१\')\n' +
      '  .replace(/2/g, \'२\')\n' +
      '  .replace(/3/g, \'३\')\n' +
      '  .replace(/4/g, \'४\')\n' +
      '  .replace(/5/g, \'५\')\n' +
      '  .replace(/6/g, \'६\')\n' +
      '  .replace(/7/g, \'७\')\n' +
      '  .replace(/8/g, \'८\')\n' +
      '  .replace(/9/g, \'९\')\n' +
      '  .replace(/0/g, \'०\')\n\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.contain(indentSpaces(8, functionBody));
      done();
    });
  });

  it('should be able to compile devanagari numerals', function(done) {
    var localizations = {
      'ne-IN': {
        'key-1': {
          value: '{variable1, number:deva, 0}'
        }
      }
    };
    var dependencies = getDependencies(localizations)
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
      '    symbols: localizations[\'ne-IN\'].__numberSymbols[\'deva\'],\n' +
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
      '    symbols: localizations[\'ne-IN\'].__numberSymbols[\'deva\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 1\n' +
      '  });\n' +
      '}\n' +
      'string = string\n' +
      '  .replace(/1/g, \'१\')\n' +
      '  .replace(/2/g, \'२\')\n' +
      '  .replace(/3/g, \'३\')\n' +
      '  .replace(/4/g, \'४\')\n' +
      '  .replace(/5/g, \'५\')\n' +
      '  .replace(/6/g, \'६\')\n' +
      '  .replace(/7/g, \'७\')\n' +
      '  .replace(/8/g, \'८\')\n' +
      '  .replace(/9/g, \'९\')\n' +
      '  .replace(/0/g, \'०\')\n\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[0][1]).to.contain(indentSpaces(8, functionBody));
      done();
    });
  });
});
