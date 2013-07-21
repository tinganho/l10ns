define([

  // Libs
  'backbone',
  'jquery',
  'tmpl',

  // App
  'App',

  // MVCs
  'TranslationModel',
  'TranslationCollection',
  'TranslationView'

], function(

  // Libs
  Backbone,
  $,
  tmpl,

  // App
  App,

  // MVCs
  TranslationModel,
  TranslationCollection,
  TranslationView

) {

  var TranslationsView = Backbone.View.extend({

    initialize : function() {

      this.sel = {
        json         : '.js-translations-json',
        translation  : '.translation',
        row          : '.translations-row',
        editRow      : '.translations-edit-row',
        editRowInput : '.js-translation-input',
        editCell     : '.translations-edit-cell',
        keyText      : '.translations-key .translations-text',
        valueText    : '.translations-value .translations-text',

        dataAttributeId : function(id) {
          return '[data-id=' + id + ']';
        }
      };



      var json         = $(this.sel.json),
          hasData      = json.length,
          translation,
          translations;

      try {
        translations = JSON.parse(json.text());
      } catch(e) {}

      for(var key in translations) {
        translation = new TranslationModel({
          id    : translations[key].id,
          key   : translations[key].key,
          vars  : translations[key].vars,
          value : translations[key].value
        });
      }
      App.TranslationCollection = new TranslationCollection(translations);
      App.TranslationCollection.bootstrap({totalRecords: 100});
      App.TranslationCollection.meta('prevLength', translations.length);

      // events
      App.TranslationCollection.on('change', this.reRenderTitles, this);
      // App.TranslationCollection.on('add', this.renderNewTranslations);

      // Remove json data
      json.remove();

      translation = $(this.sel.editCell);
      if(translation.length) {
        var translationView = new TranslationView();
        translationView.setElement(translation);
        var id = translation.parents(this.sel.editRow).attr('data-id');
        if(App.TranslationCollection) {
          translationView.model = App.TranslationCollection.get(id);
        } else {
          requirejs(['App'], function(App) {
            translationView.model = App.TranslationCollection.get(id);
          });
        }
      }
    },

    el : '.translations',

    events : {
      'click .translations-row'                        : 'openEdit',
      'click .translations-row-close-btn'              : 'closeEdit',
      'click .translation-pagination-load-more-button' : 'loadMoreTranslations'
    },

    openEdit : function(event) {
      App.TranslationRouter.navigate('translation/'
        + $(event.currentTarget).attr('data-id') + window.location.search, {trigger: true});
    },

    closeEdit : function() {

    },

    reRenderTitles : function() {
      var self = this;
      App.TranslationCollection.each(function(model) {
        var id = model.get('id');
        var row = self.$el.find(self.sel.row
          + self.sel.dataAttributeId(id));
        if(row.length) {
          var val = model.get('value').text;
          if(val === '') {
            val = 'NO TRANSLATION';
          }
          row
            .find(self.sel.valueText)
              .html(val);

          // Update translation input
          $(self.sel.editRow + self.sel.dataAttributeId(id))
            .find(self.sel.editRowInput)
              .val(val);
        }
      });
    },

    loadMoreTranslations : function() {
      var self = this;
      App.TranslationCollection.nextPage({
        update: true,
        remove: false,
        success: function() {
          self.appendNewTranslations();
        }});
    },

    appendNewTranslations : function() {
      var newCollection =
      App
        .TranslationCollection
          .slice(App.TranslationCollection.meta('prevLength'));
      for(var i = 0; i < newCollection.length; i++) {
        var _tmpl = tmpl.translationRow({
          id    : newCollection[i].get('id'),
          key   : newCollection[i].get('key'),
          value : newCollection[i].get('value').text
        });
        this.$('.translations-pagination').before(_tmpl);
      }

      App.TranslationCollection.meta('prevLength', App.TranslationCollection.length);

      if(newCollection.length < 20) {
        this.$('.translations-pagination').hide();
      }
    }
  });

  return TranslationsView;

});
