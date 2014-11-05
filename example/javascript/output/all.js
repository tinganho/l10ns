;(function() {
  function roundTo(number, to) {
    return Math.round(number / to) * to;
  }

  function toSignficantDigits(number, minimumSignificantDigits, maximumSignificantDigits) {
    var multiple = Math.pow(10, maximumSignificantDigits - Math.floor(Math.log(number) / Math.LN10) - 1);
    number = Math.round(number * multiple) / multiple + '';
    var difference = maximumSignificantDigits - minimumSignificantDigits;
    if(difference > 0 && /\./.test(difference)) {
      number = number.replace(new RegExp('0{1,' + difference + '}$'), '');
    }
    var subtract = 0;
    if(/^0\./.test(number)) {
      subtract = 2;
    }
    else if(/\./.test(number)) {
      subtract = 1;
    }
    while(number.length - subtract < minimumSignificantDigits) {
      number += '0';
    }

    return number;
  }

  function toExponentDigits(number, it) {
    var minimumMantissaIntegerDigits = 1
      , maximumMantissaIntegerDigits = Infinity
      , exponentGrouping = 1
      , minimumMantissaSignificantDigits
      , maximumMantissaSignificantDigits
      , exponentNumber = 0;

    if(it.type === 'floating') {
      if(it.maximumIntegerDigits === it.minimumIntegerDigits) {
        minimumMantissaIntegerDigits = maximumMantissaIntegerDigits = it.minimumIntegerDigits;
      }
      else {
        maximumMantissaIntegerDigits = it.maximumIntegerDigits;
        exponentGrouping = it.maximumIntegerDigits;
      }

      minimumMantissaSignificantDigits = 1;
      maximumMantissaSignificantDigits = it.minimumIntegerDigits + it.maximumFractionDigits;
    }
    else {
      minimumMantissaIntegerDigits = maximumMantissaIntegerDigits = 1;
      minimumMantissaSignificantDigits = it.minimumSignificantDigits;
      maximumMantissaSignificantDigits = it.maximumSignificantDigits
    }

    if(number >= 1) {
      var divider = Math.pow(10, exponentGrouping)
        , integerLength = (number + '').replace(/\.\d+/, '').length;
      while((integerLength < minimumMantissaIntegerDigits || integerLength > maximumMantissaIntegerDigits) &&
            (exponentNumber + '').length === it.exponent.digits) {
        number = number / divider;
        exponentNumber += exponentGrouping;
        integerLength = (number + '').replace(/\.\d+/, '').length;
      }
      if((exponentNumber + '').length !== it.exponent.digits) {
        exponentNumber--;
        number = number * divider;
      }
    }
    else {
      var multiplier = Math.pow(10, exponentGrouping)
        , integerLength = (number + '').replace(/^0\.\d+/, '').replace(/\.\d+/, '').length;
      while((integerLength < minimumMantissaIntegerDigits || integerLength > maximumMantissaIntegerDigits) &&
            (Math.abs(exponentNumber) + '').length === it.exponent.digits) {
        number = number * multiplier;
        exponentNumber -= exponentGrouping;
        integerLength = (number + '').replace(/^0\.\d+/, '').replace(/\.\d+/, '').length;
      }
      if((Math.abs(exponentNumber) + '').length !== it.exponent.digits) {
        exponentNumber++;
        number = number / multiplier;
      }
    }

    var mantissa = toSignficantDigits(number, minimumMantissaSignificantDigits, maximumMantissaSignificantDigits)
      , mantissa = mantissa.split('.')
      , exponent = it.symbols.exponential;
    if(it.exponent.plusSign && exponentNumber > 0) {
      exponent += it.symbols.plusSign;
    }
    exponent += exponentNumber;

    if(it.type === 'floating') {
      if(it.minimumFractionDigits > 0) {
        if(typeof mantissa[1] === 'undefined') {
          mantissa[1] = '';
        }
        while(mantissa[1].length < it.minimumFractionDigits) {
          mantissa[1] += '0';
        }
      }
    }

    return {
      integer: mantissa[0],
      fraction: mantissa[1],
      exponent: exponent
    };
  };

  function formatNumber(it) {
    if(typeof it.number !== 'number') {
      return it.symbols.nan;
    }
    if(it.number === Infinity) {
      return it.symbols.plusSign + it.symbols.infinity;
    }
    if(it.number === -Infinity) {
      return it.symbols.minusSign + it.symbols.infinity;
    }

    var number = Math.abs(it.number)
      , prefix = it.prefix
      , suffix = it.suffix
      , currencySymbol =
        '([\\u0024\\u00A2-\\u00A5\\u058F\\u060B\\u09F2\\u09F3\\u09FB\\u0AF1\\\
           \\u0BF9\\u0E3F\\u17DB\\u20A0-\\u20BD\\uA838\\uFDFC\\uFE69\\uFF04\\\
           \\uFFE0\\uFFE1\\uFFE5\\uFFE6])'
      , startsWithCurrencySymbolSyntax = new RegExp('^' + currencySymbol)
      , endsWithCurrencySymbolSyntax = new RegExp(currencySymbol + '$');

    if(it.percentage) {
      prefix = prefix.replace('%', it.symbols.percentSign);
      suffix = suffix.replace('%', it.symbols.percentSign);
      number = number * 100;
    }
    else if(it.permille) {
      prefix = prefix.replace('‰', it.symbols.perMille);
      suffix = suffix.replace('‰', it.symbols.perMille);
      number = number * 1000;
    }

    if(it.exponent) {
      var exponent = toExponentDigits(number, it);
      integerDigits = exponent.integer;
      fractionDigits = exponent.fraction || '';
      exponent = exponent.exponent;
    }
    else if(it.type === 'significant') {
      number = toSignficantDigits(number, it.minimumSignificantDigits, it.maximumSignificantDigits);
    }
    else {
      number = roundTo(number, it.roundTo);
    }

    if(!it.exponent) {
      var numberSplit = (number + '').split('.')
        , integerDigits = numberSplit[0]
        , integerDigitsLength = integerDigits.length
        , fractionDigits = numberSplit[1] || ''
        , fractionDigitsLength = fractionDigits.length;

      if(it.type === 'floating' && integerDigitsLength < it.minimumIntegerDigits) {
        var missingIntegerDigits = it.minimumIntegerDigits - integerDigitsLength;
        for(var index = 0; index < missingIntegerDigits; index++) {
          integerDigits = '0' + integerDigits;
        }
        integerDigitsLength = it.minimumIntegerDigits;
      }
      if(it.groupSize) {
        var newIntegerDigits = '';
        for(var index = integerDigitsLength - 1; index >= 0; index--) {
          var primaryIndex = integerDigitsLength - it.groupSize.primary - 1;
          if(index === primaryIndex) {
            newIntegerDigits += it.symbols.group;
          }
          else if(index < primaryIndex && (primaryIndex - index) % it.groupSize.secondary === 0) {
            newIntegerDigits += it.symbols.group;
          }

          newIntegerDigits += integerDigits.charAt(index);
        }
        integerDigits = newIntegerDigits.split('').reverse().join('');
      }

      if(it.type === 'floating') {
        if(fractionDigitsLength > it.maximumFractionDigits) {
          fractionDigits = fractionDigits.substring(0, it.maximumFractionDigits);
        }
        else if(fractionDigitsLength < it.minimumFractionDigits) {
          var missingFractionDigits = it.minimumFractionDigits - fractionDigitsLength;
          for(var index = 0; index < missingFractionDigits; index++) {
            fractionDigits += '0';
          }
        }

        if(fractionDigits.length > it.minimumFractionDigits) {
          fractionDigits = fractionDigits.replace(/[0]+$/, '');
        }
      }
    }

    if(it.currency) {
      if(!endsWithCurrencySymbolSyntax.test(it.currency.symbol)) {
        prefix = prefix + ' ';
      }
      if(!startsWithCurrencySymbolSyntax.test(it.currency.symbol)) {
        suffix = ' ' + suffix;
      }
      prefix = prefix.replace(/¤+/, it.currency.symbol);
      suffix = suffix.replace(/¤+/, it.currency.symbol);
    }

    var result = '';
    result += prefix;
    result += integerDigits;
    if(fractionDigits.length > 0) {
      result += it.symbols.decimal + fractionDigits;
    }
    if(exponent) {
      result += exponent;
    }
    result += suffix;

    if(it.paddingCharacter) {
      var resultLength = result.length - 2;
      result = result.replace(new RegExp('\\*\\' + it.paddingCharacter), function(match) {
        var replacement = '';
        while(resultLength < it.patternLength) {
          replacement += it.paddingCharacter;
          resultLength++;
        }

        return replacement;
      });
    }

    return result;
  }

  var localizations = {
    'ar-AE': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n === 0) {
          return 'zero';
        }
        else if(n === 1) {
          return 'one';
        }
        else if(n === 2) {
          return 'two';
        }
        else if((3 >= n && n <= 10)) {
          return 'few';
        }
        else if((11 >= n && n <= 99)) {
          return 'many';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'arab': {
          'decimal': '٫',
          'group': '٬',
          'list': '؛',
          'percentSign': '٪',
          'plusSign': '‏+',
          'comment': ' includes RLM before sign (002D) ',
          'minusSign': '‏-',
          'exponential': 'اس',
          'superscriptingExponent': '×',
          'perMille': '؉',
          'infinity': '∞',
          'nan': 'ليس رقم',
          'timeSeparator': '،'
        },
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '‎+',
          'comment': ' includes LRM before sign (002D) ',
          'minusSign': '‎-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'دولار أمريكي',
          'text': {
            'local': null,
            'global': {
              'zero': 'دولار أمريكي',
              'one': 'دولار أمريكي',
              'two': 'دولار أمريكي',
              'few': 'دولار أمريكي',
              'many': 'دولار أمريكي',
              'other': 'دولار أمريكي'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'zero': '{0} {1}',
        'one': '{0} {1}',
        'two': '{0} {1}',
        'few': '{0} {1}',
        'many': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['ar-AE'].__numberSymbols['arab'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['ar-AE'].__numberSymbols['arab'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        numberString = numberString
          .replace(/1/g, '١')
          .replace(/2/g, '٢')
          .replace(/3/g, '٣')
          .replace(/4/g, '٤')
          .replace(/5/g, '٥')
          .replace(/6/g, '٦')
          .replace(/7/g, '٧')
          .replace(/8/g, '٨')
          .replace(/9/g, '٩')
          .replace(/0/g, '٠');
        string += numberString;
        return string;
      }
    },
    'da-DK': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n === 1 || t !== 0 && i === 0 && i === 1) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': '.',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': '.'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'Amerikansk dollar',
          'text': {
            'local': null,
            'global': {
              'one': 'Amerikansk dollar',
              'other': 'Amerikanske dollar'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['da-DK'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['da-DK'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'de-DE': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(i === 1 && v === 0) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': '.',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '·',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'US-Dollar',
          'text': {
            'local': null,
            'global': {
              'one': 'US-Dollar',
              'other': 'US-Dollar'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['de-DE'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['de-DE'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'en-US': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(i === 1 && v === 0) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n % 10 === 1 && n % 100 !== 11) {
          return 'one';
        }
        else if(n % 10 === 2 && n % 100 !== 12) {
          return 'two';
        }
        else if(n % 10 === 3 && n % 100 !== 13) {
          return 'few';
        }
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'US Dollar',
          'text': {
            'local': {
              'one': 'dollar',
              'other': 'dollars'
            },
            'global': {
              'one': 'US dollar',
              'other': 'US dollars'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['en-US'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['en-US'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'es-ES': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n === 1) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': '.',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'dólar estadounidense',
          'text': {
            'local': null,
            'global': {
              'one': 'dólar estadounidense',
              'other': 'dólares estadounidenses'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['es-ES'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['es-ES'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'es-MX': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n === 1) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': '.',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'dólar estadounidense',
          'text': {
            'local': null,
            'global': {
              'one': 'dólar estadounidense',
              'other': 'dólares estadounidenses'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 1,
            prefix: '',
            suffix: 'k',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: null,
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 1,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['es-MX'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 2
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 1,
            prefix: '-',
            suffix: 'k',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: null,
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 1,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['es-MX'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 2
          });
        }
        string += numberString;
        return string;
      }
    },
    'fi-FI': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(i === 1 && v === 0) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': ' ',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '−',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'epäluku',
          'timeSeparator': '.'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'Yhdysvaltain dollari',
          'text': {
            'local': null,
            'global': {
              'one': 'Yhdysvaltain dollari',
              'other': 'Yhdysvaltain dollaria'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['fi-FI'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['fi-FI'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'fr-CA': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(i === 0 && i === 1) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n === 1) {
          return 'one';
        }
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': ' ',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {},
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 1,
            prefix: '',
            suffix: ' G',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: null,
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 1,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['fr-CA'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 3
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 1,
            prefix: '-',
            suffix: ' G',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: null,
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 1,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['fr-CA'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 3
          });
        }
        string += numberString;
        return string;
      }
    },
    'is-IS': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(t === 0 && i % 10 === 1 && i % 100 !== 11 || t !== 0) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': '.',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'Bandaríkjadalur',
          'text': {
            'local': null,
            'global': {
              'one': 'Bandaríkjadalur',
              'other': 'Bandaríkjadalir'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['is-IS'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['is-IS'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'ja-JP': {
      '__getPluralKeyword': function(cardinal) {
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': '米ドル',
          'text': {
            'local': null,
            'global': {
              'other': '米ドル'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['ja-JP'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['ja-JP'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'ko-KR': {
      '__getPluralKeyword': function(cardinal) {
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': '미국 달러',
          'text': {
            'local': null,
            'global': {
              'other': '미국 달러'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['ko-KR'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['ko-KR'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'sv-SE': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(i === 1 && v === 0) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n % 10 === 1 && n % 10 === 2 && n % 100 !== 11 && n % 100 !== 12) {
          return 'one';
        }
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': ' ',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '−',
          'exponential': '×10^',
          'superscriptingExponent': '·',
          'perMille': '‰',
          'infinity': '∞',
          'nan': '¤¤¤',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'US-dollar',
          'text': {
            'local': null,
            'global': {
              'one': 'US-dollar',
              'other': 'US-dollar'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['sv-SE'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['sv-SE'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'zh-CN': {
      '__getPluralKeyword': function(cardinal) {
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'hanidec': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        },
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': '美元',
          'text': {
            'local': null,
            'global': {
              'other': '美元'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'other': '{0}{1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['zh-CN'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['zh-CN'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'zh-HK': {
      '__getPluralKeyword': function(cardinal) {
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'hanidec': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        },
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': '美元',
          'text': {
            'local': null,
            'global': {
              'other': '美元'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'other': '{0}{1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['zh-HK'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['zh-HK'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    }
  };

  function requireLocalizations(locale) {
    return (function(locale) {
      return function l(key) {
        if(!(locale in localizations)) {
          return 'LOCALE_NOT_IN_LOCALIZATIONS: ' + locale;
        }
        if(!(key in localizations[locale])) {
          return 'KEY_NOT_IN_LOCALIZATIONS: ' + key;
        }
        return localizations[locale][key].call(undefined, arguments[1]);
      };
    })(locale);
  };

  if(typeof require === "function" && typeof exports === 'object' && typeof module === 'object') {
    module.exports = requireLocalizations;
  }
  else if (typeof define === "function" && define.amd) {
    define(function() {
      return requireLocalizations;
    });
  }
  else {
    window.requireLocalizations = requireLocalizations;
  }
})();
