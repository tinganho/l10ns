define(function() {
function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['translations']=function anonymous(it) {
var out='<ul class="translations ';if(!it.metas.revealed){out+='hidden';}out+='"><li class="translations-headers"><h2 class="translation-col translations-header">'+(it.metas.l10n_keys)+'</h2><h2 class="translation-col translations-header">'+(it.metas.l10n_values)+'</h2><li>';var arr1=it;if(arr1){var translation,index=-1,l1=arr1.length-1;while(index<l1){translation=arr1[index+=1];out+='<li class="translation" data-id="'+(translation.id)+'"><div class="translation-col translation-key">'+(translation.key)+'</div><div class="translation-col translation-value">'+(translation.text)+'</div></li>';} } out+='</ul>';return out;
};
  tmpl['search']=function anonymous(it) {
var out='<div class="search-layout"><input class="search" type="text" placeholder="'+(it.i18n_placeholder)+'"></input></div>';return out;
};
  tmpl['edit']=function anonymous(it) {
var out='<div class="edit"><h1 class="edit-title">'+(it.key)+'</h1><form class="edit-form"><div class="edit-variables"><h2 class="edit-sub-title">'+(it.i18n_variables)+'</h2><ul class="edit-variables-list">';if(it.variables){var arr1=it.variables;if(arr1){var variable,index=-1,l1=arr1.length-1;while(index<l1){variable=arr1[index+=1];out+='<li class="edit-variable">'+(variable)+'</li>';} } }else{out+='<li class="edit-variable">'+(it.i18n_none)+'</li>';}out+='</ul></div><div class="edit-inputs clearfix"><h2 class="edit-sub-title">'+(it.i18n_translation)+'</h2><input type="text" class="edit-input"></input><div class="edit-actions"><input class="edit-actions-save button" type="submit" value="'+(it.i18n_save)+'" disabled></input><a class="edit-actions-cancel button" disabled>'+(it.i18n_else)+'</a></div></div></form></div>';return out;
};
return tmpl;});
