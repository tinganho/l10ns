

define(function(require) {

  var Backbone    = require('backbone'),
      $           = require('jquery'),
      Translation = require('TranslationModel');

  var Translations = Backbone.Collection.extend({

    model : Translation,

    url : '/translations'

  });

  return Translations;

});
