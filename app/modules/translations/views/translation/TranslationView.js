define([

  // Libs
  'backbone',
  'jquery',
  'tmpl',

  // MVCs
  'TranslationModel',
  'TranslationCollection'

],function(

  // Libs
  Backbone,
  $,
  tmpl,

  // MVCs
  TranslationModel,
  TranslationCollection

) {

  var TranslationView = Backbone.View.extend({

    initialize : function() {
      // Selectors
      this.sel = {
        input : '.js-translation-input'
      };
    },

    events: {
      'click .js-translation-save'  : 'save',
      'click .js-translation-else'  : '_else',
      'keyup .js-translation-input' : 'updateTranslation'
    },

    render : function() {
      this.$el.append(tmpl.translation({
        key: this.model.get('key'),
        vars : this.model.get('vars')
      }));
      if(this.model.get('value').text !== 'if...'
      && this.model.get('value').text !== 'NO TRANSLATION'
      ) {
        this.$(this.sel.input)
          .val(this.model.get('value').text);
      }
    },

    updateTranslation : function(event) {
      if(this.model.get('type') === 'simple') {
        var val = this.model.get('value');
        val.text = val.value = this.$(this.sel.input).val();
        this.model.set('value', val);
      }
    },

    save : function(event) {
      var self = this;
      this.$el.addClass('saving');
      var t = 0, interval = 50, min = 500;
      setInterval(function() {
        t += interval;
      }, interval);
      event.preventDefault();
      this.model.save({},{
        success: function(model, response, options) {
          if(response.meta.code === 200) {
            requirejs(['App'], function(App) {
              App.TranslationCollection.trigger('change');
            });
            if(t > min) {
              self.$el.removeClass('saving');
            } else {
              var left = min - t;
              setTimeout(function() {
                self.$el.removeClass('saving');
              }, left);
            }
          }
        }
      });
    },

    _else : function(event) {
    }
  });

  return TranslationView;

});
