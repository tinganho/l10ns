
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

describe('PluralFormat', function() {
  afterEach(function() {
    messageFormat.unsetVariables();
  });

  it('should be able to parse a single case', function() {
    messageFormat.parse('{variable1,plural,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
  });

  it('should be able to parse with multiple cases using keywords', function() {
    messageFormat.parse('{variable1,plural,one{message1} other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].offset).to.equal(0);
    expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
  });

  it('should be able to parse with exact cases', function() {
    messageFormat.parse('{variable1,plural,=1{message1} other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values['=1']).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,plural,=1{message1}=2{message2} other{message3}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values['=1']).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values['=2']).to.eql([{ string: 'message2' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message3' }]);
  });

  it('should be able to parse with negative exact cases', function() {
    messageFormat.parse('{variable1,plural,=-1{message1} other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values['=-1']).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
  });

  it('should be able to parse with a positive floating exact case', function() {
    messageFormat.parse('{variable1,plural,=1.1{message1} other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values['=1.1']).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
  });

  it('should be able to parse with a negative floating exact case', function() {
    messageFormat.parse('{variable1,plural,=-1.1{message1} other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values['=-1.1']).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
  });

  it('should be able to parse with a positive infinity exact case', function() {
    messageFormat.parse('{variable1,plural,=infinity{message1} other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values['=infinity']).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
  });

  it('should be able to parse with a negative infinity exact case', function() {
    messageFormat.parse('{variable1,plural,=-infinity{message1} other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values['=-infinity']).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
  });

  it('should be able to set offset', function() {
    messageFormat.parse('{variable1,plural, offset:1 other{message1}}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.PluralFormat);
    expect(messageFormat.messageAST[0].offset).to.equal(1);
  });

  it('should be able to parse sub-message with a remaining symbol', function() {
    messageFormat.parse('{variable1, plural, offset:1 one {message1} other {sentence1#sentence2}}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.PluralFormat);
    expect(messageFormat.messageAST[0].offset).to.equal(1);
    expect(messageFormat.messageAST[0].values['other'][1]).to.be.an.instanceOf(AST.Remaining);
    expect(messageFormat.messageAST[0].values['other'][1].offset).to.equal(1);
    expect(messageFormat.messageAST[0].values['other'][1].variable.name).to.equal('variable1');
    messageFormat.parse('{variable1, plural, one {message1} other {#sentence1}}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.PluralFormat);
    expect(messageFormat.messageAST[0].offset).to.equal(0);
    expect(messageFormat.messageAST[0].values['other'][0]).to.be.an.instanceOf(AST.Remaining);
    expect(messageFormat.messageAST[0].values['other'][0].offset).to.equal(0);
    expect(messageFormat.messageAST[0].values['other'][0].variable.name).to.equal('variable1');
  });

  it('should be able to parse a sub-message with a sentence', function() {
    messageFormat.parse('{variable1,plural,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0].string).to.eql('message1');
  });

  it('should be able to parse a sub-message with a Remaining', function() {
    messageFormat.parse('{variable1,plural,other{message1#}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0].string).to.eql('message1');
    expect(messageFormat.messageAST[0].values.other[1]).to.be.an.instanceOf(AST.Remaining);
  });

  it('should be able to parse a sub-message with the same variable connected to the PluralFormat', function() {
    messageFormat.parse('{variable1,plural,other{{variable1}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable1');
  });

  it('should be able to parse a sub-message with a variable that is not connected to the PluralFormat', function() {
    messageFormat.parse('{variable1,plural,other{{variable2}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable2');
  });

  it('should be able to parse a sub-message with multiple variable that is not connected to the PluralFormat', function() {
    messageFormat.parse('{variable1,plural,other{{variable2}{variable3}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable2');
    expect(messageFormat.messageAST[0].values.other[1].name).to.equal('variable3');
  });

  it('should be able to parse a sub-message with an another PluralFormat', function() {
    messageFormat.parse('{variable1,plural,other{{variable2,plural,other{message1}}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.PluralFormat);
    expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
    expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
  });

  it('should be able to parse a sub-message with a SelectFormat', function() {
    messageFormat.parse('{variable1,plural,other{{variable2,select,other{message1}}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.SelectFormat);
    expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
    expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
  });

  it('should be able to parse a sub-message with both a SelectFormat and a PluralFormat', function() {
    messageFormat.parse('{variable1,plural,other{{variable2,select,other{message1}}{variable3,plural,other{message2}}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.SelectFormat);
    expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
    expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
    expect(messageFormat.messageAST[0].values.other[1]).to.be.an.instanceOf(AST.PluralFormat);
    expect(messageFormat.messageAST[0].values.other[1].variable.name).to.equal('variable3');
    expect(messageFormat.messageAST[0].values.other[1].values.other[0].string).to.equal('message2');
  });

  it('should parse with spaces between keywords', function() {
    messageFormat.parse('{variable1,plural,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{ variable1,plural,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1 ,plural,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1, plural,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,plural ,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,plural, other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,plural,other {message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,plural,other {message1} }');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,plural,one{message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,plural, one{message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,plural,one {message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,plural,one{message1} other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,plural,one{message1}other {message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,plural,offset:1 other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].offset).to.equal(1);
    expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
    messageFormat.parse('{variable1,plural, offset:1 other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].offset).to.equal(1);
    expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
    messageFormat.parse('{variable1,plural, offset:1  other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].offset).to.equal(1);
    expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
    messageFormat.parse('{variable1,plural, offset:1 one{message1} other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].offset).to.equal(1);
    expect(messageFormat.messageAST[0].values.one[0].string).to.equal('message1');
    expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message2');
  });

  it('should parse with tabs between keywords', function() {
    messageFormat.parse('{variable1,plural,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{\tvariable1,plural,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1\t,plural,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,\tplural,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,plural\t,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,plural,\tother{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,plural,other\t{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,plural,other{message1}\t}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,plural,one{message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,plural,\tone{message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,plural,one\t{message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,plural,one{message1}\tother{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,plural,one{message1}other\t{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,plural,offset:1 other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].offset).to.equal(1);
    expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
    messageFormat.parse('{variable1,plural,\toffset:1 other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].offset).to.equal(1);
    expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
    messageFormat.parse('{variable1,plural,\toffset:1\tother{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].offset).to.equal(1);
    expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
    messageFormat.parse('{variable1,plural,\toffset:1\tone{message1}\tother{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].offset).to.equal(1);
    expect(messageFormat.messageAST[0].values.one[0].string).to.equal('message1');
    expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message2');
  });

  it('should throw an error if there is no other case', function() {
    var method = function() {
      messageFormat.parse('{variable1,plural,one{message1}}');
    }
    expect(method).to.throw(TypeError, 'There must exist one other case in {variable1,plural,one{message1}}');
  });

  it('should throw an error if there is one case that is not defined in the plural rules', function() {
    var method = function() {
      messageFormat.parse('{variable1,plural,few{message1}other{message2}}');
    }
    expect(method).to.throw(TypeError, 'Expected a keyword (one, other) or an exact case (=n). Instead got \'few\' in {variable1,plural,few{');
    var method = function() {
      messageFormat.parse('{variable1,plural,somecase{message1}other{message2}}');
    }
    expect(method).to.throw(TypeError, 'Expected a keyword (one, other) or an exact case (=n). Instead got \'somecase\' in {variable1,plural,somecase{');
  });

  it('should throw an error if one of the brackets are missing in the values', function() {
    var method = function() {
      messageFormat.parse('{variable1,plural,other message1}}');
    }
    expect(method).to.throw(TypeError, 'Expected bracket \'{\' instead got \'m\' in {variable1,plural,other m');
    var method = function() {
      messageFormat.parse('{variable1,plural,other {message1}');
    }
    expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got EOF in {variable1,plural,other {message1}');
  });

  it('should throw an error if there is letters or a case after the other case', function() {
    var method = function() {
      messageFormat.parse('{variable1,plural,other {message1}case}');
    }
    expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got \'c\' in {variable1,plural,other {message1}c');
  });

  it('should throw an error if one undefined variable is used', function() {
    var method = function() {
      messageFormat.setVariables(['variable2'])
      messageFormat.parse('{variable1,plural,other {message1}}');
    }
    expect(method).to.throw(TypeError, 'Variable \'variable1\' is not defined in \'{variable1,\'. Please tell your developer to add the variable to his source code and update translations.');
  });
});
