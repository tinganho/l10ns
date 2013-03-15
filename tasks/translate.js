/*
 * grunt-translate
 * https://github.com/tinganho/grunt-translate
 *
 * Copyright (c) 2013 Tingan Ho
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  // Set grunt
  grunt.util = grunt.util || grunt.utils;
  var _ = grunt.util._;

  // Get config
  var translation = './translations';
  var options = _.defaults(grunt.config.get('translate').dist.options, {
    config: './translation',
    requireJS: true,
    translationFunctionName: 'gt'
  });
  options.output = options.config + '/output';
  options.deleteLog = options.config + '/delete.log';

  // Grunt trix
  grunt.registerTask('translate:update', ['translate']);
  grunt.registerTask('translate:compile', ['translate']);
  grunt.registerTask('translate:log', ['translate']);
  grunt.registerTask('translate:interface', ['translate']);

  grunt.registerMultiTask('translate', 'Your task description goes here.', function(opt) {
    // Run appropiate sub task
    var subtask = process.argv[2].split(':')[1];
    GruntTranslate[subtask](options);
  });
  var bootstrap = require('../lib/bootstrap');
  var server = require('../app/server');

  var GruntTranslate = _.extend(bootstrap, server);
};
