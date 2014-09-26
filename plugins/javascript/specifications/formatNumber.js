
var fs = require('fs')
  , path = require('path');

eval(fs.readFileSync(path.join(__dirname, '../templates/FormatNumberFunction.tmpl'), 'utf-8'));
eval(fs.readFileSync(path.join(__dirname, '../templates/RoundToFunction.tmpl'), 'utf-8'));

var symbols = {
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
};

describe('formatNumber(Object)', function() {
  it('should be able to group primary', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 1000,
      percentage: false,
      permille: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 3
      },
      symbols: symbols
    });
    expect(number).to.equal('1,000');
  });

  it('should be able to group primary and secondary', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 1000000,
      percentage: false,
      permille: false,
      fraction: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 3
      },
      symbols: symbols
    });
    expect(number).to.equal('1,000,000');
    var number = formatNumber({
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 1000000,
      percentage: false,
      permille: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('10,00,000');
    var number = formatNumber({
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 100000000,
      percentage: false,
      permille: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('10,00,00,000');
  });

  it('should be able to add trailing zeros whenever minimum fraction digits is not met', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '',
      roundTo: 0.01,
      number: 0.2,
      percentage: false,
      permille: false,
      maximumFractionDigits: 3,
      minimumFractionDigits: 2,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('0.20');
  });

  it('should round to the defined increment when number of fraction digits exceeds maximum fraction digits', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '',
      roundTo: 0.001,
      number: 0.1236,
      percentage: false,
      permille: false,
      maximumFractionDigits: 3,
      minimumFractionDigits: 2,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('0.124');
  });

  it('should be able to render maximum fraction digits', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '',
      roundTo: 0.001,
      number: 0.1333,
      percentage: false,
      permille: false,
      maximumFractionDigits: 3,
      minimumFractionDigits: 2,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('0.133');
  });

  it('should not render fraction digits that are zero', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '',
      roundTo: 0.001,
      number: 0.1200,
      percentage: false,
      permille: false,
      maximumFractionDigits: 3,
      minimumFractionDigits: 2,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('0.12');
  });

  it('should prepend zeros whenever minimum integers is not met', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 1,
      percentage: false,
      permille: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 2,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('01');
  });

  it('should be able to render percentages', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '%',
      roundTo: 0.001,
      number: 0.1230,
      percentage: true,
      permille: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 2,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('12%');
    var number = formatNumber({
      prefix: '',
      suffix: ' %',
      roundTo: 0.001,
      number: 0.1230,
      percentage: true,
      permille: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 2,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('12 %');
    var number = formatNumber({
      prefix: '%',
      suffix: '',
      roundTo: 0.001,
      number: 0.1230,
      percentage: true,
      permille: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 2,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('%12');
    var number = formatNumber({
      prefix: '% ',
      suffix: '',
      roundTo: 0.001,
      number: 0.1230,
      percentage: true,
      permille: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 2,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('% 12');
  });

  it('should be able to render permille', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '‰',
      roundTo: 0.001,
      number: 0.1230,
      percentage: false,
      permille: true,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('123‰');
    var number = formatNumber({
      prefix: '‰',
      suffix: '',
      roundTo: 0.001,
      number: 0.1230,
      percentage: false,
      permille: true,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('‰123');
    var number = formatNumber({
      prefix: '‰ ',
      suffix: '',
      roundTo: 0.001,
      number: 0.1230,
      percentage: false,
      permille: true,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('‰ 123');
    var number = formatNumber({
      prefix: '',
      suffix: ' ‰',
      roundTo: 0.001,
      number: 0.1230,
      percentage: false,
      permille: true,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('123 ‰');
  });

  it('should be able to render a prefix', function() {
    var number = formatNumber({
      prefix: '$',
      suffix: '',
      roundTo: 1,
      number: 10,
      percentage: false,
      permille: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('$10');
  });

  it('should be able to render a suffix', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '$',
      roundTo: 1,
      number: 10,
      percentage: false,
      permille: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('10$');
  });

  it('should be able to render currency', function() {
    var number = formatNumber({
      prefix: '¤',
      suffix: '',
      roundTo: 1,
      number: 10,
      percentage: false,
      permille: false,
      currency: {
        symbol: '$'
      },
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('$10');
  });

  it('should be able to append a space if a non-currency symbol surrounds a digit', function() {
    var number = formatNumber({
      prefix: '¤',
      suffix: '',
      roundTo: 1,
      number: 10,
      percentage: false,
      permille: false,
      currency: {
        symbol: '$NT'
      },
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('$NT 10');
  });

  it('should not append a space if a non-currency symbol surrounds a digit', function() {
    var number = formatNumber({
      prefix: '¤',
      suffix: '',
      roundTo: 1,
      number: 10,
      percentage: false,
      permille: false,
      currency: {
        symbol: '$'
      },
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('$10');
  });

  it('should be able to prepend a space if a non-currency symbol surrounds a digit', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '¤',
      roundTo: 1,
      number: 10,
      percentage: false,
      permille: false,
      currency: {
        symbol: 'US$'
      },
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('10 US$');
  });

  it('should not prepend a space if a non-currency symbol surrounds a digit', function() {
    var number = formatNumber({
      prefix: '',
      suffix: '¤',
      roundTo: 1,
      number: 10,
      percentage: false,
      permille: false,
      currency: {
        symbol: '$'
      },
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      type: 'floating',
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('10$');
  });

  it('should be able to format a significant integer number', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 11,
      percentage: false,
      permille: false,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 1,
      minimumSignificantDigits: 1,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('10');
  });

  it('should be able to format a significant fraction number', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 0.1200,
      percentage: false,
      permille: false,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 2,
      minimumSignificantDigits: 2,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('0.12');
  });

  it('should be able to format a significant fraction number by adding trailing zeros', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 0.1200,
      percentage: false,
      permille: false,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('0.120');
  });

  it('should be able to format a significant integer and fraction number by adding trailing zeros', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 1.1200,
      percentage: false,
      permille: false,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 4,
      minimumSignificantDigits: 4,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('1.120');
  });

  it('should be able to format a significant number with group separators', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 1120000,
      percentage: false,
      permille: false,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 4,
      minimumSignificantDigits: 4,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('11,20,000');
  });

  it('should be able to format a significant fraction in percentage', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '%',
      roundTo: 1,
      number: 0.00789,
      percentage: true,
      permille: false,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 1,
      minimumSignificantDigits: 1,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('0.8%');
  });

  it('should be able to format a significant integer in percentage', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '%',
      roundTo: 1,
      number: 0.789,
      percentage: true,
      permille: false,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 2,
      minimumSignificantDigits: 2,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('79%');
  });

  it('should be able to format a significant integer and fraction in percentage', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '%',
      roundTo: 1,
      number: 0.789,
      percentage: true,
      permille: false,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('78.9%');
  });

  it('should be able to format a significant number with group separators', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '%',
      roundTo: 1,
      number: 78900,
      percentage: true,
      permille: false,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('78,90,000%');
  });

  it('should be able to format a significant fraction in percentage', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '‰',
      roundTo: 1,
      number: 0.000789,
      percentage: false,
      permille: true,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 1,
      minimumSignificantDigits: 1,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('0.8‰');
  });

  it('should be able to format a significant integer in percentage', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '‰',
      roundTo: 1,
      number: 0.0789,
      percentage: false,
      permille: true,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 2,
      minimumSignificantDigits: 2,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('79‰');
  });

  it('should be able to format a significant integer and fraction in percentage', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '‰',
      roundTo: 1,
      number: 0.0789,
      percentage: false,
      permille: true,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('78.9‰');
  });

  it('should be able to format a significant number with group separators', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '‰',
      roundTo: 1,
      number: 789,
      percentage: false,
      permille: true,
      currency: null,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 0,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('7,89,000‰');
  });

  it('should be able to format an exponent number with only minimum integer digits specified', function() {
    var number = formatNumber({
      type: 'floating',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 12000,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: false
      },
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 2,
      maximumIntegerDigits: 2,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('12E3');
  });

  it('should be able to format an exponent number with minimum fraction digits and minimum integer digits specified', function() {
    var number = formatNumber({
      type: 'floating',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 12000,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: false
      },
      maximumFractionDigits: 4,
      minimumFractionDigits: 2,
      minimumIntegerDigits: 2,
      maximumIntegerDigits: 2,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('12.00E3');
  });

  it('should be able to format an exponent number with exponent grouping(maximum digit specified)', function() {
    var number = formatNumber({
      type: 'floating',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 12345,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: false
      },
      maximumFractionDigits: 4,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      maximumIntegerDigits: 3,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('12.345E3');
  });

  it('should be able to format an exponent number with plus sign', function() {
    var number = formatNumber({
      type: 'floating',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 100320,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: true
      },
      maximumFractionDigits: 3,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      maximumIntegerDigits: 3,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('100.3E+3');
  });

  it('should be able to format an exponent number with negative exponent', function() {
    var number = formatNumber({
      type: 'floating',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 0.0087,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: true
      },
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      maximumIntegerDigits: 1,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('8.7E-3');
  });

  it('should be able to format an exponent number with specififed significant digits with input of a small fraction', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 0.0087,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: true
      },
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      maximumIntegerDigits: 1,
      maximumSignificantDigits: 2,
      minimumSignificantDigits: 2,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('8.7E-3');
  });

  it('should be able to format an exponent number with specififed significant digits with inpu of a big integer', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 1123000,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: false
      },
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      maximumIntegerDigits: 1,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 1,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('1.12E6');
  });

  it('should be able to format an exponent number with specififed significant digits by appending trailing zeros', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 0.00000087,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: true
      },
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      maximumIntegerDigits: 1,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('8.70E-7');
  });

  it('should use the specified number of exponent digit before maximum integer digits', function() {
    var number = formatNumber({
      type: 'floating',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 0.00000000087,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: true
      },
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      maximumIntegerDigits: 1,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('0.87E-9');
    var number = formatNumber({
      type: 'floating',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 87000000000,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: false
      },
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      maximumIntegerDigits: 1,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('87E9');
  });

  it('should be able to format an exponent number with specififed significant digits by appending trailing zeros', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '',
      suffix: '',
      roundTo: 1,
      number: 0.00000087,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: true
      },
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      maximumIntegerDigits: 1,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      symbols: symbols
    });
    expect(number).to.equal('8.70E-7');
  });

  it('should be able to format a significant number with padding character', function() {
    var number = formatNumber({
      type: 'significant',
      prefix: '$*#',
      suffix: '',
      roundTo: 1,
      number: 0.00000087,
      percentage: false,
      permille: false,
      currency: null,
      exponent: {
        digits: 1,
        plusSign: true
      },
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 1,
      maximumIntegerDigits: 1,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      patternLength: 10,
      paddingCharacter: '#',
      symbols: symbols
    });
    expect(number).to.equal('$##8.70E-7');
  });

  it('should be able to format a floating number with padding character', function() {
    var number = formatNumber({
      type: 'floating',
      prefix: '*#',
      suffix: '',
      roundTo: 1,
      number: 1200,
      percentage: false,
      permille: false,
      currency: null,
      exponent: null,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 2,
      maximumIntegerDigits: 2,
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3,
      groupSize: {
        primary: 3,
        secondary: 2
      },
      patternLength: 10,
      paddingCharacter: '#',
      symbols: symbols
    });
    expect(number).to.equal('#####1,200');
  });
});
