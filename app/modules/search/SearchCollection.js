define([

  'backbone'

],function(

  Backbone

) {

  var SearchCollection = Backbone.Collection.extend({

    initialize : function() {
      this._meta = [];
    },

    url : function() {
      return '/search?q=' + this.meta('query');
    },

    meta : function(prop, value) {
      if (value === undefined) {
          return this._meta[prop];
      } else {
          this._meta[prop] = value;
      }
    },

    showResult : function(q) {

    }

  });

  return SearchCollection;
});
