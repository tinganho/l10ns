
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

describe('Sentences', function() {
  it('should parse a sentence', function() {
    messageFormat.parse('sentence');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.Sentence);
    expect(messageFormat.messageAST[0].string).to.equal('sentence');
    expect(messageFormat.messageAST.length).to.equal(1);
  });

  it('should escape diagraph character in non-choice format context', function() {
    messageFormat.parse('sentence1 | sentence2');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.Sentence);
    expect(messageFormat.messageAST[0].string).to.equal('sentence1 | sentence2');
    expect(messageFormat.messageAST.length).to.equal(1);

    messageFormat.parse('{variable1, plural, other{sentence1 | sentence2}}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.PluralFormat);
    expect(messageFormat.messageAST[0].values['other'][0]).to.be.an.instanceOf(AST.Sentence);
    expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('sentence1 | sentence2');

    messageFormat.parse('{variable1, select, other{sentence1 | sentence2}}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.SelectFormat);
    expect(messageFormat.messageAST[0].values['other'][0]).to.be.an.instanceOf(AST.Sentence);
    expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('sentence1 | sentence2');

    messageFormat.parse('{variable1, selectordinal, other{sentence1 | sentence2}}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.SelectordinalFormat);
    expect(messageFormat.messageAST[0].values['other'][0]).to.be.an.instanceOf(AST.Sentence);
    expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('sentence1 | sentence2');
  });

  it('should parse escaped sentences', function() {
    messageFormat.parse('sentence\'{\'');
    expect(messageFormat.messageAST[0].string).to.equal('sentence{');
    expect(messageFormat.messageAST.length).to.equal(1);
    messageFormat.parse('sentence\'}\'');
    expect(messageFormat.messageAST[0].string).to.equal('sentence}');
    expect(messageFormat.messageAST.length).to.equal(1);
    messageFormat.parse('\'{\'sentence\'{\'');
    expect(messageFormat.messageAST[0].string).to.equal('{sentence{');
    expect(messageFormat.messageAST.length).to.equal(1);
    messageFormat.parse('{variable1, choice, 1<\'|\'}');
    expect(messageFormat.messageAST[0].values[0].messageAST[0].string).to.equal('|');
    messageFormat.parse('{variable1, plural, other{\'#\'}}');
    expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('#');
  });

  it('should not escape if it does not percede a special character', function() {
    messageFormat.parse('don\'t');
    expect(messageFormat.messageAST[0].string).to.equal('don\'t');
    expect(messageFormat.messageAST.length).to.equal(1);
  });

  it('should be able to parse a sentence only containing #', function() {
    messageFormat.parse('#');
    expect(messageFormat.messageAST[0].string).to.equal('#');
    expect(messageFormat.messageAST.length).to.equal(1);
  });

  it('should throw an error if an unescaped reserved character is used', function() {
    function method() {
      messageFormat.parse('sentence {');
    }
    expect(method).to.throw(TypeError, 'Could not parse variable in sentence {');
  });

  it('should throw an error if a missing ending quote is missing in sentence', function() {
    function method() {
      messageFormat.parse('sentence\'{');
    }
    expect(method).to.throw(TypeError, 'Escape message doesn\'t have an ending quote(\') in sentence\'{');
  });

  it('should throw en error if a missing ending quote is missing in a choice value', function() {
    function method() {
      messageFormat.parse('{variable1, choice, 1<\'|}');
    }
    expect(method).to.throw(TypeError, 'Escape message doesn\'t have an ending quote(\') in {variable1, choice, 1<\'|}');
  });

  it('should throw en error if a missing ending quote is missing in a plural value', function() {
    function method() {
      messageFormat.parse('{variable1, plural, other{\'#}}');
    }
    expect(method).to.throw(TypeError, 'Escape message doesn\'t have an ending quote(\') in {variable1, plural, other{\'#}}');
  });
});
