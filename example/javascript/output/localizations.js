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
      'INDEX21': function(it) {
        var string = '';
        string += 'dwfwefewfwefff<script>alert(\'hej\')</script>';
        return string;
      },
      'INDEX10': function(it) {
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
      'INDEX20': function(it) {
        var string = '';

        return string;
      },
      'INDEX3': function(it) {
        var string = '';

        return string;
      },
      'INDEX4': function(it) {
        var string = '';

        return string;
      },
      'INDEX5': function(it) {
        var string = '';

        return string;
      },
      'INDEX6': function(it) {
        var string = '';

        return string;
      },
      'INDEX7': function(it) {
        var string = '';

        return string;
      },
      'INDEX8': function(it) {
        var string = '';

        return string;
      },
      'INDEX9': function(it) {
        var string = '';

        return string;
      },
      'POST__COMMENTSS': function(it) {
        var string = '';
        string += 'He had ';
        var _case;
        _case = localizations['en-US'].__getPluralKeyword(it.files);
        switch(_case) {
          case 'one':
            string += (it.files - 0);
            string += ' file';
            break;
          default:
            string += (it.files - 0);
            string += ' files';
            break;
        }
        return string;
      },
      'INDEX1': function(it) {
        var string = '';
        var _case;
        _case = localizations['en-US'].__getPluralKeyword(it.files);
        switch(_case) {
          case 'one':
            string += 'message-one';
            break;
          default:
            string += 'message-other';
            break;
        }
        return string;
      },

    },
    'zh-CN': {
      '__getPluralKeyword': function(cardinal) {
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      'INDEX21': function(it) {
        var string = '';

        return string;
      },
      'INDEX10': function(it) {
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
      'INDEX20': function(it) {
        var string = '';

        return string;
      },
      'INDEX3': function(it) {
        var string = '';

        return string;
      },
      'INDEX4': function(it) {
        var string = '';

        return string;
      },
      'INDEX5': function(it) {
        var string = '';

        return string;
      },
      'INDEX6': function(it) {
        var string = '';

        return string;
      },
      'INDEX7': function(it) {
        var string = '';

        return string;
      },
      'INDEX8': function(it) {
        var string = '';

        return string;
      },
      'INDEX9': function(it) {
        var string = '';

        return string;
      },
      'POST__COMMENTSS': function(it) {
        var string = '';

        return string;
      },
      'INDEX1': function(it) {
        var string = '';

        return string;
      },

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
