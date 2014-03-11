
requirejs.config({
  paths : {
    'jquery' : 'vendor/jquery/dist/jquery',
    'jquery.cookie' : 'vendor/jquery.cookie/jquery.cookie',
    'underscore' : 'vendor/underscore/underscore',
    'backbone' : 'vendor/backbone/backbone',
    'backbone.queryparams' : 'vendor/backbone-query-parameters-patch/backbone.queryparams',
    'backbone.relational' : 'vendor/backbone-relational/backbone-relational',
    'superagent' : 'vendor/superagent/superagent',
    'jquery.hammer' : 'vendor/hammerjs/dist/jquery.hammer',
    'purl' : 'vendor/purl/purl',
    'jquery.formParams' : 'vendor/jquery.formParams/jquery.formParams',
    'xregexp' : 'vendor/xregexp/xregexp-all'
  },

  shim : {
    'superagent' : {
      exports : 'request'
    },
    'jquery' : {
      exports : 'jQuery'
    },
    'underscore' : {
      exports : '_'
    },
    'backbone' : {
      exports : 'Backbone',
      deps : ['underscore', 'jquery']
    },
    'stackblur' : {
      exports : 'stackBlurCanvasRGB'
    },
    'xregexp' : {
      exports : 'XRegExp'
    },

    // Plugins
    'backbone.queryparams' : ['backbone'],
    'backbone.relational' : ['backbone', 'underscore', 'jquery'],
    'jquery.cookie' : ['jquery'],
    'jquery.hammer' : ['jquery'],
    'purl' : ['jquery'],
    'jquery.formParams' : ['jquery']
  },

  map : {
    '*': {
      'View' : 'lib/View',
      'Collection' : 'lib/Collection',
      'Model' : 'lib/Model'
    }
  },

  waitSeconds : 90,

  baseUrl : '/'
});

define('modernizr', function() {
  return Modernizr;
});

require([

  'backbone'

], function(

  Backbone

) {

  // App
  window.App = {
    routers : {},
    models : {},
    collections : {},
    views : {},
    components : {}
  };

  /**
   * Initialize App
   */

  App.initialize = function() {
    this.delegateRouters();
    this.startBackbone();
  };

  /**
   * Start backbone router
   */

  App.startBackbone = function() {
    Backbone.history.start({ pushState : true, hashChange : false });
  };

  /**
   * Delegate Backbone routers
   */

  App.delegateRouters = function() {
  };

  // Initialize App
  App.initialize();

});

