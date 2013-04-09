define(function(require) {

  var Backbone    = require('backbone'),
      $           = require('jquery');
  var Translation = Backbone.Model.extend({

    defaults : {
      type : 'simple'
    },

    url: '/translation'

  });


  return Translation;

});
