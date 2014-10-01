
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

project.currencies = ['USD'];

describe('MessageFormat', function() {
  describe('#constructor', function() {
    it('should read decimal pattern', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.decimalPattern.positive.groupSize).to.eql({
        primary: 3,
        secondary: 3
      });
      expect(messageFormat.decimalPattern.positive).to.include({
        patternLength: 9,
      });
      expect(messageFormat.decimalPattern.positive.integer).to.eql({
        leftAbsentNumbers: 3,
        nonAbsentNumbers: 1
      });
      expect(messageFormat.decimalPattern.positive.fraction).to.eql({
        nonAbsentNumbers: 0,
        rightAbsentNumbers: 3
      });
    });

    it('should read percentage pattern', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.percentagePattern.positive.percentage).to.equal(true);
      expect(messageFormat.percentagePattern.positive.patternLength).to.equal(6);
      expect(messageFormat.percentagePattern.positive.suffix).to.equal('%');
      expect(messageFormat.percentagePattern.positive.groupSize).to.eql({
        primary: 3,
        secondary: 3
      });
      expect(messageFormat.percentagePattern.positive.integer).to.eql({
        leftAbsentNumbers: 3,
        nonAbsentNumbers: 1
      });
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

    it('should read number sumbols', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.numberSymbols).to.eql({
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
        nan: 'NaN'
      });
    });
  });

  describe('#parse(string)', function() {
    require('./sentences');
    require('./variables');
    require('./numberFormat');
    require('./currencyFormat');
    require('./pluralFormat');
    require('./selectFormat');
    require('./choiceFormat');
    require('./selectordinalFormat');
  });
});
