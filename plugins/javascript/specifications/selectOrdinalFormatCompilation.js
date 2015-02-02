
describe('SelectordinalFormat', function() {
  it('should be able to compile with a single case', function(done) {
    var localizations = getLocalizations('{variable1, selectordinal, other{message1}}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var _case;\n' +
      '_case = this.__getOrdinalKeyword(it.variable1);\n' +
      'switch(_case) {\n' +
      '  default:\n' +
      '    string += \'message1\';\n' +
      '    break;\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile multiple cases', function(done) {
    var localizations = getLocalizations('{variable1, selectordinal, one {message1} other {message2}}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var _case;\n' +
      '_case = this.__getOrdinalKeyword(it.variable1);\n' +
      'switch(_case) {\n' +
      '  case \'one\':\n' +
      '    string += \'message1\';\n' +
      '    break;\n' +
      '  default:\n' +
      '    string += \'message2\';\n' +
      '    break;\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile with exact cases', function(done) {
    var localizations = getLocalizations('{variable1, selectordinal, =1{message1} other{message2}}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var _case;\n' +
      'if(it.variable1 === 1) {\n' +
      '  _case = \'=\' + 1;\n' +
      '}\n' +
      'else {\n' +
      '  _case = this.__getOrdinalKeyword(it.variable1);\n' +
      '}\n' +
      'switch(_case) {\n' +
      '  case \'=1\':\n' +
      '    string += \'message1\';\n' +
      '    break;\n' +
      '  default:\n' +
      '    string += \'message2\';\n' +
      '    break;\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile with a variable in sub message', function(done) {
    var localizations = getLocalizations('{variable1, selectordinal, one {{variable2}} other {message3}}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var _case;\n' +
      '_case = this.__getOrdinalKeyword(it.variable1);\n' +
      'switch(_case) {\n' +
      '  case \'one\':\n' +
      '    string += it.variable2;\n' +
      '    break;\n' +
      '  default:\n' +
      '    string += \'message3\';\n' +
      '    break;\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile with a variable and sentence in sub message', function(done) {
    var localizations = getLocalizations('{variable1, selectordinal, one {sentence1{variable2}} other {message3}}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var _case;\n' +
      '_case = this.__getOrdinalKeyword(it.variable1);\n' +
      'switch(_case) {\n' +
      '  case \'one\':\n' +
      '    string += \'sentence1\';\n' +
      '    string += it.variable2;\n' +
      '    break;\n' +
      '  default:\n' +
      '    string += \'message3\';\n' +
      '    break;\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile with a remaining in sub message', function(done) {
    var localizations = getLocalizations('{variable1, selectordinal, one{sentence1{variable2}} other{# sentence2}}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var _case;\n' +
      '_case = this.__getOrdinalKeyword(it.variable1);\n' +
      'switch(_case) {\n' +
      '  case \'one\':\n' +
      '    string += \'sentence1\';\n' +
      '    string += it.variable2;\n' +
      '    break;\n' +
      '  default:\n' +
      '    string += formatNumber({\n' +
      '      number: it.variable1 - 0,\n' +
      '      roundTo: 0.001,\n' +
      '      prefix: \'\',\n' +
      '      suffix: \'\',\n' +
      '      percentage: null,\n' +
      '      permille: null,\n' +
      '      currency: null,\n' +
      '      groupSize: {\n' +
      '        primary: 3,\n' +
      '        secondary: 3\n' +
      '      },\n' +
      '      minimumIntegerDigits: 1,\n' +
      '      minimumFractionDigits: 0,\n' +
      '      maximumFractionDigits: 3,\n' +
      '      symbols: this.__numberSymbols[\'latn\']\n' +
      '    });\n' +
      '    string += \' sentence2\';\n' +
      '    break;\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile with a SelectFormat in sub message', function(done) {
    var localizations = getLocalizations('{variable1, selectordinal, one {{variable2, select, case1 {message1} other {message2}}} other {message3}}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var _case;\n' +
      '_case = this.__getOrdinalKeyword(it.variable1);\n' +
      'switch(_case) {\n' +
      '  case \'one\':\n' +
      '    switch(it.variable2) {\n' +
      '      case \'case1\':\n' +
      '        string += \'message1\';\n' +
      '        break;\n' +
      '      default:\n' +
      '        string += \'message2\';\n' +
      '        break;\n' +
      '    }\n' +
      '    break;\n' +
      '  default:\n' +
      '    string += \'message3\';\n' +
      '    break;\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile with a PluralFormat in sub message', function(done) {
    var localizations = getLocalizations('{variable1, selectordinal, one {{variable2, plural, one {message1} other {message2}}} other {message3}}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var _case;\n' +
      '_case = this.__getOrdinalKeyword(it.variable1);\n' +
      'switch(_case) {\n' +
      '  case \'one\':\n' +
      '    var _case;\n' +
      '    _case = this.__getPluralKeyword(it.variable2);\n' +
      '    switch(_case) {\n' +
      '      case \'one\':\n' +
      '        string += \'message1\';\n' +
      '        break;\n' +
      '      default:\n' +
      '        string += \'message2\';\n' +
      '        break;\n' +
      '    }\n' +
      '    break;\n' +
      '  default:\n' +
      '    string += \'message3\';\n' +
      '    break;\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });

  it('should be able to compile with a SelectordinalFormat in sub message', function(done) {
    var localizations = getLocalizations('{variable1, selectordinal, one {{variable2, selectordinal, one {message1} other {message2}}} other {message3}}')
      , dependencies = getDependencies(localizations)
      , compiler = proxyquire('../plugins/javascript/compiler', dependencies);

    compiler.run();
    eventually(function() {
      var functionBody =
      'var string = \'\';\n' +
      'var _case;\n' +
      '_case = this.__getOrdinalKeyword(it.variable1);\n' +
      'switch(_case) {\n' +
      '  case \'one\':\n' +
      '    var _case;\n' +
      '    _case = this.__getOrdinalKeyword(it.variable2);\n' +
      '    switch(_case) {\n' +
      '      case \'one\':\n' +
      '        string += \'message1\';\n' +
      '        break;\n' +
      '      default:\n' +
      '        string += \'message2\';\n' +
      '        break;\n' +
      '    }\n' +
      '    break;\n' +
      '  default:\n' +
      '    string += \'message3\';\n' +
      '    break;\n' +
      '}\n' +
      'return string;';
      expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
        functionBody: indentSpaces(8, functionBody)
      }));
      done();
    });
  });
});
