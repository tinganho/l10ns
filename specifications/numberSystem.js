
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('ar-AE')
  , AST = require('../libraries/MessageFormat/AST');

describe('Number system', function() {
  it('should use the default number system defined in CLDR in number format', function() {
    messageFormat.parse('{variable1, number, integer}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.NumberFormat);
    expect(messageFormat.messageAST[0].numberSystem).to.equal('arab');
  });

  it('should use the default number system defined in CLDR in currency format', function() {
    messageFormat.parse('{variable1, currency, local, symbol}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.CurrencyFormat);
    expect(messageFormat.messageAST[0].numberSystem).to.equal('arab');
  });

  it('should use the default number system defined in CLDR in plural remaining', function() {
    messageFormat.parse('{variable1, plural, other {# sentence1}}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.PluralFormat);
    console.log(messageFormat.messageAST[0].values['other'][0]);
    expect(messageFormat.messageAST[0].values['other'][0].numberSystem).to.equal('arab');
  });

  it('should be able to parse number system in number format', function() {
    messageFormat.parse('{variable1, number:latn, integer}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.NumberFormat);
    expect(messageFormat.messageAST[0].numberSystem).to.equal('latn');
  });

  it('should be able to use different nested number system', function() {
    messageFormat.parse('{variable1, plural:arab, other{#{variable2, plural:latn, other{# sentence1}}}}');
    expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.PluralFormat);
    expect(messageFormat.messageAST[0].values['other'][0].numberSystem).to.equal('arab');
    expect(messageFormat.messageAST[0].values['other'][1]).to.be.an.instanceOf(AST.PluralFormat);
    expect(messageFormat.messageAST[0].values['other'][1].values['other'][0].numberSystem).to.equal('latn');
  });

  it('should throw an error if a non-defined number system is used in plural format', function() {
    var method = function() {
      messageFormat.parse('{variable1, plural:nondefinednumbersystem, other{# sentence1}}');
    };
    expect(method).to.throw(TypeError, 'No defined number system in l10ns called \'nondefinednumbersystem\'');
  });

  it('should throw an error if a non-defined number system is used in number format', function() {
    var method = function() {
      messageFormat.parse('{variable1, number:nondefinednumbersystem, integer}');
    };
    expect(method).to.throw(TypeError, 'No defined number system in l10ns called \'nondefinednumbersystem\'');
  });

  it('should throw an error if a non-defined number system is used in number format', function() {
    var method = function() {
      messageFormat.parse('{variable1, currency:nondefinednumbersystem, local, symbol}');
    };
    expect(method).to.throw(TypeError, 'No defined number system in l10ns called \'nondefinednumbersystem\'');
  });
});
