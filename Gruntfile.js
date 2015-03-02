
module.exports = function(grunt) {
  grunt.initConfig({
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          base: '.',
          port: 8000,
          livereload: true,
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
}
