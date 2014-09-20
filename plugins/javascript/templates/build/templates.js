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
  tmpl['FormatNumber']=function anonymous(it) {
var out='string += formatNumber({\n  number: it.'+(it.variableName)+',\n  roundTo: '+(it.roundTo)+',\n  prefix: \''+(it.prefix)+'\',\n  suffix: \''+(it.suffix)+'\',\n  percentage: '+(it.percentage)+',\n  permille: '+(it.permille)+',';if(it.currency){out+='\n  currency: {\n    type: \''+(it.currency.type)+'\',\n    context: \''+(it.currency.symbol)+'\'\n  },';}else{out+='\n  currency: null,';}if(it.groupSize){out+='\n  groupSize: {\n    primary: '+(it.groupSize.primary)+',\n    secondary: '+(it.groupSize.secondary)+'\n  },';}else{out+='\n  groupSize: null,';}out+='\n  minimumIntegerDigits: '+(it.minimumIntegerDigits)+',\n  minimumFractionDigits: '+(it.minimumFractionDigits)+',\n  maximumFractionDigits: '+(it.maximumFractionDigits)+',\n  symbols: localizations[\''+(it.locale)+'\'].__numberSymbols\n});';return out;
};
  tmpl['FormatNumberCondition']=function anonymous(it) {
var out='if(it.'+(it.variableName)+' >= 0) {\n'+(it.positive)+'\n}\nelse {\n'+(it.negative)+'\n}';return out;
};
  tmpl['FormatNumberFunction']=function anonymous(it) {
var out='function toSignficantDigits(number, digits) {\n  var multiple = Math.pow(10, digits - Math.floor(Math.log(number) / Math.LN10) - 1);\n  return Math.round(number * multiple) / multiple;\n}\n\nfunction formatNumber(it) {\n  var number = it.number\n    , prefix = it.prefix\n    , suffix = it.suffix\n    , currencySymbol =\n      \'([\\\\u0024\\\\u00A2-\\\\u00A5\\\\u058F\\\\u060B\\\\u09F2\\\\u09F3\\\\u09FB\\\\u0AF1\\\\\\\n         \\\\u0BF9\\\\u0E3F\\\\u17DB\\\\u20A0-\\\\u20BD\\\\uA838\\\\uFDFC\\\\uFE69\\\\uFF04\\\\\\\n         \\\\uFFE0\\\\uFFE1\\\\uFFE5\\\\uFFE6])\'\n    , startsWithCurrencySymbolSyntax = new RegExp(\'^\' + currencySymbol)\n    , endsWithCurrencySymbolSyntax = new RegExp(currencySymbol + \'$\');\n\n  if(it.percentage) {\n    prefix = prefix.replace(\'%\', it.symbols.percent);\n    suffix = suffix.replace(\'%\', it.symbols.percent);\n    number = number * 100;\n  }\n  else if(it.permille) {\n    prefix = prefix.replace(\'‰\', it.symbols.permille);\n    suffix = suffix.replace(\'‰\', it.symbols.permille);\n    number = number * 1000;\n  }\n  if(it.type === \'significant\') {\n    number = toSignficantDigits(number, it.maximumSignificantDigits) + \'\';\n    var difference = it.maximumSignificantDigits - it.minimumSignificantDigits;\n    if(difference > 0) {\n      number = number.replace(new RegExp(\'0{1,\' + difference + \'}$\'), \'\');\n    }\n    var subtract = 0;\n    if(/^0\\./.test(number)) {\n      subtract = 2;\n    }\n    else if(/\\./.test(number)) {\n      subtract = 1;\n    }\n    while(number.length - subtract < it.minimumSignificantDigits) {\n      number += \'0\';\n    }\n  }\n  else {\n    number = roundTo(number, it.roundTo);\n  }\n\n  var numberSplit = (number + \'\').split(\'.\')\n    , integerDigits = numberSplit[0]\n    , integerDigitsLength = integerDigits.length\n    , fractionDigits = numberSplit[1] || \'\'\n    , fractionDigitsLength = fractionDigits.length;\n\n  if(it.type === \'floating\' && integerDigitsLength < it.minimumIntegerDigits) {\n    var missingIntegerDigits = it.minimumIntegerDigits - integerDigitsLength;\n    for(var index = 0; index < missingIntegerDigits; index++) {\n      integerDigits = \'0\' + integerDigits;\n    }\n    integerDigitsLength = it.minimumIntegerDigits;\n  }\n  if(it.groupSize) {\n    var newIntegerDigits = \'\';\n    for(var index = integerDigitsLength - 1; index >= 0; index--) {\n      var primaryIndex = integerDigitsLength - it.groupSize.primary - 1;\n      if(index === primaryIndex) {\n        newIntegerDigits += it.symbols.group;\n      }\n      else if(index < primaryIndex && (primaryIndex - index) % it.groupSize.secondary === 0) {\n        newIntegerDigits += it.symbols.group;\n      }\n\n      newIntegerDigits += integerDigits.charAt(index);\n    }\n    integerDigits = newIntegerDigits.split(\'\').reverse().join(\'\');\n  }\n\n  if(it.type === \'floating\') {\n    if(fractionDigitsLength > it.maximumFractionDigits) {\n      fractionDigits = fractionDigits.substring(0, it.maximumFractionDigits);\n    }\n    else if(fractionDigitsLength < it.minimumFractionDigits) {\n      var missingFractionDigits = it.minimumFractionDigits - fractionDigitsLength;\n      for(var index = 0; index < missingFractionDigits; index++) {\n        fractionDigits += \'0\';\n      }\n    }\n  }\n\n  if(it.currency) {\n    if(!endsWithCurrencySymbolSyntax.test(it.currency.symbol)) {\n      prefix = prefix + \' \';\n    }\n    if(!startsWithCurrencySymbolSyntax.test(it.currency.symbol)) {\n      suffix = \' \' + suffix;\n    }\n    prefix = prefix.replace(/¤+/, it.currency.symbol);\n    suffix = suffix.replace(/¤+/, it.currency.symbol);\n  }\n\n  var result = \'\';\n  result += prefix;\n  result += integerDigits;\n  if(fractionDigits.length > 0) {\n    result += it.symbols.decimal + fractionDigits;\n  }\n  result += suffix;\n\n  return result;\n}';return out;
};
  tmpl['Function']=function anonymous(it) {
var out='function(it) {\n  var string = \'\';\n'+(it.functionBody)+'\n  return string;\n}';return out;
};
  tmpl['GetNumberSymbolsFunction']=function anonymous(it) {
var out='';return out;
};
  tmpl['GetPluralKeyword']=function anonymous(it) {
var out='function(cardinal) {\n';if(it.functionBody !== '  return \'other\';'){out+='  var cardinal = cardinal + \'\'\n    , n = cardinal\n    , i = parseInt(cardinal, 10)\n    , v = 0\n    , w = 0\n    , f = 0\n    , t = 0;\n\n  var hasFractionalDigitsSyntax = /\\.(\\d+)/;\n\n  if(hasFractionalDigitsSyntax.test(cardinal)) {\n    f = fractionalDigits.exec(cardinal)[1];\n    v = f.length;\n  }\n  if(hasFractionalDigitsSyntax.test(cardinal)) {\n    t = cardinal.replace(/0+$/, \'\');\n    t = fractionalDigits.exec(t)[1];\n    w = t.length;\n  }';}out+=(it.functionBody)+'\n},';return out;
};
  tmpl['JavascriptWrapper']=function anonymous(it) {
var out=';(function() {\n'+(it.roundUpFunction)+'\n\n'+(it.formatNumberFunction)+'\n\n'+(it.localizationMap)+'\n\n'+(it.requireStatement)+'\n\n  if(typeof require === "function" && typeof exports === \'object\' && typeof module === \'object\') {\n    module.exports = requireLocale;\n  }\n  else if (typeof define === "function" && define.amd) {\n    define(function() {\n      return requireLocale;\n    });\n  }\n  else {\n    window.requireLocale = requireLocale;\n  }\n})();\n';return out;
};
  tmpl['LocalizationKeyValue']=function anonymous(it) {
var out='\''+(it.key)+'\': '+(it.value);return out;
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
var out='string += formatNumber({\n  number: it.'+(it.variableName)+' - '+(it.offset)+',\n  roundTo: '+(it.roundTo)+',\n  prefix: \''+(it.prefix)+'\',\n  suffix: \''+(it.suffix)+'\',\n  percentage: '+(it.percentage)+',\n  permille: '+(it.permille)+',';if(it.currency){out+='\n  currency: {\n    type: \''+(it.currency.type)+'\',\n    context: \''+(it.currency.symbol)+'\'\n  },';}else{out+='\n  currency: null,';}if(it.groupSize){out+='\n  groupSize: {\n    primary: '+(it.groupSize.primary)+',\n    secondary: '+(it.groupSize.secondary)+'\n  },';}else{out+='\n  groupSize: null,';}out+='\n  minimumIntegerDigits: '+(it.minimumIntegerDigits)+',\n  minimumFractionDigits: '+(it.minimumFractionDigits)+',\n  maximumFractionDigits: '+(it.maximumFractionDigits)+',\n  symbols: localizations[\''+(it.locale)+'\'].__numberSymbols\n});';return out;
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