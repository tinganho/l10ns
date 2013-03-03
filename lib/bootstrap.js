
// Import
var grunt = require('grunt'),
   findup = require('findup-sync'),
       fs = require('fs'),
        _ = grunt.util._,
     path = require('path'),
   engine = require('./helpers/engine'),
   config = require('./helpers/config');


require(findup('Gruntfile.js'))(grunt);
var options = _.extend(this.data || {}, grunt.config.get('translate').options);

// Set default options
var translation = './translation';
options = _.defaults( options, {
  configDir: translation,
  output: './translation/output',
  requireJS: true,
  translationFunctionName: 'gt',
  deleteLog: options.configDir + '/delete.log'
});

// Set UTF-8
grunt.file.defaultEncoding = 'utf8';

var GruntTranslate = {};
GruntTranslate.update = function(){
  require('./bootstrap/update')(options);
};
GruntTranslate.compile = function(){
  require('./bootstrap/compile')(options);
};
GruntTranslate.log = function(silent){
  return require('./bootstrap/log')(options, silent);
};

module.exports = GruntTranslate;

