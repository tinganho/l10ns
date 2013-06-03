define([

  // Libs
  'backbone',
  'jquery',
  'tmpl',

  // MVCs
  'TranslationModel',
  'TranslationView'

], function(

  // Libs
  Backbone,
  $,
  tmpl,

  //MVCs
  TranslationModel,
  TranslationView

) {

  var TranslationRouter = Backbone.Router.extend({

    initialize : function() {

      // Elements
      this.translations = $('.translations');

      // Selectors
      this.sel = {
        keysAndValues : '.translations-key, .translations-value',
        translation   : '.translation',
        editRow       : '.translations-edit-row',
        editCell      : '.translations-edit-cell',
        row           : '.translations-row',

        dataAttributeId : function(id) {
          return '[data-id=' + id + ']';
        }
      };
    },

    routes: {
      'translation/:id' : 'showTranslation'
    },

    showTranslation : function(id) {

      var id = id.split('?')[0];
      var self = this;

      var isShowing =
      this.translations
        .find(this.sel.editRow
          + this.sel.dataAttributeId(id))
        .length;

      // No logic needed if it's already showing
      if(isShowing) {
        return false;
      }

      requirejs(['App'], function(App) {

          // Remove edit rows
          self.translations
            .find(self.sel.editRow)
              .remove();

          // Show all rows
          self.translations
            .find(self.sel.row)
              .show();

          // Hide showing
          self.translations
            .find(self.sel.row
              + self.sel.dataAttributeId(id))
              .hide()
              .after(tmpl.translationsEditRow({id:id}));

          var editCell = $(self.sel.editCell);

          var translationView = new TranslationView();
          translationView.setElement(editCell);
          translationView.model = App.TranslationCollection.get(id);
          translationView.render();

      });
    }

  });

  return TranslationRouter;
});
