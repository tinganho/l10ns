if( typeof define !== "function" ) {
define = require( "amdefine" )( module )
}
define(function() {
var tmpl=tmpl|| {};
 tmpl['langauge_select']=function anonymous(it) {
var out='<select class="language-select">'; for(var prop in it) { out+='<option value="'+(prop)+'">'+(it[prop])+'</option>'; } out+='</select>';return out;
}
 tmpl['layout']=function anonymous(it) {
var out='<!DOCTYPE html><html><head><title>Grunt Translate</title><link type="text/css" rel="stylesheet" href="static/style.css"></head><body></body></html>';return out;
}
 tmpl['main_search']=function anonymous() {
var out='<div id="search-wrapper"><i class="eye-glass main-eye-glass fl-lt d-bl"></i><input class="search-input" value="Search"></input></div>';return out;
}
 tmpl['menu_items']=function anonymous(it) {
var out='<ul class="menu-items"><li class="fl-lt active"><a>Translations</a></li><li class="fl-lt"><a>Statistics</a></li></ul>';return out;
}
 tmpl['page_title']=function anonymous(it) {
var out='<h2>'+(it.title)+'</h2>';return out;
}
 tmpl['regions']=function anonymous(it) {
var out='<nav id="main-menu"><ul ><li id="r-search" class="ov-hid fl-lt"></li><li id="r-menu-items" class="ov-hid fl-lt"></li></ul></nav><div id="page"><div id="r-body"><ul><li id="r-keys"><div class="page-wrapper"></div></li><li id="r-values"><div class="page-wrapper"></div></li></ul></div><footer id="r-footer"></footer></div>';return out;
}
 tmpl['translation_keys']=function anonymous(it) {
var out='<ul class="m-translation-keys">'; for(var keys in it) { out+='<li><a>'+(keys)+'</a></li>'; } out+='</ul>';return out;
}
return tmpl;});
