module.exports = function(grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var path = require('path');
  var config = {};

  grunt.initConfig(config);

  grunt.registerTask('docs', 'A new documentation generator.', function(file) {
    
    var fs;

    // Check to see if we have the required file to search for
    if (arguments.length === 0) {
      grunt.log.writeln(this.name + ', no args');
    } else {
      grunt.log.writeln(this.name + ': ' + file);
      init();
      getFile( file );
    }

    function init() {
      grunt.log.writeln('init()');

      fs = require('fs-extra');
    }

    function getFile( file ) {
      grunt.log.writeln('getFile()');

      var data, regex, docs, code;
      data = fs.readFileSync(file, 'utf-8');
      regex = {
        topdoc: /\/\*\s*topdoc[^*]*\*+(?:[^/*][^*]*\*+)*\//g
      };
      // Remove anything before the first topdoc comment
      data = data.slice(data.search(regex.topdoc)).trim();
      // Save just the topdoc comments
      docs = data.match(regex.topdoc);
      // Save everything between the topdoc comments
      code = data.split(regex.topdoc);
      // Removes the first item in the array since it will always be empty
      code.shift();

      grunt.log.writeln('docs.length:', docs.length);
      grunt.log.writeln('code.length:', code.length);

      grunt.log.writeln('\ndocs\n', docs);
      grunt.log.writeln('\ncode\n', code);
    }
  });

};
