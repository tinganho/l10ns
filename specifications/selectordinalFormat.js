
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

describe('SelectordinalFormat', function() {
  afterEach(function() {
    messageFormat.unsetVariables();
  });

  it('should be able to parse a single case', function() {
    messageFormat.parse('{variable1, selectordinal, other{message1}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.SelectordinalFormat);
    expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('message1');
  });

  it('should be able to parse a multiple cases', function() {
    messageFormat.parse('{variable1, selectordinal, one{message1} other{message2}}');
    expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.SelectordinalFormat);
    expect(messageFormat.messageAST[0].values['one'][0].string).to.equal('message1');
    expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('message2');
  });

  it('should throw an error if one of the brackets are missing in the values', function() {
    var method = function() {
      messageFormat.parse('{variable1,selectordinal,other message1}}');
    }
    expect(method).to.throw(TypeError, 'Expected bracket \'{\' instead got \'m\' in {variable1,selectordinal,other m');
    var method = function() {
      messageFormat.parse('{variable1,selectordinal,other {message1}');
    }
    expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got EOF in {variable1,selectordinal,other {message1}');
  });

  it('should throw an error if there is letters or a case after the other case', function() {
    var method = function() {
      messageFormat.parse('{variable1,selectordinal,other {message1}case}');
    }
    expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got \'c\' in {variable1,selectordinal,other {message1}c');
  });

  it('should throw an error if one undefined variable is used', function() {
    var method = function() {
      messageFormat.setVariables(['variable2'])
      messageFormat.parse('{variable1,selectordinal,other {message1}}');
    }
    expect(method).to.throw(TypeError, 'Variable \'variable1\' is not defined in \'{variable1,\'. Please tell your developer to add the variable to his source code and update translations.');
  });

  it('should throw an error if there is one case that is not defined in the ordinal rules', function() {
    var method = function() {
      messageFormat.parse('{variable1,selectordinal,many{message1}other{message2}}');
    }
    expect(method).to.throw(TypeError, 'Expected a keyword (one, two, few, other). Instead got \'many\' in {variable1,selectordinal,many{');
    var method = function() {
      messageFormat.parse('{variable1,selectordinal,somecase{message1}other{message2}}');
    }
    expect(method).to.throw(TypeError, 'Expected a keyword (one, two, few, other). Instead got \'somecase\' in {variable1,selectordinal,somecase{');
  });
});
