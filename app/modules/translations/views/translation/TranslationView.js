define(function(require) {

  var Backbone     = require('backbone'),
      $            = require('jquery'),
      Translation  = require('TranslationModel'),
      Translations = require('TranslationCollection'),
      tmpl         = require('tmpl');

  var TranslationView = Backbone.View.extend({

    intitialize : function() {
    },
    events: {
      'click .js-translation-save' : 'save',
      'click .js-translation-else' : '_else'
    },

    render : function() {
      this.$el.append(tmpl.translation({
        key: this.model.get('key'),
        vars : ['phrase', 'name']
      }));
    },

    save : function() {
      this.model.save();
    },


    _else : function() {
    }
  });

  return TranslationView;

});
