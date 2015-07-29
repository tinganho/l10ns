describe('CurrencyFormat', function() {
  it('should be able to compile a currency format with a local symbol', function(done) {
    var localizations = getLocalizations('{variable1, currency, local, symbol}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var currencyString = \'\';\n' +
      'if(!this.__currencies) {\n' +
      '  throw new TypeError(\'You must define your currencies in your configuration file l10ns.json. http://l10ns.org/docs.html#currencyformat\');\n' +
      '}\n' +
      'var unit;\n' +
      'if(it.variable1.amount && it.variable1.code) {\n' +
      '  if(!this.__currencies[it.variable1.code]) {\n' +
      '    throw new TypeError(\'Currency code \' + it.variable1.code + \' is not defined. Please define it on your l10ns.json file.\');\n' +
      '  }\n' +
      '  unit = this.__currencies[it.variable1.code][\'symbol\'][\'local\'];\n' +
      '}\n' +
      'else {\n' +
      '  throw TypeError(\'`variable1` must be an object that has properties amount and code.\');\n' +
      '}\n' +
      'if(it.variable1.amount >= 0) {\n' +
      '  currencyString += formatNumber({\n' +
      '    number: it.variable1.amount,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'¤\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: {\n' +
      '      primary: 3,\n' +
      '      secondary: 3\n' +
      '    },\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 4,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 2,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: this.__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 9\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  currencyString += formatNumber({\n' +
      '    number: it.variable1.amount,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'(¤\',\n' +
      '    suffix: \')\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: {\n' +
      '      primary: 3,\n' +
      '      secondary: 3\n' +
      '    },\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 4,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 2,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: this.__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 11\n' +
      '  });\n' +
      '}\n' +
      'string += currencyString;\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile a currency format with a global symbol', function(done) {
    var localizations = getLocalizations('{variable1, currency, global, symbol}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var currencyString = \'\';\n' +
      'if(!this.__currencies) {\n' +
      '  throw new TypeError(\'You must define your currencies in your configuration file l10ns.json. http://l10ns.org/docs.html#currencyformat\');\n' +
      '}\n' +
      'var unit;\n' +
      'if(it.variable1.amount && it.variable1.code) {\n' +
      '  if(!this.__currencies[it.variable1.code]) {\n' +
      '    throw new TypeError(\'Currency code \' + it.variable1.code + \' is not defined. Please define it on your l10ns.json file.\');\n' +
      '  }\n' +
      '  unit = this.__currencies[it.variable1.code][\'symbol\'][\'global\'];\n' +
      '}\n' +
      'else {\n' +
      '  throw TypeError(\'`variable1` must be an object that has properties amount and code.\');\n' +
      '}\n' +
      'if(it.variable1.amount >= 0) {\n' +
      '  currencyString += formatNumber({\n' +
      '    number: it.variable1.amount,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'¤\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: {\n' +
      '      primary: 3,\n' +
      '      secondary: 3\n' +
      '    },\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 4,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 2,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: this.__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 9\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  currencyString += formatNumber({\n' +
      '    number: it.variable1.amount,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'(¤\',\n' +
      '    suffix: \')\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: {\n' +
      '      primary: 3,\n' +
      '      secondary: 3\n' +
      '    },\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 4,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 2,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: this.__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 11\n' +
      '  });\n' +
      '}\n' +
      'string += currencyString;\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile a currency format with a reverse global symbol', function(done) {
    var localizations = getLocalizations('{variable1, currency, reverseglobal, symbol}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var currencyString = \'\';\n' +
      'if(!this.__currencies) {\n' +
      '  throw new TypeError(\'You must define your currencies in your configuration file l10ns.json. http://l10ns.org/docs.html#currencyformat\');\n' +
      '}\n' +
      'var unit;\n' +
      'if(it.variable1.amount && it.variable1.code) {\n' +
      '  if(!this.__currencies[it.variable1.code]) {\n' +
      '    throw new TypeError(\'Currency code \' + it.variable1.code + \' is not defined. Please define it on your l10ns.json file.\');\n' +
      '  }\n' +
      '  unit = this.__currencies[it.variable1.code][\'symbol\'][\'reverseGlobal\'];\n' +
      '}\n' +
      'else {\n' +
      '  throw TypeError(\'`variable1` must be an object that has properties amount and code.\');\n' +
      '}\n' +
      'if(it.variable1.amount >= 0) {\n' +
      '  currencyString += formatNumber({\n' +
      '    number: it.variable1.amount,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'¤\',\n' +
      '    suffix: \'\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: {\n' +
      '      primary: 3,\n' +
      '      secondary: 3\n' +
      '    },\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 4,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 2,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: this.__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 9\n' +
      '  });\n' +
      '}\n' +
      'else {\n' +
      '  currencyString += formatNumber({\n' +
      '    number: it.variable1.amount,\n' +
      '    type: \'floating\',\n' +
      '    roundTo: 0.01,\n' +
      '    prefix: \'(¤\',\n' +
      '    suffix: \')\',\n' +
      '    percentage: null,\n' +
      '    permille: null,\n' +
      '    currency: {\n' +
      '      symbol: unit\n' +
      '    },\n' +
      '    groupSize: {\n' +
      '      primary: 3,\n' +
      '      secondary: 3\n' +
      '    },\n' +
      '    exponent: null,\n' +
      '    minimumIntegerDigits: 1,\n' +
      '    maximumIntegerDigits: 4,\n' +
      '    minimumFractionDigits: 2,\n' +
      '    maximumFractionDigits: 2,\n' +
      '    minimumSignificantDigits: 0,\n' +
      '    maximumSignificantDigits: 0,\n' +
      '    symbols: this.__numberSymbols[\'latn\'],\n' +
      '    paddingCharacter: null,\n' +
      '    patternLength: 11\n' +
      '  });\n' +
      '}\n' +
      'string += currencyString;\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile a currency format with a local text', function(done) {
    var localizations = getLocalizations('{variable1, currency, local, text}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var currencyString = \'\';\n' +
      'if(!this.__currencies) {\n' +
      '  throw new TypeError(\'You must define your currencies in your configuration file l10ns.json. http://l10ns.org/docs.html#currencyformat\');\n' +
      '}\n' +
      'var unit;\n' +
      'if(it.variable1.amount && it.variable1.code) {\n' +
      '  if(!this.__currencies[it.variable1.code]) {\n' +
      '    throw new TypeError(\'Currency code \' + it.variable1.code + \' is not defined. Please define it on your l10ns.json file.\');\n' +
      '  }\n' +
      '  var pluralKeyword = this.__getPluralKeyword(it.variable1.amount);\n' +
      '  if(this.__currencies[it.variable1.code][\'text\'][\'local\']) {\n' +
      '    unit = this.__currencies[it.variable1.code][\'text\'][\'local\'][pluralKeyword];\n' +
      '  }\n' +
      '  else {\n' +
      '    unit = this.__currencies[it.variable1.code][\'text\'][\'global\'][pluralKeyword];\n' +
      '  }\n' +
      '}\n' +
      'else {\n' +
      '  throw TypeError(\'`variable1` must be an object that has properties amount and code.\');\n' +
      '}\n' +
      'var number;\n' +
      'if(it.variable1.amount >= 0) {\n' +
      '  number =\n' +
      '    formatNumber({\n' +
      '      number: it.variable1.amount,\n' +
      '      type: \'floating\',\n' +
      '      roundTo: 0.01,\n' +
      '      prefix: \'\',\n' +
      '      suffix: \'\',\n' +
      '      percentage: null,\n' +
      '      permille: null,\n' +
      '      currency: null,\n' +
      '      groupSize: {\n' +
      '        primary: 3,\n' +
      '        secondary: 3\n' +
      '      },\n' +
      '      exponent: null,\n' +
      '      minimumIntegerDigits: 1,\n' +
      '      maximumIntegerDigits: 4,\n' +
      '      minimumFractionDigits: 2,\n' +
      '      maximumFractionDigits: 2,\n' +
      '      minimumSignificantDigits: 0,\n' +
      '      maximumSignificantDigits: 0,\n' +
      '      symbols: this.__numberSymbols[\'latn\'],\n' +
      '      paddingCharacter: null,\n' +
      '      patternLength: 9\n' +
      '    });\n' +
      '}\n' +
      'else {\n' +
      '  number =\n' +
      '    formatNumber({\n' +
      '      number: it.variable1.amount,\n' +
      '      type: \'floating\',\n' +
      '      roundTo: 0.01,\n' +
      '      prefix: \'-\',\n' +
      '      suffix: \'\',\n' +
      '      percentage: null,\n' +
      '      permille: null,\n' +
      '      currency: null,\n' +
      '      groupSize: {\n' +
      '        primary: 3,\n' +
      '        secondary: 3\n' +
      '      },\n' +
      '      exponent: null,\n' +
      '      minimumIntegerDigits: 1,\n' +
      '      maximumIntegerDigits: 4,\n' +
      '      minimumFractionDigits: 2,\n' +
      '      maximumFractionDigits: 2,\n' +
      '      minimumSignificantDigits: 0,\n' +
      '      maximumSignificantDigits: 0,\n' +
      '      symbols: this.__numberSymbols[\'latn\'],\n' +
      '      paddingCharacter: null,\n' +
      '      patternLength: 10\n' +
      '    });\n' +
      '}\n' +
      'currencyString += this.__currencyUnitPattern[pluralKeyword].replace(\'{0}\', number).replace(\'{1}\', unit);\n' +
      'string += currencyString;\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile a currency format with a global text', function(done) {
    var localizations = getLocalizations('{variable1, currency, global, text}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var currencyString = \'\';\n' +
      'if(!this.__currencies) {\n' +
      '  throw new TypeError(\'You must define your currencies in your configuration file l10ns.json. http://l10ns.org/docs.html#currencyformat\');\n' +
      '}\n' +
      'var unit;\n' +
      'if(it.variable1.amount && it.variable1.code) {\n' +
      '  if(!this.__currencies[it.variable1.code]) {\n' +
      '    throw new TypeError(\'Currency code \' + it.variable1.code + \' is not defined. Please define it on your l10ns.json file.\');\n' +
      '  }\n' +
      '  var pluralKeyword = this.__getPluralKeyword(it.variable1.amount);\n' +
      '  unit = this.__currencies[it.variable1.code][\'text\'][\'global\'][pluralKeyword];\n' +
      '}\n' +
      'else {\n' +
      '  throw TypeError(\'`variable1` must be an object that has properties amount and code.\');\n' +
      '}\n' +
      'var number;\n' +
      'if(it.variable1.amount >= 0) {\n' +
      '  number =\n' +
      '    formatNumber({\n' +
      '      number: it.variable1.amount,\n' +
      '      type: \'floating\',\n' +
      '      roundTo: 0.01,\n' +
      '      prefix: \'\',\n' +
      '      suffix: \'\',\n' +
      '      percentage: null,\n' +
      '      permille: null,\n' +
      '      currency: null,\n' +
      '      groupSize: {\n' +
      '        primary: 3,\n' +
      '        secondary: 3\n' +
      '      },\n' +
      '      exponent: null,\n' +
      '      minimumIntegerDigits: 1,\n' +
      '      maximumIntegerDigits: 4,\n' +
      '      minimumFractionDigits: 2,\n' +
      '      maximumFractionDigits: 2,\n' +
      '      minimumSignificantDigits: 0,\n' +
      '      maximumSignificantDigits: 0,\n' +
      '      symbols: this.__numberSymbols[\'latn\'],\n' +
      '      paddingCharacter: null,\n' +
      '      patternLength: 9\n' +
      '    });\n' +
      '}\n' +
      'else {\n' +
      '  number =\n' +
      '    formatNumber({\n' +
      '      number: it.variable1.amount,\n' +
      '      type: \'floating\',\n' +
      '      roundTo: 0.01,\n' +
      '      prefix: \'-\',\n' +
      '      suffix: \'\',\n' +
      '      percentage: null,\n' +
      '      permille: null,\n' +
      '      currency: null,\n' +
      '      groupSize: {\n' +
      '        primary: 3,\n' +
      '        secondary: 3\n' +
      '      },\n' +
      '      exponent: null,\n' +
      '      minimumIntegerDigits: 1,\n' +
      '      maximumIntegerDigits: 4,\n' +
      '      minimumFractionDigits: 2,\n' +
      '      maximumFractionDigits: 2,\n' +
      '      minimumSignificantDigits: 0,\n' +
      '      maximumSignificantDigits: 0,\n' +
      '      symbols: this.__numberSymbols[\'latn\'],\n' +
      '      paddingCharacter: null,\n' +
      '      patternLength: 10\n' +
      '    });\n' +
      '}\n' +
      'currencyString += this.__currencyUnitPattern[pluralKeyword].replace(\'{0}\', number).replace(\'{1}\', unit);\n' +
      'string += currencyString;\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });
});
