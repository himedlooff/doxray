module.exports = function(grunt) {

  'use strict';

  var path = require('path');

  grunt.initConfig({

    bower: {
      install: {
        options: {
          targetDir: './vendor/',
          install: true,
          verbose: true,
          cleanBowerDir: true,
          cleanTargetDir: true,
          layout: function(type, component) {
            return path.join(component);
          }
        }
      }
    },

    less: {
      docs: {
        options: {
          paths: grunt.file.expand('vendor/**'),
        },
        files: {
          'docs/static/docs/docs.css': ['docs-src/docs.less']
        }
      }
    },

    copy: {
      raw_HTML5Shiv: {
        files: [
          {
            expand: true,
            src: ['vendor/html5shiv/html5shiv-printshiv.js'],
            dest: 'raw/static/demo/',
            flatten: true
          }
        ]
      }
    },

    uglify: {
      code_examples: {
        src: [
          'vendor/rainbow/js/rainbow.js',
          'vendor/rainbow/js/language/html.js',
          'vendor/rainbow/js/language/css.js'
        ],
        dest: 'code_examples/static/demo/main.min.js'
      },
      docs: {
        src: [
          'vendor/rainbow/js/rainbow.js',
          'vendor/rainbow/js/language/html.js',
          'vendor/rainbow/js/language/css.js'
        ],
        dest: 'docs/static/docs/main.min.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['less', 'copy', 'uglify']);
  grunt.registerTask('raw', ['copy:raw_HTML5Shiv']);
  grunt.registerTask('code_examples', ['uglify:code_examples']);
  grunt.registerTask('docs', ['less:docs', 'uglify:docs']);

};
