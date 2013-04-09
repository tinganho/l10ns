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
        json        : '.js-translations-json',
        translation : '.translation',
        row         : '.translations-row',
        editRow     : '.translations-edit-row',
        editCell    : '.translations-edit-cell',
        keyText     : '.translations-key .translations-text',
        valueText   : '.translations-value .translations-text',

        dataAttributeId : function(id) {
          return '[data-id=' + id + ']';
        }
      };

      App.TranslationCollection = new TranslationCollection();

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
        App.TranslationCollection.add(translation);
      }

      // Remove json data
      json.remove();

      // events
      App.TranslationCollection.on('change', this.reRenderTitles, this);

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
      'click .translations-row'           : 'openEdit',
      'click .translations-row-close-btn' : 'closeEdit'
    },

    openEdit : function(event) {
      App.TranslationRouter.navigate('translation/'
        + $(event.currentTarget).attr('data-id'), {trigger: true});
    },

    closeEdit : function() {

    },

    reRenderTitles : function() {
      var self = this;
      App.TranslationCollection.each(function(model) {
        var row = self.$el.find(self.sel.row
          + self.sel.dataAttributeId(model.get('id')));
        if(row.length) {
          var val = model.get('value').text;
          if(val === '') {
            val = 'NO TRANSLATION';
          }
          row
            .find(self.sel.valueText)
              .html(val);
        }
      });
    }
  });

  return TranslationsView;

});
