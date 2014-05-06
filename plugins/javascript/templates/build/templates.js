function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['JSONTranslationFunctionField']=function anonymous(it) {
var out='\''+(it.key)+'\' : '+(it.functionString);return out;
};
  tmpl['additionalCondition']=function anonymous(it) {
var out=''+(it.additionalCondition)+' '+(it.operand1)+' '+(it.operator)+' '+(it.operand2);return out;
};
  tmpl['condition']=function anonymous(it) {
var out=''+(it.condition)+'('+(it.operand1)+' '+(it.operator)+' '+(it.operand2);return out;
};
  tmpl['conditionBody']=function anonymous(it) {
var out=') {return \''+(it.string)+'\';}';return out;
};
  tmpl['elseStatement']=function anonymous(it) {
var out='else {return \''+(it.string)+'\';}';return out;
};
  tmpl['function']=function anonymous(it) {
var out='function gt(key) {if(!(key in t)) {return \'KEY_NOT_IN_SOURCE: \' + key;}return t[key].apply(undefined, arguments);};';return out;
};
  tmpl['javascriptWrapper']=function anonymous(it) {
var out=';(function() {'+(it.translationMap)+'function gt(key) { if(!(key in t)) { return \'KEY_NOT_IN_SOURCE: \' + key; } return t[key].apply(undefined, arguments);};if(typeof require === "function" && typeof exports === \'object\' && typeof module === \'object\') {module.exports = gt;}else if (typeof define === "function" && define.amd) {define(function () {return gt;});}else {window.'+(it.variable)+' = gt;}})();';return out;
};
  tmpl['mapDeclaration']=function anonymous(it) {
var out='var t = {'+(it.body)+'};';return out;
};
  tmpl['nonConditionFunctionBody']=function anonymous(it) {
var out='return \''+(it.string)+'\';';return out;
};
  tmpl['nonTranslatedFunctionBody']=function anonymous(it) {
var out='return \'KEY_NOT_TRANSLATED: \' + \''+(it.key)+'\' + \';\';';return out;
};
module.exports = tmpl;