function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['JSONTranslationFunctionField']=function anonymous(it) {
var out='\''+(it.key)+'\': '+(it.functionString);return out;
};
  tmpl['additionalCondition']=function anonymous(it) {
var out=''+(it.additionalCondition)+' '+(it.operand1)+' '+(it.operator)+' '+(it.operand2);return out;
};
  tmpl['additionalConditionFunction']=function anonymous(it) {
var out=''+(it.additionalCondition)+' '+(it.function)+'('+(it.operand1)+', '+(it.operand2)+')';return out;
};
  tmpl['condition']=function anonymous(it) {
var out=''+(it.condition)+'('+(it.operand1)+' '+(it.operator)+' '+(it.operand2);return out;
};
  tmpl['conditionBody']=function anonymous(it) {
var out=') {\n  return \''+(it.string)+'\';\n}';return out;
};
  tmpl['conditionFunction']=function anonymous(it) {
var out=''+(it.condition)+'('+(it.function)+'('+(it.operand1)+', '+(it.operand2)+')';return out;
};
  tmpl['elseStatement']=function anonymous(it) {
var out='else {\n  return \''+(it.string)+'\';\n}';return out;
};
  tmpl['functions']=function anonymous(it) {
var out='function l(key) {\n  if(!(key in localizations)) {\n    return \'KEY_NOT_IN_SOURCE: \' + key;\n  }\n  return localizations[key].call(undefined, arguments[1]);\n};\n\nfunction lci(operand1, operand2) {\n  operand1 = operand1 + \'\';\n  operand2 = operand2 + \'\';\n  operand1LastNumber = operand1.substr(-1,1);\n  return operand1LastNumber === operand2;\n};';return out;
};
  tmpl['javascriptWrapper']=function anonymous(it) {
var out=';(function() {\n'+(it.localizationMap)+'\n'+(it.functions)+'\n\n  if(typeof require === "function" && typeof exports === \'object\' && typeof module === \'object\') {\n    module.exports = l;\n  }\n  else if (typeof define === "function" && define.amd) {\n    define(function() {\n      return l;\n    });\n  }\n  else {\n    window.'+(it.functionName)+' = l;\n  }\n})();\n';return out;
};
  tmpl['mapDeclaration']=function anonymous(it) {
var out='var localizations = {\n'+(it.body)+'\n};\n';return out;
};
  tmpl['nonConditionFunctionBody']=function anonymous(it) {
var out='return \''+(it.string)+'\';';return out;
};
  tmpl['nonTranslatedFunctionBody']=function anonymous(it) {
var out='return \'KEY_NOT_TRANSLATED: '+(it.key)+'\';';return out;
};
module.exports = tmpl;