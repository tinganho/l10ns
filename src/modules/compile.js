var grunt  = require('grunt'),
    findup = require('findup-sync'),
    fs     = require('fs'),
    _      = grunt.util._,
    path   = require('path'),
    engine = require('../lib/engine'),
    config = require('../lib/config');

require(findup('Gruntfile.js'))(grunt);

module.exports = function(options) {

  // Get all localization files
  var files = grunt.file.expand({filter: 'isFile'}, options.config + '/locales/**/*.json');

  // Check configuration are right
  if( !fs.existsSync(options.config + '/locales.json') ) {
    throw {
      name:     'Configuration Directory Misconfiguration',
      message:  'Please see configurations to correct your failures'
    };
  }

  var output = options.config + '/output';
  if( !fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  // Define translation file content
  files.forEach(function(file){
    var js = '';

    // RequireJS
    if(options.requirejs) {
      js += engine.appendRequireJSContent();
    } else {
      js += engine.appendModuleContent(options);
    }

    //Append translation content
    js += engine.appendTranslationContent(file);

    // RequireJS
    if(options.requirejs) {
      js += '});' + grunt.util.linefeed;
    } else {
      js += '})()' + grunt.util.linefeed;
    }

    var filename = path.basename(file, '.json');

    var p = options.output + '/' + filename + '.js';

    if(fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
    fs.appendFileSync(p, js);

  });

  grunt.log.ok('Compiled new translation object in ' + options.config + '/output');

};
