define(function(require) {

  var Backbone    = require('backbone'),
      $           = require('jquery');
  var Translation = Backbone.Model.extend({

    defaults : {
      key : '',
      translation : ''
    },


    url: '/translation'

  });


  return Translation;

});
