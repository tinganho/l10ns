define([

  // Libs
  'backbone',
  'jquery',
  'tmpl'

], function(

  // Libs
  Backbone,
  $,
  tmpl

) {

  var LocalesModel = Backbone.Model.extend({
    currentLocale : 'kjwefh'
  });

  return LocalesModel;
});
