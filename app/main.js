requirejs.config({

  paths: {

    // libs
    'lodash'                : 'vendor/lodash/lodash',
    'backbone'              : 'vendor/backbone/backbone',
    'jquery'                : 'vendor/jquery/jquery',
    'tmpl'                  : 'public/templates/tmpl',

    // Modules
    'TranslationModel'      : 'modules/translations/TranslationModel',
    'TranslationCollection' : 'modules/translations/TranslationCollection',
    'TranslationsView'      : 'modules/translations/views/translations/TranslationsView',
    'TranslationView'       : 'modules/translations/views/translation/TranslationView',
    'TranslationRouter'     : 'modules/translations/TranslationRouter',

    'SearchRouter'          : 'modules/search/SearchRouter'

  },

  shim: {

    'lodash' : {
      exports : '_'
    },
    'backbone': {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    },
    'jquery': {
      exports: 'jQuery'
    }

  }

});
// Define a module modernizr
define('modernizr', [], function() {
  return Modernizr;
});

// Require all libraries
requirejs([

  // Libs
  'jquery',
  'backbone',
  'App'

], function(

  $,
  Backbone,
  App

){

  $(function(){
    App.init();
  });

});
