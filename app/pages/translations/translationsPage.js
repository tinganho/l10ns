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

  function getRegions(id) {

    var translations = config.getLatestTranslations(opt, 0, 20);

    // Append ID
    if(id) {
      for(var key in translations) {
        if(translations[key].id === id) {
          translations[key].edit = tmpl.translation(translations[key]);
          break;
        }
      }
    }

    // Append to data
    var data = {
      collection : translations,
      json : JSON.stringify(translations)
    };

    var regions = tmpl.translations_regions({
      search       : tmpl.search(),
      menu_items   : tmpl.menu_items(),
      translations : tmpl.translations(data)
    });

    return regions;
  }


  server.get('/', function(req, res) {
    var layout = tmpl.layout({
      body: getRegions()
    });
    return res.send(layout);
  });

  server.get('/translation/:id', function(req, res) {
    var layout = tmpl.layout({
      body: getRegions(req.param('id'))
    });
    return res.send(layout);
  });

};

module.exports = routes;
