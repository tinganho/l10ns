
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

describe('SelectFormat', function() {
  afterEach(function() {
    messageFormat.unsetVariables();
  });

  it('should be able to parse with a single case', function() {
    messageFormat.parse('{variable1,select,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
  });

  it('should be able to  parse with multiple cases', function() {
    messageFormat.parse('{variable1,select,case1{message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1[0].string).to.equal('message1');
    expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message2');
    messageFormat.parse('{variable1,select,case1{message1}case2{message2}other{message3}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1[0].string).to.equal('message1');
    expect(messageFormat.messageAST[0].values.case2[0].string).to.equal('message2');
    expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message3');
  });

  it('should be able to parse with spaces between keywords', function() {
    messageFormat.parse('{variable1,select,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{ variable1,select,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1 ,select,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1, select,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,select ,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,select, other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,select,other {message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,select,other {message1} }');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,select,case1{message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,select, case1{message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,select,case1 {message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,select,case1{message1} other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,select,case1{message1}other {message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
  });

  it('should be able to parse with tabs between keywords', function() {
    messageFormat.parse('{variable1,select,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{\tvariable1,select,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1\t,select,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,\tselect,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,select\t,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,select,\tother{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,select,other\t{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,select,other{message1}\t}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
    messageFormat.parse('{variable1,select,case1{message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,select,\tcase1{message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,select,case1\t{message1}other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,select,case1{message1}\tother{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
    messageFormat.parse('{variable1,select,case1{message1}other\t{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
    expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
  });

  it('should be able to parse a sub-message with a sentence', function() {
    messageFormat.parse('{variable1,select,other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0].string).to.eql('message1');
  });

  it('should be able to parse a sub-message with the same variable connected to the SelectFormat', function() {
    messageFormat.parse('{variable1,select,other{{variable1}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable1');
  });

  it('should be able to parse a sub-message with a variable that is not connected to the SelectFormat', function() {
    messageFormat.parse('{variable1,select,other{{variable2}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable2');
  });

  it('should be able to parse a sub-message with multiple variable that is not connected to the SelectFormat', function() {
    messageFormat.parse('{variable1,select,other{{variable2}{variable3}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable2');
    expect(messageFormat.messageAST[0].values.other[1].name).to.equal('variable3');
  });

  it('should be able to parse a sub-message with an another SelectFormat', function() {
    messageFormat.parse('{variable1,select,other{{variable2,select,other{message1}}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.SelectFormat);
    expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
    expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
  });

  it('should be able to parse a sub-message with a PluralFormat', function() {
    messageFormat.parse('{variable1,select,other{{variable2,plural,other{message1}}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.PluralFormat);
    expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
    expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
  });

  it('should be able to parse a sub-message with both a SelectFormat and a PluralFormat', function() {
    messageFormat.parse('{variable1,select,other{{variable2,select,other{message1}}{variable3,plural,other{message2}}}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.SelectFormat);
    expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
    expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
    expect(messageFormat.messageAST[0].values.other[1]).to.be.an.instanceOf(AST.PluralFormat);
    expect(messageFormat.messageAST[0].values.other[1].variable.name).to.equal('variable3');
    expect(messageFormat.messageAST[0].values.other[1].values.other[0].string).to.equal('message2');
  });

  it('should throw an error if there is no other case', function() {
    var method = function() {
      messageFormat.parse('{variable1,select,case1{message1}}');
    }
    expect(method).to.throw(TypeError, 'Missing \'other\' case in {variable1,select,case1{message1}}');
  });

  it('should throw an error if one of the brackets are missing in the values', function() {
    var method = function() {
      messageFormat.parse('{variable1,select,other message1}}');
    }
    expect(method).to.throw(TypeError, 'Expected bracket \'{\' instead got \'m\' in {variable1,select,other m');
    var method = function() {
      messageFormat.parse('{variable1,select,other {message1}');
    }
    expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got EOF in {variable1,select,other {message1}');
  });

  it('should throw an error if there is letters or a case after the other case', function() {
    var method = function() {
      messageFormat.parse('{variable1,select,other {message1}case}');
    }
    expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got \'c\' in {variable1,select,other {message1}c');
  });

  it('should throw an error if one undefined variable is used', function() {
    var method = function() {
      messageFormat.setVariables(['variable2'])
      messageFormat.parse('{variable1,select,other {message1}}');
    }
    expect(method).to.throw(TypeError, 'Variable \'variable1\' is not defined in \'{variable1,\'. Please tell your developer to add the variable to his source code and update translations.');
  });
});
