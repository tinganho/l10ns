define(function() {
function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['compositeRouter']=function anonymous(it) {
var out='define([\'backbone\'], function(Backbone) {return Backbone.Router.extend({routes : {';var arr1=it.routes;if(arr1){var route,index=-1,l1=arr1.length-1;while(index<l1){route=arr1[index+=1];out+='\''+(route.path)+'\' : \'route.method\'';} } out+='},';var arr2=it.routes;if(arr2){var route,index=-1,l2=arr2.length-1;while(index<l2){route=arr2[index+=1];out+=(route.method)+' : function() {var model = model.fetch({success: function() {}})}';} } out+='});});';return out;
};
  tmpl['jsonScript']=function anonymous(it) {
var out='<script type="application/json" class="js-json-'+(it.name)+'">'+(it.json)+'</script>';return out;
};
return tmpl;});
