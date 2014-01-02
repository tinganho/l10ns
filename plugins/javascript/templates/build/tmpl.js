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
var out=''+(it.condition)+'(it.'+(it.operand1)+' '+(it.operator)+' it.'+(it.operand2);return out;
};
  tmpl['conditionBody']=function anonymous(it) {
var out=') {return \''+(it.string)+'\';}';return out;
};
  tmpl['elseStatement']=function anonymous(it) {
var out='else {return \''+(it.string)+'\';}';return out;
};
  tmpl['javascriptWrapper']=function anonymous(it) {
var out='var '+(it.variable)+' = (function() {'+(it.translationMap)+'return function(key) { if(!(key in t)) { return \'KEY_NOT_IN_SOURCE: \' + key; } return t[key].apply(undefined, arguments);};})();';return out;
};
  tmpl['mapDeclaration']=function anonymous(it) {
var out='var t = {'+(it.body)+'};';return out;
};
  tmpl['nodejsWrapper']=function anonymous(it) {
var out='module.exports = (function() {'+(it.translationMap)+'})();';return out;
};
  tmpl['nonConditionFunctionBody']=function anonymous(it) {
var out='return \''+(it.string)+'\';';return out;
};
  tmpl['nonTranslatedFunctionBody']=function anonymous(it) {
var out='return \'KEY_NOT_TRANSLATED: \' + \''+(it.key)+'\' + \';\';';return out;
};
  tmpl['requirejsAndNodejsWrapper']=function anonymous(it) {
var out='if(typeof define !== \'function\') {var define = require(\'amdefine\')(module);}define(function() {'+(it.translationMap)+'return function(key) { if(!(key in t)) { return \'KEY_NOT_IN_SOURCE: \' + key; } return t[key].apply(undefined, arguments);};});';return out;
};
  tmpl['requirejsWrapper']=function anonymous(it) {
var out='define(function() {'+(it.translationMap)+'return function(key) { if(!(key in t)) { return \'KEY_NOT_IN_SOURCE: \' + key; } return t[key].apply(undefined, arguments);};});';return out;
};
  tmpl['returnStatement']=function anonymous(it) {
var out='return function(key) {if(!(key in t)) {return \'KEY_NOT_IN_SOURCE: \' + key;}return t[key].apply(undefined, arguments);};';return out;
};
module.exports = tmpl;