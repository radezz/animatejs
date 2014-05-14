
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    path: {
      closure: 'node_modules/closure-library/',
      src: 'src',
      tmp: 'tmp'
    },
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
        src: '<%= path.src %>/**/*'
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
          "animatejs": true,
          "describe": true,
          "expect": true,
          "spyOn": true,
          "jasmine": true
        }
      },
      all: 'src/**/*'
    },
    jasmine: {
      options: {
        vendor: ['<%= path.closure %>/closure/goog/base.js', '<%= path.tmp %>/dependencies.js'],
        specs: '<%= path.src %>/**/*_spec.js'
      },
      test: {
        options: {
          outfile: '<%= path.tmp %>/unittests/SpecRunner.html',
          junit: {
            path: '<%= path.tmp %>/unittests/',
            consolidate: true
          },
          keepRunner: true
        }
      }
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
        closureLibraryPath: '<%= path.closure %>',
        root_with_prefix: '"src ../../../../src/"'
      },
      deps: {
        dest: '<%= path.tmp %>/dependencies.js'
      }
    }

  });

  grunt.registerTask('default', ['closureDepsWriter']);
  grunt.registerTask('lint', ['jshint', 'gjslint']);
  grunt.registerTask('deps', ['closureDepsWriter']);
  grunt.registerTask('http', ['connect:serve']);
  grunt.registerTask('test', ['deps', 'jasmine:test']);


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
