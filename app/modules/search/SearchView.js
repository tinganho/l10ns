define([

  'backbone',
  'SearchCollection'

], function(
  
  Backbone,
  SearchCollection

) {

  var SearchView = Backbone.View.extend({

    initialize : function() {
      this.input = this.$('.js-search-input');
      this.collection = new SearchCollection;
    },

    events : {
      'keyup .js-search-input' : 'showResult'
    },

    el : '.search',

    showResult : function() {
      var self = this;
      this.collection.meta('query', this.input.val());
      this.collection.fetch({
        success: function() {
          self.renderResult();
        }
      });
    },

    renderResult : function() {

    }

  });

  return SearchView;
});