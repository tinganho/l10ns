function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['conditionBody']=function anonymous(it) {
var out='<!--Condition body including brackets@param {string} string to return!-->) {return \''+(it.string)+'\';}';return out;
};
  tmpl['elseStatement']=function anonymous(it) {
var out='<!--Else statement@param {string} string to return!-->else {return \''+(it.string)+'\';}';return out;
};
  tmpl['javascriptWrapper']=function anonymous(it) {
var out='var '+(it.variable)+' = (function() {'+(it.translationMap)+'  return function(key, opt) { if(!(key in t)) { return \'KEY_NOT_IN_SOURCE: \'+ key; } return t[key].apply(undefined, arguments); };})();';return out;
};
  tmpl['nodejsWrapper']=function anonymous(it) {
var out='module.exports = (function() {'+(it.translationMap)+'})();';return out;
};
  tmpl['requirejsAndNodejsWrapper']=function anonymous(it) {
var out='if(typeof define !== \'function\') {var define = require(\'amdefine\')(module);}define(function() {'+(it.translationMap)+'  return function(key, opt) { if(!(key in t)) { return \'KEY_NOT_IN_SOURCE: \'+ key; } return t[key].apply(undefined, arguments); };});';return out;
};
  tmpl['returnStatement']=function anonymous(it) {
var out='return function(key, opt) {if(!(key in t)) {return \'KEY_NOT_IN_SOURCE: \'+ key;}return t[key].apply(undefined, arguments);};';return out;
};
module.exports = tmpl;