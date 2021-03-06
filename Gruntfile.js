module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/client/*.js'],
        dest: 'public/dist/built.js'
      },
      libs: {
        src: ['public/lib/jquery.js','public/lib/handlebars.js', 'public/lib/underscore.js', 'public/lib/backbone.js'],
        dest: 'public/dist/libs.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        options: {
          mangle: {
            // mangle:
            //except: ['Backbone','jQuery', '$', 'Templates', '_','Handlebars']
          }
        },

      files: {
        'public/dist/output.min.js': 'public/dist/built.js',
        'public/dist/libs.min.js': 'public/dist/libs.js'
      }
    }
    },

    jshint: {
      files: [
        'public/client/*.js'
      ],
      options: {
        force: 'false',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'jshint', 'build', 'test'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        //command: 'git push azure master'
        command: 'ls'
      }
    },
    exec: {
      deployToAzure: 'git push azure master'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'build', 'watch' ]);
  });

  // Running shell commands in a different process and displaying output on the main console

  // grunt.registerTask('git-shell', function(target) {
  //   var shell = grunt.util.spawn({
  //          cmd: 'git',
  //          args: 'push azure master'
  //     });
  //     shell.stdout.pipe(process.stdout);
  //     shell.stderr.pipe(process.stderr);
  // });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['concat', 'uglify'
  ]);

  grunt.registerTask('deploy', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['test', 'jshint', 'exec']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });
};
