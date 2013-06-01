define([

  'backbone',
  'jquery'

], function(

  Backbone,
  $

) {

  var Translation = Backbone.Model.extend({

    defaults : {
      type : 'simple'
    },

    url: '/translation'

  });


  return Translation;

});
