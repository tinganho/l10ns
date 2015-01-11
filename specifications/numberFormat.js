
var MessageFormat = require('../libraries/MessageFormat');
var messageFormat = new MessageFormat('en-US');
var AST = require('../libraries/MessageFormat/AST');

project.currencies = ['USD'];

describe('NumberFormat', function() {
  afterEach(function() {
    messageFormat.unsetVariables();
  });

  it('should be able to parse a non-pattern arguments', function() {
    messageFormat.parse('{variable1,number,integer}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('integer');
    messageFormat.parse('{variable1,number,percent}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('percent');
  });

  it('should be able to parse padding characters by setting it on the prefix', function() {
    messageFormat.parse('{variable1,number,*p0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('*p0');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal('p');
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse padding characters by setting it on the suffix', function() {
    messageFormat.parse('{variable1,number,0*p}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('0*p');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal('p');
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse percentage by setting it on the prefix', function() {
    messageFormat.parse('{variable1,number,%0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('%0');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(true);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse percentage by setting it on the suffix', function() {
    messageFormat.parse('{variable1,number,0%}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('0%');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(true);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse permille by setting it on the prefix', function() {
    messageFormat.parse('{variable1,number,‰0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('‰0');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(true);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse permille by setting it on the suffix', function() {
    messageFormat.parse('{variable1,number,0‰}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('0‰');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(true);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a local symbol currency by setting it on the prefix', function() {
    messageFormat.parse('{variable1,number,¤0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('¤0');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.eql({
      context: 'local',
      type: 'symbol'
    });
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a global symbol currency by setting it on the prefix', function() {
    messageFormat.parse('{variable1,number,¤¤0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('¤¤0');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.eql({
      context: 'global',
      type: 'symbol'
    });
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a local text currency by setting it on the prefix', function() {
    messageFormat.parse('{variable1,number,¤¤¤0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('¤¤¤0');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.eql({
      context: 'local',
      type: 'text'
    });
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a local text currency by setting it on the prefix', function() {
    messageFormat.parse('{variable1,number,¤¤¤¤0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('¤¤¤¤0');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.eql({
      context: 'global',
      type: 'text'
    });
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a local symbol currency by setting it on the suffix', function() {
    messageFormat.parse('{variable1,number,0¤}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('0¤');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.eql({
      context: 'local',
      type: 'symbol'
    });
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a global symbol currency by setting it on the suffix', function() {
    messageFormat.parse('{variable1,number,0¤¤}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('0¤¤');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.eql({
      context: 'global',
      type: 'symbol'
    });
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a local text currency by setting it on the suffix', function() {
    messageFormat.parse('{variable1,number,0¤¤¤}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('0¤¤¤');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.eql({
      context: 'local',
      type: 'text'
    });
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a local text currency by setting it on the suffix', function() {
    messageFormat.parse('{variable1,number,0¤¤¤¤}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('0¤¤¤¤');
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.percentage).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.permille).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.currency).to.eql({
      context: 'global',
      type: 'text'
    });
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a signifcant number pattern with a single non-absent number', function() {
    messageFormat.parse('{variable1,number,@}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._SignificantNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.rightAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a signifcant number pattern with multiple non-absent numbers', function() {
    messageFormat.parse('{variable1,number,@@}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._SignificantNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.rightAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a signifcant number pattern with multiple non-absent numbers and a single left absent number', function() {
    messageFormat.parse('{variable1,number,#@@}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._SignificantNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.leftAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.rightAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(3);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a signifcant number pattern with multiple non-absent numbers and multiple left absent numbers', function() {
    messageFormat.parse('{variable1,number,##@@}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._SignificantNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.leftAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.rightAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(4);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a signifcant number pattern with multiple non-absent numbers and multiple left absent numbers and multiple right absent numbers', function() {
    messageFormat.parse('{variable1,number,##@@##}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._SignificantNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.leftAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.rightAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(6);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a signifcant number pattern with one group separator', function() {
    messageFormat.parse('{variable1,number,##,@@#}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._SignificantNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.leftAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.rightAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(6);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize.primary).to.equal(3);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize.secondary).to.equal(3);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a signifcant number pattern with one group separator', function() {
    messageFormat.parse('{variable1,number,#,##,@@#}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._SignificantNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.leftAbsentNumbers).to.equal(3);
    expect(messageFormat.messageAST[0].pattern.positive.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.rightAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(8);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize.primary).to.equal(3);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize.secondary).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a signifcant number pattern with exponent pattern', function() {
    messageFormat.parse('{variable1,number,##@@#E0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._SignificantNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.leftAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.rightAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.eql({
      nonAbsentNumbers: 1,
      showPositiveCharacter: false
    });
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(7);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a number pattern argument with a single non-absent number', function() {
    messageFormat.parse('{variable1,number,0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('0');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a patternted argument with a single non-absent number with a rounding number', function() {
    messageFormat.parse('{variable1,number,05}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('05');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(5);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a patternted argument with a rounding numbers spanning integer and fraction', function() {
    messageFormat.parse('{variable1,number,1.05}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('1.05');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer).to.eql({
      leftAbsentNumbers: 0,
      nonAbsentNumbers: 1
    });
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(1.05);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.eql({
      nonAbsentNumbers: 2,
      rightAbsentNumbers: 0
    });
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(4);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a patternted argument with multiple non-absent numbers', function() {
    messageFormat.parse('{variable1,number,00}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('00');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a patternted argument with a single left absent number', function() {
    messageFormat.parse('{variable1,number,#0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('#0');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a patternted argument with multiple left absent numbers', function() {
    messageFormat.parse('{variable1,number,##0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('##0');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(3);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a patternted argument with a single decimal with a non-absent number', function() {
    messageFormat.parse('{variable1,number,#0.0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('#0.0');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction.rightAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(4);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a patternted argument with multiple decimals with multiple non-absent numbers', function() {
    messageFormat.parse('{variable1,number,#0.00}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('#0.00');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.fraction.rightAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(5);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a patternted argument with multiple decimals with multiple non-absent numbers and single absent number', function() {
    messageFormat.parse('{variable1,number,#0.00#}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('#0.00#');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.fraction.rightAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(6);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a patternted argument with multiple decimals with multiple non-absent numbers and multiple absent numbers', function() {
    messageFormat.parse('{variable1,number,#0.00##}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('#0.00##');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.fraction.rightAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(7);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse exponent pattern with a single non-absent number and without showing positive character', function() {
    messageFormat.parse('{variable1,number,#0E0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('#0E0');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.eql({ nonAbsentNumbers: 1, showPositiveCharacter: false });
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(4);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse exponent pattern with multiple non-absent numbers and without showing positive character', function() {
    messageFormat.parse('{variable1,number,#0E00}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('#0E00');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.eql({ nonAbsentNumbers: 2, showPositiveCharacter: false });
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(5);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse exponent pattern with showing positive character', function() {
    messageFormat.parse('{variable1,number,#0E+0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].argument).to.equal('#0E+0');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.positive.fraction).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive.exponent).to.eql({ nonAbsentNumbers: 1, showPositiveCharacter: true });
    expect(messageFormat.messageAST[0].pattern.positive.patternLength).to.equal(5);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse a patternted argument with a negative pattern', function() {
    messageFormat.parse('{variable1,number,0;0}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.negative.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.negative.integer.nonAbsentNumbers).to.equal(1);
    messageFormat.parse('{variable1,number,0;##0.00##E0}');
    expect(messageFormat.messageAST[0].pattern.negative).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.negative.integer.leftAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative.fraction.nonAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative.fraction.rightAbsentNumbers).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.negative.exponent).to.eql({ nonAbsentNumbers: 1, showPositiveCharacter: false });
    expect(messageFormat.messageAST[0].pattern.negative.paddingCharacter).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.negative.groupSize).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.negative.patternLength).to.equal(10);
  });

  it('should be able to parse group size with a single group separator', function() {
    messageFormat.parse('{variable1,number,#,#0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize.primary).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize.secondary).to.equal(2);
  });

  it('should be able to parse a group size with multiple group separator', function() {
    messageFormat.parse('{variable1,number,#,#,#0}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize.primary).to.equal(2);
    expect(messageFormat.messageAST[0].pattern.positive.groupSize.secondary).to.equal(1);
  });

  it('should be able to parse with spaces between keywords', function() {
    messageFormat.parse('{ variable1,number,0}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    messageFormat.parse('{variable1 ,number,0}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    messageFormat.parse('{variable1 ,number,0}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    messageFormat.parse('{variable1, number,0}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    messageFormat.parse('{variable1,number, 0}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    messageFormat.parse('{variable1,number,0 }');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse with tabes between keywords', function() {
    messageFormat.parse('{\tvariable1,number,0}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    messageFormat.parse('{variable1\t,number,0}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    messageFormat.parse('{variable1\t,number,0}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    messageFormat.parse('{variable1,\tnumber,0}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    messageFormat.parse('{variable1,number,\t0}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
    messageFormat.parse('{variable1,number,0\t}');
    expect(messageFormat.messageAST[0].pattern.positive).to.be.an.instanceOf(AST.NumberFormatPattern._FloatingNumberFormat);
    expect(messageFormat.messageAST[0].pattern.positive.integer.leftAbsentNumbers).to.equal(0);
    expect(messageFormat.messageAST[0].pattern.positive.integer.nonAbsentNumbers).to.equal(1);
    expect(messageFormat.messageAST[0].pattern.negative).to.equal(null);
  });

  it('should be able to parse rounding', function() {
    messageFormat.parse('{variable1,number,010}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(10);
    messageFormat.parse('{variable1,number,011}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(11);
    messageFormat.parse('{variable1,number,0.010}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(0.01);
    messageFormat.parse('{variable1,number,0.019}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(0.019);
    messageFormat.parse('{variable1,number,00.0}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(0.1);
    messageFormat.parse('{variable1,number,00.005}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(0.005);
    messageFormat.parse('{variable1,number,00.105}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(0.105);
    messageFormat.parse('{variable1,number,00}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(1);
    messageFormat.parse('{variable1,number,###00}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(1);
    messageFormat.parse('{variable1,number,50}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(50);
    messageFormat.parse('{variable1,number,50.000}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(50);
    messageFormat.parse('{variable1,number,50.001}');
    expect(messageFormat.messageAST[0].pattern.positive.rounding).to.equal(50.001);
  });

  it('should throw an error if there exists two padding characters', function() {
    var method = function() {
      messageFormat.parse('{variable1,number,*r*r0}');
    };
    expect(method).to.throw(TypeError, 'Can not set double padding character(*x*x) in *r*r0');
  });

  it('should throw an error if there exists two percentage characters', function() {
    var method = function() {
      messageFormat.parse('{variable1,number,%%0}');
    };
    expect(method).to.throw(TypeError, 'Can not set double percentage character(%%) in %%0');
  });

  it('should throw an error if there exists two permille characters', function() {
    var method = function() {
      messageFormat.parse('{variable1,number,‰‰0}');
    };
    expect(method).to.throw(TypeError, 'Can not set double permille character(‰‰) in ‰‰0');
  });

  it('should throw an error if there exists two permille characters', function() {
    var method = function() {
      messageFormat.parse('{variable1,number,‰‰0}');
    };
    expect(method).to.throw(TypeError, 'Can not set double permille character(‰‰) in ‰‰0');
  });

  it('should throw an error if you set percentage and then set permille', function() {
    var method = function() {
      messageFormat.parse('{variable1,number,%‰0}');
    };
    expect(method).to.throw(TypeError, 'Can not set permille whenever percentage or currency are set in %‰0');
  });

  it('should throw an error if you set permille and then set currency', function() {
    var method = function() {
      messageFormat.parse('{variable1,number,‰¤0}');
    };
    expect(method).to.throw(TypeError, 'Can not set currency whenever percentage or permille are set in `‰¤0`');
  });

  it('should throw an error if you set percentage and then set currency', function() {
    var method = function() {
      messageFormat.parse('{variable1,number,%¤0}');
    };
    expect(method).to.throw(TypeError, 'Can not set currency whenever percentage or permille are set in `%¤0`');
  });

  it('should throw an error if the number pattern does not have any non-absent numbers', function() {
    var method = function() {
      messageFormat.parse('{variable1,number,#}');
    };
    expect(method).to.throw(TypeError, 'Expected a valid integer pattern (/^#*0+$/) in your NumberFormat argument, got (#) in #');
  });

  it('should throw an error if the exponent pattern have no non-absent numbers', function() {
    var method = function() {
      messageFormat.parse('{variable1,number,0E}');
    };
    expect(method).to.throw(TypeError, 'Expected a valid exponent pattern (/^E\\+?[0-9]+$/) in your NumberFormat argument, got (E) in 0E');
  });

  it('should throw an error if a special character exists in between integer and exponent pattern', function() {
    var method = function() {
      messageFormat.parse('{variable1,number,0nE0}');
    };
    expect(method).to.throw(TypeError, 'A number pattern can not exist after suffix pattern in 0nE0');
  });

  it('should throw an error if there exist a non non-absent number after `E` in an exponent pattern', function() {
    var method = function() {
      messageFormat.parse('{variable1,number,0E10}');
    };
    expect(method).to.throw(TypeError, 'Expected a valid exponent pattern (/^E\\+?[0-9]+$/) in your NumberFormat argument, got (E10) in 0E10');
  });

  it('should throw an error if one undefined variable is used', function() {
    var method = function() {
      messageFormat.setVariables(['variable2']);
      messageFormat.parse('{variable1,number, integer}');
    }
    expect(method).to.throw(TypeError, 'Variable \'variable1\' is not defined in \'{variable1,\'. Please tell your developer to add the variable to his source code and update translations.');
  });

  it('should throw an error if the consecutive currency character length exceeds four', function() {
    var method = function() {
      messageFormat.parse('{variable1, number, ¤¤¤¤¤0}');
    }
    expect(method).to.throw(TypeError, 'The consecutive currency character length can not exceed four in `¤¤¤¤¤0`');
  });

  it('should throw an error if multiple currency sequences is defined', function() {
    var method = function() {
      messageFormat.parse('{variable1, number, ¤¤¤¤ ¤0}');
    }
    expect(method).to.throw(TypeError, 'Can not set multiple currency unit sequences in `¤¤¤¤ ¤0`');
    var method = function() {
      messageFormat.parse('{variable1, number, ¤¤¤¤ 0¤}');
    }
    expect(method).to.throw(TypeError, 'Can not set multiple currency unit sequences in `¤¤¤¤ 0¤`');
  });
});
