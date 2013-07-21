define([

  // Libs
  'backbone',

  // Routers
  'TranslationRouter',
  'SearchRouter',

  // Views
  'Locales',
  'LocalesView',
  'SearchView'

], function(

  // Libs
  Backbone,

  // Routers
  TranslationRouter,
  SearchRouter,

  Locales,
  LocalesView,
  SearchView

) {

  return {

    init: function() {
      var self = this;
      // Enable routers
      this.TranslationRouter = new TranslationRouter;
      this.SearchRouter      = new SearchRouter;

      // Set Locales
      this.Locales = new Locales;

      // Enable Views
      this.LocalesView = new LocalesView;
      this.SearchView  = new SearchView;

      // Enable pushState for compatible browsers
      var enablePushState = true;

      // Disable for older browsers
      var pushState = !!(enablePushState && window.history && window.history.pushState);

      // Record history
      Backbone.history.start({pushState : true});

      // Set base views depending on path
      var path = window.location.pathname;
      if(path === '/' || /translation\/\w/.test(path)) {
        requirejs([
          'TranslationsView'
        ], function(
          TranslationsView
        ) {
          self.TranslationsView = new TranslationsView;
        });
      }
    }
  };
});
