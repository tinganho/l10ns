define([

  'backbone',
  'jquery',
  'jquery.url'

], function(

  Backbone,
  $,
  jquerUrl

) {

  var Translation = Backbone.Model.extend({

    defaults : {
      type : 'simple',
      locale : $.url().param('l')
    },

    url: '/translation'

  });


  return Translation;

});
