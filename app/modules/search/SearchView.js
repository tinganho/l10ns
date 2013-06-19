define([

  'backbone',
  'tmpl',
  'SearchCollection'

], function(

  Backbone,
  tmpl,
  SearchCollection

) {

  var SearchView = Backbone.View.extend({

    initialize : function() {
      this.input = this.$('.js-search-input');
      this.searchResultContainer = this.$('.js-search-result-container');
      this.collection = new SearchCollection;
    },

    events : {
      'keyup .js-search-input' : 'showResult'
    },

    el : '.search',

    showResult : function() {
      var self = this;
      var val = this.input.val();
      if(val.length === 0) {
        this.searchResultContainer.html('');
        return;
      }

      this.collection.meta('query', val);
      this.collection.fetch({
        success: function() {
          self.renderResult();
        }
      });
    },

    renderResult : function() {
      var resultTmpl = tmpl.searchResult({
        results: this.collection.models
      });
      this.searchResultContainer.html(resultTmpl);
    },

    // hideResult : function() {
    //   console.log(this.input.val());
    //   if(this.input.val().length === 0) {

    //   }
    // }

  });

  return SearchView;
});
