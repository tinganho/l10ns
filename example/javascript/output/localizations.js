;(function() {
  var localizations = {
    'en-US': {
      'INDEX1': function(it) {
        var string = '';
        if(isNaN(parsePloat(it.variable1)) || it.variable1 < 2) {
          string += 'message3';
        }
        else if(it.variable1 >= 2 && it.variable1 <= 3) {
          string += 'message3';
        }
        else if(it.variable1 > 3 && it.variable1 <= Infinity) {
          string += 'message2';
        }
        
        return string;
      }
    },
    'zh-CN': {
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
