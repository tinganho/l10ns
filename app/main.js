requirejs.config({

  paths: {
    // libs
    'lodash'                : 'vendor/lodash/lodash',
    'backbone'              : 'vendor/backbone/backbone',
    'jquery'                : 'vendor/jquery/jquery',
    'tmpl'                  : 'public/templates/tmpl',

    // modules
    'translationModel'      : 'modules/translations/translationModel',
    'translationCollection' : 'modules/translations/translationCollection',
    'translationsView'      : 'modules/translations/views/translationsView',
    'translationView'       : 'modules/translations/views/translationView'

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
  'modules/translations/views/translationsView'
], function($, Backbone, TranslationView) {

  /**
  * General config for API calls
  * Possible pitfalls : Authorization token not present, weird API routes
  */

  var translationView = new TranslationView();

  Backbone.history.start({ pushState: true });

});
