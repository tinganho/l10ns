var requirejs = require('requirejs'),
    findup    = require('findup-sync'),
    jsdom     = require('jsdom').jsdom;

var routes = function(server) {

  'use strict';
  var grunt = require('grunt');
  require(findup('Gruntfile.js'))(grunt);
  var config = grunt.config.get('translate');

  var tmpl = requirejs('./build/tmpl');

  // Insert translation keys
  var keys = grunt.file.readJSON(config.options.configDir + '/locales/' + config.options.defaultLanguage + '.json');
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

  // // Render langague
  // var langagues = grunt.file.readJSON(config.options.configDir + '/locales.json');
  // document.getElementById('r-values').getElementsByClassName('page-wrapper')[0].innerHTML += tmpl.langauge_select(langagues);
  // document.querySelectorAll('option[value='+ config.options.defaultLanguage +']')[0].setAttribute('selected', 'selected');

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
  server.get( '/translations', function(req, res) {
    return res.send( layout );
  });

};

module.exports = routes;
