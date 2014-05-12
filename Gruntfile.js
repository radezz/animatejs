
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    closureDepsWriter: {
      options: {
        closureLibraryPath: 'node_modules/closure-library/',
        root_with_prefix: '"src ../../../../src/"'
      },
      deps: {
        dest: 'tmp/dependencies.js'
      }
    }

  });

  grunt.registerTask('default', ['closureDepsWriter']);

  grunt.loadNpmTasks('grunt-closure-tools');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-combine');

};
