define([

  // Libs
  'backbone',

  // Routers
  'TranslationRouter',
  'SearchRouter',

], function(

  // Libs
  Backbone,

  // Routers
  TranslationRouter,
  SearchRouter

) {

  return {

    init: function() {
      var self = this;
      // Enable routers
      this.TranslationRouter = new TranslationRouter;
      this.SearchRouter = new SearchRouter;

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
