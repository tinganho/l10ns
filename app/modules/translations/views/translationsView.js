define(function(require) {

  var Backbone        = require('backbone'),
      $               = require('jquery'),
      Translation     = require('translationModel'),
      Translations    = require('translationCollection'),
      TranslationView = require('translationView'),
      tmpl            = require('tmpl');

  var TranslationsView = Backbone.View.extend({

    intitialize : function() {


      this.collection = new Translations();
    },

    el: '.translations',

    events: {
      'click .translations-row'           : 'openEdit',
      'click .translations-row-close-btn' : 'closeEdit'
    },

    openEdit : function(event) {

      var active = this.$('.translations-row.active').length;
      var target = $(event.currentTarget);
      var title = target.find('.translations-key').text();

      if(target.hasClass('active')) {
        return false;
      }

      this.$('.translations-row')
        .removeClass('active')
        .removeClass('expanded')
      .find('.translations-key, .translations-value')
        .show();

      var timeout = 0;
      if(active) {
        timeout = 0;
      }

      target.addClass('active');

      setTimeout(function() {
        target
          .addClass('expanded')
          .removeClass('initial')
        .find('.translations-key, .translations-value')
          .hide();
      }, timeout);

      this.$('.translation').remove();

      var translationView = new TranslationView();
      translationView.setElement(target);
      translationView.model = new Translation({
        key : title
      });
      translationView.render();

    },


    closeEdit : function() {

    }
  });

  return TranslationsView;

});
