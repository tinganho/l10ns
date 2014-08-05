function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['JSONTranslationFunctionField']=function anonymous(it) {
var out='\''+(it.key)+'\' : '+(it.functionString);return out;
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
var out=') {return \''+(it.string)+'\';}';return out;
};
  tmpl['conditionFunction']=function anonymous(it) {
var out=''+(it.condition)+'('+(it.function)+'('+(it.operand1)+', '+(it.operand2)+')';return out;
};
  tmpl['elseStatement']=function anonymous(it) {
var out='else {return \''+(it.string)+'\';}';return out;
};
  tmpl['function']=function anonymous(it) {
var out='function gt(key) {if(!(key in t)) {return \'KEY_NOT_IN_SOURCE: \' + key;}return t[key].call(undefined, arguments[1]);};function lni(operand1, operand2) {operand1 = operand1 + \'\';operand2 = operand2 + \'\';operand1LastNumber = operand1.substr(-1,1);return operand1LastNumber === operand2;};';return out;
};
  tmpl['javascriptWrapper']=function anonymous(it) {
var out=';(function() {'+(it.localizationMap)+'function gt(key) { if(!(key in t)) { return \'KEY_NOT_IN_SOURCE: \' + key; } return t[key].call(undefined, arguments[1]);};function lni(operand1, operand2) { operand1 = operand1 + \'\'; operand2 = operand2 + \'\'; operand1LastNumber = operand1.substr(-1,1); return operand1LastNumber === operand2;};if(typeof require === "function" && typeof exports === \'object\' && typeof module === \'object\') {module.exports = l;}else if (typeof define === "function" && define.amd) {define(function () {return l;});}else {window.'+(it.functionName)+' = l;}})();';return out;
};
  tmpl['mapDeclaration']=function anonymous(it) {
var out='var t = {'+(it.body)+'};';return out;
};
  tmpl['nonConditionFunctionBody']=function anonymous(it) {
var out='return \''+(it.string)+'\';';return out;
};
  tmpl['nonTranslatedFunctionBody']=function anonymous(it) {
var out='return \'KEY_NOT_TRANSLATED: \' + \''+(it.key)+'\';';return out;
};
module.exports = tmpl;