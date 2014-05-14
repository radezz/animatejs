
module.exports = function(grunt) {

  grunt.initConfig({
    "pkg": grunt.file.readJSON('package.json'),
    gjslint: {
      options: {
        flags: [
          //'--disable 220' //ignore error code 220 from gjslint
          '--strict'
        ],
        reporter: {
          name: 'console'
        }
      },
      all: {
        src: 'src/**/*'
      }
    },
    jshint: {
      options: {
        "smarttabs": true,
        "curly": true,
        "eqnull": true,
        "eqeqeq": true,
        "undef": true,
        "strict": true,
        "sub": true,
        "globals": {
          "goog": true,
          "animatejs": true
        }
      },
      all: 'src/**/*'
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['lint'],
        options: {
          spawn: false
        }
      }
    },
    connect: {
      serve: {
        options: {
          port: 8000,
          hostname: "*",
          keepalive: true
        }
      }
    },
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
  grunt.registerTask('lint', ['jshint', 'gjslint']);
  grunt.registerTask('deps', ['closureDepsWriter']);
  grunt.registerTask('http', ['connect:serve']);


  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-closure-tools');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-combine');

};
