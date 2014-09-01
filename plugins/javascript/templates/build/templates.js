function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['Case']=function anonymous(it) {
var out='case \''+(it.case)+'\':\n'+(it.caseBody)+'\n  break;';return out;
};
  tmpl['Condition']=function anonymous(it) {
var out='it.'+(it.variableName)+' '+(it.comparator)+' '+(it.value);return out;
};
  tmpl['ConditionStatement']=function anonymous(it) {
var out=''+(it.order)+'('+(it.condition)+') {\n'+(it.body)+'\n}';return out;
};
  tmpl['FirstRangeCondition']=function anonymous(it) {
var out='if(isNaN(parseFloat(it.'+(it.variableName)+')) || it.'+(it.variableName)+' '+(it.type)+' '+(it.lowestLimit)+' || it.'+(it.variableName)+' '+(it.limits.lower.type)+' '+(it.limits.lower.value)+' && it.'+(it.variableName)+' '+(it.limits.upper.type)+' '+(it.limits.upper.value)+') {\n'+(it.body)+'\n}';return out;
};
  tmpl['Function']=function anonymous(it) {
var out='function(it) {\n  var string = \'\';\n'+(it.functionBody)+'\n  return string;\n}';return out;
};
  tmpl['GetPluralKeyword']=function anonymous(it) {
var out='function(cardinal) {\n  var cardinal = cardinal + \'\'\n    , n = cardinal\n    , i = parseInt(cardinal, 10)\n    , v = 0\n    , w = 0\n    , f = 0\n    , t = 0;\n\n  var hasFractionalDigitsSyntax = /\\.(\\d+)/;\n\n  if(hasFractionalDigitsSyntax.test(cardinal)) {\n    f = fractionalDigits.exec(cardinal)[1];\n    v = f.length;\n  }\n  if(hasFractionalDigitsSyntax.test(cardinal)) {\n    t = cardinal.replace(/+0$/, \'\');\n    t = fractionalDigits.exec(t)[1];\n    w = t.length;\n  }\n'+(it.functionBody)+'\n},';return out;
};
  tmpl['JavascriptWrapper']=function anonymous(it) {
var out=';(function() {\n'+(it.localizationMap)+'\n\n'+(it.requireStatement)+'\n\n  if(typeof require === "function" && typeof exports === \'object\' && typeof module === \'object\') {\n    module.exports = requireLocale;\n  }\n  else if (typeof define === "function" && define.amd) {\n    define(function() {\n      return requireLocale;\n    });\n  }\n  else {\n    window.requireLocale = requireLocale;\n  }\n})();\n';return out;
};
  tmpl['LocalizationKeyValue']=function anonymous(it) {
var out='\''+(it.key)+'\': '+(it.function);return out;
};
  tmpl['LocalizationMap']=function anonymous(it) {
var out='\''+(it.locale)+'\': {\n'+(it.map)+'\n}';return out;
};
  tmpl['LocalizationsMap']=function anonymous(it) {
var out='var localizations = {\n'+(it.localizations)+'\n};';return out;
};
  tmpl['NumberComparison']=function anonymous(it) {
var out=''+(it.variableName);if(it.modulus){out+='%'+(it.modulus);}out+=' === '+(it.value);return out;
};
  tmpl['OtherCase']=function anonymous(it) {
var out='default:\n'+(it.caseBody)+'\n  break;';return out;
};
  tmpl['RangeCondition']=function anonymous(it) {
var out='else if(it.'+(it.variableName)+' '+(it.limits.lower.type)+' '+(it.limits.lower.value)+' && it.'+(it.variableName)+' '+(it.limits.upper.type)+' '+(it.limits.upper.value)+') {\n'+(it.body)+'\n}';return out;
};
  tmpl['RangeNumberComparison']=function anonymous(it) {
var out='('+(it.from)+' >= '+(it.variableName)+' && '+(it.variableName)+' <= '+(it.to)+')';return out;
};
  tmpl['RequireStatement']=function anonymous(it) {
var out='function requireLocale(locale) {\n  return (function(locale) {\n    return function l(key) {\n      if(!(locale in localizations)) {\n        return \'LOCALE_NOT_IN_LOCALIZATIONS: \' + locale;\n      }\n      if(!(key in localizations[locale])) {\n        return \'KEY_NOT_IN_LOCALIZATIONS: \' + key;\n      }\n      var variables = {};\n      for(var variable in arguments[1]) {\n        variables[variable.replace(/^\\w+\\s+/, \'\')] = arguments[1][variable];\n      }\n      return localizations[locale][key].call(undefined, variables);\n    };\n  })(locale);\n};';return out;
};
  tmpl['ReturnOtherStringStatement']=function anonymous(it) {
var out='return \'other\';';return out;
};
  tmpl['Sentence']=function anonymous(it) {
var out='string += \''+(it.sentence)+'\';';return out;
};
  tmpl['SetPluralCase']=function anonymous(it) {
var out='_case = localizations[\''+(it.locale)+'\']._getPluralKeyword(it.'+(it.variableName)+');';return out;
};
  tmpl['SetPluralConditionCase']=function anonymous(it) {
var out=''+(it.statementType)+'(it.'+(it.variableName)+' === '+(it.value)+') {\n  _case = \'=\' + '+(it.value)+';\n}';return out;
};
  tmpl['SetPluralElseCase']=function anonymous(it) {
var out='else {\n  _case = localizations[\''+(it.locale)+'\'].getPluralKeyword(it.'+(it.variableName)+');\n}';return out;
};
  tmpl['Start']=function anonymous(it) {
var out='var string = \'\';';return out;
};
  tmpl['SwitchStatement']=function anonymous(it) {
var out='var _case;\n'+(it.setCaseStatement)+'\nswitch(_case) {\n'+(it.switchBody)+'\n}';return out;
};
  tmpl['Variable']=function anonymous(it) {
var out='string += it.'+(it.variableName)+';';return out;
};
module.exports = tmpl;