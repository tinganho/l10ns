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
  var fs     = require('fs'),
      path   = require('path'),
      _      = grunt.util._,
      engine = require('./helpers/engine'),
      config = require('./helpers/config');

  grunt.util = grunt.util || grunt.utils;

  // vars
  var options;

  grunt.registerMultiTask('translate', 'Your task description goes here.', function() {

    // Run appropiate sub task
    GruntTranslate[this.target]();

  });
  var bootstrap = require('./bootstrap');
  var server = require('../app/server');

  var GruntTranslate = _.extend(bootstrap, server);
};
