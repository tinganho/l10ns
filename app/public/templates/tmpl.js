if(typeof define !== "function") {
define = require( "amdefine")(module)
}
define(function() {
function encodeHTMLSource() {var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;return function() {return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;};};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl=tmpl|| {};
 tmpl['layout']=function anonymous(it) {
var out='<!DOCTYPE html><html><head><title>Grunt Translate</title><!-- styles --><link type="text/css" rel="stylesheet" href="public/styles/style.css"><!-- scripts --><script src="vendor/modernizr/modernizr.js"></script><!-- meta --><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"></head><body>'+(it.body)+'<!-- build:js app.js --><script src="vendor/requirejs/require.js"></script><!-- endbuild --><script src="main.js"></script></body></html>';return out;
};
 tmpl['menu_items']=function anonymous(it) {
var out='<ul class="menu-items"><li class="menu-item active"><a>Translations</a></li><li class="menu-item"><a>Statistics</a></li></ul>';return out;
};
 tmpl['search']=function anonymous(it) {
var out='<div class="search"><div class="search-input-container"><input class="search-input" value="Search" type="text"></input></div></div>';return out;
};
 tmpl['translation']=function anonymous(it) {
var out='<div class="translation"><div class="translation-blur-helper"><h1 class="translation-key">'+(it.key)+'</h1><div class="translation-body"><ul class="translation-vars"><li class="translation-header">VARIABLES</li><li class="translation-var"><ul class="translation-vars-vars">';if(it.vars.length != 0){var arr1=it.vars;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+='<li class="translation-vars-var">'+(value)+'</li>';} } }else{out+='<li class="translation-vars-var">None</li>';}out+='</ul></li></ul><ul class="translation-values"><li class="translation-header">ENGLISH</li><li class="translation-form"><form class="js-translation-value-form"><div class="translation-input-helper"><input class="translation-input js-translation-input"type="text"value="';if(it.type === 'simple'){out+=(it.value.value);}out+='"></input></div><div class="translation-button-container"><div class="js-translation-else white-button"><a>ELSE</a></div><input class="translation-save js-translation-save form-submit" type="submit" value="SAVE"></input></div></form></li></ul></div></div><div class="translation-loading-frame"><div class="translation-loading-container"><div class="translation-loading-indicator-helper"><i class="translation-loading-indicator"></i></div><span class="translation-loading-text">SAVING...</span></div></div></div>';return out;
};
 tmpl['translationElse']=function anonymous(it) {
var out='';return out;
};
 tmpl['translationIf']=function anonymous(it) {
var out='';return out;
};
 tmpl['translations']=function anonymous(it) {
var out='<table class="translations"><col class="translations-first-col"><col class="translations-second-col"><thead class="translations-header"><tr class="translations-title-layout"><th class="translations-first-col"><h1 class="translations-title">Keys</h1></th><th class="translations-second-col"><h1 class="translations-title">Values</h1></th></tr></thead><tbody class="translations-body">'; for(var key in it.collection) { out+='<tr class="translations-row"';if(it.collection[key].edit){out+='style="display: none;"';}out+='data-id="'+(it.collection[key].id)+'"><td class="translations-key translations-first-col"><div class="translations-text">'+(it.collection[key].key)+'</div></td><td class="translations-value translations-second-col"><div class="translations-text">'+(it.collection[key].value.text)+'</div></td></tr>';if(it.collection[key].edit){out+='<tr class="translations-edit-row" data-id="'+(it.collection[key].id)+'"><td class="translations-edit-cell" colspan="2">'+(it.collection[key].edit)+'</td></tr>';} } out+='</tbody></table>';if(it.json){out+='<script class="js-translations-json">'+(it.json)+'</script>';}return out;
};
 tmpl['translationsEditRow']=function anonymous(it) {
var out='<tr class="translations-edit-row" data-id="'+(it.id)+'"><td class="translations-edit-cell" colspan="2"></td></tr>';return out;
};
 tmpl['translations_regions']=function anonymous(it) {
var out='<nav class="main-menu"><ul ><li class="search-region">'+(it.search)+'</li><li class="menu-items-region">'+(it.menu_items)+'</li></ul></nav><div class="page"><div class="body-region">'+(it.translations)+'</div><footer class="footer-region"></footer></div>';return out;
};
 tmpl['translationLoading']=function anonymous(it) {
var out='<div class="translation-loading-frame"><div class="translation-loading-container"><div class="translation-loading-indicator-helper"><i class="translation-loading-indicator"></i></div><span class="translation-loading-text">SAVING...</span></div></div>';return out;
};
 tmpl['translationValues']=function anonymous(it) {
var out='<ul class="translation-values"><li class="translation-header">ENGLISH</li><li class="translation-form"><form class="js-translation-value-form"><div class="translation-input-helper"><input class="translation-input js-translation-input"type="text"value="';if(it.type === 'simple'){out+=(it.value.value);}out+='"></input></div><div class="translation-button-container"><div class="js-translation-else white-button"><a>ELSE</a></div><input class="translation-save js-translation-save form-submit" type="submit" value="SAVE"></input></div></form></li></ul>';return out;
};
 tmpl['translationVars']=function anonymous(it) {
var out='<ul class="translation-vars"><li class="translation-header">VARIABLES</li><li class="translation-var"><ul class="translation-vars-vars">';if(it.vars.length != 0){var arr1=it.vars;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+='<li class="translation-vars-var">'+(value)+'</li>';} } }else{out+='<li class="translation-vars-var">None</li>';}out+='</ul></li></ul>';return out;
};
return tmpl;});
