function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['JSONTranslationFunctionField']=function anonymous(it) {
var out='<!--JSON translation function field@param {string} key@param {string} functionString!-->'+(it.key)+' : '+(it.functionString);return out;
};
  tmpl['conditionBody']=function anonymous(it) {
var out='<!--Condition body including brackets@param {string} string to return!-->) {return \''+(it.string)+'\';}';return out;
};
  tmpl['elseStatement']=function anonymous(it) {
var out='<!--Else statement@param {string} string to return!-->else {return \''+(it.string)+'\';}';return out;
};
  tmpl['javascriptWrapper']=function anonymous(it) {
var out='<!--Else statement@param {string} string to return!-->var '+(it.variable)+' = (function() {'+(it.translationMap)+'<!--Return statement!-->return function(key, opt) { if(!(key in t)) { return \'KEY_NOT_IN_SOURCE: \' + key; } return t[key].apply(undefined, arguments);};})();';return out;
};
  tmpl['mapDeclaration']=function anonymous(it) {
var out='<!--Translation map declaration@param {string} body!-->var t = {'+(it.body)+'};';return out;
};
  tmpl['nodejsWrapper']=function anonymous(it) {
var out='<!--NodeJS wrapper@param {string} translationMap!-->module.exports = (function() {'+(it.translationMap)+'})();';return out;
};
  tmpl['nonConditionFunctionBody']=function anonymous(it) {
var out='<!--Non-condition function body string@param {string} string to return!-->return \'';it.stringout+='\';';return out;
};
  tmpl['nonTranslatedFunctionBody']=function anonymous(it) {
var out='<!--Non-translated function body@param {string} string to return!-->return \'KEY_NOT_TRANSLATED: \' + '+(it.key)+' + \';\';';return out;
};
  tmpl['requirejsAndNodejsWrapper']=function anonymous(it) {
var out='<!--NodeJS and RequireJS wrapper@param {string} translationMap!-->if(typeof define !== \'function\') {var define = require(\'amdefine\')(module);}define(function() {'+(it.translationMap)+'<!--Return statement!-->return function(key, opt) { if(!(key in t)) { return \'KEY_NOT_IN_SOURCE: \' + key; } return t[key].apply(undefined, arguments);};});';return out;
};
  tmpl['returnStatement']=function anonymous(it) {
var out='<!--Return statement!-->return function(key, opt) {if(!(key in t)) {return \'KEY_NOT_IN_SOURCE: \' + key;}return t[key].apply(undefined, arguments);};';return out;
};
module.exports = tmpl;