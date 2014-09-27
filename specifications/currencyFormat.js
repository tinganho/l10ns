
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

project.currencies = ['USD'];

describe('CurrencyFormat', function() {
  it('should be able to parse a currency amount with a local symbol', function() {
    messageFormat.parse('{variable1, currency, local, symbol}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.CurrencyFormat);
    expect(messageFormat.messageAST[0].context).to.equal('local');
    expect(messageFormat.messageAST[0].type).to.equal('symbol');
  });

  it('should parse a currency amount with a global symbol', function() {
    messageFormat.parse('{variable1, currency, global, symbol}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.CurrencyFormat);
    expect(messageFormat.messageAST[0].context).to.equal('global');
    expect(messageFormat.messageAST[0].type).to.equal('symbol');
  });

  it('should parse a currency amount with a local text', function() {
    messageFormat.parse('{variable1, currency, local, text}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.CurrencyFormat);
    expect(messageFormat.messageAST[0].context).to.equal('local');
    expect(messageFormat.messageAST[0].type).to.equal('text');
  });

  it('should parse a currency amount with a global text', function() {
    messageFormat.parse('{variable1, currency, global, text}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.CurrencyFormat);
    expect(messageFormat.messageAST[0].context).to.equal('global');
    expect(messageFormat.messageAST[0].type).to.equal('text');
  });

  it('should get relevant information about the currency', function() {
    messageFormat.parse('{variable1, currency, local, symbol}');
    expect(messageFormat.messageAST[0].currencies.USD).to.eql({
      name: 'US Dollar',
      text: {
        local: {
          one: 'dollar',
          other: 'dollars'
        },
        localUnitPattern: {
          one: '{value} {unit}',
          other: '{value} {unit}'
        },
        global: {
          one: 'US dollar',
          other: 'US dollars'
        }
      },
      symbols: {
        local: '$',
        global: 'US$',
        reverseGlobal: '$US'
      }
    });
  });

  it('should throw an error if context is not local, global or auto', function() {
    var method = function() {
      messageFormat.parse('{variable1, currency, notlocalorglobal, text}');
    };
    expect(method).to.throw(TypeError, 'Third argument, context argument, must be either local or global in {variable1, currency, notlocalorglobal, text}');
  });

  it('should throw an error if type is not text or symbol', function() {
    var method = function() {
      messageFormat.parse('{variable1, currency, local, nottextorsymbol}');
    };
    expect(method).to.throw(TypeError, 'Fourth argument, type argument, must be either symbol or text in {variable1, currency, local, nottextorsymbol}');
  });
});
