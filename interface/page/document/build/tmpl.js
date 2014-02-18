define(function() {
function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['default']=function anonymous(it) {
var out='<!DOCTYPE html><html lang="'+(it.locale)+'" class="'+(it.locale)+' '+(it.device)+'"><head><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta charset="utf-8"><meta name="viewport" content="width=device-width, user-scalable=no"><meta name="apple-mobile-web-app-capable" content="yes"><title class="js-page-title">'+(it.title)+'</title><script>(function(Modernizr) { // webpalpha detection var image = new Image(); image.onerror = function() { Modernizr.addTest(\'webpalpha\', false); }; image.onload = function() { Modernizr.addTest(\'webpalpha\', image.width === 1); }; image.src = \'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==\';})(Modernizr);</script>';var arr1=it.styles;if(arr1){var href,index=-1,l1=arr1.length-1;while(index<l1){href=arr1[index+=1];out+='<link href="'+(href)+'" rel="stylesheet" type="text/css">';} } out+='</head><body>'+(it.layout)+'</body></html>';return out;
};
return tmpl;});
