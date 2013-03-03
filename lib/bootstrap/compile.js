var grunt = require('grunt'),
   findup = require('findup-sync'),
       fs = require('fs'),
        _ = grunt.util._,
     path = require('path'),
   engine = require('../helpers/engine'),
   config = require('../helpers/config');

require(findup('Gruntfile.js'))(grunt);

module.exports = function(options) {

  // Get all localization files
  var files = grunt.file.expand({filter: 'isFile'}, options.configDir + '/locales/**/*.json');

  // Check configuration are right
  if( !fs.existsSync(options.configDir + '/locales.json') ) {
    throw {
      name:     'Configuration Directory Misconfiguration',
      message:  'Please see configurations to correct your failures'
    };
  }

  var output = options.configDir + '/output';
  if( !fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  // Define translation file content
  files.forEach(function(file){
    var js = '';

    // RequireJS
    if(options.requireJS) {
      js += engine.appendRequireJSContent();
    } else {
      js += engine.appendModuleContent(options);
    }

    //Append translation content
    js += engine.appendTranslationContent(file);

    // RequireJS
    if(options.requireJS) {
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

}
