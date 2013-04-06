requirejs.config({

  paths: {
    // libs
    'lodash'                : 'vendor/lodash/lodash',
    'backbone'              : 'vendor/backbone/backbone',
    'jquery'                : 'vendor/jquery/jquery',
    'tmpl'                  : 'public/templates/tmpl',

    // modules
    'TranslationModel'      : 'modules/translations/TranslationModel',
    'TranslationCollection' : 'modules/translations/TranslationCollection',
    'TranslationsView'      : 'modules/translations/views/TranslationsView',
    'TranslationView'       : 'modules/translations/views/TranslationView'

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
require([
  'jquery',
  'backbone',
  'TranslationView'
], function($, Backbone, TranslationView) {

  var translationView = new TranslationView();

  Backbone.history.start({ pushState: true });

});
