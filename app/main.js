requirejs.config({

  paths: {

    // libs
    'lodash'                : 'vendor/lodash/lodash',
    'backbone'              : 'vendor/backbone/backbone',
    'jquery'                : 'vendor/jquery/jquery',
    'jquery.url'            : 'vendor/url-parser/purl',
    'backbone.paginator'    : 'vendor/backbone.paginator/lib/backbone.paginator'

  },

  shim: {

    'lodash' : {
      exports : '_'
    },
    'backbone' : {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    },
    'jquery' : {
      exports: 'jQuery'
    },

    'jquery.url' : ['jquery'],
    'backbone.paginator' : ['backbone']
  },

  map : {
    '*' : {

      'tmpl'                  : 'public/templates/tmpl',
        // Modules
      'TranslationModel'      : 'modules/translations/TranslationModel',
      'TranslationCollection' : 'modules/translations/TranslationCollection',
      'TranslationsView'      : 'modules/translations/views/translations/TranslationsView',
      'TranslationView'       : 'modules/translations/views/translation/TranslationView',
      'TranslationRouter'     : 'modules/translations/TranslationRouter',

      'SearchRouter'          : 'modules/search/SearchRouter',
      'SearchCollection'      : 'modules/search/SearchCollection',
      'SearchView'            : 'modules/search/SearchView',

      'Locales'               : 'modules/locales/Locales',
      'LocalesView'           : 'modules/locales/LocalesView'
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

  // Plugins
  'backbone.paginator',

  'App'

], function(

  // Libs
  $,
  Backbone,

  // Plugins
  BackbonePaginator,

  // App
  App

){

  $(function(){
    App.init();
  });

});
