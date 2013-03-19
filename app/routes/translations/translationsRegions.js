var requirejs = require('requirejs'),
    findup    = require('findup-sync'),
    jsdom     = require('jsdom').jsdom;

requirejs.config({

  baseUrl: __dirname,
  nodeRequire: require

});

var routes = function(server) {

  'use strict';
  var grunt = require('grunt');
  require(findup('Gruntfile.js'))(grunt, true);
  var config = grunt.config.get('translate');

  var tmpl = requirejs('../../build/tmpl');

  // Insert translation keys
  var translations = grunt.file.readJSON(config.dist.options.config + '/locales/' + config.dist.options.defaultLanguage + '.json');
  var keys = [];
  for(var key in translations) {
    if(translations.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  keys.sort(function(a, b) {
    return translations[b].timestamp - translations[a].timestamp;
  });


  var outputKeys = {};
  var first;
  var n = 0;
  for(var i in keys) {
    if(n  > 20) {
      break;
    }
    if(n === 0) {
      (function(i) {
        first = [i, keys[i]];
      })(i);
    }
    outputKeys[i] = keys[i];
    n++;
  }

  var regions = tmpl.translations_regions({
    search: tmpl.main_search(),
    menu_items: tmpl.menu_items(),
    keys_title: tmpl.page_title({ title: 'Keys'}),
    keys_region: tmpl.translation_keys(outputKeys),
    values_title: tmpl.page_title({ title: 'Values'}),
    values_region: ''
  });

  var layout = tmpl.layout({
    body: regions
  });

  // DOM appending
  server.get( '/', function(req, res) {
    return res.send( layout );
  });

};

module.exports = routes;
