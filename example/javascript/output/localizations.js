;(function() {
  var localizations = {
    'en-US': {
      '_getPluralKeyword': function(cardinal) {
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
          t = cardinal.replace(/+0$/, '');
          t = fractionalDigits.exec(t)[1];
          w = t.length;
        }

        if(i === 1 && v === 0) {
          return 'one';
        }
        return 'other';
      },'INDEX1': function(it) {
        var string = '';
        if(isNaN(parsePloat(it.variable1)) || it.variable1 < 2 || it.variable1 >= 2 && it.variable1 <= 3) {
          var _case;
          _case = this._getPluralKeyword(it.variable2);
          switch(_case) {
            case 'one':
              string += 'message1';
              break;
            default:
              string += 'message2';
              break;
          }
        }
        else if(it.variable1 > 3 && it.variable1 <= Infinity) {
          string += 'message2';
        }
        return string;
      }
    },
    'zh-CN': {
      '_getPluralKeyword': function(cardinal) {
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
          t = cardinal.replace(/+0$/, '');
          t = fractionalDigits.exec(t)[1];
          w = t.length;
        }

        return 'other';
      },'INDEX1': function(it) {
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
