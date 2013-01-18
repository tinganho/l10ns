/*
 * grunt-translate
 * https://github.com/tinganho/grunt-translate
 *
 * Copyright (c) 2013 Tingan Ho
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // Requires
  var fs  = require('fs'),
      _   = grunt.utils._;

  grunt.registerMultiTask('translate', 'Your task description goes here.', function() {

    // Set default options
    var options = _.defaults(this.data || {}, {
      configDir: './translation',
      output: './translation/output',
      requireJS: true
    });

    // Set UTF-8
    grunt.file.defaultEncoding = 'utf8';

    // Get all localization files
    var files = grunt.file.expand(options.configDir + '/locales/**/*.json');

    // Check configuration are right
    if( !fs.existsSync(options.configDir + '/locales.json') ) {
      throw {
        name:     'Configuration Directory Misconfiguration',
        message:  'Please see configurations to correct your failures'
      };
    }

    // Define translation file content
    var js = '';

    // RequireJS
    if(options.requireJS) {
      js += grunt.helper('append-requirejs-content');
    }

    //Append translation content
    grunt.helper('append-translation-content', files);


  });

  /**
    Helper for appending requirejs file content
    @return String RequireJS content
   */
  grunt.registerHelper('append-requirejs-content', function() {
    var js = '';
        js += 'if( typeof define !== "function" ) {' + grunt.utils.linefeed;
        js +=   'var define = require( "amdefine" )( module );' + grunt.utils.linefeed;
        js += '}' + grunt.utils.linefeed;
        js += 'define(function() {' + grunt.utils.linefeed;
    return js;
  });


  /**
    Helper for appending translation content
    @param Array files
    @return String Translation content
   */
  grunt.registerHelper('append-translation-content', function(files) {

    // Store every function in a hash
    var t = {};

    // Append translation content
    files.map(function(file){
      var translations = grunt.file.readJSON(file);

      for( var key in translations ) {

        // Re-formats all params/vars
        var params = translations[key].vars.map(function(item){
          return item.replace('$', '');
        });

        // Define function body
        var functionBody = '';

        // Minimum requirements for a conditional statement
        if(translations[key].translations[0] === 'if') {

          var trans = translations[key].translations;
          trans.forEach(function(condition){
            functionBody += condition;
          });

          if()

        } else {


        }

        // Make function
        t[key] = new Function(params);

      }
    });

  });

};
