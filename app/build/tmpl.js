if(typeof define !== "function") {
define = require( "amdefine")(module)
}
function encodeHTMLSource() {var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;return function() {return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;};};
String.prototype.encodeHTML=encodeHTMLSource();
define(function() {
var tmpl=tmpl|| {};
 tmpl['layout']=function anonymous(it) {
var out='<!DOCTYPE html><html><head><title>Grunt Translate</title><link type="text/css" rel="stylesheet" href="public/styles/style.css"></head><body>'+(it.body)+'</body></html>';return out;
}
 tmpl['page_title']=function anonymous(it) {
var out='<h2>'+(it.title)+'</h2>';return out;
}
 tmpl['menu_items']=function anonymous(it) {
var out='<ul class="menu-items"><li class="active"><a>Translations</a></li><li><a>Statistics</a></li></ul>';return out;
}
 tmpl['main_search']=function anonymous(it) {
var out='<div class="m-main-search"><div class="l-main-search-icon"><i class="eye-glass-icon main-eye-glass"></i></div><div class="l-main-search-input"><input class="main-search__input" value="Search"></input></div></div>';return out;
}
 tmpl['langauge_select']=function anonymous(it) {
var out='<select class="language-select">'; for(var prop in it) { out+='<option value="'+(prop)+'">'+(it[prop])+'</option>'; } out+='</select>';return out;
}
 tmpl['translation_keys']=function anonymous(it) {
var out='<ul class="m-translation-keys">'; for(var keys in it) { out+='<li><a>'+(it[keys])+'</a></li>'; } out+='</ul>';return out;
}
 tmpl['translations_regions']=function anonymous(it) {
var out='<nav class="main-menu"><ul ><li class="r-search">'+(it.search)+'</li><li class="r-menu-items">'+(it.menu_items)+'</li></ul></nav><div class="page"><div class="r-body"><ul><li class="r-keys"><div class="l-page-wrapper">'+(it.keys_title)+(it.keys_region)+'</div></li><li class="r-values"><div class="l-page-wrapper">'+(it.values_title)+(it.values_region)+'</div></li></ul></div><footer class="r-footer"></footer></div>';return out;
}
return tmpl;});
