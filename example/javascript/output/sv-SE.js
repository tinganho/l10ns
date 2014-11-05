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
      'INDEX10': function(it) {
        var string = '';

        return string;
      },
      'INDEX100': function(it) {
        var string = '';

        return string;
      },
      'INDEX11': function(it) {
        var string = '';

        return string;
      },
      'INDEX12': function(it) {
        var string = '';

        return string;
      },
      'INDEX13': function(it) {
        var string = '';

        return string;
      },
      'INDEX14': function(it) {
        var string = '';

        return string;
      },
      'INDEX15': function(it) {
        var string = '';

        return string;
      },
      'INDEX16': function(it) {
        var string = '';

        return string;
      },
      'INDEX17': function(it) {
        var string = '';

        return string;
      },
      'INDEX18': function(it) {
        var string = '';

        return string;
      },
      'INDEX19': function(it) {
        var string = '';

        return string;
      },
      'INDEX2': function(it) {
        var string = '';

        return string;
      },
      'INDEX20': function(it) {
        var string = '';

        return string;
      },
      'INDEX21': function(it) {
        var string = '';

        return string;
      },
      'INDEX22': function(it) {
        var string = '';

        return string;
      },
      'INDEX23': function(it) {
        var string = '';

        return string;
      },
      'INDEX24': function(it) {
        var string = '';

        return string;
      },
      'INDEX25': function(it) {
        var string = '';

        return string;
      },
      'INDEX26': function(it) {
        var string = '';

        return string;
      },
      'INDEX27': function(it) {
        var string = '';

        return string;
      },
      'INDEX28': function(it) {
        var string = '';

        return string;
      },
      'INDEX29': function(it) {
        var string = '';

        return string;
      },
      'INDEX3': function(it) {
        var string = '';

        return string;
      },
      'INDEX30': function(it) {
        var string = '';

        return string;
      },
      'INDEX31': function(it) {
        var string = '';

        return string;
      },
      'INDEX32': function(it) {
        var string = '';

        return string;
      },
      'INDEX33': function(it) {
        var string = '';

        return string;
      },
      'INDEX34': function(it) {
        var string = '';

        return string;
      },
      'INDEX35': function(it) {
        var string = '';

        return string;
      },
      'INDEX36': function(it) {
        var string = '';

        return string;
      },
      'INDEX37': function(it) {
        var string = '';

        return string;
      },
      'INDEX38': function(it) {
        var string = '';

        return string;
      },
      'INDEX39': function(it) {
        var string = '';

        return string;
      },
      'INDEX4': function(it) {
        var string = '';

        return string;
      },
      'INDEX40': function(it) {
        var string = '';

        return string;
      },
      'INDEX41': function(it) {
        var string = '';

        return string;
      },
      'INDEX42': function(it) {
        var string = '';

        return string;
      },
      'INDEX43': function(it) {
        var string = '';

        return string;
      },
      'INDEX44': function(it) {
        var string = '';

        return string;
      },
      'INDEX45': function(it) {
        var string = '';

        return string;
      },
      'INDEX46': function(it) {
        var string = '';

        return string;
      },
      'INDEX47': function(it) {
        var string = '';

        return string;
      },
      'INDEX48': function(it) {
        var string = '';

        return string;
      },
      'INDEX49': function(it) {
        var string = '';

        return string;
      },
      'INDEX5': function(it) {
        var string = '';

        return string;
      },
      'INDEX50': function(it) {
        var string = '';

        return string;
      },
      'INDEX51': function(it) {
        var string = '';

        return string;
      },
      'INDEX52': function(it) {
        var string = '';

        return string;
      },
      'INDEX53': function(it) {
        var string = '';

        return string;
      },
      'INDEX54': function(it) {
        var string = '';

        return string;
      },
      'INDEX55': function(it) {
        var string = '';

        return string;
      },
      'INDEX56': function(it) {
        var string = '';

        return string;
      },
      'INDEX57': function(it) {
        var string = '';

        return string;
      },
      'INDEX58': function(it) {
        var string = '';

        return string;
      },
      'INDEX59': function(it) {
        var string = '';

        return string;
      },
      'INDEX6': function(it) {
        var string = '';

        return string;
      },
      'INDEX60': function(it) {
        var string = '';

        return string;
      },
      'INDEX61': function(it) {
        var string = '';

        return string;
      },
      'INDEX62': function(it) {
        var string = '';

        return string;
      },
      'INDEX63': function(it) {
        var string = '';

        return string;
      },
      'INDEX64': function(it) {
        var string = '';

        return string;
      },
      'INDEX65': function(it) {
        var string = '';

        return string;
      },
      'INDEX66': function(it) {
        var string = '';

        return string;
      },
      'INDEX67': function(it) {
        var string = '';

        return string;
      },
      'INDEX68': function(it) {
        var string = '';

        return string;
      },
      'INDEX69': function(it) {
        var string = '';

        return string;
      },
      'INDEX7': function(it) {
        var string = '';

        return string;
      },
      'INDEX70': function(it) {
        var string = '';

        return string;
      },
      'INDEX71': function(it) {
        var string = '';

        return string;
      },
      'INDEX72': function(it) {
        var string = '';

        return string;
      },
      'INDEX73': function(it) {
        var string = '';

        return string;
      },
      'INDEX74': function(it) {
        var string = '';

        return string;
      },
      'INDEX75': function(it) {
        var string = '';

        return string;
      },
      'INDEX76': function(it) {
        var string = '';

        return string;
      },
      'INDEX77': function(it) {
        var string = '';

        return string;
      },
      'INDEX78': function(it) {
        var string = '';

        return string;
      },
      'INDEX79': function(it) {
        var string = '';

        return string;
      },
      'INDEX8': function(it) {
        var string = '';

        return string;
      },
      'INDEX80': function(it) {
        var string = '';

        return string;
      },
      'INDEX81': function(it) {
        var string = '';

        return string;
      },
      'INDEX82': function(it) {
        var string = '';

        return string;
      },
      'INDEX83': function(it) {
        var string = '';

        return string;
      },
      'INDEX84': function(it) {
        var string = '';

        return string;
      },
      'INDEX85': function(it) {
        var string = '';

        return string;
      },
      'INDEX86': function(it) {
        var string = '';

        return string;
      },
      'INDEX87': function(it) {
        var string = '';

        return string;
      },
      'INDEX88': function(it) {
        var string = '';

        return string;
      },
      'INDEX89': function(it) {
        var string = '';

        return string;
      },
      'INDEX9': function(it) {
        var string = '';

        return string;
      },
      'INDEX90': function(it) {
        var string = '';

        return string;
      },
      'INDEX91': function(it) {
        var string = '';

        return string;
      },
      'INDEX92': function(it) {
        var string = '';

        return string;
      },
      'INDEX93': function(it) {
        var string = '';

        return string;
      },
      'INDEX94': function(it) {
        var string = '';

        return string;
      },
      'INDEX95': function(it) {
        var string = '';

        return string;
      },
      'INDEX96': function(it) {
        var string = '';

        return string;
      },
      'INDEX97': function(it) {
        var string = '';

        return string;
      },
      'INDEX98': function(it) {
        var string = '';

        return string;
      },
      'INDEX99': function(it) {
        var string = '';

        return string;
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
    }
  };

  function l(key) {
    if(!(key in localizations['sv-SE'])) {
    	throw new TypeError('Key `' + key + '` not in sv-SE localizations');
    }
    return localizations['sv-SE'][key].call(undefined, arguments[1]);
  }

  if(typeof require === "function" && typeof exports === 'object' && typeof module === 'object') {
    module.exports = l;
  }
  else if (typeof define === "function" && define.amd) {
    define(function() {
      return l;
    });
  }
  else {
    window.l = l;
  }
})();
