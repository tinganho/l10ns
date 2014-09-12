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
var out='function(cardinal) {\n';if(it.functionBody !== '  return \'other\';'){out+='  var cardinal = cardinal + \'\'\n    , n = cardinal\n    , i = parseInt(cardinal, 10)\n    , v = 0\n    , w = 0\n    , f = 0\n    , t = 0;\n\n  var hasFractionalDigitsSyntax = /\\.(\\d+)/;\n\n  if(hasFractionalDigitsSyntax.test(cardinal)) {\n    f = fractionalDigits.exec(cardinal)[1];\n    v = f.length;\n  }\n  if(hasFractionalDigitsSyntax.test(cardinal)) {\n    t = cardinal.replace(/0+$/, \'\');\n    t = fractionalDigits.exec(t)[1];\n    w = t.length;\n  }';}out+=(it.functionBody)+'\n},';return out;
};
  tmpl['JavascriptWrapper']=function anonymous(it) {
var out=';(function() {\n'+(it.roundUpFunction)+'\n\n'+(it.localizationMap)+'\n\n'+(it.requireStatement)+'\n\n  if(typeof require === "function" && typeof exports === \'object\' && typeof module === \'object\') {\n    module.exports = requireLocale;\n  }\n  else if (typeof define === "function" && define.amd) {\n    define(function() {\n      return requireLocale;\n    });\n  }\n  else {\n    window.requireLocale = requireLocale;\n  }\n})();\n';return out;
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
var out=''+(it.variableName);if(it.modulus){out+=' % '+(it.modulus);}out+=' '+(it.comparator)+' '+(it.value);return out;
};
  tmpl['NumberFormat']=function anonymous(it) {
var out='function formatNumber(it) {\n  var number = it.number;\n  if(it.percentage) {\n    number = number * 100;\n  }\n  else if(it.permille) {\n    number = number * 1000;\n  }\n  number = roundTo(number, it.roundTo)\n\n  var numberSplit = number + \'\'.split(\'.\')\n    , integerDigits = numberSplit[0]\n    , integerDigitsLength = integerDigits.length\n    , fractionDigits = numberSplit[1] || \'\'\n    , fractionDigitsLength = 0;\n\n  if(integerDigitsLength < it.minimumIntegerDigits) {\n    var missingIntegerDigits = it.minimumIntegerDigits - integerDigitsLength;\n    for(var index = 0; index < missingIntegerDigits; index++) {\n      fractionDigits += \'0\' + fractionDigits;\n    }\n    integerDigitsLength = it.minimumIntegerDigits;\n  }\n  if(it.groupSize) {\n    var newIntegerDigits = \'\';\n    for(var index = integerDigitsLength - 1; index > 0; index--) {\n      if(index === integerDigitsLength - it.groupSize.primary - 1) {\n        newIntegerDigits += it.symbols.group;\n      }\n      else if(index < integerDigitsLength - it.groupSize.primary - 1 &&\n              integerDigitsLength - it.groupSize.primary - 1 - index % it.groupSize.secondary === 0) {\n        newIntegerDigits += it.symbols.group;\n      }\n\n      newIntegerDigits += integerDigits.charAt(index);\n    }\n    integerDigits = newIntegerDigits;\n  }\n\n  if(typeof fractionDigits === \'string\') {\n    fractionDigitsLength = fractionDigits.length;\n  }\n  if(fractionDigitsLength > it.maximumFractionDigits) {\n    fractionDigits = fractionDigits.substring(0, it.maximumFractionDigits);\n  }\n  else if(fractionDigitsLength < it.minimumFractionDigits) {\n    var missingFractionDigits = it.minimumFractionDigits - fractionDigitsLength;\n    for(var index = 0; index < missingFractionDigits; index++) {\n      fractionDigits += \'0\';\n    }\n  }\n\n  return integerDigits + it.symbols.decimal + fractionDigits\n}';return out;
};
  tmpl['OrdinalSwitchStatement']=function anonymous(it) {
var out='var _case;\n'+(it.setCaseStatement)+'\nswitch(_case) {\n'+(it.switchBody)+'\n}';return out;
};
  tmpl['OtherCase']=function anonymous(it) {
var out='default:\n'+(it.caseBody)+'\n  break;';return out;
};
  tmpl['PluralSwitchStatement']=function anonymous(it) {
var out='var _case;\n'+(it.setCaseStatement)+'\nswitch(_case) {\n'+(it.switchBody)+'\n}';return out;
};
  tmpl['RangeCondition']=function anonymous(it) {
var out='else if(it.'+(it.variableName)+' '+(it.limits.lower.type)+' '+(it.limits.lower.value)+' && it.'+(it.variableName)+' '+(it.limits.upper.type)+' '+(it.limits.upper.value)+') {\n'+(it.body)+'\n}';return out;
};
  tmpl['RangeNumberComparison']=function anonymous(it) {
var out='('+(it.from)+' >= '+(it.variableName)+' && '+(it.variableName)+' <= '+(it.to)+')';return out;
};
  tmpl['Remaining']=function anonymous(it) {
var out='string += (it.'+(it.variableName)+' - '+(it.offset)+');';return out;
};
  tmpl['RequireStatement']=function anonymous(it) {
var out='function requireLocale(locale) {\n  return (function(locale) {\n    return function l(key) {\n      if(!(locale in localizations)) {\n        return \'LOCALE_NOT_IN_LOCALIZATIONS: \' + locale;\n      }\n      if(!(key in localizations[locale])) {\n        return \'KEY_NOT_IN_LOCALIZATIONS: \' + key;\n      }\n      return localizations[locale][key].call(undefined, arguments[1]);\n    };\n  })(locale);\n};';return out;
};
  tmpl['ReturnOtherStringStatement']=function anonymous(it) {
var out='return \'other\';';return out;
};
  tmpl['RoundToFunction']=function anonymous(it) {
var out='function roundTo(number, to) {\n  return Math.round(number / to) * to;\n}';return out;
};
  tmpl['SelectSwitchStatement']=function anonymous(it) {
var out='switch(it.'+(it.variableName)+') {\n'+(it.switchBody)+'\n}';return out;
};
  tmpl['Sentence']=function anonymous(it) {
var out='string += \''+(it.sentence)+'\';';return out;
};
  tmpl['SetOrdinalCase']=function anonymous(it) {
var out='_case = localizations[\''+(it.locale)+'\'].__getOrdinalKeyword(it.'+(it.variableName)+');';return out;
};
  tmpl['SetPluralCase']=function anonymous(it) {
var out='_case = localizations[\''+(it.locale)+'\'].__getPluralKeyword(it.'+(it.variableName)+');';return out;
};
  tmpl['SetPluralConditionCase']=function anonymous(it) {
var out=''+(it.statementType)+'(it.'+(it.variableName)+' === '+(it.value)+') {\n  _case = \'=\' + '+(it.value)+';\n}';return out;
};
  tmpl['SetPluralElseCase']=function anonymous(it) {
var out='else {\n  _case = localizations[\''+(it.locale)+'\'].__getPluralKeyword(it.'+(it.variableName)+');\n}';return out;
};
  tmpl['Start']=function anonymous(it) {
var out='var string = \'\';';return out;
};
  tmpl['Variable']=function anonymous(it) {
var out='string += it.'+(it.variableName)+';';return out;
};
module.exports = tmpl;