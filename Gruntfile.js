
var jshintGlobals = require('jshint-globals');

module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({

    jshint: {
      options: {
        maxlen : 180,
        strict : false,
        curly : false,
        eqeqeq : true,
        loopfunc : true,
        forin : false,
        immed : true,
        latedef : true,
        newcap : true,
        noarg : true,
        sub : true,
        undef : true,
        boss : true,
        eqnull : true,
        node : true,
        es5 : true,
        supernew : true,
        laxbreak : true,
        expr : true,
        laxcomma : true,
        unused : true,
        globals: jshintGlobals({
          lcf : true,
          pcf : true,
          cf : true,
          gt : true,
          tmpl : true,
          opt : true,
          Modernizr : true,
          jQuery : true,
          $ : true,
          requirejs : jshintGlobals.requirejs,
          mocha : jshintGlobals.mocha,
          browser : jshintGlobals.browser
        })
      },

      files: [
        'grunt.js',
        'app/**/*.js',
        'lib/**/*.js',
        '!app/build/tmpl.js',
        '!app/vendor/**',
        '!app/public/templates/**/*.js',
        'src/**/*.js'
      ]
    },

    compass: {
      dist: {
        options: {
          config : 'app/config.rb',
          require : ['susy', 'compass-placeholder', 'compass-retina-sprites', 'toolkit', 'animation'],
          sassDir : 'app/conf',
          cssDir : 'app/public/styles',
          debugInfo : true,
          noLineComments : true,
          imagesDir : 'app/public/images'
        }
      }
    },

    translate: {
      dist: {
        options: {
          config : './test/translations',
          requirejs : false,
          defaultLanguage : 'en', // grunt-translate use it to update translation.
          output : './test/translations/output',
          src : ['./test/example/**/*.js'],
          interface: {
            autoOpen : false,
            port : 3000
          }
        }
      }
    },

    // Configuration to be run (and then tested)
    regarde: {
      txt: {
        files: '**/*.txt',
        tasks: ['livereload']
      }
    },

    dot: {
      interface: {
        options: {
          variable : 'tmpl',
          requirejs : true,
          node : true
        },
        src : ['interface/**/*.dot'],
        dest : 'interface/public/templates/tmpl.js'
      },

      jsPlugin : {
        options: {
          variable : 'tmpl',
          requirejs : false,
          node : true
        },
        src : ['plugins/**/*.{dot,part}'],
        dest : 'plugins/javascript/templates/build/tmpl.js'
      }
    },

    open : {
      translation : {
        path: 'http://localhost:3000/translations'
      }
    },

    jsdoc : {
      dist : {
        src: [
          'app/**/*.js',
          '!app/vendor/**',
          'src/**/*.js',
          'tasks/**/*.js'
        ],
        options: {
          destination: 'docs'
        }
      }
    },

    watch: {
      templates: {
        files: [
          '**/*.dot',
          '**/*.part'
        ],
        tasks: ['dot']
      },

      jshint: {
        files: [
          '**/*.js',
          'Gruntfile.js',
          'bin/**/*.js',
          'tasks/**/*.js'
        ],
        tasks: ['jshint']
      },

      compass: {
        files: ['app/**/*.scss'],
        tasks: ['compass']
      }
    }

  });


  // Load npm tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-dot-compiler');
  grunt.loadNpmTasks('grunt-contrib-connect');


  // Default task.
  grunt.registerTask('default', 'jshint translate:update translate:compile test');

};
