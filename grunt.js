module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
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
        supernew: true
      },
      globals: {
        gt: true
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
      }
    }
  });
  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'lint translate:update translate:compile test');

  grunt.loadNpmTasks('grunt-bump');

};
