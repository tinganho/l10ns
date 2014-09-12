;(function() {
  function roundTo(number, to) {
    return Math.round(number / to) * to;
  }

  var localizations = {
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
      'INDEX1': function(it) {
        var string = '';
        var number = it.files;

        number = roundTo(number, 1)

        var numberSplit = number + ''.split('.')
          , integerDigits = numberSplit[0]
          , integerDigitsLength = integerDigits.length
          , fractionDigits = numberSplit[1] || ''
          , fractionDigitsLength = 0;

        if(integerDigitsLength < 1) {
          var missingIntegerDigits = 1 - integerDigitsLength;
          for(var index = 0; index < missingIntegerDigits; index++) {
            fractionDigits += '0' + fractionDigits;
          }
          integerDigitsLength = 1;
        }

        if(typeof fractionDigits === 'string') {
          fractionDigitsLength = fractions.length;
        }
        if(fractionDigitsLength > 2) {
          fractionDigits = fractionDigits.substring(0, var number = it.files;

        number = roundTo(number, 1)

        var numberSplit = number + ''.split('.')
          , integerDigits = numberSplit[0]
          , integerDigitsLength = integerDigits.length
          , fractionDigits = numberSplit[1] || ''
          , fractionDigitsLength = 0;

        if(integerDigitsLength < 1) {
          var missingIntegerDigits = 1 - integerDigitsLength;
          for(var index = 0; index < missingIntegerDigits; index++) {
            fractionDigits += '0' + fractionDigits;
          }
          integerDigitsLength = 1;
        }

        if(typeof fractionDigits === 'string') {
          fractionDigitsLength = fractions.length;
        }
        if(fractionDigitsLength > 2) {
          fractionDigits = fractionDigits.substring(0, 
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
      'INDEX1': function(it) {
        var string = '';

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
