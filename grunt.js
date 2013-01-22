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
        forin: true,
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
      all: {
        files: ['./test/example/**/*.js'],
        output: './test/translations/output',
        configDir: './test/translations',
        requireJS: true
      }
    }
  });
  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'lint translate test');

};
