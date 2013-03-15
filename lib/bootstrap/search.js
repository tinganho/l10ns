var grunt = require('grunt'),
   findup = require('findup-sync'),
       fs = require('fs'),
        _ = grunt.util._,
   engine = require('../helpers/engine'),
   config = require('../helpers/config'),
   Search = require('node-search').Search,
   nStore = require('nstore');

grunt.util = grunt.util || grunt.utils;
grunt.file.expand = grunt.file.expandFiles || grunt.file.expand;

module.exports = function(options, silent) {

  return 'result';
};