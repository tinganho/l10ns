module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*.js']
    },

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
          gt: true
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
        defaultLanguage: 'en' // grunt-translate use it to update translation.
      },
      compile: {
        output: './test/translations/output'
      },
      update: {
        src: ['./test/example/**/*.js']
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

    watch: {
      templates: {
        files: '**/*.dot',
        tasks: ['compile-templates']
      },

      jshint: {
        files: ['**/*.js', 'Gruntfile.js', 'bin/**/*.js', 'tasks/**/*.js'],
        tasks: ['jshint', 'translate:update', 'translate:compile', 'nodeunit']
      },

      compass: {
        files: ['app/**/*.scss'],
        tasks: ['compass']
      }
    }

  });
  // Load local tasks.
  grunt.loadTasks('lib');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-dot-compiler');


  // Default task.
  grunt.registerTask('default', 'jshint translate:update translate:compile test');



};
