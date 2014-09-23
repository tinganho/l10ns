
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

project.currencies = ['USD'];

describe('CurrencyFormat', function() {
  it('should be able to parse a currency amount with symbol', function() {
    messageFormat.parse('{variable1, currency, local, symbol}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.CurrencyFormat);
    expect(messageFormat.messageAST[0].context).to.equal('local');
    expect(messageFormat.messageAST[0].type).to.equal('symbol');
    console.log(messageFormat.messageAST[0].currencies.USD)
  });
});
