
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

describe('Variables', function() {
  afterEach(function() {
    messageFormat.unsetVariables();
  });

  it('should parse a sentence with a single variable', function() {
    messageFormat.parse('sentence {variable1}');
    expect(messageFormat.messageAST[0].string).to.equal('sentence ');
    expect(messageFormat.messageAST[1].name).to.equal('variable1');
    expect(messageFormat.messageAST.length).to.equal(2);
  });

  it('should parse a message with multiple variables', function() {
    messageFormat.parse('{variable1} {variable2}');
    expect(messageFormat.messageAST[0].name).to.equal('variable1');
    expect(messageFormat.messageAST[1].string).to.equal(' ');
    expect(messageFormat.messageAST[2].name).to.equal('variable2');
    expect(messageFormat.messageAST.length).to.equal(3);
  });

  it('should parse a sentence with multiple subsequent variables', function() {
    messageFormat.parse('{variable1}{variable2}{variable3}');
    expect(messageFormat.messageAST[0].name).to.equal('variable1');
    expect(messageFormat.messageAST[1].name).to.equal('variable2');
    expect(messageFormat.messageAST[2].name).to.equal('variable3');
    expect(messageFormat.messageAST.length).to.equal(3);
  });

  it('should throw an error if a variable contains non alphanumeric characters', function() {
    var method = function() {
      messageFormat.parse('{!variable1}');
    };
    expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {!');
    var method = function() {
      messageFormat.parse('{varia!ble1}');
    };
    expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {varia!');
    var method = function() {
      messageFormat.parse('{variable1!}');
    };
    expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {variable1!');
    var method = function() {
      messageFormat.parse('{variable1}{varia!ble2}');
    };
    expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {variable1}{varia');
  });

  it('should throw an error if an undefined variable is used', function() {
    var method = function() {
      messageFormat.setVariables(['variable2']);
      messageFormat.parse('{variable1}');
    };
    expect(method).to.throw(TypeError, 'Variable \'variable1\' is not defined in \'{variable1}\'. Please tell your developer to add the variable to his source code and update translations.');
  });
});
