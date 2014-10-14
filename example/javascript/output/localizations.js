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
        var _case;
        _case = localizations['ar-AE'].__getPluralKeyword(it.people);
        switch(_case) {
          default:
            string += formatNumber({
              number: it.people - 0,
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
              minimumIntegerDigits: 1,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              symbols: localizations['ar-AE'].__numberSymbols['arab']
            });
            string = string
              .replace(/1/g, '١')
              .replace(/2/g, '٢')
              .replace(/3/g, '٣')
              .replace(/4/g, '٤')
              .replace(/5/g, '٥')
              .replace(/6/g, '٦')
              .replace(/7/g, '٧')
              .replace(/8/g, '٨')
              .replace(/9/g, '٩')
              .replace(/0/g, '٠')

            string += ' wfwfej';
            break;
        }
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
        var _case;
        if(it.floor === 0) {
          _case = '=' + 0;
        }else if(it.floor === 1) {
          _case = '=' + 1;
        }
        else {
          _case = localizations['en-US'].__getOrdinalKeyword(it.floor);
        }
        switch(_case) {
          case '=0':
            string += 'ground floor';
            break;
          case '=1':
            string += 'first floor';
            break;
          case 'one':
            string += formatNumber({
              number: it.floor - 0,
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
              minimumIntegerDigits: 1,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              symbols: localizations['en-US'].__numberSymbols['latn']
            });
            string += 'st floor';
            break;
          case 'two':
            string += formatNumber({
              number: it.floor - 0,
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
              minimumIntegerDigits: 1,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              symbols: localizations['en-US'].__numberSymbols['latn']
            });
            string += 'nd floor';
            break;
          case 'few':
            string += formatNumber({
              number: it.floor - 0,
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
              minimumIntegerDigits: 1,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              symbols: localizations['en-US'].__numberSymbols['latn']
            });
            string += 'rd floor';
            break;
          default:
            string += formatNumber({
              number: it.floor - 0,
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
              minimumIntegerDigits: 1,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              symbols: localizations['en-US'].__numberSymbols['latn']
            });
            string += 'th floor';
            break;
        }
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
