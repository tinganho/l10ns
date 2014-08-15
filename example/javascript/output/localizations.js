;(function() {
  var localizations = {
    'en-US': {
      'lo\'\"cale1': function anonymous(it) {
        if('value1' == 'value2' || 'value1' == 'value2') {
          return '';
        } else {
          return '';
        }
      },
      'locale2': function anonymous(it) {
        return 'KEY_NOT_TRANSLATED: locale2';
      }
    },
    'zh-CN': {
      'lo\'\"cale1': function anonymous(it) {
        return 'KEY_NOT_TRANSLATED: lo\'\"cale1';
      },
      'locale2': function anonymous(it) {
        return 'KEY_NOT_TRANSLATED: locale2';
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
  
  function lci(operand1, operand2) {
    operand1 = operand1 + '';
    operand2 = operand2 + '';
    operand1LastNumber = operand1.substr(-1,1);
    return operand1LastNumber === operand2;
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
