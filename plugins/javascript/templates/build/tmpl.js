function encodeHTMLSource() {var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;return function() {return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;};};
  String.prototype.encodeHTML=encodeHTMLSource();
  var tmpl = {};
  tmpl['JSONTranslationFunctionField']=function anonymous(it) {
var out='<!--JSON translation function field@param {string} key@param {string} functionString!-->\''+(it.key)+'\' : '+(it.functionString);return out;
};
  tmpl['additionalCondition']=function anonymous(it) {
var out='<!--Additional condition string@param {string} additionalCondition@param {string} operand1@param {string} operator@param {string} operand2!-->'+(it.additionalCondition)+' '+(it.operand1)+' '+(it.operator)+' '+(it.operand2);return out;
};
  tmpl['condition']=function anonymous(it) {
var out='<!--Condition string@param {string} condition@param {string} operand1@param {string} operator@param {string} operand2!-->'+(it.condition)+'('+(it.operand1)+' '+(it.operator)+' '+(it.operand2);return out;
};
  tmpl['conditionBody']=function anonymous(it) {
var out='<!--Condition body including brackets@param {string} string to return!-->) {return \''+(it.string)+'\';}';return out;
};
  tmpl['elseStatement']=function anonymous(it) {
var out='<!--Else statement@param {string} string to return!-->else {return \''+(it.string)+'\';}';return out;
};
  tmpl['function']=function anonymous(it) {
var out='<!--Function!-->function gt(key) {if(!(key in t)) {return \'KEY_NOT_IN_SOURCE: \' + key;}return t[key].apply(undefined, arguments);};';return out;
};
  tmpl['javascriptWrapper']=function anonymous(it) {
var out='<!--Else statement@param {string} string to return!-->;(function() {'+(it.translationMap)+'<!--Function!-->function gt(key) {if(!(key in t)) {return \'KEY_NOT_IN_SOURCE: \' + key;}return t[key].apply(undefined, arguments);};; if(typeof require === "function" && typeof exports === \'object\' && typeof module === \'object\') {module.exports = gt;}else if (typeof define === "function" && define.amd) {define(function () {return gt;});}else {window[\''+(it.variable)+'\'\'] = gt;}})();';return out;
};
  tmpl['mapDeclaration']=function anonymous(it) {
var out='<!--Translation map declaration@param {string} body!-->var t = {'+(it.body)+'};';return out;
};
  tmpl['nonConditionFunctionBody']=function anonymous(it) {
var out='<!--Non-condition function body string@param {string} string to return!-->return \''+(it.string)+'\';';return out;
};
  tmpl['nonTranslatedFunctionBody']=function anonymous(it) {
var out='<!--Non-translated function body@param {string} string to return!-->return \'KEY_NOT_TRANSLATED: \' + \''+(it.key)+'\' + \';\';';return out;
};
module.exports = tmpl;