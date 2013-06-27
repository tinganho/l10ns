define([

  'backbone',
  'tmpl',
  'lodash',
  'SearchCollection',
  'TranslationView',
  'App'

], function(

  Backbone,
  tmpl,
  _,
  SearchCollection,
  TranslationView,
  App

) {

  var SearchView = Backbone.View.extend({

    initialize : function() {
      this.input = this.$('.js-search-input');
      this.searchResultContainer = $('.js-search-result-region');
      this.localesPickRegion = $('.js-locales-pick-region');
      this.bodyRegion = $('.js-body-region');
      this.collection = new SearchCollection;

      this.sel = {
        searchItem    : '.js-search-result-item',
        translation   : '.translation',
        editRow       : '.translations-edit-row',
        editCell      : '.translations-edit-cell',

        dataAttributeId : function(id) {
          return '[data-id=' + id + ']';
        }
      };

      _.bindAll(this);
    },

    events : {
      'keyup .js-search-input' : 'showResult'
    },

    el : '.search',

    showResult : function() {
      var self = this;
      var val = this.input.val();
      if(val.length === 0) {
        this.hideResult();
        return;
      }
      this.localesPickRegion.hide();
      this.bodyRegion.hide();
      this.collection.meta('query', val);
      this.collection.fetch({
        success: function() {
          self.renderResult();
        }
      });
    },

    renderResult : function() {
      if(this.collection.models.length > 0) {
        var resultTmpl = tmpl.searchResult({
          results: this.collection.models
        });
        this.searchResultContainer.html(resultTmpl);
        this.searchResultContainer.on('click',
          '.js-search-result-item', this.openEdit);
      } else {
        this.searchResultContainer.html(tmpl.noSearchResult({ query: this.input.val()}));
      }
    },

    hideResult : function() {
      this.localesPickRegion.show();
      this.bodyRegion.show();
      this.searchResultContainer.html('');
    },

    openEdit : function(event) {

      var self = this, curEl = $(event.currentTarget),
          id = curEl.attr('data-id');

      // Remove edit rows
      self.searchResultContainer
        .find(self.sel.editRow)
          .remove();

      // Show all rows
      self.searchResultContainer
        .find(self.sel.searchItem)
          .show();

      // Hide showing
      curEl
        .hide()
        .after(tmpl.translationsEditRow({id:id}));

      var editCell = this.searchResultContainer.find(self.sel.editCell);

      var translationView = new TranslationView();
      translationView.setElement(editCell);
      translationView.model = this.collection.get(id);
      translationView.render();
    }
  });

  return SearchView;
});
