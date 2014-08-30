function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['Case']=function anonymous(it) {
var out='case \''+(it.case)+'\':\n'+(it.caseBody)+'\n  break;';return out;
};
  tmpl['ConditionStatement']=function anonymous(it) {
var out=''+(it.type)+'('+(it.condition)+') {\n  return \''+(it.case)+'\';\n}';return out;
};
  tmpl['Function']=function anonymous(it) {
var out='function(it) {\n  var string = \'\';\n'+(it.functionBody)+'\n  return string;\n}';return out;
};
  tmpl['GetPluralKeyword']=function anonymous(it) {
var out='function getPluralKeyword(cardinal) {\n  var cardinal = cardinal + \'\'\n    , n = cardinal\n    , i = parseInt(cardinal, 10)\n    , v = 0\n    , w = 0\n    , f = 0\n    , t = 0;\n\n  var hasFractionalDigitsSyntax = /\\.(\\d+)/;\n\n  if(hasFractionalDigitsSyntax.test(cardinal)) {\n    f = fractionalDigits.exec(cardinal)[1];\n    v = f.length;\n  }\n  if(hasFractionalDigitsSyntax.test(cardinal)) {\n    t = cardinal.replace(/+0$/, \'\');\n    t = fractionalDigits.exec(t)[1];\n    w = t.length;\n  }\n'+(it.functionBody)+'\n};';return out;
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
  tmpl['PluralFormat']=function anonymous(it) {
var out='var keyword = this.getPluralKeyword(cardinal);';return out;
};
  tmpl['RangeNumberComparison']=function anonymous(it) {
var out='('+(it.from)+' >= '+(it.variableName)+' && '+(it.variableName)+' <= '+(it.to)+')';return out;
};
  tmpl['ReturnOtherStringStatement']=function anonymous(it) {
var out='return \'other\';';return out;
};
  tmpl['Sentence']=function anonymous(it) {
var out='string += \''+(it.sentence)+'\';';return out;
};
  tmpl['SetKeywordCase']=function anonymous(it) {
var out='_case = this.getPluralKeyword('+(it.variableName)+');';return out;
};
  tmpl['SetPluralCase']=function anonymous(it) {
var out=''+(it.statementType)+'(it.'+(it.variableName)+' === '+(it.value)+') {\n  _case = \'=\' + '+(it.value)+';\n}';return out;
};
  tmpl['SetPluralElseCase']=function anonymous(it) {
var out='else {\n  _case = this.getPluralKeyword(it.'+(it.variableName)+');\n}';return out;
};
  tmpl['Start']=function anonymous(it) {
var out='var string = \'\';';return out;
};
  tmpl['SwitchStatement']=function anonymous(it) {
var out='var _case;\n'+(it.setCaseStatement)+'\nswitch(_case) {\n'+(it.switchBody)+'\n}';return out;
};
module.exports = tmpl;