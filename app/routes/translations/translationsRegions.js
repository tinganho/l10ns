var requirejs = require('requirejs'),
    findup    = require('findup-sync'),
    config    = require('../../../src/lib/config');

requirejs.config({

  baseUrl: __dirname,
  nodeRequire: require

});

var routes = function(server) {

  'use strict';
  var grunt = require('grunt');
  require(findup('Gruntfile.js'))(grunt, true);
  var opt = grunt.config.get('translate').dist.options;

  var tmpl = requirejs('../../public/templates/tmpl');



  // DOM appending
  server.get( '/', function(req, res) {
    // Insert translation keys
    var translations = config.getLatestTranslations(opt, 20);

    var regions = tmpl.translations_regions({
      search: tmpl.search(),
      menu_items: tmpl.menu_items(),
      translations: tmpl.translations(translations)
    });

    var layout = tmpl.layout({
      body: regions
    });

    res.header('Cache-Control', 'no-cache');
    return res.send( layout );
  });

};

module.exports = routes;
