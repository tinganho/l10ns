
requirejs.config({
  paths : {
    'jquery' : 'vendor/jquery/dist/jquery',
    'jquery.cookie' : 'vendor/jquery.cookie/jquery.cookie',
    'underscore' : 'vendor/underscore/underscore',
    'backbone' : 'vendor/backbone/backbone',
    'backbone.queryparams' : 'vendor/backbone-query-parameters-patch/backbone.queryparams',
    'backbone-relational' : 'vendor/backbone-relational/backbone-relational',
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
    'backbone-relational' : ['backbone', 'underscore', 'jquery'],
    'jquery.cookie' : ['jquery'],
    'jquery.hammer' : ['jquery'],
    'purl' : ['jquery'],
    'jquery.formParams' : ['jquery']
  },

  map : {
    '*': {
      'View' : 'lib/View',
      'Collection' : 'lib/Collection',
      'Model' : 'lib/Model',
      'contentTmpls' : 'public/templates/content/app',

      'CompositeRouter' : 'public/scripts/routers/composer',
      'request' : 'client-lib/request',
      'Document' : 'lib/Document',
      'DocumentView' : 'lib/DocumentView',
      'layoutTmpls' : 'public/templates/layouts/tmpl'
    }
  },

  waitSeconds : 90,

  baseUrl : '/'
});

define('modernizr', function() {
  return Modernizr;
});

require([

  'backbone',
  'backbone-relational',
  'CompositeRouter',
  'Document',
  'DocumentView',
  'layoutTmpls'

], function(

  Backbone,
  BackboneRelational,
  CompositeRouter,
  Document,
  DocumentView,
  layoutTmpls

) {

  var $body = $(document.body);

  // App
  window.app = {
    routers : {},
    models : {},
    collections : {},
    views : {},
    components : {},
    document : new Document,
    $document : $(document),
    layoutTmpls : layoutTmpls,
    initialPageLoad : true,
    $body : $body,
    $layout : $body.find('[data-layout]'),
    navigate : function(path) {
      Backbone.Router.prototype.navigate(path, { trigger : true });
    }
  };

  /**
   * Initialize App
   */

  app.initialize = function() {
    this.delegateRouters();
    this.startBackbone();
  };

  /**
   * Start backbone router
   */

  app.startBackbone = function() {
    Backbone.history.start({ pushState : true, hashChange : false });
    app.views.document = new DocumentView(app.document);
  };

  /**
   * Delegate Backbone routers
   */

  app.delegateRouters = function() {
    new CompositeRouter();
  };

  // Initialize App
  app.initialize();

});

