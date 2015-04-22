
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

project.currencies = ['USD'];

describe('MessageFormat', function() {
  describe('#constructor', function() {
    it('should read decimal pattern', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.decimalPatterns['latn']).to.equal('#,##0.###');
    });

    it('should read percentage pattern', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.percentagePatterns['latn']).to.equal('#,##0%');
    });

    it('if language script is missing it should set the most likely language tag', function() {
      var messageFormat = new MessageFormat('zh-CN');
      expect(messageFormat.languageTag).to.equal('zh-Hans');
    });

    it('should read currencies', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.currencies).to.eql({
        'USD': {
          name: 'US Dollar',
          text: {
            local: {
              one: 'dollar',
              other: 'dollars'
            },
            global: {
              one: 'US dollar',
              other: 'US dollars'
            }
          },
          symbol: {
            local: '$',
            global: 'US$',
            reverseGlobal: '$US'
          }
        }
      });
    });

    it('should read currency unit patterns', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.currencyUnitPattern).to.eql({
        one: '{0} {1}',
        other: '{0} {1}'
      });
    });

    it('should read number symbols', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.numberSymbols).to.eql({
        latn: {
          decimal: '.',
          group: ',',
          list: ';',
          percentSign: '%',
          plusSign: '+',
          minusSign: '-',
          exponential: 'E',
          superscriptingExponent: '×',
          perMille: '‰',
          infinity: '∞',
          nan: 'NaN',
          timeSeparator: ':'
        }
      });
    });

    it('should throw an error if wrong language tag is used', function() {
      var method = function() {
        new MessageFormat('wrong-tag');
      };
      expect(method).to.throw('Your language tag (wrong-tag) are not bcp47 compliant. For more info https://tools.ietf.org/html/bcp47.');
    });
  });

  describe('#parse(string)', function() {
    require('./sentences');
    require('./variables');
    require('./numberFormat');
    require('./currencyFormat');
    require('./numberSystem');
    require('./dateFormat');
    require('./pluralFormat');
    require('./selectFormat');
    require('./selectordinalFormat');
  });
});
