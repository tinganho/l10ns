;(function() {
  function roundTo(number, to) {
    return Math.round(number / to) * to;
  }

  function formatNumber(it) {
    var number = it.number
      , prefix = it.prefix
      , suffix = it.suffix
      , currencySymbol =
        '([\\u0024\\u00A2-\\u00A5\\u058F\\u060B\\u09F2\\u09F3\\u09FB\\u0AF1\\\
           \\u0BF9\\u0E3F\\u17DB\\u20A0-\\u20BD\\uA838\\uFDFC\\uFE69\\uFF04\\\
           \\uFFE0\\uFFE1\\uFFE5\\uFFE6])'
      , startsWithCurrencySymbolSyntax = new RegExp('^' + currencySymbol)
      , endsWithCurrencySymbolSyntax = new RegExp(currencySymbol + '$');

    if(it.percentage) {
      prefix = prefix.replace('%', it.symbols.percent);
      suffix = suffix.replace('%', it.symbols.percent);
      number = number * 100;
    }
    else if(it.permille) {
      prefix = prefix.replace('‰', it.symbols.permille);
      suffix = suffix.replace('‰', it.symbols.permille);
      number = number * 1000;
    }
    number = roundTo(number, it.roundTo);

    var numberSplit = (number + '').split('.')
      , integerDigits = numberSplit[0]
      , integerDigitsLength = integerDigits.length
      , fractionDigits = numberSplit[1] || ''
      , fractionDigitsLength = fractionDigits.length;

    if(integerDigitsLength < it.minimumIntegerDigits) {
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

    if(fractionDigitsLength > it.maximumFractionDigits) {
      fractionDigits = fractionDigits.substring(0, it.maximumFractionDigits);
    }
    else if(fractionDigitsLength < it.minimumFractionDigits) {
      var missingFractionDigits = it.minimumFractionDigits - fractionDigitsLength;
      for(var index = 0; index < missingFractionDigits; index++) {
        fractionDigits += '0';
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
    result += suffix;

    return result;
  }

  var localizations = {
    'zh-CN': {
      '__getPluralKeyword': function(cardinal) {
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
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
      },
      'INDEX1': function(it) {
        var string = '';

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
          f = fractionalDigits.exec(cardinal)[1];
          v = f.length;
        }
        if(hasFractionalDigitsSyntax.test(cardinal)) {
          t = cardinal.replace(/0+$/, '');
          t = fractionalDigits.exec(t)[1];
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
          f = fractionalDigits.exec(cardinal)[1];
          v = f.length;
        }
        if(hasFractionalDigitsSyntax.test(cardinal)) {
          t = cardinal.replace(/0+$/, '');
          t = fractionalDigits.exec(t)[1];
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
      },
      'INDEX1': function(it) {
        var string = '';
        if(it.files >= 0) {
          string += formatNumber({
            number: it.files,
            roundTo: 1,
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
            maximumFractionDigits: 3,
            symbols: localizations['en-US'].__numberSymbols
          });
        }
        else {
          string += formatNumber({
            number: it.files,
            roundTo: 1,
            prefix: '-',
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
            maximumFractionDigits: 3,
            symbols: localizations['en-US'].__numberSymbols
          });
        }
        return string;
      }
    }
  };

  function requireLocale(locale) {
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
    module.exports = requireLocale;
  }
  else if (typeof define === "function" && define.amd) {
    define(function() {
      return requireLocale;
    });
  }
  else {
    window.requireLocale = requireLocale;
  }
})();
