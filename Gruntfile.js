
var jshintGlobals = require('jshint-globals')
  , compassRequires = ['susy', 'compass-placeholder', 'compass-retina-sprites', 'toolkit', 'animation', 'compass-h5bp'];

module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({

    jshint: {
      options: {
        maxlen : 100,
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

    compass : {
      documents : {
        options : {
          require : compassRequires,
          sassDir : 'interface/documents/styles',
          cssDir : 'interface/public/styles/documents',
          debugInfo : true,
          noLineComments : true,
          imagesDir : 'interface/public/images',
          relativeAssets : true
        }
      },

      content : {
        options : {
          require : compassRequires,
          sassDir : 'interface/contents/styles',
          cssDir : 'interface/public/styles/content',
          debugInfo : true,
          noLineComments : true,
          imagesDir : 'interface/public/images',
          relativeAssets : true
        }
      }
    },

    rev: {
      options: {
        algorithm: 'sha1',
        length: 8
      },
      files: {
        src: [
          'dist/public/styles/**/*.css',
          'dist/public/conf/**/*.js',
          'dist/public/scripts/**/*.js',
          'dist/vendor/modernizr/modernizr.js',
          'dist/vendor/requirejs/require.js',
          'dist/modules/device/features.js',
          'dist/public/images/**/*.{png,jpg}',
          '!dist/public/images/main/**/*',
          '!dist/public/images/main2x/**/*',
          '!dist/public/images/flags/**/*',
          '!dist/public/images/flags2x/**/*',
          'dist/public/images-webp/**/*.webp',
        ]
      }
    },

    modernizr : {
      dist : {
        devFile : 'interface/vendor/modernizr/modernizr.js',
        outputFile : 'interface/vendor/modernizr/build/modernizr.js', // we will revision this later
        extra : {
          shiv : true,
          printShiv : false,
          mq : true,
          cssclasses : true
        },
        extensibility : {
          addtest : true,
          prefixed : false,
          teststyles : false,
          testallprops : false,
          hasevents : false,
          prefixes : false,
          domprefixes : false,
        },
        uglify : true,
        parseFiles : true
      }
    },

    clean : {
      css: ['interface/public/styles/*']
    },

    dot : {
      core : {
        options : {
          variable : 'tmpl',
          requirejs : true,
          node : true
        },
        src : ['interface/core/**/*.dot'],
        dest : 'interface/public/templates/core/templates.js'
      },

      documents : {
        options : {
          variable : 'tmpl',
          requirejs : true,
          node : true
        },
        src : ['interface/documents/**/*.dot'],
        dest : 'interface/public/templates/documents/templates.js'
      },

      layouts : {
        options : {
          variable : 'tmpl',
          requirejs : true,
          node : true
        },
        src : ['interface/layouts/**/*.dot'],
        dest : 'interface/public/templates/layouts/templates.js'
      },

      content_app : {
        options : {
          variable : 'tmpl',
          requirejs : true,
          node : true
        },
        src : [
          'interface/contents/translations/**/*.dot',
          'interface/contents/search/**/*.dot',
          'interface/contents/translation/**/*.dot'
        ],
        dest : 'interface/public/templates/contents/templates.js'
      },

      jsPlugin : {
        options : {
          variable : 'tmpl',
          requirejs : false,
          node : true
        },
        src : ['plugins/javascript/templates/*.{dot,part}'],
        dest : 'plugins/javascript/templates/build/templates.js'
      }
    },

    mocha: {
      test: {
        src: ['interface/specifications/*.html'],
        options: {
          run: false,
          reporter: './node_modules/mocha/lib/reporters/spec.js'
        }
      },
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
          'tasks/**/*.js',
          '!**/node_modules/**/*.js'
        ],
        tasks: ['jshint']
      },

      styles_documents : {
        files : [
          'interface/layouts/**/*.scss',
          'interface/documents/styles/**/*.scss',
          'interface/components/**/*.scss'
        ],
        tasks : ['compass:documents']
      },

      styles_content_app : {
        files : [
          'interface/contents/styles/app.scss',
          'interface/contents/translations/**/*.scss',
          'interface/contents/search/**/*.scss',
          'interface/contents/edit/**/*.scss'
        ],
        tasks : ['compass:content']
      }
    },

    webp: {
      dev : {
        expand: true,
        cwd : 'interface/public/images',
        src : [
          '*.{jpg,png}'
        ],
        dest : 'interface/public/images-webp'
      },
      options: {
        lossless: true,
      }
    },

    requirejs: {
      default: {
        options: {
          optimize : 'uglify',
          preserveLicenseComments : false,
          // generateSourceMaps : true,
          baseUrl : 'interface',
          mainConfigFile : 'interface/documents/mains/app.js',
          out : 'interface/public/scripts/mains/app.js',
          name : 'documents/mains/app',
          paths : {
            'modernizr' : 'empty:'
          }
        }
      }
    }
  });


  // Load npm tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webp');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-rev');
  grunt.loadNpmTasks('grunt-dot-compiler');
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-mocha');

};
