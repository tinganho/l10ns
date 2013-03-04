module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        loopfunc: true,
        forin: false,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true,
        supernew: true,
        strict: false,
        globals: {
          gt: true,
          describe: true,
          it: true
        }
      },

      files: [
        'grunt.js',
        'app/**/*.js',
        'lib/**/*.js',
        '!app/build/tmpl.js'
      ]
    },

    compass: {
      dist: {
        options: {
          config: 'app/config.rb',
          require: ['susy', 'breakpoint', 'stylewithclass', 'sassy-buttons', 'toolkit'],
          sassDir: 'app/build',
          cssDir: 'app/public/styles',
          debugInfo: true,
          noLineComments: true,
          imagesDir: 'app/public/images'
        }
      }
    },

    translate: {
      options: {
        configDir: './test/translations',
        requireJS: true,
        defaultLanguage: 'en', // grunt-translate use it to update translation.
        output: './test/translations/output',
        src: ['./test/example/**/*.js']
      },
      compile: {
      },
      update: {

      },
      server: {
        port: 3000
      }
    },

    'compile-templates': {
      dist: {
        options: {
            variable: 'tmpl',
            prefix: 'doT.template(',
            suffix: ')',
            root: __dirname + '/app'
        },
        src: ['app/**/*.dot'],
        dest: 'app/build/tmpl.js'
      }
    },

    open : {
      translation : {
        path: 'http://localhost:3000/translations'
      }
    },

    watch: {
      templates: {
        files: '**/*.dot',
        tasks: ['compile-templates']
      },

      jshint: {
        files: [
          '**/*.js',
          'Gruntfile.js',
          'bin/**/*.js',
          'tasks/**/*.js',
          '!app/build/tmpl.js'
        ],
        tasks: ['jshint', 'translate:update', 'translate:compile']
      },

      compass: {
        files: ['app/**/*.scss'],
        tasks: ['compass']
      }
    }

  });
  // Load local tasks.
  grunt.loadTasks('lib');

  // Load npm tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-dot-compiler');
  grunt.loadNpmTasks('grunt-open');

  // Default task.
  grunt.registerTask('default', 'jshint translate:update translate:compile test');



};
