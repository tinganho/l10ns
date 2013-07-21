define([

  'jquery',
  'backbone',
  'Locales',
  'lodash'

], function(

  $,
  Backbone,
  Locales,
  _

) {

  var LocalesView = Backbone.View.extend({
    initialize : function() {
      this.model = new Locales();
      this.button   = this.$('.js-locales-button');
      this.dropdown = this.$('.js-locales-selection');
      _.bindAll(this);
    },

    el: '.locales',

    events : {
      'click .js-locales-button'           : 'showDropDown',
      'click .js-locales-selection-option' : 'setLocale'
    },

    showDropDown : function(e) {
      var self = this;
      this.button.addClass('active');
      this.dropdown.show();
      setTimeout(function() {
        $(document).click(function() {
          self.hideDropDown();
          $(document).unbind();
        });
      }, 0);
      e.stopPropagation();
    },

    hideDropDown : function() {
      this.button.removeClass('active');
      this.dropdown.hide();
    },

    setLocale : function(e) {
      this.hideDropDown();
      e.stopPropagation();
    }
  });

  return LocalesView;

});