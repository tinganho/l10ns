var requirejs = require('requirejs'),
    jsdom     = require('jsdom').jsdom;

var routes = function(server) {

  'use strict';
  var grunt = require('grunt');
  var tmp = require('../../../Gruntfile');
  tmp(grunt);
  var config = grunt.config.get('translate');

  var tmpl = requirejs('./build/tmpl');
  var document = jsdom(tmpl.layout());
  document.body.innerHTML += tmpl.regions();
  document.getElementById('r-menu-items').innerHTML = tmpl.menu_items();
  document.getElementById('r-search').innerHTML = tmpl.main_search();

  // Titles
  document.getElementById('r-keys').getElementsByClassName('page-wrapper')[0].innerHTML = tmpl.page_title({ title: 'Keys'});
  document.getElementById('r-values').getElementsByClassName('page-wrapper')[0].innerHTML = tmpl.page_title({ title: 'Values'});

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
  document.getElementById('r-keys').getElementsByClassName('page-wrapper')[0].innerHTML += tmpl.translation_keys(outputKeys);

  // Render langague
  var langagues = grunt.file.readJSON(config.options.configDir + '/locales.json');
  document.getElementById('r-values').getElementsByClassName('page-wrapper')[0].innerHTML += tmpl.langauge_select(langagues);
  document.querySelectorAll('option[value='+ config.options.defaultLanguage +']')[0].setAttribute('selected', 'selected');


  // DOM appending
  server.get( '/translations', function(req, res) {
    return res.send( document.innerHTML );
  });

};

module.exports = routes;
