
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
          '--strict',
          '--max_line_length=120'
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
        "browser": true,
        "trailing": true,
        "unused": true,
        "globals": {
          "goog": true,
          "animatejs": true,
          "describe": true,
          "it": true,
          "expect": true,
          "spyOn": true,
          "jasmine": true,
          "beforeEach": true,
          "afterEach": true
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
        tasks: ['lint', 'test'],
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
    },
    closureBuilder: {
      options: {
        closureLibraryPath: 'node_modules/closure-library/',
        namespaces: 'animatejs',
        compilerFile: 'node_modules/closure-compiler/lib/vendor/compiler.jar',
        compile: true,
        compilerOpts: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5',
          generate_exports: true,
          define: ["'goog.DEBUG=false'"],
          warning_level: 'verbose',
          summary_detail_level: 3,
          output_wrapper: '\'(function(){%output%}).call(this);\''
        }
      },
      build: {
        src: ['src/', 'node_modules/closure-library/'],
        dest: 'tmp/animate.js'
      }
    }

  });

  grunt.registerTask('default', ['closureDepsWriter']);
  grunt.registerTask('lint', ['jshint', 'gjslint']);
  grunt.registerTask('deps', ['closureDepsWriter']);
  grunt.registerTask('http', ['connect:serve']);
  grunt.registerTask('test', ['deps', 'jasmine:test']);
  grunt.registerTask('build', ['lint', 'deps', 'jasmine:test', 'closureBuilder:build']);


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
